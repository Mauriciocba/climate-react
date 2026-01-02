import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { GeoResult } from "../services/openMeteo";
import { getLocationFromCoordinates, searchCity } from "../services/openMeteo";

type LocationContextType = {
  location: GeoResult | null;
  loading: boolean;
  error: string | null;
  refreshLocation: () => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<GeoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDefaultLocation = async () => {
    try {
      const cities = await searchCity("Córdoba");
      if (cities.length > 0) {
        setLocation(cities[0]);
        setError(null);
      } else {
        setError("No se pudo cargar la ubicación por defecto.");
      }
    } catch (err) {
      console.error("Error cargando ubicación por defecto:", err);
      setError("Error al cargar la ubicación por defecto.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      loadDefaultLocation();
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData = await getLocationFromCoordinates(latitude, longitude);
          
          if (locationData) {
            setLocation(locationData);
            setError(null);
          } else {
            await loadDefaultLocation();
          }
        } catch (err) {
          console.error("Error obteniendo ubicación:", err);
          await loadDefaultLocation();
        } finally {
          setLoading(false);
        }
      },
      async (err) => {
        console.error("Error de geolocalización:", err);
        await loadDefaultLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const refreshLocation = () => {
    getCurrentLocation();
  };

  return (
    <LocationContext.Provider value={{ location, loading, error, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation debe ser usado dentro de un LocationProvider");
  }
  return context;
}


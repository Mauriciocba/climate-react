import { useEffect, useState } from "react";
import { Card } from "./Card";
import { getCurrentWeather, searchCity } from "../services/openMeteo";

type CardItem = {
  name?: string;
  city?: string;
  country?: string;
  temperature?: number | string;
  description?: string;
  condition?: string;
  humidity?: number | string;
  wind?: number | string;
  pressure?: number | string;
  chanceOfRain?: number | string;
  formattedDateTime?: string;
};

const CITIES = [
  "São Paulo",
  "New York",
  "Buenos Aires",
  "Madrid",
  "Tokyo",
  "Chile",
  "Paris",
  "Mexico City",
  "Sydney",
];

export function WeatherGrid() {
  const [items, setItems] = useState<CardItem[]>(Array(9).fill({}));
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  async function loadCityWeather(cityName: string, index: number) {
    try {
      const cities = await searchCity(cityName);
      if (!cities.length) {
        setItems((prev) => {
          const newItems = [...prev];
          newItems[index] = { name: cityName };
          return newItems;
        });
        setErrors((prev) => [...prev, `No se encontró: ${cityName}`]);
        return;
      }

      const city = cities[0];

      const { current, humidity, chanceOfRain, formattedDateTime } = await getCurrentWeather(
        city.latitude,
        city.longitude
      );

      if (!current) {
        setItems((prev) => {
          const newItems = [...prev];
          newItems[index] = { name: city.name };
          return newItems;
        });
        setErrors((prev) => [...prev, `No se pudo obtener clima para: ${cityName}`]);
        return;
      }

      setItems((prev) => {
        const newItems = [...prev];
        newItems[index] = {
          name: city.name,
          country: city.country,
          temperature: Math.round(current.temperature),
          description: current.conditionText || "Condición",
          condition: current.conditionText || "Condición",
          wind: Math.round(current.windspeed),
          humidity: humidity !== undefined ? Math.round(humidity) : undefined,
          chanceOfRain: chanceOfRain !== undefined ? chanceOfRain : undefined,
          formattedDateTime: formattedDateTime,
        };
        return newItems;
      });
    } catch {
      setErrors((prev) => [...prev, `Error consultando: ${cityName}`]);
      setItems((prev) => {
        const newItems = [...prev];
        newItems[index] = { name: cityName };
        return newItems;
      });
    }
  }

  useEffect(() => {
    const loadAllCities = async () => {
      setLoading(true);
      setErrors([]);

      const promises = CITIES.map((city, index) => loadCityWeather(city, index));

      await Promise.allSettled(promises);
      setLoading(false);
    };

    loadAllCities();
  }, []);

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Clima Mundial
      </h2>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando información del clima...</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mb-4 text-center">
          {errors.map((error, idx) => (
            <p key={idx} className="text-red-600 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {items.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

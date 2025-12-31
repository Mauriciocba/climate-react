import { useEffect, useState } from "react";
import { Card } from "../components/Card";
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

export function WeatherPage() {
  const [q, setQ] = useState("Córdoba");
  const [item, setItem] = useState<CardItem>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(cityName: string) {
    setLoading(true);
    setError("");

    try {
      const cities = await searchCity(cityName);
      if (!cities.length) {
        setItem({});
        setError("No encontré esa ciudad.");
        return;
      }

      const city = cities[0];

      const { current, humidity, chanceOfRain, formattedDateTime } = await getCurrentWeather(
        city.latitude,
        city.longitude
      );

      if (!current) {
        setItem({});
        setError("No pude obtener clima actual.");
        return;
      }

      setItem({
        name: city.name,
        country: city.country,
        temperature: Math.round(current.temperature),
        description: current.conditionText || "Condición",
        condition: current.conditionText || "Condición",
        wind: Math.round(current.windspeed),
        humidity: humidity !== undefined ? Math.round(humidity) : undefined,
        chanceOfRain: chanceOfRain !== undefined ? chanceOfRain : undefined,
        formattedDateTime: formattedDateTime,
      });
    } catch {
      setError("Error consultando WeatherAPI.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(q);
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(q.trim());
        }}
        className="flex gap-2 justify-center mt-6"
      >
        <input
          className="border rounded px-3 py-2"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar ciudad"
        />
        <button
          className="bg-black text-white rounded px-4 py-2"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Buscar"}
        </button>
      </form>

      {error && <p className="text-red-600 text-center mt-3">{error}</p>}

      <Card item={item} />
    </div>
  );
}

import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL || "https://api.weatherapi.com/v1";

const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Accept": "application/json",
  },
});

export type GeoResult = {
  id: number;
  name: string;
  country: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  region?: string;
};

type WeatherApiLocation = {
  id?: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url?: string;
};

export async function searchCity(name: string): Promise<GeoResult[]> {
  try {
    const { data } = await weatherApi.get<WeatherApiLocation[]>("/search.json", {
      params: {
        key: API_KEY,
        q: name,
      },
    });

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((location, index) => ({
      id: location.id ?? index,
      name: location.name,
      country: location.country,
      country_code: location.country.substring(0, 2).toUpperCase(),
      admin1: location.region,
      latitude: location.lat,
      longitude: location.lon,
      region: location.region,
    }));
  } catch (error: any) {
    console.error("Error en searchCity:", error);
    throw error;
  }
}

export async function getLocationFromCoordinates(
  lat: number,
  lon: number
): Promise<GeoResult | null> {
  try {
    const { data } = await weatherApi.get<WeatherApiForecastResponse>("/forecast.json", {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        days: 1,
        lang: "es",
      },
    });

    if (!data.location) {
      return null;
    }

    return {
      id: data.location.id ?? 0,
      name: data.location.name,
      country: data.location.country,
      country_code: data.location.country.substring(0, 2).toUpperCase(),
      admin1: data.location.region,
      latitude: data.location.lat,
      longitude: data.location.lon,
      region: data.location.region,
    };
  } catch (error: any) {
    console.error("Error en getLocationFromCoordinates:", error);
    throw error;
  }
}

export type CurrentWeather = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  conditionText?: string;
};

type WeatherApiCurrent = {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
};

type WeatherApiForecastDay = {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
    daily_will_it_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_rain: number;
    daily_chance_of_snow: number;
  };
};

type WeatherApiForecastResponse = {
  location: WeatherApiLocation;
  current: WeatherApiCurrent;
  forecast: {
    forecastday: WeatherApiForecastDay[];
  };
};

function formatDateTime(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${dayName}, ${day} de ${month} de ${year}, ${hours}:${minutesStr} ${ampm}`;
  } catch (error) {
    return dateTimeString;
  }
}

export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<{ 
  current?: CurrentWeather; 
  humidity?: number;
  chanceOfRain?: number;
  lastUpdated?: string;
  formattedDateTime?: string;
  location?: GeoResult;
}> {
  try {
    const { data } = await weatherApi.get<WeatherApiForecastResponse>("/forecast.json", {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        days: 1,
        lang: "es",
      },
    });

    if (!data.current) {
      return {};
    }

    const current: CurrentWeather = {
      temperature: data.current.temp_c,
      windspeed: data.current.wind_kph,
      winddirection: data.current.wind_degree,
      weathercode: data.current.condition.code,
      time: data.current.last_updated,
      conditionText: data.current.condition.text,
    };

    const chanceOfRain = data.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain ?? undefined;
    const formattedDateTime = formatDateTime(data.current.last_updated);

    const location: GeoResult | undefined = data.location ? {
      id: data.location.id ?? 0,
      name: data.location.name,
      country: data.location.country,
      country_code: data.location.country.substring(0, 2).toUpperCase(),
      admin1: data.location.region,
      latitude: data.location.lat,
      longitude: data.location.lon,
      region: data.location.region,
    } : undefined;

    return {
      current,
      humidity: data.current.humidity,
      chanceOfRain,
      lastUpdated: data.current.last_updated,
      formattedDateTime,
      location,
    };
  } catch (error: any) {
    console.error("Error en getCurrentWeather:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
}

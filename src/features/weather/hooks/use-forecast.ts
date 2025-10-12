/**
 * useForecast Hook
 * Fetches weather forecast data for a city
 */

import { useApiQuery } from "@/shared/services/api/queryService";
import { ForecastWeatherResponse } from "@/features/weather/types";
import { weatherService } from "@/features/weather/services/weatherService";
import { TIMINGS } from "@/constants";

export interface UseForecastOptions {
  city: string;
  days?: number;
  enabled?: boolean;
  aqi?: boolean;
  alerts?: boolean;
}

export const useForecast = ({
  city,
  days = 5,
  enabled = true,
  aqi = false,
  alerts = true,
}: UseForecastOptions) => {
  const endpoint = weatherService.getForecastEndpoint(city, days, aqi, alerts);

  return useApiQuery<ForecastWeatherResponse>(
    endpoint,
    ["weather", "forecast", city, days],
    {
      enabled: enabled && !!city,
      staleTime: TIMINGS.WEATHER_CACHE_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
    }
  );
};

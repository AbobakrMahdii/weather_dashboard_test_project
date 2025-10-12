/**
 * useWeather Hook
 * Fetches current weather data for a city
 */

import { useApiQuery } from "@/shared/services/api/queryService";
import { CurrentWeatherResponse } from "@/features/weather/types";
import { weatherService } from "@/features/weather/services/weatherService";
import { TIMINGS } from "@/constants";

export interface UseWeatherOptions {
  city: string;
  enabled?: boolean;
  aqi?: boolean;
}

export const useWeather = ({
  city,
  enabled = true,
  aqi = false,
}: UseWeatherOptions) => {
  const endpoint = weatherService.getCurrentWeatherEndpoint(city, aqi);

  return useApiQuery<CurrentWeatherResponse>(
    endpoint,
    ["weather", "current", city],
    {
      enabled: enabled && !!city,
      staleTime: TIMINGS.WEATHER_CACHE_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
    }
  );
};

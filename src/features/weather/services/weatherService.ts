/**
 * Weather API Service Layer
 * Handles all weather-related API calls using WeatherAPI.com
 */

import { API_ENDPOINTS } from "@/constants";

/**
 * Build query string for weather API requests
 */
const buildQueryString = (params: Record<string, string | number>): string => {
  const queryParams = new URLSearchParams();

  // Add other parameters
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });

  return queryParams.toString();
};

/**
 * Get current weather for a city
 * @param city - City name or coordinates (lat,lon)
 * @param aqi - Include air quality data
 */
export const getCurrentWeatherEndpoint = (
  city: string,
  aqi: boolean = false
): string => {
  const params = {
    q: city,
    aqi: aqi ? "yes" : "no",
  };
  return `${API_ENDPOINTS.WEATHER.CURRENT}?${buildQueryString(params)}`;
};

/**
 * Get weather forecast for a city
 * @param city - City name or coordinates (lat,lon)
 * @param days - Number of forecast days (1-10)
 * @param aqi - Include air quality data
 * @param alerts - Include weather alerts
 */
export const getForecastEndpoint = (
  city: string,
  days: number = 5,
  aqi: boolean = false,
  alerts: boolean = true
): string => {
  const params = {
    q: city,
    days: days,
    aqi: aqi ? "yes" : "no",
    alerts: alerts ? "yes" : "no",
  };
  return `${API_ENDPOINTS.WEATHER.FORECAST}?${buildQueryString(params)}`;
};

/**
 * Search/Autocomplete for cities
 * @param query - Search query
 */
export const getSearchEndpoint = (query: string): string => {
  const params = { q: query };
  return `${API_ENDPOINTS.WEATHER.SEARCH}?${buildQueryString(params)}`;
};

/**
 * Get current weather by coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 */
export const getCurrentWeatherByCoordinatesEndpoint = (
  lat: number,
  lon: number
): string => {
  return getCurrentWeatherEndpoint(`${lat},${lon}`);
};

/**
 * Get forecast by coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @param days - Number of forecast days
 */
export const getForecastByCoordinatesEndpoint = (
  lat: number,
  lon: number,
  days: number = 5
): string => {
  return getForecastEndpoint(`${lat},${lon}`, days);
};

/**
 * Service object with all weather API functions
 */
export const weatherService = {
  getCurrentWeatherEndpoint,
  getForecastEndpoint,
  getSearchEndpoint,
  getCurrentWeatherByCoordinatesEndpoint,
  getForecastByCoordinatesEndpoint,
};

export default weatherService;

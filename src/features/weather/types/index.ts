/**
 * Weather API Type Definitions
 * Based on WeatherAPI.com response structure
 */

// Location information
export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

// Current weather condition
export interface Condition {
  text: string;
  icon: string;
  code: number;
}

// Current weather data
export interface Current {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
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
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

// Astronomy data
export interface Astro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
}

// Hourly forecast data
export interface Hour {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
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
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

// Daily forecast data
export interface Day {
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
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: Condition;
  uv: number;
}

// Forecast day structure
export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: Day;
  astro: Astro;
  hour: Hour[];
}

// Forecast container
export interface Forecast {
  forecastday: ForecastDay[];
}

// Alert information
export interface Alert {
  headline: string;
  msgtype: string;
  severity: string;
  urgency: string;
  areas: string;
  category: string;
  certainty: string;
  event: string;
  note: string;
  effective: string;
  expires: string;
  desc: string;
  instruction: string;
}

// Alerts container
export interface Alerts {
  alert: Alert[];
}

// Complete current weather response
export interface CurrentWeatherResponse {
  location: Location;
  current: Current;
}

// Complete forecast response
export interface ForecastWeatherResponse {
  location: Location;
  current: Current;
  forecast: Forecast;
  alerts?: Alerts;
}

// Search/Autocomplete result
export interface SearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

// Search parameters
export interface WeatherSearchParams {
  q: string; // City name or coordinates (lat,lon)
  days?: number; // Number of days for forecast (1-10)
  aqi?: "yes" | "no"; // Air quality data
  alerts?: "yes" | "no"; // Weather alerts
  lang?: string; // Language code
}

// Temperature unit type
export type TemperatureUnit = "metric" | "imperial";

// Weather condition type for backgrounds
export type WeatherConditionType =
  | "clear"
  | "clouds"
  | "rain"
  | "snow"
  | "thunderstorm"
  | "mist";

// Recent search item
export interface RecentSearch {
  city: string;
  country: string;
  timestamp: number;
  lat?: number;
  lon?: number;
}

// Error response from API
export interface WeatherErrorResponse {
  error: {
    code: number;
    message: string;
  };
}

// UI State types
export interface WeatherState {
  temperatureUnit: TemperatureUnit;
  lastSearchedCity: string | null;
  favoriteLocations: string[];
  recentSearches: RecentSearch[];
}

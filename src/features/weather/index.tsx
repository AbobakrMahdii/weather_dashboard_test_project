/**
 * Weather Feature Public API
 * Only export what other features need to import
 */

// Main dashboard component
export { WeatherDashboard } from "./components/ui/WeatherDashboard";

// UI Components
export { SearchBar } from "./components/ui/SearchBar";
export { CurrentWeatherCard } from "./components/ui/CurrentWeatherCard";
export { ForecastCard } from "./components/ui/ForecastCard";
export { UnitToggle } from "./components/ui/UnitToggle";
export { WeatherBackground } from "./components/ui/WeatherBackground";

// Common components
export { ErrorDisplay } from "./components/common/ErrorDisplay";

// Hooks
export { useWeather } from "./hooks/use-weather";
export { useForecast } from "./hooks/use-forecast";
export { useGeolocation } from "./hooks/use-geolocation";
export { useUnitToggle } from "./hooks/use-unit-toggle";
export { useRecentSearches } from "./hooks/use-recent-searches";

// Types
export type {
  CurrentWeatherResponse,
  ForecastWeatherResponse,
  Location,
  Current,
  Condition,
  ForecastDay,
  TemperatureUnit,
  WeatherConditionType,
  RecentSearch,
  WeatherState,
} from "./types";

// Shimmers
export {
  SearchBarShimmer,
  CurrentWeatherCardShimmer,
  ForecastCardShimmer,
} from "./shimmers";

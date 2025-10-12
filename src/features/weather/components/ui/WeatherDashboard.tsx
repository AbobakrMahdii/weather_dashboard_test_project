/**
 * WeatherDashboard Component
 * Main weather dashboard component that orchestrates all weather features
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { SearchBar } from "./SearchBar";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { ForecastCard } from "./ForecastCard";
import { UnitToggle } from "./UnitToggle";
import { WeatherBackground } from "./WeatherBackground";
import { ErrorDisplay } from "../common/ErrorDisplay";
import {
  SearchBarShimmer,
  CurrentWeatherCardShimmer,
  ForecastCardShimmer,
} from "@/features/weather/shimmers";
import { useWeather } from "@/features/weather/hooks/use-weather";
import { useForecast } from "@/features/weather/hooks/use-forecast";
import { useDispatch } from "react-redux";
import { setLastSearchedCity } from "@/shared/store/slices/ui-slice";
import { WEATHER } from "@/constants";
import { fadeInUp } from "@/features/weather/animations";

export const WeatherDashboard = () => {
  const t = useTranslations("weather");
  const dispatch = useDispatch();
  const [searchCity, setSearchCity] = useState(WEATHER.DEFAULT_CITY);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch current weather
  const {
    data: currentWeather,
    isLoading: currentLoading,
    error: currentError,
    refetch: refetchCurrent,
  } = useWeather({
    city: searchCity,
    enabled: hasSearched,
  });

  // Fetch forecast
  const {
    data: forecast,
    isLoading: forecastLoading,
    error: forecastError,
    refetch: refetchForecast,
  } = useForecast({
    city: searchCity,
    days: WEATHER.FORECAST_DAYS,
    enabled: hasSearched,
  });

  // Initial search on mount
  useEffect(() => {
    if (!hasSearched) {
      setHasSearched(true);
    }
  }, [hasSearched]);

  // Handle city search
  const handleSearch = useCallback(
    (city: string) => {
      setSearchCity(city);
      setHasSearched(true);
      dispatch(setLastSearchedCity(city));
    },
    [dispatch]
  );

  // Handle location-based search
  const handleLocationSearch = useCallback((lat: number, lon: number) => {
    const coords = `${lat},${lon}`;
    setSearchCity(coords);
    setHasSearched(true);
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    refetchCurrent();
    refetchForecast();
  }, [refetchCurrent, refetchForecast]);

  // Determine error type
  const getErrorType = (
    error: unknown
  ): "network" | "not-found" | "api-limit" | "general" => {
    if (!error) return "general";
    const errorMessage =
      (error as { message?: string })?.message?.toLowerCase() || "";
    if (errorMessage.includes("network") || errorMessage.includes("offline")) {
      return "network";
    }
    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("no matching")
    ) {
      return "not-found";
    }
    if (errorMessage.includes("limit") || errorMessage.includes("quota")) {
      return "api-limit";
    }
    return "general";
  };

  const isLoading = currentLoading || forecastLoading;
  const hasError = currentError || forecastError;
  const errorMessage =
    (currentError as { message?: string })?.message ||
    (forecastError as { message?: string })?.message ||
    null;
  const errorType = getErrorType(currentError || forecastError);

  return (
    <div className="relative min-h-screen py-8 px-4">
      {/* Dynamic background */}
      {currentWeather && (
        <WeatherBackground
          condition={currentWeather.current.condition.text}
          isDay={currentWeather.current.is_day}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/80 drop-shadow-lg">
            {t("dashboard.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/60 drop-shadow-md">
            {t("dashboard.subtitle")}
          </p>
        </motion.div>

        {/* Unit toggle */}
        <div className="flex justify-center">
          <UnitToggle />
        </div>

        {/* Search bar */}
        {isLoading && !currentWeather ? (
          <SearchBarShimmer />
        ) : (
          <SearchBar
            onSearch={handleSearch}
            onLocationSearch={handleLocationSearch}
          />
        )}

        {/* Loading state */}
        {isLoading && !currentWeather && (
          <div className="space-y-8">
            <CurrentWeatherCardShimmer />
            <ForecastCardShimmer />
          </div>
        )}

        {/* Error state */}
        {hasError && !isLoading && (
          <ErrorDisplay
            error={errorMessage}
            onRetry={handleRetry}
            type={errorType}
          />
        )}

        {/* Weather data */}
        <AnimatePresence mode="wait">
          {!hasError && !isLoading && currentWeather && (
            <motion.div
              key="weather-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Current weather */}
              <CurrentWeatherCard data={currentWeather} />

              {/* Forecast */}
              {forecast && <ForecastCard data={forecast} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

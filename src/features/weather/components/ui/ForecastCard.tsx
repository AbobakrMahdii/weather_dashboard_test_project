/**
 * ForecastCard Component
 * Displays 7-day weather forecast with horizontal scroll
 */

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ForecastWeatherResponse } from "@/features/weather/types";
import { useUnitToggle } from "@/features/weather/hooks/use-unit-toggle";
import {
  cardEntrance,
  fadeInUp,
  staggerChildren,
} from "@/features/weather/animations";

export interface ForecastCardProps {
  data: ForecastWeatherResponse;
  className?: string;
}

export const ForecastCard = ({ data, className = "" }: ForecastCardProps) => {
  const t = useTranslations("weather");
  const { isCelsius } = useUnitToggle();

  const unit = isCelsius ? "°C" : "°F";

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Get current hour to filter hourly forecast
  const getCurrentHour = () => {
    return new Date().getHours();
  };

  // Filter hourly forecast to show only remaining hours of today
  const getRemainingHoursOfToday = () => {
    if (!data.forecast.forecastday[0]?.hour) return [];

    const currentHour = getCurrentHour();
    return data.forecast.forecastday[0].hour.filter((hour) => {
      const hourTime = new Date(hour.time).getHours();
      return hourTime >= currentHour;
    });
  };

  const remainingHours = getRemainingHoursOfToday();

  return (
    <motion.div
      variants={cardEntrance}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`w-full max-w-6xl mx-auto p-6 bg-card rounded-2xl shadow-xl border border-border ${className}`}
    >
      <motion.h3
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-2xl font-bold text-card-foreground mb-6"
      >
        {t("forecast.title")}
      </motion.h3>

      {/* 7-day forecast with horizontal scroll */}
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="flex gap-4 min-w-max"
        >
          {data.forecast.forecastday.map((day, index) => {
            const maxTemp = isCelsius ? day.day.maxtemp_c : day.day.maxtemp_f;
            const minTemp = isCelsius ? day.day.mintemp_c : day.day.mintemp_f;

            return (
              <motion.div
                key={day.date}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 bg-accent rounded-xl shadow-md cursor-pointer border border-border min-w-[160px] sm:min-w-[180px]"
              >
                {/* Date */}
                <p className="text-sm font-semibold text-center text-card-foreground mb-2">
                  {index === 0 ? t("forecast.today") : formatDate(day.date)}
                </p>

                {/* Weather icon */}
                <div className="flex justify-center mb-3">
                  <Image
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text}
                    width={64}
                    height={64}
                    className="drop-shadow-md"
                  />
                </div>

                {/* Temperature range */}
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-bold text-card-foreground">
                      {Math.round(maxTemp)}
                      {unit}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {Math.round(minTemp)}
                      {unit}
                    </span>
                  </div>

                  {/* Condition */}
                  <p className="text-xs text-muted-foreground capitalize line-clamp-2">
                    {day.day.condition.text}
                  </p>
                </div>

                {/* Additional info */}
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>💧 {day.day.avghumidity}%</span>
                    <span>🌧️ {day.day.daily_chance_of_rain}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      💨 {isCelsius ? day.day.maxwind_kph : day.day.maxwind_mph}{" "}
                      {isCelsius ? "km/h" : "mph"}
                    </span>
                    <span>☀️ UV {day.day.uv}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Hourly forecast for remaining hours of today */}
      {remainingHours.length > 0 && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-8"
        >
          <h4 className="text-lg font-semibold text-card-foreground mb-4">
            {t("forecast.hourly")}
          </h4>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {remainingHours.map((hour) => {
                const temp = isCelsius ? hour.temp_c : hour.temp_f;
                const time = new Date(hour.time).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  hour12: true,
                });

                return (
                  <motion.div
                    key={hour.time}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-3 bg-accent rounded-lg min-w-[80px] border border-border"
                  >
                    <p className="text-xs text-muted-foreground mb-2">{time}</p>
                    <Image
                      src={`https:${hour.condition.icon}`}
                      alt={hour.condition.text}
                      width={40}
                      height={40}
                      className="mb-2"
                    />
                    <p className="text-sm font-semibold text-card-foreground">
                      {Math.round(temp)}
                      {unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      💧 {hour.humidity}%
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

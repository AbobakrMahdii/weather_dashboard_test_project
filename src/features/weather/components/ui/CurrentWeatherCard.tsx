/**
 * CurrentWeatherCard Component
 * Displays current weather information with animations
 */

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sun,
  Moon,
  ThermometerSun,
} from "lucide-react";
import { CurrentWeatherResponse } from "@/features/weather/types";
import { useUnitToggle } from "@/features/weather/hooks/use-unit-toggle";
import {
  cardEntrance,
  fadeInUp,
  staggerChildren,
  weatherIconFloat,
} from "@/features/weather/animations";

export interface CurrentWeatherCardProps {
  data: CurrentWeatherResponse;
  className?: string;
}

export const CurrentWeatherCard = ({
  data,
  className = "",
}: CurrentWeatherCardProps) => {
  const t = useTranslations("weather");
  const { isCelsius } = useUnitToggle();

  const { location, current } = data;
  const temperature = isCelsius ? current.temp_c : current.temp_f;
  const feelsLike = isCelsius ? current.feelslike_c : current.feelslike_f;
  const unit = isCelsius ? "°C" : "°F";

  // Format local time
  const localTime = new Date(location.localtime).toLocaleString("en-US", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      variants={cardEntrance}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`w-full max-w-4xl mx-auto p-6 md:p-8 bg-card rounded-2xl shadow-xl border border-border ${className}`}
    >
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left side - Main weather info */}
        <div className="space-y-6">
          {/* Location and time */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-card-foreground">
              {location.name}
            </h2>
            <p className="text-muted-foreground">
              {location.region}, {location.country}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{localTime}</p>
          </motion.div>

          {/* Weather icon */}
          <motion.div
            variants={weatherIconFloat}
            initial="initial"
            animate="animate"
            className="flex justify-center"
          >
            <Image
              src={`https:${current.condition.icon}`}
              alt={current.condition.text}
              width={128}
              height={128}
              className="drop-shadow-lg"
            />
          </motion.div>

          {/* Temperature */}
          <motion.div variants={fadeInUp} className="text-center space-y-2">
            <div className="text-6xl font-bold text-card-foreground">
              {Math.round(temperature)}
              {unit}
            </div>
            <p className="text-xl text-muted-foreground capitalize">
              {current.condition.text}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("details.feelsLike")}: {Math.round(feelsLike)}
              {unit}
            </p>
          </motion.div>
        </div>

        {/* Right side - Weather details */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            {t("details.title")}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Humidity */}
            <DetailItem
              icon={<Droplets className="w-5 h-5" />}
              label={t("details.humidity")}
              value={`${current.humidity}%`}
            />

            {/* Wind Speed */}
            <DetailItem
              icon={<Wind className="w-5 h-5" />}
              label={t("details.windSpeed")}
              value={`${isCelsius ? current.wind_kph : current.wind_mph} ${
                isCelsius ? "km/h" : "mph"
              }`}
            />

            {/* Visibility */}
            <DetailItem
              icon={<Eye className="w-5 h-5" />}
              label={t("details.visibility")}
              value={`${isCelsius ? current.vis_km : current.vis_miles} ${
                isCelsius ? "km" : "mi"
              }`}
            />

            {/* Pressure */}
            <DetailItem
              icon={<Gauge className="w-5 h-5" />}
              label={t("details.pressure")}
              value={`${current.pressure_mb} mb`}
            />

            {/* UV Index */}
            <DetailItem
              icon={<Sun className="w-5 h-5" />}
              label={t("details.uvIndex")}
              value={current.uv.toString()}
            />

            {/* Is Day/Night */}
            <DetailItem
              icon={
                current.is_day ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )
              }
              label={t("details.time")}
              value={current.is_day ? t("details.day") : t("details.night")}
            />

            {/* Heat Index */}
            <DetailItem
              icon={<ThermometerSun className="w-5 h-5" />}
              label={t("details.heatIndex")}
              value={`${
                isCelsius
                  ? Math.round(current.heatindex_c)
                  : Math.round(current.heatindex_f)
              }${unit}`}
            />

            {/* Wind Direction */}
            <DetailItem
              icon={<Wind className="w-5 h-5" />}
              label={t("details.windDirection")}
              value={current.wind_dir}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Detail item component
interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-3 p-3 bg-accent rounded-lg"
  >
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-card-foreground">{value}</p>
    </div>
  </motion.div>
);

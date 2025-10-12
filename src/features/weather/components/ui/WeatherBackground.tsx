/**
 * WeatherBackground Component
 * Animated background that changes based on weather conditions
 */

"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { WeatherConditionType } from "@/features/weather/types";
import { WEATHER } from "@/constants";

export interface WeatherBackgroundProps {
  condition: string;
  isDay: number;
  className?: string;
}

export const WeatherBackground = ({
  condition,
  isDay,
  className = "",
}: WeatherBackgroundProps) => {
  // Map API condition to our condition types
  const getConditionType = (cond: string): WeatherConditionType => {
    const condLower = cond.toLowerCase();
    if (condLower.includes("clear") || condLower.includes("sunny")) {
      return "clear";
    }
    if (condLower.includes("cloud") || condLower.includes("overcast")) {
      return "clouds";
    }
    if (
      condLower.includes("rain") ||
      condLower.includes("drizzle") ||
      condLower.includes("shower")
    ) {
      return "rain";
    }
    if (condLower.includes("snow") || condLower.includes("sleet")) {
      return "snow";
    }
    if (condLower.includes("thunder") || condLower.includes("storm")) {
      return "thunderstorm";
    }
    if (
      condLower.includes("mist") ||
      condLower.includes("fog") ||
      condLower.includes("haze")
    ) {
      return "mist";
    }
    return "clear";
  };

  const conditionType = getConditionType(condition);
  const timeOfDay = isDay ? "day" : "night";

  // Get gradient colors for current condition
  const gradientColors = useMemo(() => {
    return WEATHER.CONDITION_BACKGROUNDS[conditionType][timeOfDay];
  }, [conditionType, timeOfDay]);

  // Create gradient string
  const gradientString = `linear-gradient(135deg, ${gradientColors.join(
    ", "
  )})`;

  return (
    <motion.div
      className={`fixed inset-0 -z-10 ${className}`}
      style={{
        background: gradientString,
        backgroundSize: "400% 400%",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Animated particles based on weather */}
      {conditionType === "rain" && <RainEffect />}
      {conditionType === "snow" && <SnowEffect />}
      {conditionType === "thunderstorm" && <ThunderstormEffect />}
      {conditionType === "clear" && isDay && <SunRays />}
    </motion.div>
  );
};

// Rain effect component
const RainEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-blue-300/30"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${20 + Math.random() * 30}px`,
          }}
          animate={{
            y: ["0vh", "100vh"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1 + Math.random() * 0.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Snow effect component
const SnowEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ["0vh", "100vh"],
            x: [0, -30, 30, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Thunderstorm effect component
const ThunderstormEffect = () => {
  return (
    <>
      <RainEffect />
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-white"
          animate={{
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 3 + Math.random() * 5,
          }}
        />
      </div>
    </>
  );
};

// Sun rays effect component
const SunRays = () => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-yellow-300/20 to-transparent origin-top"
          style={{
            transform: `rotate(${i * 30}deg)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

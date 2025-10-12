/**
 * UnitToggle Component
 * Toggle between Celsius and Fahrenheit
 */

"use client";

import { motion } from "framer-motion";
import { useUnitToggle } from "@/features/weather/hooks/use-unit-toggle";
import { scaleBounce } from "@/features/weather/animations";

export const UnitToggle = () => {
  const { isCelsius, toggleUnit } = useUnitToggle();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 rounded-full p-1 shadow-md backdrop-blur-3xl"
    >
      {/* Celsius button */}
      <motion.button
        onClick={() => !isCelsius && toggleUnit()}
        variants={scaleBounce}
        initial="initial"
        whileHover={!isCelsius ? "hover" : undefined}
        whileTap={!isCelsius ? "tap" : undefined}
        className={`relative px-4 py-2 rounded-full font-medium transition-colors ${
          isCelsius ? "text-white" : "text-background hover:bg-foreground"
        }`}
      >
        {isCelsius && (
          <motion.div
            layoutId="activeUnit"
            className="absolute inset-0 bg-blue-500 rounded-full -z-10"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        °C
      </motion.button>

      {/* Fahrenheit button */}
      <motion.button
        onClick={() => isCelsius && toggleUnit()}
        variants={scaleBounce}
        initial="initial"
        whileHover={isCelsius ? "hover" : undefined}
        whileTap={isCelsius ? "tap" : undefined}
        className={`relative px-4 py-2 rounded-full font-medium transition-colors ${
          !isCelsius ? "text-white" : "text-background hover:bg-foreground"
        }`}
      >
        {!isCelsius && (
          <motion.div
            layoutId="activeUnit"
            className="absolute inset-0 bg-blue-500 rounded-full -z-10"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        °F
      </motion.button>
    </motion.div>
  );
};

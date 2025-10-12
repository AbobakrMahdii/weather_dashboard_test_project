/**
 * ErrorDisplay Component
 * Displays error messages with retry functionality
 */

"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, CloudOff, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { fadeInUp } from "@/features/weather/animations";

export interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  type?: "network" | "not-found" | "api-limit" | "general";
  className?: string;
}

export const ErrorDisplay = ({
  error,
  onRetry,
  type = "general",
  className = "",
}: ErrorDisplayProps) => {
  const t = useTranslations("weather");

  if (!error) return null;

  const getIcon = () => {
    switch (type) {
      case "network":
        return <CloudOff className="w-16 h-16 text-red-500" />;
      case "not-found":
        return <Search className="w-16 h-16 text-orange-500" />;
      case "api-limit":
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "network":
        return t("errors.network.title");
      case "not-found":
        return t("errors.notFound.title");
      case "api-limit":
        return t("errors.apiLimit.title");
      default:
        return t("errors.general.title");
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={`w-full max-w-md mx-auto p-8 bg-card rounded-2xl shadow-lg border border-border ${className}`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
        >
          {getIcon()}
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-card-foreground">
          {getTitle()}
        </h3>

        {/* Error message */}
        <p className="text-muted-foreground">{error}</p>

        {/* Retry button */}
        {onRetry && (
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t("errors.retryButton")}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

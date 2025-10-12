"use client";

import { motion } from "framer-motion";
import { Cloud } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { fadeInUp } from "@/features/weather/animations";

/**
 * Navbar Component
 * Displays logo, theme switcher, and language switcher
 */
export default function Navbar() {
  const t = useTranslations("common");

  return (
    <motion.nav
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg"
    >
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo Section */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 min-w-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">
                {t("appName", { default: "Weather Dashboard" })}
              </h1>
              <p className="hidden md:block text-xs text-muted-foreground truncate">
                {t("appTagline", { default: "Real-time weather updates" })}
              </p>
            </div>
          </motion.div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

/**
 * SearchBar Component
 * Allows users to search for cities with geolocation and recent searches
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Loader2, X, Clock, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGeolocation } from "@/features/weather/hooks/use-geolocation";
import { useRecentSearches } from "@/features/weather/hooks/use-recent-searches";
import { dropdownMenu, scaleBounce } from "@/features/weather/animations";

export interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: (lat: number, lon: number) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({
  onSearch,
  onLocationSearch,
  placeholder,
  className = "",
}: SearchBarProps) => {
  const t = useTranslations("weather");
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    getCurrentLocation,
    loading: geoLoading,
    latitude,
    longitude,
  } = useGeolocation();
  const { recentSearches, addSearch, removeSearch, hasSearches } =
    useRecentSearches();

  // Handle geolocation result
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      onLocationSearch(latitude, longitude);
    }
  }, [latitude, longitude, onLocationSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim());
      addSearch({ city: query.trim(), country: "" });
      setQuery("");
      setShowDropdown(false);
    }
  }, [query, onSearch, addSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleRecentSearchClick = useCallback(
    (city: string) => {
      onSearch(city);
      setQuery("");
      setShowDropdown(false);
    },
    [onSearch]
  );

  const handleLocationClick = useCallback(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const handleDeleteSearch = useCallback(
    (city: string, e: React.MouseEvent) => {
      e.stopPropagation();
      removeSearch(city);
    },
    [removeSearch]
  );

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <div className="flex gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <motion.input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => hasSearches && setShowDropdown(true)}
            placeholder={placeholder || t("search.placeholder")}
            className="w-full px-4 py-3 pl-12 pr-10 text-foreground bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

          {/* Clear button */}
          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Location button */}
        <motion.button
          onClick={handleLocationClick}
          disabled={geoLoading}
          variants={scaleBounce}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={t("search.useLocation")}
        >
          {geoLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </motion.button>

        {/* Search button */}
        <motion.button
          onClick={handleSearch}
          disabled={!query.trim()}
          variants={scaleBounce}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t("search.button")}
        </motion.button>
      </div>

      {/* Recent searches dropdown */}
      <AnimatePresence>
        {showDropdown && hasSearches && (
          <motion.div
            ref={dropdownRef}
            variants={dropdownMenu}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t("search.recentSearches")}
                </span>
              </div>

              {recentSearches.map((search, index) => (
                <motion.div
                  key={search.city}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between px-3 py-2 hover:bg-accent rounded-md cursor-pointer group"
                  onClick={() => handleRecentSearchClick(search.city)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{search.city}</span>
                    {search.country && (
                      <span className="text-sm text-muted-foreground">
                        , {search.country}
                      </span>
                    )}
                  </div>

                  <motion.button
                    onClick={(e) => handleDeleteSearch(search.city, e)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/10 rounded transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

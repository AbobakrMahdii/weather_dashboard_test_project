/**
 * API endpoints
 * Example: AUTH: {
 *    LOGIN: "/login",
 *    ..///
 * }
 */
export const API_ENDPOINTS = {
  WEATHER: {
    CURRENT: "/current.json",
    FORECAST: "/forecast.json",
    SEARCH: "/search.json",
  },
};

/**
 * Cookie names
 */
export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth-token",
  REFRESH_TOKEN: "refresh-token",
  LOCALE: "NEXT_LOCALE",
  THEME: "site-theme",
  USER_DATA: "user-data",
  TEMPERATURE_UNIT: "temperature-unit", // For weather app
  RECENT_SEARCHES: "recent-weather-searches", // For weather app
};

/**
 * Routes
 * Example: HOME: "/"
 */
export const ROUTES = {
  HOME: "/",
  WEATHER: "/weather",
};

/**
 * Application timing constants (in milliseconds)
 */
export const TIMINGS = {
  API_TIMEOUT: 30000, // 30 seconds
  DEBOUNCE_SEARCH: 300, // 300 milliseconds
  TOKEN_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutes
  NOTIFICATION_DISPLAY: 5000, // 5 seconds
  ANIMATION_FADE: 500, // 500 milliseconds
  NETWORK_STATUS_TRANSITION: 2000, // 500 milliseconds
  WEATHER_CACHE_TIME: 10 * 60 * 1000, // 10 minutes - Weather data cache
};

/**
 * Regular expressions for validation
 */
export const REGEX = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^(ftp|http|https):\/\/[^ "]+$/,
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 25, 50, 100, 200, 500],
};

/**
 * Cookie settings
 */
export const COOKIE_SETTINGS = {
  LOCALE_MAX_AGE: 31536000, // 1 year in seconds
  PATH: "/",
  AUTH_MAX_AGE: 86400, // 1 day in seconds
  SECURE: true,
  HTTP_ONLY: false, // Changed to false so JavaScript can access the auth token
  SAME_SITE: "strict" as const,
};

/**
 * CSS class utilities
 */
export const CSS_CLASSES = {
  ACTIVE_BUTTON: "bg-primary text-primary-foreground",
  INACTIVE_BUTTON:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  INACTIVE_BUTTON_PRIMARY_HOVER:
    "bg-secondary text-secondary-foreground hover:bg-primary/10",
};

export const QUERY_STATE_MANAGERS = {
  CALLBACK_URL: "callbackUrl",
  API_KEY_VALUE: "key",
};

/**
 * Auth related constants
 */
export const AUTH = {
  ROLES: {
    ADMIN: "admin",
    USER: "user",
    GUEST: "guest",
  },
  DEFAULT_ROLE: "user",
  SESSION_DURATION: 86400 * 1000, // 1 day in milliseconds
};

/**
 * Weather related constants
 */
export const WEATHER = {
  UNITS: {
    CELSIUS: "metric",
    FAHRENHEIT: "imperial",
  },
  DEFAULT_UNIT: "metric" as "metric" | "imperial",
  DEFAULT_CITY: "Yemen",
  MAX_RECENT_SEARCHES: 10,
  FORECAST_DAYS: 7,
  ICONS_MAP: {
    "01d": "☀️", // Clear sky day
    "01n": "🌙", // Clear sky night
    "02d": "⛅", // Few clouds day
    "02n": "☁️", // Few clouds night
    "03d": "☁️", // Scattered clouds
    "03n": "☁️",
    "04d": "☁️", // Broken clouds
    "04n": "☁️",
    "09d": "🌧️", // Shower rain
    "09n": "🌧️",
    "10d": "🌦️", // Rain day
    "10n": "🌧️", // Rain night
    "11d": "⛈️", // Thunderstorm
    "11n": "⛈️",
    "13d": "❄️", // Snow
    "13n": "❄️",
    "50d": "🌫️", // Mist
    "50n": "🌫️",
  },
  CONDITION_BACKGROUNDS: {
    clear: {
      day: ["#56CCF2", "#2F80ED"],
      night: ["#0F2027", "#203A43", "#2C5364"],
    },
    clouds: {
      day: ["#bdc3c7", "#2c3e50"],
      night: ["#232526", "#414345"],
    },
    rain: {
      day: ["#667db6", "#667db6", "#0082c8"],
      night: ["#283048", "#859398"],
    },
    snow: {
      day: ["#E0EAFC", "#CFDEF3"],
      night: ["#2C3E50", "#34495E"],
    },
    thunderstorm: {
      day: ["#4B79A1", "#283E51"],
      night: ["#141E30", "#243B55"],
    },
    mist: {
      day: ["#B7B8B6", "#50565E"],
      night: ["#1C1C1C", "#383838"],
    },
  },
};

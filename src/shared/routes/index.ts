import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants";

/**
 * Route configuration including metadata
 */
export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  title?: string;
  description?: string;
  permissions?: string[];
}

/**
 * Main application routes with configuration
 * Example: HOME: {
 *   path: ROUTES.HOME,
 *   requiresAuth: false,
 *   title: "Home",
 *   description: `Welcome to Home Page`
 * }
 */
export const appRoutes: Record<keyof typeof ROUTES, RouteConfig> = {
  HOME: {
    path: ROUTES.HOME,
    requiresAuth: false,
    title: "Home",
    description: `Welcome to ${siteConfig.name}`,
  },
  WEATHER: {
    path: ROUTES.WEATHER,
    requiresAuth: false,
    title: "Weather",
    description: `Check the weather in your area`,
  },
};

/**
 * Helper functions to work with routes
 */
export const routeUtils = {
  /**
   * Check if a route requires authentication
   * @param path The path to check
   * @returns True if the path requires authentication
   */
  requiresAuth: (path: string): boolean => {
    return Object.values(appRoutes).some(
      (route) => path.startsWith(route.path) && route.requiresAuth
    );
  },

  /**
   * Generate the login URL with callback
   * @param callbackUrl Where to redirect after login
   * @returns The full login URL with callback
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLoginUrl: (callbackUrl?: string): string => {
    // if (!callbackUrl) return login_path_from_appRoutes;
    // return `${login_path_from_appRoutes}?callbackUrl=${encodeURIComponent(
    //   callbackUrl
    // )}`;
    return "";
  },

  /**
   * Generate the home URL
   * @returns The full home URL
   */
  getHomeUrl: (): string => {
    return appRoutes.HOME.path;
  },

  /**
   * Check if a path is a public path (doesn't require auth)
   * @param path The path to check
   * @returns True if the path is public
   */
  isPublicPath: (path: string): boolean => {
    return !routeUtils.requiresAuth(path);
  },

  /**
   * Check if a path is a private path (requires auth)
   * @param path The path to check
   * @returns True if the path is private
   */
  isPrivatePath: (path: string): boolean => {
    return routeUtils.requiresAuth(path);
  },

  /**
   * Check if a path is an auth path (requires auth)
   * @param path The path to check
   * @returns True if the path is an auth path
   */
  isAuthPath: (path: string): boolean => {
    return Object.values(appRoutes).some(
      (route) => path.startsWith(route.path) && route.requiresAuth
    );
  },
};

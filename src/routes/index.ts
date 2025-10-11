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
 */
export const appRoutes: Record<keyof typeof ROUTES, RouteConfig> = {
  HOME: {
    path: ROUTES.HOME,
    requiresAuth: false,
    title: "Home",
    description: `Welcome to ${siteConfig.name}`,
  },
  REGISTER: {
    path: ROUTES.REGISTER,
    requiresAuth: false,
    title: "Register",
    description: "Create a new account",
  },
  DASHBOARD: {
    path: ROUTES.DASHBOARD,
    requiresAuth: true,
    title: "Dashboard",
    description: "Your personal dashboard",
  },
  PROFILE: {
    path: ROUTES.PROFILE,
    requiresAuth: true,
    title: "Profile",
    description: "Your profile information",
  },
  SETTINGS: {
    path: ROUTES.SETTINGS,
    requiresAuth: true,
    title: "Settings",
    description: "Account settings",
  },
  AUTH: {
    path: ROUTES.AUTH,
    requiresAuth: false,
    title: "Auth",
    description: "Authentication",
  },
  LOGOUT: {
    path: ROUTES.LOGOUT,
    requiresAuth: true,
    title: "Logout",
    description: "Logout from your account",
  },
  FORGOT_PASSWORD: {
    path: ROUTES.FORGOT_PASSWORD,
    requiresAuth: false,
    title: "Forgot Password",
    description: "Forgot your password",
  },
  RESET_PASSWORD: {
    path: ROUTES.RESET_PASSWORD,
    requiresAuth: false,
    title: "Reset Password",
    description: "Reset your password",
  },
  LOGIN: {
    path: ROUTES.LOGIN,
    requiresAuth: false,
    title: "Login",
    description: "Login to your account",
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
   * Check if a path is an auth-related path
   * @param path The path to check
   * @returns True if the path is an auth-related path
   */
  isAuthPath: (path: string): boolean => {
    return path.startsWith(appRoutes.AUTH.path);
  },

  /**
   * Generate the login URL with callback
   * @param callbackUrl Where to redirect after login
   * @returns The full login URL with callback
   */
  getLoginUrl: (callbackUrl?: string): string => {
    if (!callbackUrl) return appRoutes.LOGIN.path;
    return `${appRoutes.LOGIN.path}?callbackUrl=${encodeURIComponent(
      callbackUrl
    )}`;
  },

  /**
   * Generate the home URL
   * @returns The full home URL
   */
  getHomeUrl: (): string => {
    return appRoutes.HOME.path;
  },

  /**
   * Generate the dashboard URL
   * @returns The full dashboard URL
   */
  getDashboardUrl: (): string => {
    return appRoutes.DASHBOARD.path;
  },

  /**
   * Check if a path is the dashboard path
   * @param path The path to check
   * @returns True if the path is the dashboard path
   */
  isDashboardPath: (path: string): boolean => {
    return (
      path === appRoutes.DASHBOARD.path ||
      path.startsWith(`${appRoutes.DASHBOARD.path}/`)
    );
  },

  /**
   * Check if a path is a public path (doesn't require auth)
   * @param path The path to check
   * @returns True if the path is public
   */
  isPublicPath: (path: string): boolean => {
    return !routeUtils.requiresAuth(path);
  },
};

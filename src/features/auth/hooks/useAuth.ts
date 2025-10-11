"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { setUser, setToken, logout as logoutAction } from "../store/authSlice";
import {
  getAuthToken,
  fetchUserData,
  login as loginService,
  logout as logoutService,
  initializeAuthCleanup,
} from "../services";
import { AuthOperation, AuthResponse, LoginCredentials } from "../types/auth";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/routes";
import { ErrorHandler } from "@/services/api";

/**
 * Helper function to initialize authentication
 */
function useAuthInit(
  dispatch: ReturnType<typeof useDispatch>,
  t: (key: string) => string
) {
  const [isLoading, setIsLoading] = useState(true); // Start with true to show loading initially
  const [currentOperation, setCurrentOperation] = useState<AuthOperation>(
    AuthOperation.INIT
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        setCurrentOperation(AuthOperation.INIT);
        setAuthError(null);

        // Clean up any insecure user data cookies from previous versions
        initializeAuthCleanup();

        // First check if we have a token
        const token = await getAuthToken();

        if (token) {
          // If we have a token, fetch user data from server
          const userData = await fetchUserData();

          if (userData) {
            // Update Redux state with both token and user
            dispatch(setToken(token));
            dispatch(setUser(userData));
          } else {
            // Token exists but couldn't fetch user data - token might be invalid
            console.warn(
              "Token exists but user data fetch failed - clearing auth"
            );
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);

        // Use ErrorHandler for consistent error handling
        const errorResponse = ErrorHandler.handle(error);

        // Set specific error message based on error type
        if (errorResponse.isNetworkError) {
          setAuthError(t("networkError") || "Network connection error");
        } else if (errorResponse.isAuthError) {
          setAuthError(t("authInitFailed"));
        } else {
          setAuthError(t("authInitFailed"));
        }
      } finally {
        setIsLoading(false);
        setCurrentOperation(AuthOperation.NONE);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [dispatch, isInitialized, t]);

  return {
    isLoading,
    currentOperation,
    authError,
    isInitialized,
    setIsLoading,
    setCurrentOperation,
    setAuthError,
  };
}

/**
 * Login handler function
 */
/**
 * Main authentication hook that provides all auth functionality
 */
export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations("auth");
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Use the init helper to handle authentication initialization
  const {
    isLoading,
    currentOperation,
    authError,
    isInitialized,
    setIsLoading,
    setCurrentOperation,
    setAuthError,
  } = useAuthInit(dispatch, t);

  // Create the state handlers object wrapped in useMemo to prevent recreation on each render
  // Create memoized login function
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setIsLoading(true);
        setCurrentOperation(AuthOperation.LOGIN);
        setAuthError(null);

        const response: AuthResponse = await loginService(credentials);

        // Use the user data returned from the login response instead of making another API call
        // This avoids the timing issue where the cookie isn't immediately available
        if (response.user) {
          dispatch(setUser(response.user));
        } else {
          throw new Error("No user data returned from login");
        }

        return response;
      } catch (error) {
        console.error("Login error:", error);

        // Use ErrorHandler for consistent error handling
        const errorResponse = ErrorHandler.handle(error);

        // Set specific error message based on error type
        if (errorResponse.isNetworkError) {
          setAuthError(t("networkError") || "Network connection error");
        } else if (errorResponse.isAuthError) {
          setAuthError(t("loginFailed"));
        } else if (errorResponse.isValidationError) {
          setAuthError(
            t("validationFailed") || "Please check your credentials"
          );
        } else {
          setAuthError(t("loginFailed"));
        }

        throw error;
      } finally {
        setIsLoading(false);
        setCurrentOperation(AuthOperation.NONE);
      }
    },
    [setIsLoading, setCurrentOperation, setAuthError, dispatch, t]
  );

  // Create memoized logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setCurrentOperation(AuthOperation.LOGOUT);
      setAuthError(null);

      await logoutService();

      // Clear Redux state
      dispatch(logoutAction());

      // Redirect to home page
      router.push(appRoutes.HOME.path);
    } catch (error) {
      console.error("Logout error:", error);

      // Use ErrorHandler for consistent error handling
      const errorResponse = ErrorHandler.handle(error);

      // Set specific error message based on error type
      if (errorResponse.isNetworkError) {
        setAuthError(t("networkError") || "Network connection error");
      } else {
        setAuthError(t("logoutFailed"));
      }

      throw error;
    } finally {
      setIsLoading(false);
      setCurrentOperation(AuthOperation.NONE);
    }
  }, [setIsLoading, setCurrentOperation, setAuthError, dispatch, router, t]);

  // Create memoized clearError function
  const clearError = useCallback(() => setAuthError(null), [setAuthError]);

  return {
    // Auth state
    user,
    isAuthenticated,

    // Loading state
    isLoading,
    isInitialized,
    currentOperation,

    // Error state
    error: authError,

    // Auth operations
    login,
    logout,

    // Helper methods
    clearError,
  };
}

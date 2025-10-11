import { apiClient } from "@/services/api/apiClient";
import { LoginCredentials, User } from "../types/auth";
import { decrypt, isCryptoSupported } from "@/lib/crypto";
import { getCookie } from "@/lib/cookie";
import { COOKIE_NAMES, API_ENDPOINTS } from "@/constants";
import { ResponseHandler, ErrorHandler } from "@/services/api";
import { ApiResponse, EndpointType } from "@/types";
import { appRoutes } from "@/routes";

/**
 * Consolidated Authentication Service
 *
 * This service handles all authentication operations using the project's
 * established patterns and architecture. It replaces both authService.ts
 * and secureAuthService.ts to eliminate redundancy.
 */

/**
 * Get the authentication token from cookie with proper processing
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const tokenValue = getCookie(COOKIE_NAMES.AUTH_TOKEN);
    if (!tokenValue) return null;

    // Decode URI component if encoded
    let processedToken: string;
    try {
      processedToken = decodeURIComponent(tokenValue);
    } catch {
      processedToken = tokenValue;
    }

    // Decrypt if crypto is supported and the token appears to be encrypted
    if (isCryptoSupported() && processedToken.startsWith("encrypted:")) {
      try {
        processedToken = await decrypt(processedToken);
      } catch (error) {
        console.error("Failed to decrypt token:", error);
        return null;
      }
    }

    // The token might be JSON-stringified, try to parse it
    try {
      const parsed = JSON.parse(processedToken);
      return typeof parsed === "string" ? parsed : processedToken;
    } catch {
      // If it's not JSON, return as-is
      return processedToken;
    }
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
}

/**
 * Fetch user data from the server using the authentication token
 * Uses project's API patterns and endpoint constants
 */
export async function fetchUserData(): Promise<User | null> {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    // Use API_ENDPOINTS constant instead of hardcoded path
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USER.PROFILE,
      {
        endpointType: EndpointType.APP_API,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return ResponseHandler.process(response);
  } catch (error) {
    // Use project's ErrorHandler for consistent error handling
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 401
    ) {
      // Token is invalid or expired, clear it
      clearAuthToken();
      return null;
    }
    throw ErrorHandler.handle(error);
  }
}

/**
 * Login with email and password using project's API patterns
 */
export async function login<T>(credentials: LoginCredentials): Promise<T> {
  try {
    // Use appRoutes instead of hardcoded path
    const response = await apiClient.post<ApiResponse<T>>(
      appRoutes.LOGIN.path,
      credentials,
      { endpointType: EndpointType.APP_API }
    );

    return ResponseHandler.process(response);
  } catch (error) {
    throw ErrorHandler.handle(error);
  }
}

/**
 * Logout the user using project's API patterns
 */
export async function logout(): Promise<void> {
  try {
    // Use appRoutes instead of hardcoded path
    await apiClient.post<ApiResponse<void>>(appRoutes.LOGOUT.path, undefined, {
      endpointType: EndpointType.APP_API,
    });

    // Clear auth token from client-side as fallback
    clearAuthToken();
  } catch (error) {
    throw ErrorHandler.handle(error);
  }
}

/**
 * Validate the current authentication token
 */
export async function validateToken(): Promise<boolean> {
  try {
    const token = await getAuthToken();
    if (!token) return false;

    // Use API_ENDPOINTS constant for validation
    const response = await apiClient.get<ApiResponse<{ valid: boolean }>>(
      API_ENDPOINTS.AUTH.VALIDATE,
      {
        endpointType: EndpointType.APP_API,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = ResponseHandler.process(response);
    return result.valid;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

/**
 * Clear authentication token from client-side storage
 * Private utility function for cleanup
 */
function clearAuthToken(): void {
  try {
    // Use COOKIE_NAMES constant
    document.cookie = `${COOKIE_NAMES.AUTH_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    // Also clear any legacy user data cookie that might exist
    document.cookie = `${COOKIE_NAMES.USER_DATA}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch (error) {
    console.error("Error clearing auth token:", error);
  }
}

/**
 * Initialize authentication state cleanup
 * Removes any insecure cookies from previous versions
 */
export function initializeAuthCleanup(): void {
  try {
    // Check and clean up any existing insecure user data cookies
    const userDataCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_NAMES.USER_DATA}=`));

    if (userDataCookie) {
      console.log("Cleaning up insecure user data cookie for security...");
      document.cookie = `${COOKIE_NAMES.USER_DATA}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
    }
  } catch (error) {
    console.error("Error during auth cleanup:", error);
  }
}

// Export types for external use
export type { LoginCredentials, User } from "../types/auth";

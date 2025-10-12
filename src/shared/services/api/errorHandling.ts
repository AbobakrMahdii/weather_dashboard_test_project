import { AxiosError } from "axios";
import {
  ApiError,
  AuthError,
  ForbiddenError,
  NetworkError,
  ServerError,
  ValidationError,
} from "../custom-errors";
import { siteConfig } from "@/config/site";

export type ErrorResponse = {
  message: string;
  statusCode?: number;
  validationErrors?: Record<string, string[]>;
  isNetworkError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
  isServerError: boolean;
};

export interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
  isValidationError?: boolean;
  isAuthError?: boolean;
}

export class ErrorHandler {
  /**
   * Handle any error and return a standardized error response
   */
  static handle(error: unknown): ErrorResponse {
    // Log detailed error information in development mode
    if (!siteConfig.isProduction) {
      console.group("🔴 API Error Details");

      if (error instanceof AxiosError) {
        console.log("📍 Endpoint:", error.config?.url);
        console.log("🔢 Status Code:", error.response?.status);
        console.log("📦 Response Data:", error.response?.data);
        console.log("📋 Full Error:", error);
      } else {
        console.log("📋 Error:", error);
      }

      console.groupEnd();
    }

    if (typeof window !== "undefined" && !window.navigator.onLine) {
      return {
        message:
          "You are currently offline. Please check your internet connection.",
        isNetworkError: true,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }

    // Handle Axios errors
    else if (error instanceof AxiosError) {
      const statusCode = error.response?.status;

      // Handle network errors
      if (!statusCode) {
        return {
          message: "Network error. Unable to connect to the server.",
          isNetworkError: true,
          isAuthError: false,
          isValidationError: false,
          isServerError: false,
        };
      }

      // Extract error message from various possible response structures
      // Handles: { error: { message: "..." } }, { message: "..." }, or plain text
      const getErrorMessage = (defaultMessage: string): string => {
        const responseData = error.response?.data;
        if (responseData?.error?.message) {
          return responseData.error.message; // WeatherAPI format
        }
        if (responseData?.message) {
          return responseData.message; // Standard format
        }
        if (typeof responseData === "string") {
          return responseData; // Plain text
        }
        return defaultMessage;
      };

      // Handle bad request errors (400) - common for invalid locations in WeatherAPI
      if (statusCode === 400) {
        return {
          message: getErrorMessage(
            "Bad request. Please check your search input."
          ),
          statusCode,
          isNetworkError: false,
          isAuthError: false,
          isValidationError: false,
          isServerError: false,
        };
      }

      // Handle unauthorized errors
      if (statusCode === 401) {
        return {
          message: getErrorMessage(
            "Authentication failed. Please login again."
          ),
          statusCode,
          isNetworkError: false,
          isAuthError: true,
          isValidationError: false,
          isServerError: false,
        };
      }

      // Handle forbidden errors
      if (statusCode === 403) {
        return {
          message: getErrorMessage(
            "You don't have permission to access this resource."
          ),
          statusCode,
          isNetworkError: false,
          isAuthError: false,
          isValidationError: false,
          isServerError: false,
        };
      }

      // Handle not found errors
      if (statusCode === 404) {
        return {
          message: getErrorMessage("The requested resource was not found."),
          statusCode,
          isNetworkError: false,
          isAuthError: false,
          isValidationError: false,
          isServerError: false,
        };
      }

      // Handle validation errors
      if (statusCode === 422) {
        return {
          message: getErrorMessage(
            "Validation failed. Please check your input."
          ),
          statusCode,
          validationErrors: error.response?.data?.errors,
          isNetworkError: false,
          isAuthError: false,
          isValidationError: true,
          isServerError: false,
        };
      }

      // Handle server errors
      if (statusCode >= 500) {
        return {
          message: getErrorMessage("An unexpected server error occurred."),
          statusCode,
          isNetworkError: false,
          isAuthError: false,
          isValidationError: false,
          isServerError: true,
        };
      }

      // Handle other HTTP errors
      return {
        message: getErrorMessage(
          error.message || "An unexpected error occurred."
        ),
        statusCode,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }

    // Handle ApiError
    else if (error instanceof ApiError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }

    // Handle known custom errors
    else if (error instanceof NetworkError) {
      return {
        message: error.message,
        isNetworkError: true,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    } else if (error instanceof AuthError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        isNetworkError: false,
        isAuthError: true,
        isValidationError: false,
        isServerError: false,
      };
    } else if (error instanceof ForbiddenError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    } else if (error instanceof ValidationError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        validationErrors: error.errors,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: true,
        isServerError: false,
      };
    } else if (error instanceof ServerError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: true,
      };
    }

    // Handle Error objects
    else if (error instanceof Error) {
      return {
        message: error.message || "An unexpected error occurred.",
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }

    // Handle unknown errors
    else {
      return {
        message: String(error) || "An unknown error occurred.",
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      };
    }
  }
}

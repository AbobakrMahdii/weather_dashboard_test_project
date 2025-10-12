/**
 * useGeolocation Hook
 * Handles browser geolocation API with error handling
 */

import { useState, useCallback, useEffect } from "react";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  supported: boolean;
}

export interface UseGeolocationReturn extends GeolocationState {
  getCurrentLocation: () => void;
  clearError: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    supported: false,
  });

  useEffect(() => {
    // Check if geolocation is supported
    if ("geolocation" in navigator) {
      setState((prev) => ({ ...prev, supported: true }));
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
          supported: true,
        });
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    getCurrentLocation,
    clearError,
  };
};

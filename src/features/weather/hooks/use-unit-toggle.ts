/**
 * useUnitToggle Hook
 * Manages temperature unit (Celsius/Fahrenheit) with Redux sync
 */

import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { RootState } from "@/shared/store";
import { setTemperatureUnit } from "@/shared/store/slices/ui-slice";
import { TemperatureUnit } from "@/features/weather/types";

export interface UseUnitToggleReturn {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  setUnit: (unit: TemperatureUnit) => void;
  isCelsius: boolean;
  isFahrenheit: boolean;
}

export const useUnitToggle = (): UseUnitToggleReturn => {
  const dispatch = useDispatch();
  const unit = useSelector((state: RootState) => state.ui.temperatureUnit);

  const toggleUnit = useCallback(() => {
    const newUnit: TemperatureUnit = unit === "metric" ? "imperial" : "metric";
    dispatch(setTemperatureUnit(newUnit));
  }, [dispatch, unit]);

  const setUnit = useCallback(
    (newUnit: TemperatureUnit) => {
      dispatch(setTemperatureUnit(newUnit));
    },
    [dispatch]
  );

  return {
    unit,
    toggleUnit,
    setUnit,
    isCelsius: unit === "metric",
    isFahrenheit: unit === "imperial",
  };
};

/**
 * useRecentSearches Hook
 * Manages recent weather searches with localStorage and Redux
 */

import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { RootState } from "@/shared/store";
import {
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from "@/shared/store/slices/ui-slice";
import { RecentSearch } from "@/features/weather/types";
import { COOKIE_NAMES } from "@/constants";

export interface UseRecentSearchesReturn {
  recentSearches: RecentSearch[];
  addSearch: (search: Omit<RecentSearch, "timestamp">) => void;
  removeSearch: (city: string) => void;
  clearSearches: () => void;
  hasSearches: boolean;
}

export const useRecentSearches = (): UseRecentSearchesReturn => {
  const dispatch = useDispatch();
  const recentSearches = useSelector(
    (state: RootState) => state.ui.recentSearches
  );

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_NAMES.RECENT_SEARCHES);
    if (stored) {
      try {
        const searches: RecentSearch[] = JSON.parse(stored);
        searches.forEach((search) => dispatch(addRecentSearch(search)));
      } catch (error) {
        console.error("Failed to parse recent searches:", error);
      }
    }
  }, [dispatch]);

  // Save to localStorage when searches change
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem(
        COOKIE_NAMES.RECENT_SEARCHES,
        JSON.stringify(recentSearches)
      );
    }
  }, [recentSearches]);

  const addSearch = useCallback(
    (search: Omit<RecentSearch, "timestamp">) => {
      const newSearch: RecentSearch = {
        ...search,
        timestamp: Date.now(),
      };
      dispatch(addRecentSearch(newSearch));
    },
    [dispatch]
  );

  const removeSearch = useCallback(
    (city: string) => {
      dispatch(removeRecentSearch(city));
    },
    [dispatch]
  );

  const clearSearches = useCallback(() => {
    dispatch(clearRecentSearches());
    localStorage.removeItem(COOKIE_NAMES.RECENT_SEARCHES);
  }, [dispatch]);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
    hasSearches: recentSearches.length > 0,
  };
};

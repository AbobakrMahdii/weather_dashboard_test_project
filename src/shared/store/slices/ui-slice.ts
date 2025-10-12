import { uuid } from "@/shared/lib/utils";
import { NotificationType, Theme } from "@/shared/types";
import { TemperatureUnit, RecentSearch } from "@/features/weather/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the UI state
export interface UiState {
  sidebarOpen: boolean;
  currentTheme: Theme;
  isOnline: boolean;
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  notifications: Notification[];
  // Weather preferences
  temperatureUnit: TemperatureUnit;
  lastSearchedCity: string | null;
  favoriteLocations: string[];
  recentSearches: RecentSearch[];
}

// Define the notification type
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  read: boolean;
}

// Define the initial state
const initialState: UiState = {
  sidebarOpen: false,
  currentTheme: "light",
  isOnline: true,
  isMobileMenuOpen: false,
  activeModal: null,
  notifications: [],
  // Weather preferences
  temperatureUnit: "metric",
  lastSearchedCity: null,
  favoriteLocations: [],
  recentSearches: [],
};

// Create the UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Toggle the sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Set the sidebar state
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Set the current theme
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
    },

    // Set the online status
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },

    // Toggle the mobile menu
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },

    // Set the mobile menu state
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },

    // Set the active modal
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },

    // Add a notification
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "read">>
    ) => {
      const id = uuid();
      state.notifications.push({
        ...action.payload,
        id,
        read: false,
      });
    },

    // Remove a notification
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    // Mark a notification as read
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Weather-related actions
    setTemperatureUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.temperatureUnit = action.payload;
    },

    setLastSearchedCity: (state, action: PayloadAction<string | null>) => {
      state.lastSearchedCity = action.payload;
    },

    addFavoriteLocation: (state, action: PayloadAction<string>) => {
      if (!state.favoriteLocations.includes(action.payload)) {
        state.favoriteLocations.push(action.payload);
      }
    },

    removeFavoriteLocation: (state, action: PayloadAction<string>) => {
      state.favoriteLocations = state.favoriteLocations.filter(
        (location) => location !== action.payload
      );
    },

    addRecentSearch: (state, action: PayloadAction<RecentSearch>) => {
      // Remove duplicate if exists
      state.recentSearches = state.recentSearches.filter(
        (search) => search.city !== action.payload.city
      );
      // Add to beginning
      state.recentSearches.unshift(action.payload);
      // Keep only last 10
      if (state.recentSearches.length > 10) {
        state.recentSearches = state.recentSearches.slice(0, 10);
      }
    },

    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        (search) => search.city !== action.payload
      );
    },

    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setOnlineStatus,
  toggleMobileMenu,
  setMobileMenuOpen,
  setActiveModal,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  clearNotifications,
  setTemperatureUnit,
  setLastSearchedCity,
  addFavoriteLocation,
  removeFavoriteLocation,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} = uiSlice.actions;

// Export the reducer
export default uiSlice.reducer;

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/ui-slice";
import { siteConfig } from "@/config/site";

// Define the root reducer with all slice reducers
const rootReducer = combineReducers({
  ui: uiReducer,
  // TODO: More reducers here
});

// Create the store with configuration
export const store = configureStore({
  reducer: rootReducer,
  // Enable Redux DevTools in development
  devTools: !siteConfig.isProduction,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain actions for serialization check
        ignoredActions: ["auth/refreshToken/fulfilled"],
        // Ignore certain paths for serialization check
        ignoredPaths: ["auth.user"],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

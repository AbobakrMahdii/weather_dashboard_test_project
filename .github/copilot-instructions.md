# Copilot Instructions for Startup Template Next.js Project

## Architecture Overview

This is a **feature-based Next.js 15** application using the App Router with TypeScript, Redux Toolkit, TanStack Query, and next-intl for internationalization. Code is organized by business domains (features), not technical layers.

### Core Stack

- **Next.js 15.3.4** with Turbopack dev mode (`npm run dev`)
- **React 19** with Server Components by default (use `"use client"` directive sparingly)
- **TypeScript** with strict mode, path alias `@/*` → `src/*`
- **Tailwind CSS 4** for styling with `cn()` utility from `@/shared/lib/utils` (combines clsx + tailwind-merge)
- **Redux Toolkit 2.8.2** for global UI state (`@/shared/store`)
- **TanStack Query 5.81.2** for server state caching with automatic error handling
- **next-intl 4.3.0** for i18n with cookie-based locale persistence
- **Framer Motion 12.19.1** for animations (AnimatePresence, motion components)
- **next-themes 0.4.6** for theme management (light/dark/system)
- **Axios 1.10.0** for HTTP requests (wrapped in custom hooks)

## Key Architectural Patterns

### 1. Feature-Based Organization

Each feature lives in `src/features/feature_name/` with this structure:

```
feature_name/
├── index.tsx              # Public API - only exports what other features need
├── components/            # Feature-specific UI (common/ and ui/ subdirs)
├── hooks/                 # Feature-specific hooks
├── services/              # Feature-specific API calls
├── store/                 # Feature-specific Redux slices
├── types/                 # Feature-specific TypeScript types
├── validations/           # Form validation schemas
├── forms/                 # Form components
├── animations/            # Framer Motion variants
└── shimmers/              # Loading skeletons
```

**Rule**: Features should have minimal cross-feature dependencies. Import from feature's `index.tsx`, not internal files.

### 2. Dual API Architecture (`EndpointType`)

The app supports two API modes (see `@/shared/types` and `@/shared/services/api/apiClient`):

- **`EndpointType.APP_API`**: Routes through Next.js API routes (`/api/feature_name/route.tsx`)
- **`EndpointType.DIRECT_API`**: Calls external API directly (`${apiBaseUrl}/${apiMainPath}/${apiVersion}`)

Default is configured in `siteConfig.defaultEndpointType`. Override per-request:

```typescript
useApiQuery(endpoint, queryKey, { endpointType: EndpointType.APP_API });
```

### 3. Data Fetching with TanStack Query

**Always use** `useApiQuery`, `useApiMutation`, or `useApiQueryWithParams` from `@/shared/services/api/queryService`:

```typescript
// Basic GET request
const { data, isLoading } = useApiQuery<ResponseType>(
  "/users/profile",
  ["user", "profile"],
  { staleTime: 5 * 60 * 1000 }
);

// GET with query parameters
const { data } = useApiQueryWithParams("/search", { q: searchTerm, page: 1 }, [
  "search",
  searchTerm,
]);

// Mutations (POST/PUT/PATCH/DELETE)
const { mutate, isPending } = useApiMutation({
  endpoint: "/users/update",
  method: HttpMethod.PUT,
  onSuccess: (data) => {
    /* ... */
  },
  onError: (error) => {
    /* ... */
  },
});

// Direct API call without caching (for auth flows)
const { execute } = useDirectApiCall("/auth/login", HttpMethod.POST);
const result = await execute({ email, password });
```

**Automatic features** (no manual configuration needed):

- Response unwrapping (`ResponseHandler.process` handles `ApiResponse<T>` structure)
- Error standardization (`ErrorHandler.handle` converts all errors to `ErrorResponse`)
- Auth token injection from `auth-token` cookie via axios interceptor
- Endpoint type routing (APP_API vs DIRECT_API)
- Network status detection (rejects requests when `navigator.onLine === false`)
- Retry logic: 2 retries for 5xx errors, no retry for 4xx client errors

**Response structure expectations**:

```typescript
// Standard API response
{ success: true, message: "OK", response: T }

// Error response
{ success: false, message: "Error", code: "ERR_CODE", errors?: {...} }

// Paginated response
{ success: true, response: { data: T[], total, per_page, current_page, ... } }
```

### 4. Internationalization (i18n)

- Locale stored in `NEXT_LOCALE` cookie (see `COOKIE_NAMES` in `@/constants`)
- Messages in `messages/{locale}.json` (currently `en.json` and `ar.json`)
- **Server components**: Use `await getTranslations()` from `next-intl/server`
- **Client components**: Use `useTranslations()` hook from `next-intl`
- **RTL support**: Root layout automatically sets `dir="rtl"` for Arabic locale
- **Locale switching**: Use `LanguageSwitcher` component which sets cookie and triggers reload
- **Default locale**: Configured in `siteConfig.defaultLocale` (env: `NEXT_PUBLIC_DEFAULT_LANGUAGE`)
- **Supported locales**: Configured in `siteConfig.locales` (env: `NEXT_PUBLIC_SUPPORTED_LOCALES` comma-separated)

**Example usage**:

```typescript
// Server component
import { getTranslations } from "next-intl/server";
const t = await getTranslations("common");
return <h1>{t("welcome")}</h1>;

// Client component
import { useTranslations } from "next-intl";
const t = useTranslations("common");
return <h1>{t("welcome")}</h1>;
```

**i18n config** (`i18n.ts`) attempts cookie-based locale first, falls back to default if invalid.

### 5. Authentication Flow

- Auth tokens stored in HTTP-only cookies: `auth-token` and `refresh-token` (see `COOKIE_NAMES`)
- **Middleware** (`src/middleware.ts`) handles:
  - Protected route checks via `routeUtils.requiresAuth(path)`
  - Redirects to login with `?callbackUrl` query param
- **Route guards** defined in `src/shared/routes/index.ts` (`appRoutes` object)
- Token refresh is **disabled** (see commented code in `apiClient.ts` interceptor)

**To add protected routes**: Update `appRoutes` in `src/shared/routes/index.ts`:

```typescript
DASHBOARD: {
  path: ROUTES.DASHBOARD,
  requiresAuth: true,
  title: "Dashboard"
}
```

### 6. Shared vs. Feature Code

**`src/shared/`** contains reusable code across features:

- `components/common/` - Generic UI (buttons, modals)
- `components/ui/` - App-level UI (theme switcher, network indicator)
- `hooks/` - Generic hooks (use-network-status, use-pagination)
- `lib/` - Pure utilities (cookie, crypto, query, utils with `cn()`)
- `services/api/` - Core API infrastructure
- `store/` - Global Redux slices (e.g., `ui-slice.ts`)

**Rule**: Don't put feature-specific logic in `shared/`. If only one feature uses it, keep it in that feature's directory.

## Configuration

### Environment Variables (see `src/config/site.ts`)

- `NEXT_PUBLIC_APP_NAME` - App name
- `NEXT_PUBLIC_API_BASE_URL` - External API base URL
- `NEXT_PUBLIC_API_VERSION` - API version (default: "v1")
- `NEXT_PUBLIC_API_MAIN_PATH` - API path prefix (default: "api")
- `NEXT_PUBLIC_DEFAULT_ENDPOINT` - "app_api" or "direct_api"
- `NEXT_PUBLIC_DEFAULT_LANGUAGE` - "en" or "ar"
- `NEXT_PUBLIC_SUPPORTED_LOCALES` - Comma-separated locale codes
- `NEXT_PUBLIC_ENCRYPTION_KEY` - For crypto operations

### Global Constants (`@/constants/index.ts`)

- `API_ENDPOINTS` - API route paths (AUTH: login/logout/refresh/validate, USER: profile)
- `COOKIE_NAMES` - Cookie key names (`auth-token`, `refresh-token`, `NEXT_LOCALE`, `site-theme`, `user-data`)
- `COOKIE_SETTINGS` - Cookie configuration (max age, path, secure, sameSite)
- `ROUTES` - App route paths (currently only HOME: "/")
- `TIMINGS` - Timeout/debounce values in milliseconds (API_TIMEOUT: 30s, DEBOUNCE_SEARCH: 300ms, etc.)
- `REGEX` - Validation patterns (EMAIL, PASSWORD, URL)
- `PAGINATION` - Pagination defaults (DEFAULT_PAGE: 1, DEFAULT_PER_PAGE: 10, PER_PAGE_OPTIONS: [10, 25, 50, 100])
- `CSS_CLASSES` - Reusable CSS class strings for consistent styling
- `QUERY_STATE_MANAGERS` - Query param keys (CALLBACK_URL)
- `AUTH` - Auth roles and session duration

## Component Patterns

### Button Example (Shared Component)

See `src/shared/components/common/Buttons/PrimaryButton/` for the pattern:

```typescript
// types.ts
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success";
}

// index.tsx
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

export default function PrimaryButton({
  isLoading,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "text-white px-4 py-2 rounded-md",
        getVariantStyles(),
        className
      )}
      {...props}
    />
  );
}
```

**Use `motion` components** for interactive UI elements with Framer Motion.

## Shared Utilities & Hooks

### Utility Functions (`@/shared/lib/`)

- **`utils.ts`**: Core helpers

  - `cn()` - Combines clsx + tailwind-merge for conditional classes
  - `formatDate()` - Intl.DateTimeFormat wrapper
  - `safeJsonParse()` - Parse JSON without throwing
  - `truncate()` - String truncation with ellipsis
  - `wait()` - Promise-based delay
  - `uuid()` - Generate unique IDs
  - `debounce()` - Function debouncing

- **`cookie.ts`**: Client-side cookie management

  - `getCookie(name)` - Read cookie value
  - `setCookie(name, value, options)` - Set cookie with security options
  - `deleteCookie(name)` - Remove cookie
  - Note: For server components, use `cookies()` from `next/headers`

- **`crypto.ts`**: Web Crypto API utilities

  - `encrypt(data)` - AES-GCM encryption with PBKDF2 key derivation
  - `decrypt(encryptedData)` - Decrypt encrypted strings
  - `isCryptoSupported()` - Check for Web Crypto API availability
  - Uses `NEXT_PUBLIC_ENCRYPTION_KEY` from env, adds "encrypted:" prefix

- **`query.ts`**: TanStack Query configuration
  - `createQueryClient()` - Configured QueryClient with retry logic
  - `createQueryKeys(feature)` - Helper for consistent cache key generation
  - `queryKeys` - Pre-defined keys for auth, dashboard, user features

### Shared Hooks (`@/shared/hooks/`)

- **`use-network-status.ts`**:

  - Monitors `navigator.onLine` status
  - Updates Redux `ui` slice with `setOnlineStatus`
  - Handles hydration mismatch with `mounted` state
  - Returns `{ isOnline, mounted }`

- **`use-pagination.ts`**:
  - Wraps `useInfiniteQuery` for paginated data
  - Takes `{ queryKey, defaultParams, enabled, fetchData }`
  - Returns flattened data array, `hasNextPage`, `fetchNextPage`, etc.
  - Automatically manages page params and refetching

## Redux Store Structure

### Global State (`@/shared/store/slices/ui-slice.ts`)

The `ui` slice manages application-wide UI state:

```typescript
interface UiState {
  sidebarOpen: boolean; // Sidebar toggle state
  currentTheme: Theme; // "light" | "dark" | "system"
  isOnline: boolean; // Network connectivity status
  isMobileMenuOpen: boolean; // Mobile menu state
  activeModal: string | null; // Currently open modal ID
  notifications: Notification[]; // In-app notifications
}
```

**Actions**:

- `toggleSidebar()`, `setSidebarOpen(bool)`
- `setTheme(theme)` - Synced with next-themes
- `setOnlineStatus(bool)` - Updated by `use-network-status` hook
- `toggleMobileMenu()`, `setMobileMenuOpen(bool)`
- `setActiveModal(id)` - Track modal state
- `addNotification(notification)`, `removeNotification(id)`, `markNotificationAsRead(id)`, `clearAllNotifications()`

**Usage**:

```typescript
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/shared/store/slices/ui-slice";
import { RootState } from "@/shared/store";

const theme = useSelector((state: RootState) => state.ui.currentTheme);
const dispatch = useDispatch();
dispatch(setTheme("dark"));
```

## Error Handling System

### Custom Error Classes (`@/shared/services/custom-errors.ts`)

All extend base `ApiError` class with `statusCode`, `code`, `success: false`:

- `NetworkError` - Network unavailable
- `AuthError` - 401 authentication failures
- `ForbiddenError` - 403 access denied
- `NotFoundError` - 404 resource not found
- `ValidationError` - 422 validation errors with `errors` field
- `ServerError` - 500 server errors
- `TimeoutError` - 408 request timeout

### Error Handler (`@/shared/services/api/errorHandling.ts`)

`ErrorHandler.handle(error)` converts any error into standardized `ErrorResponse`:

```typescript
type ErrorResponse = {
  message: string;
  statusCode?: number;
  validationErrors?: Record<string, string[]>;
  isNetworkError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
  isServerError: boolean;
};
```

**Automatic error categorization**:

- Checks `navigator.onLine` for offline state
- Parses Axios errors by status code
- Extracts validation errors from 422 responses
- Provides user-friendly messages for all scenarios

## API Response Handling

### Response Handler (`@/shared/services/api/responseHandling.ts`)

`ResponseHandler.process<T>(response)` unwraps `ApiResponse<T>` structure:

- Validates `success` field, throws on `false`
- Extracts `response` field as return value
- Handles non-standard responses (raw data passthrough)

`ResponseHandler.processPaginated<T>(response)` handles two pagination formats:

- New format: `{ success, response: { data, total, per_page, ... } }`
- Legacy format: `{ success, response: T[], meta: { pagination: {...} } }`
- Normalizes to consistent `PaginatedApiResponse<T>` structure

## Shared Components

### UI Components (`@/shared/components/ui/`)

- **`network-status-indicator.tsx`**:

  - Displays offline/online banner at bottom-center
  - Uses `AnimatePresence` for enter/exit animations
  - Auto-hides after `TIMINGS.NETWORK_STATUS_TRANSITION` (2000ms) when back online
  - Translatable via `t('network.online')` and `t('network.offline')`

- **`theme-switcher.tsx`**:

  - Three-button switcher: light, dark, system
  - Syncs with `next-themes` and Redux `ui` slice
  - Uses `CSS_CLASSES` constants for styling
  - Handles hydration mismatch with `mounted` state

- **`language-switcher.tsx`**:
  - Renders button for each locale in `siteConfig.locales`
  - Sets `NEXT_LOCALE` cookie and triggers `window.location.reload()`
  - Disables current locale button
  - Uses translations from `common` namespace

### Common Components (`@/shared/components/common/`)

- **Buttons** (`Buttons/PrimaryButton/`):
  - Structure: `types.ts` defines `ButtonProps`, `index.tsx` implements component
  - Uses `motion.button` with `whileHover`, `whileTap` animations
  - Supports `isLoading` prop with spinner from `lucide-react`
  - Variant system: primary, secondary, danger, success

## Provider Architecture

**Nesting order in `app-providers.tsx`** (outer to inner):

1. `NextIntlClientProvider` - i18n context
2. `ReduxProvider` - Redux store
3. `ThemeProvider` - next-themes
4. `QueryProvider` - TanStack Query

**Why this order**:

- i18n must wrap everything for translations
- Redux needed before components that dispatch actions
- Theme provider sets up CSS variables
- Query provider last as it depends on other contexts

## Server-Side Utilities

### Server API Client (`@/shared/services/api/serverUtils.ts`)

For use in Next.js API routes (`src/app/api/`):

```typescript
// Response helpers
createSuccessResponse<T>(data, message); // Returns NextResponse with ApiResponse structure
createErrorResponse(message, status, code, responseData); // Returns error NextResponse

// Server-side fetch wrapper
serverApiClient.request<T>(url, method, body, headers, token);
```

**Usage in API routes**:

```typescript
import {
  serverApiClient,
  createSuccessResponse,
  createErrorResponse,
} from "@/shared/services/api/serverUtils";

export async function GET(request: NextRequest) {
  try {
    const data = await serverApiClient.request("/external/api", HttpMethod.GET);
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse("Failed to fetch", 500);
  }
}
```

## Developer Workflows

### Running the App

```bash
npm run dev        # Development with Turbopack
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint checks
```

### Debugging

- Server logs: Check terminal running `npm run dev`
- Client logs: Browser DevTools console
- Redux state: Redux DevTools enabled in development
- TanStack Query: React Query Devtools auto-injected in dev

### Adding a New Feature

1. Create `src/features/new_feature/` directory
2. Add subdirectories: `components/`, `hooks/`, `services/`, `types/`, etc.
3. Create `index.tsx` to export public API
4. If feature needs routes, update `ROUTES` in `@/constants` and `appRoutes` in `@/shared/routes`
5. If feature needs API endpoints, update `API_ENDPOINTS` in `@/constants`

### Adding API Routes (App Router)

Create `src/app/api/feature_name/route.tsx`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, data: [] });
}
```

For nested paths: `src/app/api/feature_name/nested_path/route.tsx`

## Critical Files

- **`src/middleware.ts`** - Auth checks, locale handling, runs on every request (matches all except `_next/`, `/api/`, static files)
- **`src/app/layout.tsx`** - Root layout with provider nesting, sets RTL/LTR based on locale, injects `NetworkStatusIndicator`
- **`src/shared/providers/app-providers.tsx`** - Provider order: NextIntl → Redux → Theme → Query (critical for proper initialization)
- **`src/shared/services/api/apiClient.ts`** - Axios config with dual endpoint routing, token injection, network checks, commented-out refresh logic
- **`src/shared/services/api/queryService.ts`** - TanStack Query wrappers (`useApiQuery`, `useApiMutation`, `useApiQueryWithParams`, `useDirectApiCall`)
- **`i18n.ts`** - i18n config at project root, loads messages from `messages/` directory, handles cookie-based locale
- **`src/constants/index.ts`** - Single source of truth for all app constants (routes, endpoints, cookies, timings, etc.)
- **`src/config/site.ts`** - Environment variable mapping and defaults, exports `siteConfig` object

## Common Pitfalls & Best Practices

1. **Don't use `fetch()` or raw `axios`** - Use `useApiQuery`/`useApiMutation` for consistent error handling and caching
2. **Don't bypass feature `index.tsx`** - Always import from feature's public API, never from internal files
3. **Server vs. Client components** - Use `"use client"` only when needed (hooks, browser APIs, event handlers, interactivity)
4. **Middleware execution** - Runs on all routes except `_next/static`, `_next/image`, `favicon.ico`, `/public/`
5. **Cookie access**:
   - **Server components**: Use `cookies()` from `next/headers`
   - **Client components**: Use `getCookie()/setCookie()` from `@/shared/lib/cookie`
   - **Middleware**: Use `request.cookies.get()` from NextRequest
6. **Path aliases** - Always use `@/` for `src/`, never use relative imports across directories (e.g., `../../../shared/`)
7. **Hydration mismatches** - Use `mounted` state pattern for client-only features (see `theme-switcher.tsx`)
8. **Network-dependent code** - Check `navigator.onLine` or use `useNetworkStatus()` before making requests
9. **Provider order matters** - Don't reorder providers in `app-providers.tsx` without understanding dependencies
10. **Response structure** - API must return `{ success: boolean, response?: T, message?: string }` or handlers will fail

## Testing Considerations

No test framework is currently configured. When adding tests:

- Respect feature boundaries and test public APIs only
- Mock TanStack Query with `QueryClientProvider` wrapper
- Mock Redux store with `Provider` and `configureStore`
- Test i18n with `NextIntlClientProvider` wrapper
- Consider Vitest for unit tests, Playwright for E2E

## Environment Setup

See `.env.template` for all variables. Critical ones:

- `NEXT_PUBLIC_API_BASE_URL` - Required for DIRECT_API mode
- `NEXT_PUBLIC_DEFAULT_ENDPOINT` - "app_api" or "direct_api"
- `NEXT_PUBLIC_SUPPORTED_LOCALES` - Comma-separated (e.g., "en,ar")
- `NEXT_PUBLIC_ENCRYPTION_KEY` - For crypto utilities (auto-generated if missing)

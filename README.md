# 🌦️ Weather Dashboard - React Take-Home Exam

A modern, fully-featured weather dashboard application built with **Next.js 15**, **React 19**, **TypeScript**, and **WeatherAPI.com**. This project showcases professional development practices, advanced animations, and a responsive design.

![Weather Dashboard](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Configuration](#-api-configuration)
- [Project Structure](#-project-structure)
- [Design Decisions](#-design-decisions)
- [Challenges & Solutions](#-challenges--solutions)
- [Time Estimation](#-time-estimation)

## ✨ Features

### Core Features (Required)

- ✅ **City Search**: Search for weather by city name with real-time results
- ✅ **Current Weather Display**:
  - Temperature (with unit toggle)
  - City name and country
  - Weather description with icon
  - Humidity percentage
  - Wind speed and direction
- ✅ **Loading States**: Smooth skeleton loaders during data fetching
- ✅ **Error Handling**:
  - City not found errors
  - Network error detection
  - API rate limit handling
  - User-friendly error messages
- ✅ **TypeScript**: Fully typed components, hooks, and API responses

### Bonus Features (Implemented)

- ⭐ **5-Day Weather Forecast**:
  - Daily temperature ranges
  - Weather conditions
  - Hourly breakdown (every 3 hours)
- 🌍 **Geolocation**:
  - "Use My Location" feature
  - Browser geolocation API integration
  - Permission handling
- 🌡️ **Temperature Unit Toggle**:
  - Celsius/Fahrenheit switcher
  - Persisted preference via Redux
- 💾 **Recent Searches**:
  - localStorage persistence
  - Animated dropdown with delete functionality
  - Maximum 10 recent searches
- 📱 **Responsive Design**:
  - Mobile-first approach
  - Tablet and desktop optimized
  - Horizontal scroll for forecast cards
- 🎨 **Advanced Features**:
  - Dynamic weather backgrounds (changes based on conditions)
  - Animated weather particles (rain, snow, sun rays)
  - Framer Motion animations throughout
  - Theme support (light/dark mode)
  - Bilingual support (English/Arabic with RTL)
  - Extended weather details (UV index, visibility, pressure, etc.)

## Directory Structure

```
src/
├── app/                     # Next.js App Router
├── components/              # Shared UI components
├── config/                  # App configuration
├── constants/               # Global constants
├── features/                # Feature modules
│   ├── auth/                # Authentication feature
│   │   ├── components/      # Auth-specific components
│   │   ├── hooks/           # Auth-specific hooks
│   │   ├── services/        # Auth-specific services
│   │   ├── store/           # Auth-related state management
│   │   ├── types/           # Auth-related types
│   │   └── index.ts         # Public API for the auth feature
│   └── dashboard/           # Dashboard feature
│       ├── components/      # Dashboard-specific components
│       ├── hooks/           # Dashboard-specific hooks
│       ├── services/        # Dashboard-specific services
│       ├── store/           # Dashboard-related state management
│       ├── types/           # Dashboard-related types
│       └── index.ts         # Public API for the dashboard feature
├── hooks/                   # Global hooks
├── lib/                     # Utility libraries
├── providers/               # React context providers
├── routes/                  # Route definitions & guards
├── services/                # Shared services
│   ├── api/                 # API integration
│   │   ├── apiClient.ts     # Base Axios configuration
│   │   ├── errorHandling.ts # Centralized error handling
│   │   ├── queryService.ts  # TanStack Query integration
│   │   └── index.ts         # API service exports
│   └── custom-errors.ts     # Application-specific error classes
├── store/                   # Global Redux store configuration
├── styles/                  # Global styles
└── types/                   # Global TypeScript types
```

## Key Features

### Data Fetching

- **TanStack Query Integration**: Smart caching of server state with automatic revalidation
- **Custom Query Hooks**: Feature-specific hooks that leverage TanStack Query
- **Error Handling**: Centralized error handling for API requests

### State Management

- **Redux**: For global state that needs to be accessed by many components
- **React Context**: For more localized state that doesn't need Redux
- **TanStack Query**: For server state and caching

### Authentication

- **Secure Cookie Authentication**: HTTP-only cookies for token storage
- **Role-based Access Control**: Route protection based on user roles
- **Server-side Authentication**: Using Next.js middleware

### Feature-based Architecture

- **Self-contained Modules**: Each feature has its own directory with all related code
- **Clear Public APIs**: Features expose their functionality through index.ts files
- **Minimal Cross-feature Dependencies**: Features are designed to be as independent as possible

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Guidelines

### Creating a New Feature

1. Create a new directory in `src/features/`
2. Add the following subdirectories as needed:
   - `components/`: UI components specific to this feature
   - `hooks/`: React hooks specific to this feature
   - `services/`: API services specific to this feature
   - `store/`: State management specific to this feature
   - `types/`: TypeScript types specific to this feature
3. Create an `index.ts` file that exports the public API of your feature

### Best Practices

1. **Keep Components Small**: Extract reusable parts into separate components
2. **Use TanStack Query for Data Fetching**: Prefer the `useApiQuery` and `useApiMutation` hooks from our queryService
3. **Follow TypeScript Best Practices**: Define proper interfaces for props and state
4. **Maintain Feature Isolation**: Minimize dependencies between features
5. **Document Public APIs**: Add JSDoc comments to exported functions, components, and types

## Internationalization

This template supports both English and Arabic languages, with automatic RTL/LTR switching. Translation files are located in the `messages` directory.

## Authentication

Authentication is handled with secure HTTPOnly cookies, compatible with both client and server components.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

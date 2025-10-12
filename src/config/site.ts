import { EndpointType } from "@/shared/types";

// Function to generate a more secure default key if none is provided
const generateSecureKey = () => {
  // In production, this should always be overridden by an environment variable
  return "secure_default_key_" + new Date().getTime().toString();
};

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Startup Template",
  description:
    "A professional Next.js starter template with advanced architecture",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://startub_template.com",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  apiVersion: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  apiMainPath: process.env.NEXT_PUBLIC_API_MAIN_PATH || "api",
  secretKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY || generateSecureKey(),
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "en",
  defaultTheme: process.env.NEXT_PUBLIC_DEFAULT_THEME || "light",
  locales: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES?.split(",") || [],
  defaultTimeZone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || "Asia/Aden",
  defaultEndpointType:
    (process.env.NEXT_PUBLIC_DEFAULT_ENDPOINT == "app_api"
      ? EndpointType.APP_API
      : EndpointType.DIRECT_API) ?? EndpointType.DIRECT_API,
} as const;

export type SiteConfig = typeof siteConfig;

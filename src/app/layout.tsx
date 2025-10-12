import "@/shared/styles/globals.css";
import { getMessages, getLocale } from "next-intl/server";
import { AppProviders } from "@/shared/providers/app-providers";
import { siteConfig } from "@/config/site";
import { NetworkStatusIndicator } from "@/shared/components/ui/network-status-indicator";
import Navbar from "@/shared/components/ui/navbar";
import { Metadata } from "next";
import { Direction } from "@/shared/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `%s | ${siteConfig.name}`,
      default: siteConfig.name,
    },
    description: siteConfig.description,
    keywords: [
      "weather",
      "weather forecast",
      "weather dashboard",
      "7-day forecast",
      "hourly forecast",
      "real-time weather",
      "weather app",
      "temperature",
      "humidity",
      "wind speed",
    ],
    authors: [{ name: "Abobakr Mahdi" }],
    creator: "Abobakr Mahdi",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/icon.svg",
      apple: "/apple-icon.png",
    },
    // manifest: "/manifest.json",
  };
}

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir: Direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icon.png" type="image/png" />
      </head>
      <body>
        <AppProviders messages={messages} locale={locale}>
          <Navbar />
          {children}
          <NetworkStatusIndicator />
        </AppProviders>
      </body>
    </html>
  );
}

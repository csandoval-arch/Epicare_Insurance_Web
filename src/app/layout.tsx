import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ── TYPOGRAPHY: 3-ROLE FONT SYSTEM ──
// Display · Headings → Inter (variable, optical size axis pinned to 32 via CSS).
const interDisplay = Inter({
  variable: "--font-inter-display",
  axes: ["opsz"],
  subsets: ["latin"],
  display: "swap",
});

// Body · UI → Inter Tight (disciplined grotesk for all functional reading).
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

// Meta · Code → JetBrains Mono (numbers, hex, labels, metadata only).
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// URL pública del project site de GitHub Pages. Debe coincidir con el
// NEXT_PUBLIC_BASE_PATH del workflow de deploy (/Epicare).
export const SITE_URL = "https://chrisbeep98.github.io/Epicare";

const DESCRIPTION =
  "We're not the middleman. We're the operation. 130+ carrier appointments, an agency management system, CRM and licensing support — all under one producer contract, across all 52 US jurisdictions.";

/**
 * Tarjeta social compartida por todas las rutas. Sin ella, `summary_large_image`
 * se renderiza sin miniatura en todos los canales. La ruta es relativa a propósito:
 * `metadataBase` conserva el `/Epicare` del project site de GitHub Pages.
 */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Epicare — The agency that works for you",
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Epicare — The agency that works for you",
    template: "%s · Epicare",
  },
  description: DESCRIPTION,
  applicationName: "Epicare",
  authors: [{ name: "Epicare Insurance Corp" }],
  creator: "Epicare Insurance Corp",
  publisher: "Epicare Insurance Corp",
  category: "insurance",
  alternates: {
    // trailingSlash: true en next.config → la canónica lleva barra final.
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Epicare",
    title: "Epicare — The agency that works for you",
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Epicare — The agency that works for you",
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
  colorScheme: "light dark",
};

import I18nProviderClient from "../components/epicare/I18nProviderClient";
import SmoothScrollProvider from "../components/SmoothScrollProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interDisplay.variable} ${interTight.variable} ${jetBrainsMono.variable} font-body antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-surface-BG-1)] text-[var(--color-text-primary)] overflow-x-hidden">
        <SmoothScrollProvider>
          <I18nProviderClient>
            {children}
          </I18nProviderClient>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import {
  STORE_NAME,
  STORE_DESCRIPTION,
  SITE_URL,
} from "@/lib/constants";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE_NAME} | 100% Genuine Sports Nutrition Nepal`,
    template: `%s | ${STORE_NAME} Nepal`,
  },
  description: STORE_DESCRIPTION,
  applicationName: STORE_NAME,
  keywords: [
    "Whey Protein Nepal",
    "Creatine Monohydrate Kathmandu",
    "Authentic Supplements Nepal",
    "MuscleWorks Golfutar",
    "Sports Nutrition Nepal",
    "Buy Mass Gainer Kathmandu",
    "Genuine Gym Supplements Nepal",
    "Pre Workout Kathmandu",
    "Imported Supplements Nepal",
  ],
  authors: [{ name: STORE_NAME, url: SITE_URL }],
  creator: STORE_NAME,
  publisher: STORE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/brnding-assets/favicon.webp",
    shortcut: "/brnding-assets/favicon.webp",
    apple: "/brnding-assets/favicon.webp",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${STORE_NAME} Nepal`,
    title: `${STORE_NAME} | 100% Genuine Sports Nutrition Nepal`,
    description: STORE_DESCRIPTION,
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: `${STORE_NAME} — 100% Genuine Sports Nutrition in Nepal`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE_NAME} | Genuine Supplements Nepal`,
    description: STORE_DESCRIPTION,
    images: ["/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full max-w-full overflow-x-hidden scroll-smooth antialiased",
        outfit.variable,
        plusJakartaSans.variable
      )}
    >
      <body className="min-h-full max-w-full overflow-x-hidden flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 max-w-full flex flex-col">
          {children}
        </main>
        <Footer />
        <Toaster
          richColors
          theme="light"
          position="top-right"
          toastOptions={{
            className: "border border-border bg-card text-foreground font-sans shadow-md",
          }}
        />
      </body>
    </html>
  );
}

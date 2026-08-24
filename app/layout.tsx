import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import SplashScreen from "@/components/layout/SplashScreen";
import SiteLayout from "@/components/layout/SiteLayout";

// Keep these in sync with the same-named checks the splash screen itself
// would otherwise run client-side. They're duplicated here (as plain
// strings, not imported) because this string is injected into a
// beforeInteractive <script> tag that runs standalone, before any of our
// React/TS modules exist.
const SPLASH_SESSION_KEY = "nacosSplashShownThisSession";
const SPLASH_STORAGE_KEY = "nacosSplashLastSeenAt";
const SPLASH_ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Runs before hydration (and before first paint) to decide whether the
// splash screen should be skipped, and if so, marks <html> synchronously
// so CSS can hide it with zero flash. This is what actually makes the
// splash reliably show up: previously the decision was only made inside a
// client component's useState initializer, which runs *after* the server
// HTML (splash-less) has already been sent and often already painted —
// so the real page flashed in first and the splash either never appeared
// or appeared after the fact.
const splashGateScript = `
(function () {
  try {
    var sessionShown = sessionStorage.getItem(${JSON.stringify(SPLASH_SESSION_KEY)});
    var shouldSkip = false;

    if (sessionShown === "true") {
      shouldSkip = true;
    } else {
      var stored = localStorage.getItem(${JSON.stringify(SPLASH_STORAGE_KEY)});
      var lastSeen = stored ? Number(stored) : 0;
      var isExpired = Date.now() - lastSeen > ${SPLASH_ONE_DAY_MS};

      if (isExpired) {
        localStorage.setItem(${JSON.stringify(SPLASH_STORAGE_KEY)}, String(Date.now()));
      } else {
        shouldSkip = true;
      }
      sessionStorage.setItem(${JSON.stringify(SPLASH_SESSION_KEY)}, "true");
    }

    if (shouldSkip) {
      document.documentElement.classList.add("no-splash");
    }
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://nacosfunaab.com"),

  title: {
    default: "NACOS Platform",
    template: "%s | NACOS Platform",
  },

  description:
    "NACOS Platform for association fee collection, digital receipts, payments, and financial management.",

  applicationName: "NACOS Platform",

  generator: "Next.js",

  keywords: [
    "NACOS",
    "NACOS Platform",
    "association management",
    "association fees",
    "fee collection",
    "digital receipts",
    "finance management",
    "payments",
    "student association",
  ],

  authors: [
    {
      name: "Ayomikun Egbetola",
    },
  ],

  creator: "NACOS",
  publisher: "NACOS",

  referrer: "origin-when-cross-origin",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon-32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],

    other: [
      {
        rel: "msapplication-TileImage",
        url: "/mstile-144x144.png",
      },
    ],
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://nacosfunaab.com",
    siteName: "NACOS Platform",
    title: "NACOS Platform",
    description:
      "Association fee collection, digital receipts, payments, and financial management for NACOS.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "NACOS Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NACOS Platform",
    description:
      "Association fee collection, digital receipts, payments, and financial management for NACOS.",
    images: ["/icon-512.png"],
  },

  appleWebApp: {
    capable: true,
    title: "NACOS Platform",
    statusBarStyle: "default",
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <Script
          id="splash-gate"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: splashGateScript }}
        />
        <Providers>
          <SplashScreen>
            <SiteLayout>{children}</SiteLayout>
          </SplashScreen>
        </Providers>
      </body>
    </html>
  );
}

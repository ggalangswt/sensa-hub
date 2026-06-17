import type { Metadata, Viewport } from "next";
import { Kalam, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/src/provider/WalletContext";
import { ThemeProvider } from "@/src/provider/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const kalam = Kalam({
  variable: "--font-kalam",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sensa",
  description:
    "A mobile-first brain skill game hub on Celo. Train memory, focus, timing, and pattern recognition with free and Stablecoin play.",
  icons: {
    icon: [
      { url: "/sensalogo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Sensa",
    description:
      "A mobile-first brain skill game hub on Celo. Train memory, focus, timing, and pattern recognition with free and Stablecoin play.",
    images: [{ url: "/sensalogo.png", width: 458, height: 458, alt: "Sensa" }],
  },
  twitter: {
    card: "summary",
    title: "Sensa",
    description:
      "A mobile-first brain skill game hub on Celo. Train memory, focus, timing, and pattern recognition with free and Stablecoin play.",
    images: ["/sensalogo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#422057",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${kalam.variable} ${caveat.variable} ${jetbrains.variable}`}
    >
      <body>
        <ThemeProvider>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

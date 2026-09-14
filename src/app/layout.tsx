import type { Metadata } from "next";
import { Outfit, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/domain/theme/theme";
import { PageTransition } from "@/components/PageTransition";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hylab.vercel.app"),
  title: "HyLab — Icons API for Developers",
  description: "18,000+ professional icons from 10 sources. One endpoint, any color, size or format. Free, no auth required.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "HyLab — The Icons API for Modern Apps",
    description: "18,039 icons. One endpoint. Any color, size or format — SVG, PNG, WebP.",
    images: [{ url: "/screenshots/home.png", width: 1200, height: 630, alt: "HyLab preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HyLab — Icons API",
    description: "18,039 icons — one API call.",
    images: ["/screenshots/home.png"],
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
      data-theme="dark"
      className={`${outfit.variable} ${dmSans.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-white focus:text-sm"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <PageTransition>
            <main id="main">{children}</main>
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}

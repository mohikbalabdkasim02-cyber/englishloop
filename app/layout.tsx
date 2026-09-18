import type { Metadata, Viewport } from "next";
import PwaRegister from "@/components/pwa-register";
import "./globals.css";

const siteUrl = "https://englishloop-beta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "English Loop — Watch. Listen. Read. Speak. Grow.",
    template: "%s | English Loop",
  },
  description: "Input-Based & Output-Based English Learning Platform by Yusril Maulana. Explore authentic input, speak, receive teacher feedback, and track progress.",
  applicationName: "English Loop",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "English Loop",
    title: "English Loop — Input → Output → Growth",
    description: "Watch. Listen. Read. Speak. Grow. A teacher-guided English learning platform by Yusril Maulana.",
    images: [
      {
        url: "https://englishloop-beta.vercel.app/brand/english-loop-logo-512.png",
        secureUrl: "https://englishloop-beta.vercel.app/brand/english-loop-logo-512.png",
        width: 512,
        height: 512,
        type: "image/png",
        alt: "English Loop logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "English Loop — Input → Output → Growth",
    description: "Watch. Listen. Read. Speak. Grow. A teacher-guided English learning platform by Yusril Maulana.",
    images: ["https://englishloop-beta.vercel.app/brand/english-loop-logo-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/brand/english-loop-logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/brand/english-loop-logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "English Loop",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#181f1e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="image_src" href="https://englishloop-beta.vercel.app/brand/english-loop-logo-512.png" />
        <meta itemProp="image" content="https://englishloop-beta.vercel.app/brand/english-loop-logo-512.png" />
      </head>
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}

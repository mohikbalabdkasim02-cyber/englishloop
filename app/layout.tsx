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
        url: "https://englishloop-beta.vercel.app/english-loop-share.png",
        secureUrl: "https://englishloop-beta.vercel.app/english-loop-share.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "English Loop — Input to Output English Learning",
      },
      {
        url: "https://englishloop-beta.vercel.app/brand/english-loop-logo.svg",
        width: 512,
        height: 512,
        type: "image/svg+xml",
        alt: "English Loop logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "English Loop — Input → Output → Growth",
    description: "Watch. Listen. Read. Speak. Grow. A teacher-guided English learning platform by Yusril Maulana.",
    images: ["https://englishloop-beta.vercel.app/english-loop-share.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon.svg" },
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
        <link rel="image_src" href="https://englishloop-beta.vercel.app/brand/english-loop-logo.svg" />
        <meta itemProp="image" content="https://englishloop-beta.vercel.app/brand/english-loop-logo.svg" />
      </head>
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}

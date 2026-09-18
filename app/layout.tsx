import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Loop — Watch. Listen. Read. Speak. Grow.",
  description: "Input-Based & Output-Based English Learning Platform by Yusril Maulana.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

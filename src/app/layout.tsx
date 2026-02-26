import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EuroShop 2026 — Categorii & Organizare",
  description: "Organizează pozele din târgul EuroShop: drag & drop din Google Drive, categorii editabile, colaborare real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased selection:bg-accent selection:text-surface`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}

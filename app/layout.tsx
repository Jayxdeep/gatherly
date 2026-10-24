import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f5f0",
};

export const metadata: Metadata = {
  title: "Gatherly — Event planning made clear",
  description:
    "Turn an occasion, budget, and guest count into a practical plan: a budget you can adjust, a timeline you can follow, and questions to ask each vendor.",
  keywords: [
    "event planner",
    "wedding planning",
    "birthday planning",
    "event budget",
    "vendor checklist",
    "Gatherly",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink focus:shadow-raised"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

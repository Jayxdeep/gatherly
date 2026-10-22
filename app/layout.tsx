import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Gatherly — AI-Powered Event & Celebration Planner",
  description:
    "Production-grade GenAI planning orchestrator for weddings, birthdays, and community events with dynamic budgets, timelines, and vendor checklists.",
  keywords: [
    "Event Planner",
    "Wedding Planning",
    "AI Event Organizer",
    "Budget Calculator",
    "Vendor Checklist",
    "Gatherly",
  ],
  authors: [{ name: "Gatherly Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-brand-500 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-brand-700 focus:text-white"
        >
          Skip to main content
        </a>
        <header className="border-b border-rose-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-rose-500 to-amber-400 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-brand-500/20">
                G
              </div>
              <div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-brand-700 to-rose-600 bg-clip-text text-transparent">
                  Gatherly
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-brand-800">
                  AI Orchestrator
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Gemini 1.5 Ready
              </span>
              <span className="text-xs text-slate-500 font-mono hidden md:inline">
                PromptWars: Ch.5
              </span>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} Gatherly. Built for Hack2Skill Google PromptWars Virtual.</p>
            <p className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              Client State Recalculation Engine Active
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

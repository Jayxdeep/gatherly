import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { Sparkles, Calendar, ShieldCheck, Zap } from "lucide-react";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Gatherly — AI Event & Celebration Orchestrator",
  description:
    "Autonomous event planning engine powered by Gemini. Real-time budget sliders, dynamic urgency rules, vendor playbooks, and calendar sync.",
  keywords: [
    "Event Planner",
    "Wedding Planning",
    "AI Celebration",
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
    <html lang="en" className={`${jakarta.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans text-slate-900 bg-slate-950 relative selection:bg-rose-500 selection:text-white overflow-x-hidden">
        {/* Ambient Celebration Light Blooms & Mesh Glow */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top Left Rose Bloom */}
          <div className="absolute -top-40 -left-40 w-96 sm:w-[550px] h-96 sm:h-[550px] bg-gradient-to-br from-rose-500/25 via-pink-600/15 to-transparent rounded-full blur-3xl animate-pulse-slow transform-gpu" />
          {/* Top Right Amber/Gold Bloom */}
          <div className="absolute -top-20 -right-40 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-gradient-to-bl from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl animate-float transform-gpu" />
          {/* Center Violet/Indigo Bloom */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/10 via-fuchsia-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* Subtle Festive Micro Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.035]" />
        </div>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-rose-600 focus:text-white focus:rounded-xl"
        >
          Skip to main content
        </a>

        {/* Floating Glassmorphic Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70 border-b border-white/10 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3.5">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-400 to-violet-600 opacity-75 blur-md group-hover:opacity-100 transition duration-300" />
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 via-rose-950 to-slate-900 border border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: "12s" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-black tracking-tight text-white">
                    Gather<span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">ly</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    AI 2.0
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                  Celebration & Event Planning Orchestrator
                </p>
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Gemini Flash + Fallback Engine
                </span>
              </div>
              <span className="text-xs text-rose-400/90 font-mono hidden md:inline px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-800/30">
                PromptWars Ch.5
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 relative z-10">
          {children}
        </main>

        {/* Celebratory Footer */}
        <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-8 text-xs text-slate-400 relative z-10 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-white text-sm">Gatherly</span>
              <span className="text-slate-600">•</span>
              <p>© {new Date().getFullYear()} Built for Hack2Skill Google PromptWars Virtual.</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero Token Leakage
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Client-Side In-Memory Recalculator
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

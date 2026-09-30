import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "ProTouchTyping - Dactilografía para Programadores",
  description:
    "Aprende y mejora tu mecanografía escribiendo código real: llaves, corchetes, indentación y símbolos de desarrollo.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col justify-between selection:bg-blue-600 selection:text-white">
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
        </div>

        <footer className="border-t border-slate-800 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">ProTouchTyping</span>
              <span>— Dactilografía para desarrolladores de software</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>TypeScript</span>
              <span>•</span>
              <span>Next.js App Router</span>
              <span>•</span>
              <span>Better Auth</span>
              <span>•</span>
              <span>Drizzle + Neon</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

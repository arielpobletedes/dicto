"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Keyboard, LayoutDashboard, Shield, LogOut, LogIn, UserPlus } from "lucide-react";
import { KeyboardLayoutSelector } from "./keyboard-layout-selector";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const isAdmin = (user as { role?: string })?.role === "admin";

  const navLinks = [
    { href: "/catalog", label: "Catálogo", icon: Keyboard },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  if (isAdmin) {
    navLinks.push({ href: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-mono font-bold shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              PT
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                ProTouchTyping
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Dactilografía para Devs</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-blue-400"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de Teclado (Latam Chile vs US) */}
          <KeyboardLayoutSelector variant="compact" />
          {isPending ? (
            <div className="h-8 w-24 bg-slate-800 animate-pulse rounded-md" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-slate-200">{user.name}</span>
                <span className="text-xs text-slate-400 capitalize">
                  {(user as { role?: string }).role || "Estudiante"}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Entrar
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

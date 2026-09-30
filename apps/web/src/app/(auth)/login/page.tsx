"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { LogIn, KeyRound, Mail, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "Credenciales inválidas");
      } else {
        router.push("/catalog");
        router.refresh();
      }
    } catch {
      setError("Error de conexión al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("DemoPassword123!");
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">Iniciar Sesión</h1>
          <p className="mt-1 text-xs text-slate-400">
            Accede para guardar tus avances y desbloquear ejercicios
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-800/40 bg-rose-950/40 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@ejemplo.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Contraseña</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Cuentas de demostración */}
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Accesos rápidos de prueba:</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("student@protouchtyping.dev")}
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Estudiante Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("admin@protouchtyping.dev")}
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Admin Demo
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          ¿No tienes cuenta aún?{" "}
          <Link href="/register" className="font-semibold text-blue-400 hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </main>
  );
}

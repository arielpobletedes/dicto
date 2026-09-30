import Link from "next/link";
import { getCurrentUser } from "@/server/auth";
import { getLevelsWithExercises } from "@/server/exercises";
import { AdminExercisesTable } from "@/components/admin-exercises-table";
import { Shield, ShieldAlert, BookOpen, Layers, Lock, Sparkles, LogIn } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">Acceso Denegado</h1>
        <p className="mt-2 text-sm text-slate-400">
          Esta sección está restringida exclusivamente a usuarios con rol de{" "}
          <strong className="text-white">Administrador</strong>. La autorización se verifica siempre
          en el servidor.
        </p>

        {!user ? (
          <Link
            href="/login"
            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Iniciar sesión con cuenta de Administrador
          </Link>
        ) : (
          <Link
            href="/catalog"
            className="mt-6 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Volver al catálogo
          </Link>
        )}
      </main>
    );
  }

  const levels = await getLevelsWithExercises(user);
  const allExercises = levels.flatMap((lvl) => lvl.exercises);

  const totalExercises = allExercises.length;
  const publishedCount = allExercises.filter((e) => e.published).length;
  const freeCount = allExercises.filter((e) => e.tier === "free").length;
  const premiumCount = allExercises.filter((e) => e.tier === "premium").length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado Admin */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Panel de Administración
              </h1>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/40">
                Rol Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestión de niveles, ejercicios, publicación y asignación de acceso gratuito o premium.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Sesión iniciada como:</span>
          <p className="text-sm font-semibold text-white">
            {user.name} ({user.email})
          </p>
        </div>
      </div>

      {/* Resumen de contenido */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Niveles Creados</span>
            <Layers className="h-4 w-4 text-blue-400" />
          </div>
          <span className="font-mono text-2xl font-bold text-white">{levels.length}</span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Ejercicios</span>
            <BookOpen className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="font-mono text-2xl font-bold text-white">{totalExercises}</span>
          <span className="text-[11px] text-slate-500">{publishedCount} publicados</span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Ejercicios Gratuitos</span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-mono text-2xl font-bold text-emerald-400">{freeCount}</span>
          <span className="text-[11px] text-slate-500">Públicos a registrados</span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Ejercicios Premium</span>
            <Lock className="h-4 w-4 text-amber-400" />
          </div>
          <span className="font-mono text-2xl font-bold text-amber-400">{premiumCount}</span>
          <span className="text-[11px] text-slate-500">Requieren suscripción</span>
        </div>
      </div>

      {/* Tabla de ejercicios */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">Catálogo de Ejercicios</h2>
          <span className="text-xs text-slate-400">
            Haz clic en el botón de Acceso para alternar entre Gratuito y Premium
          </span>
        </div>

        <AdminExercisesTable initialExercises={allExercises} />
      </section>
    </main>
  );
}

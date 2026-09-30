import Link from "next/link";
import { getCurrentUser } from "@/server/auth";
import { getUserDashboardStats } from "@/server/stats";
import { VirtualKeyboard } from "@/components/virtual-keyboard";
import {
  Trophy,
  Gauge,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  History,
  Play,
  LogIn,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400">
          <Trophy className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
          Inicia sesión para ver tu progreso
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          El dashboard guarda tus récords de velocidad, historial de intentos y mapa de calor de
          teclas para ayudarte a identificar debilidades.
        </p>
        <Link
          href="/login"
          className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          Iniciar Sesión
        </Link>
      </main>
    );
  }

  const stats = await getUserDashboardStats(user.id);

  const formatDuration = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return "< 1 min";
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado del estudiante */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase text-blue-400 font-semibold tracking-wider">
            Dashboard del Estudiante
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Hola, {user.name}</h1>
          <p className="text-sm text-slate-400">
            Sigue tu evolución, mapa de calor y precisión en cada tecla.
          </p>
        </div>

        <Link
          href="/catalog"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
        >
          <Play className="h-4 w-4" />
          Continuar Práctica
        </Link>
      </div>

      {/* Métricas clave */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Mejor WPM</span>
            <Trophy className="h-4 w-4 text-amber-400" />
          </div>
          <span className="font-mono text-3xl font-bold text-white">{stats.bestWpm}</span>
          <span className="text-[11px] text-slate-500">Récord personal</span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">WPM Promedio</span>
            <Gauge className="h-4 w-4 text-blue-400" />
          </div>
          <span className="font-mono text-3xl font-bold text-blue-400">{stats.averageWpm}</span>
          <span className="text-[11px] text-slate-500">En todos los intentos</span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Precisión Media</span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-mono text-3xl font-bold text-emerald-400">
            {stats.averageAccuracy}%
          </span>
          <span className="text-[11px] text-slate-500">Tasa de acierto</span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Completados</span>
            <CheckCircle2 className="h-4 w-4 text-purple-400" />
          </div>
          <span className="font-mono text-3xl font-bold text-purple-300">
            {stats.completedExercisesCount}
            <span className="text-sm text-slate-500 font-normal">
              /{stats.totalExercisesAvailable}
            </span>
          </span>
          <span className="text-[11px] text-slate-500">Ejercicios dominados</span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Tiempo Total</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="font-mono text-3xl font-bold text-cyan-300">
            {formatDuration(stats.totalPracticeTimeMs)}
          </span>
          <span className="text-[11px] text-slate-500">{stats.totalAttempts} sesiones</span>
        </div>
      </div>

      {/* Sección Mapa de Calor */}
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Mapa de Calor del Teclado
              </h2>
              <p className="text-xs text-slate-400">
                Visualiza qué teclas dominas (verde) y cuáles concentran más fallos (amarillo y
                rojo).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">&gt; 95% precisión</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-slate-300">80 - 95%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="text-slate-300">&lt; 80% (Mejorar)</span>
            </div>
          </div>
        </div>

        <VirtualKeyboard heatmap={stats.keyHeatmap} showFingerGuide={false} />

        {/* Teclas recomendadas para practicar */}
        {stats.weakestKeys.length > 0 && (
          <div className="mt-2 rounded-2xl border border-rose-900/30 bg-rose-950/10 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
              <AlertTriangle className="h-4 w-4" />
              <span>Teclas con mayor margen de mejora:</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {stats.weakestKeys.map((k) => (
                <div
                  key={k.key}
                  className="flex items-center gap-2 rounded-lg border border-rose-800/40 bg-rose-950/30 px-3 py-1.5 text-xs text-rose-200"
                >
                  <kbd className="font-mono font-bold">{k.key}</kbd>
                  <span className="text-rose-400">({k.accuracy}% precisión)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Historial reciente */}
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <History className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Historial de Intentos Recientes
          </h2>
        </div>

        {stats.recentAttempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 text-sm">
            <p>Aún no has completado ningún ejercicio.</p>
            <Link href="/catalog" className="mt-2 text-blue-400 hover:underline">
              Ir al catálogo y empezar a teclear
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">Ejercicio</th>
                  <th className="pb-3 font-semibold">Nivel</th>
                  <th className="pb-3 font-semibold">WPM</th>
                  <th className="pb-3 font-semibold">Precisión</th>
                  <th className="pb-3 font-semibold">Errores</th>
                  <th className="pb-3 font-semibold">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {stats.recentAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 font-medium text-white">{att.exerciseTitle}</td>
                    <td className="py-3 text-slate-400 text-xs">{att.levelTitle}</td>
                    <td className="py-3 font-mono font-semibold text-blue-400">{att.wpm}</td>
                    <td className="py-3 font-mono text-emerald-400">{att.accuracy}%</td>
                    <td className="py-3 font-mono text-rose-400">{att.errors}</td>
                    <td className="py-3 font-mono text-slate-400">
                      {Math.round(att.durationMs / 1000)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

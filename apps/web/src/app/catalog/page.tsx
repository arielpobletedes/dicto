import Link from "next/link";
import { getCurrentUser } from "@/server/auth";
import { getLevelsWithExercises } from "@/server/exercises";
import { CheckCircle2, Lock, Play, BookOpen, Code2, Terminal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const user = await getCurrentUser();
  const levels = await getLevelsWithExercises(user);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
          <BookOpen className="h-4 w-4" />
          <span>Ruta de Aprendizaje</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Catálogo de Niveles y Ejercicios
        </h1>
        <p className="max-w-2xl text-slate-400 text-sm sm:text-base">
          Progresa desde la posición de descanso de los dedos hasta estructuras de código reales en
          TypeScript, Python y comandos de terminal.
        </p>
      </div>

      {/* Lista de niveles */}
      <div className="flex flex-col gap-10">
        {levels.map((level, levelIdx) => (
          <section
            key={level.id}
            className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-sm"
          >
            {/* Cabecera del nivel */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-mono font-bold">
                  {levelIdx + 1}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{level.title}</h2>
                  {level.description && (
                    <p className="text-xs text-slate-400">{level.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{level.totalExercises} ejercicios</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{level.freeCount} gratuitos</span>
                {level.premiumCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">{level.premiumCount} Pro</span>
                  </>
                )}
              </div>
            </div>

            {/* Cuadrícula de ejercicios */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {level.exercises.map((exercise) => {
                const isLocked = exercise.isLocked;
                const isCompleted = exercise.userCompleted;

                return (
                  <div
                    key={exercise.id}
                    className={`
                      relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200
                      ${
                        isLocked
                          ? "border-slate-800/80 bg-slate-950/40 opacity-75"
                          : "border-slate-800 bg-slate-950/90 hover:border-slate-700 hover:shadow-lg hover:shadow-blue-500/5"
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-300">
                          {exercise.language === "sql" || exercise.language === "bash" ? (
                            <Terminal className="h-3 w-3" />
                          ) : (
                            <Code2 className="h-3 w-3" />
                          )}
                          {exercise.language}
                        </span>

                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/30">
                            <Lock className="h-3 w-3" />
                            Pro
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                            Gratis
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-white tracking-tight line-clamp-1">
                        {exercise.title}
                      </h3>
                      {exercise.description && (
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {exercise.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-mono">{exercise.userBestWpm} WPM</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 capitalize">
                          {exercise.difficulty}
                        </span>
                      )}

                      <Link
                        href={`/practice/${exercise.id}`}
                        className={`
                          inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors
                          ${
                            isLocked
                              ? "border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                              : "bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
                          }
                        `}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="h-3 w-3" />
                            Bloqueado
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3" />
                            Practicar
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

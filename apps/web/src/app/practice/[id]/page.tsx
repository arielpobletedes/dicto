import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/server/auth";
import { getExerciseDetail, getLevelsWithExercises } from "@/server/exercises";
import { PracticeView } from "@/components/practice-view";
import { Lock, Sparkles, ChevronLeft, LogIn } from "lucide-react";

interface PracticePageProps {
  params: Promise<{ id: string }>;
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const exercise = await getExerciseDetail(id, user);

  if (!exercise) {
    notFound();
  }

  // Si está bloqueado (ejercicio premium sin acceso)
  // ¡REGLA CRÍTICA!: content es null en el servidor
  if (exercise.isLocked || !exercise.content) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-xl shadow-amber-500/10">
          <Lock className="h-10 w-10" />
        </div>

        <span className="mt-6 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/30 uppercase tracking-wider font-mono">
          Contenido Premium
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {exercise.title}
        </h1>

        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-md">
          Este ejercicio contiene código avanzado y caracteres especiales reservados para usuarios
          con suscripción activa.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
          {!user ? (
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </Link>
          ) : (
            <button
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 opacity-80 cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              Suscripciones (Próxima Fase)
            </button>
          )}

          <Link
            href="/catalog"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  // Encontrar el siguiente ejercicio en la lista para navegación rápida
  let nextExerciseId: string | null = null;
  const levels = await getLevelsWithExercises(user);
  const currentLevel = levels.find((lvl) => lvl.id === exercise.levelId);
  if (currentLevel) {
    const currentIndex = currentLevel.exercises.findIndex((e) => e.id === exercise.id);
    if (currentIndex !== -1 && currentIndex + 1 < currentLevel.exercises.length) {
      nextExerciseId = currentLevel.exercises[currentIndex + 1]!.id;
    }
  }

  return (
    <main className="py-6">
      <PracticeView
        exercise={{
          ...exercise,
          content: exercise.content,
        }}
        nextExerciseId={nextExerciseId}
      />
    </main>
  );
}

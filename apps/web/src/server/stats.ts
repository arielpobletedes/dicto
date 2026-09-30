import type { KeyAccuracyStat, UserDashboardStats } from "@ptt/shared";
import { attempts, db, exercises, keyStats, userProgress } from "@ptt/db";
import { desc, eq } from "drizzle-orm";

const isDbAvailable = Boolean(process.env.DATABASE_URL);

export async function getUserDashboardStats(userId: string): Promise<UserDashboardStats> {
  if (!isDbAvailable) {
    return {
      totalAttempts: 0,
      completedExercisesCount: 0,
      totalExercisesAvailable: 18,
      averageWpm: 0,
      bestWpm: 0,
      averageAccuracy: 100,
      totalPracticeTimeMs: 0,
      recentAttempts: [],
      keyHeatmap: {},
      weakestKeys: [],
    };
  }

  // 1. Intentos del usuario
  const userAttempts = await db.query.attempts.findMany({
    where: eq(attempts.userId, userId),
    orderBy: [desc(attempts.createdAt)],
    limit: 20,
    with: {
      exercise: {
        with: {
          level: true,
        },
      },
    },
  });

  const allAttempts = await db.query.attempts.findMany({
    where: eq(attempts.userId, userId),
  });

  const completedProgress = await db.query.userProgress.findMany({
    where: eq(userProgress.userId, userId),
  });

  const allExercisesCount = await db.query.exercises.findMany({
    where: eq(exercises.published, true),
  });

  const totalAttempts = allAttempts.length;
  let totalWpm = 0;
  let totalAccuracy = 0;
  let bestWpm = 0;
  let totalPracticeTimeMs = 0;

  for (const a of allAttempts) {
    totalWpm += a.wpm;
    totalAccuracy += a.accuracy;
    totalPracticeTimeMs += a.durationMs;
    if (a.wpm > bestWpm) {
      bestWpm = a.wpm;
    }
  }

  const averageWpm = totalAttempts > 0 ? Math.round((totalWpm / totalAttempts) * 10) / 10 : 0;
  const averageAccuracy =
    totalAttempts > 0 ? Math.round((totalAccuracy / totalAttempts) * 10) / 10 : 100;

  // 2. Intentos recientes formateados
  const recentAttempts = userAttempts.map((att) => ({
    id: att.id,
    userId: att.userId,
    exerciseId: att.exerciseId,
    wpm: att.wpm,
    accuracy: att.accuracy,
    errors: att.errors,
    durationMs: att.durationMs,
    createdAt: att.createdAt,
    exerciseTitle: att.exercise?.title ?? "Ejercicio",
    levelTitle: att.exercise?.level?.title ?? "Nivel",
  }));

  // 3. Mapa de calor de teclas
  const userKeyStats = await db.query.keyStats.findMany({
    where: eq(keyStats.userId, userId),
  });

  const keyHeatmap: Record<string, KeyAccuracyStat> = {};
  const statsList: KeyAccuracyStat[] = [];

  for (const ks of userKeyStats) {
    const totalPresses = ks.correctCount + ks.errorCount;
    const accuracy =
      totalPresses > 0 ? Math.round((ks.correctCount / totalPresses) * 1000) / 10 : 100;
    const statItem: KeyAccuracyStat = {
      key: ks.key,
      correctCount: ks.correctCount,
      errorCount: ks.errorCount,
      totalPresses,
      accuracy,
    };
    keyHeatmap[ks.key] = statItem;
    if (totalPresses >= 5) {
      statsList.push(statItem);
    }
  }

  // Teclas con menor precisión para recomendar práctica
  const weakestKeys = statsList.sort((a, b) => a.accuracy - b.accuracy).slice(0, 5);

  return {
    totalAttempts,
    completedExercisesCount: completedProgress.filter((p) => p.completed).length,
    totalExercisesAvailable: allExercisesCount.length,
    averageWpm,
    bestWpm,
    averageAccuracy,
    totalPracticeTimeMs,
    recentAttempts,
    keyHeatmap,
    weakestKeys,
  };
}

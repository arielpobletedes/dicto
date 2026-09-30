import { type AttemptResult, type RecordAttemptInput, recordAttemptSchema } from "@ptt/shared";
import { attempts, db, keyStats, userProgress, exercises } from "@ptt/db";
import { and, eq, sql } from "drizzle-orm";

const isDbAvailable = Boolean(process.env.DATABASE_URL);

// Historial en memoria si no hay Neon conectado
const inMemoryAttempts: Array<{
  id: string;
  userId: string;
  exerciseId: string;
  wpm: number;
  accuracy: number;
  errors: number;
  durationMs: number;
  createdAt: Date;
}> = [];

export async function recordAttempt(
  userId: string,
  rawInput: RecordAttemptInput,
): Promise<AttemptResult> {
  // Validación estricta con Zod y anti-trampas
  const input = recordAttemptSchema.parse(rawInput);

  const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  let isNewBestWpm = false;
  let exerciseTitle = "Ejercicio de mecanografía";
  let levelId = "level-1";

  if (!isDbAvailable) {
    inMemoryAttempts.push({
      id: attemptId,
      userId,
      exerciseId: input.exerciseId,
      wpm: input.wpm,
      accuracy: input.accuracy,
      errors: input.errors,
      durationMs: input.durationMs,
      createdAt: new Date(),
    });

    return {
      attemptId,
      wpm: input.wpm,
      accuracy: input.accuracy,
      errors: input.errors,
      durationMs: input.durationMs,
      isNewBestWpm: true,
      exerciseTitle,
      levelId,
    };
  }

  // 1. Obtener información del ejercicio
  const ex = await db.query.exercises.findFirst({
    where: eq(exercises.id, input.exerciseId),
  });
  if (ex) {
    exerciseTitle = ex.title;
    levelId = ex.levelId;
  }

  // 2. Guardar intento
  await db.insert(attempts).values({
    id: attemptId,
    userId,
    exerciseId: input.exerciseId,
    wpm: input.wpm,
    accuracy: input.accuracy,
    errors: input.errors,
    durationMs: input.durationMs,
  });

  // 3. Actualizar progreso del usuario
  const existingProg = await db.query.userProgress.findFirst({
    where: and(eq(userProgress.userId, userId), eq(userProgress.exerciseId, input.exerciseId)),
  });

  if (!existingProg) {
    isNewBestWpm = true;
    await db.insert(userProgress).values({
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      exerciseId: input.exerciseId,
      completed: true,
      bestWpm: input.wpm,
      bestAccuracy: input.accuracy,
      completedAt: new Date(),
    });
  } else {
    isNewBestWpm = input.wpm > existingProg.bestWpm;
    await db
      .update(userProgress)
      .set({
        completed: true,
        bestWpm: Math.max(existingProg.bestWpm, input.wpm),
        bestAccuracy: Math.max(existingProg.bestAccuracy, input.accuracy),
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userProgress.id, existingProg.id));
  }

  // 4. Actualizar estadísticas por tecla (para el mapa de calor)
  if (input.keyStats && input.keyStats.length > 0) {
    for (const stat of input.keyStats) {
      if (!stat.key) continue;
      const keyId = `ks-${userId}-${encodeURIComponent(stat.key)}`;
      await db
        .insert(keyStats)
        .values({
          id: keyId,
          userId,
          key: stat.key,
          correctCount: stat.correctCount,
          errorCount: stat.errorCount,
        })
        .onConflictDoUpdate({
          target: [keyStats.userId, keyStats.key],
          set: {
            correctCount: sql`${keyStats.correctCount} + ${stat.correctCount}`,
            errorCount: sql`${keyStats.errorCount} + ${stat.errorCount}`,
            updatedAt: new Date(),
          },
        });
    }
  }

  return {
    attemptId,
    wpm: input.wpm,
    accuracy: input.accuracy,
    errors: input.errors,
    durationMs: input.durationMs,
    isNewBestWpm,
    exerciseTitle,
    levelId,
  };
}

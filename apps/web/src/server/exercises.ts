import {
  type CreateExerciseInput,
  type ExerciseDetail,
  type ExerciseSummary,
  type LevelWithExercises,
  type UpdateExerciseInput,
  createExerciseSchema,
  updateExerciseSchema,
} from "@ptt/shared";
import { db, exercises, levels, userProgress, SEED_EXERCISES, SEED_LEVELS } from "@ptt/db";
import { asc, eq } from "drizzle-orm";
import type { CurrentUser } from "./auth";
import { hasAccess } from "./entitlements";

const isDbAvailable = Boolean(process.env.DATABASE_URL);

// Base de datos en memoria para modo desarrollo / demo si no hay Neon conectado
const inMemoryExercises = [...SEED_EXERCISES];
const inMemoryLevels = [...SEED_LEVELS];

export async function getLevelsWithExercises(
  currentUser?: CurrentUser | null,
): Promise<LevelWithExercises[]> {
  if (!isDbAvailable) {
    // Modo local / demo
    return inMemoryLevels.map((lvl) => {
      const levelExercises = inMemoryExercises
        .filter((e) => e.levelId === lvl.id && (currentUser?.role === "admin" || e.published))
        .sort((a, b) => a.order - b.order)
        .map((e) => {
          const canAccess = hasAccess(currentUser, e);
          const summary: ExerciseSummary = {
            id: e.id,
            levelId: e.levelId,
            title: e.title,
            description: e.description,
            language: e.language,
            difficulty: e.difficulty,
            tier: e.tier,
            order: e.order,
            published: e.published,
            isLocked: !canAccess,
            characterCount: e.content.length,
          };
          return summary;
        });

      return {
        id: lvl.id,
        title: lvl.title,
        description: lvl.description,
        slug: lvl.slug,
        order: lvl.order,
        createdAt: new Date(),
        updatedAt: new Date(),
        exercises: levelExercises,
        totalExercises: levelExercises.length,
        completedExercises: 0,
        freeCount: levelExercises.filter((e) => e.tier === "free").length,
        premiumCount: levelExercises.filter((e) => e.tier === "premium").length,
      };
    });
  }

  // Consulta con Neon / Postgres
  const allLevels = await db.query.levels.findMany({
    orderBy: [asc(levels.order)],
  });

  const allExercises = await db.query.exercises.findMany({
    where: currentUser?.role === "admin" ? undefined : eq(exercises.published, true),
    orderBy: [asc(exercises.order)],
  });

  // Si hay usuario, obtener su progreso
  const progressMap = new Map<
    string,
    { completed: boolean; bestWpm: number; bestAccuracy: number }
  >();
  if (currentUser?.id) {
    try {
      const userProg = await db.query.userProgress.findMany({
        where: eq(userProgress.userId, currentUser.id),
      });
      for (const p of userProg) {
        progressMap.set(p.exerciseId, {
          completed: p.completed,
          bestWpm: p.bestWpm,
          bestAccuracy: p.bestAccuracy,
        });
      }
    } catch {
      // Ignorar si falla la consulta opcional
    }
  }

  return allLevels.map((lvl) => {
    const lvlExercises = allExercises
      .filter((e) => e.levelId === lvl.id)
      .map((e) => {
        const canAccess = hasAccess(currentUser, e as { tier: "free" | "premium" });
        const prog = progressMap.get(e.id);

        const summary: ExerciseSummary = {
          id: e.id,
          levelId: e.levelId,
          title: e.title,
          description: e.description,
          language: e.language as ExerciseSummary["language"],
          difficulty: e.difficulty as ExerciseSummary["difficulty"],
          tier: e.tier as ExerciseSummary["tier"],
          order: e.order,
          published: e.published,
          isLocked: !canAccess,
          characterCount: e.content.length,
          userCompleted: prog?.completed ?? false,
          userBestWpm: prog?.bestWpm ?? null,
          userBestAccuracy: prog?.bestAccuracy ?? null,
        };
        return summary;
      });

    return {
      ...lvl,
      exercises: lvlExercises,
      totalExercises: lvlExercises.length,
      completedExercises: lvlExercises.filter((e) => e.userCompleted).length,
      freeCount: lvlExercises.filter((e) => e.tier === "free").length,
      premiumCount: lvlExercises.filter((e) => e.tier === "premium").length,
    };
  });
}

/**
 * Obtiene el detalle de un ejercicio para la pantalla de práctica.
 * REGLA CRÍTICA: Si el ejercicio es premium y el usuario no tiene acceso,
 * `content` es NULL para no serializar el texto en el payload de Next.js.
 */
export async function getExerciseDetail(
  exerciseId: string,
  currentUser?: CurrentUser | null,
): Promise<ExerciseDetail | null> {
  let exercise: {
    id: string;
    levelId: string;
    title: string;
    description: string | null;
    content: string;
    language: string;
    difficulty: string;
    tier: string;
    order: number;
    published: boolean;
  } | null = null;

  if (!isDbAvailable) {
    const found = inMemoryExercises.find((e) => e.id === exerciseId);
    if (found) {
      exercise = found;
    }
  } else {
    const dbEx = await db.query.exercises.findFirst({
      where: eq(exercises.id, exerciseId),
    });
    if (dbEx) {
      exercise = dbEx;
    }
  }

  if (!exercise) {
    return null;
  }

  const canAccess = hasAccess(currentUser, exercise as { tier: "free" | "premium" });

  return {
    id: exercise.id,
    levelId: exercise.levelId,
    title: exercise.title,
    description: exercise.description,
    language: exercise.language as ExerciseDetail["language"],
    difficulty: exercise.difficulty as ExerciseDetail["difficulty"],
    tier: exercise.tier as ExerciseDetail["tier"],
    order: exercise.order,
    isLocked: !canAccess,
    // ¡REGLA CRÍTICA DE AUTORIZACIÓN!: Nunca enviar el contenido si está bloqueado
    content: canAccess ? exercise.content : null,
  };
}

/**
 * Acciones administrativas (requieren verificación de rol admin previa).
 */
export async function createExercise(input: CreateExerciseInput) {
  const validated = createExerciseSchema.parse(input);
  const id = `ex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (!isDbAvailable) {
    const newEx = {
      id,
      levelId: validated.levelId,
      title: validated.title,
      description: validated.description ?? "",
      content: validated.content,
      language: validated.language,
      difficulty: validated.difficulty,
      tier: validated.tier,
      order: validated.order,
      published: validated.published,
    };
    inMemoryExercises.push(newEx);
    return newEx;
  }

  const [created] = await db
    .insert(exercises)
    .values({
      id,
      levelId: validated.levelId,
      title: validated.title,
      description: validated.description,
      content: validated.content,
      language: validated.language,
      difficulty: validated.difficulty,
      tier: validated.tier,
      order: validated.order,
      published: validated.published,
    })
    .returning();

  return created;
}

export async function updateExercise(exerciseId: string, input: UpdateExerciseInput) {
  const validated = updateExerciseSchema.parse(input);

  if (!isDbAvailable) {
    const idx = inMemoryExercises.findIndex((e) => e.id === exerciseId);
    if (idx !== -1) {
      inMemoryExercises[idx] = {
        ...inMemoryExercises[idx]!,
        ...validated,
      };
      return inMemoryExercises[idx];
    }
    return null;
  }

  const [updated] = await db
    .update(exercises)
    .set({
      ...validated,
      updatedAt: new Date(),
    })
    .where(eq(exercises.id, exerciseId))
    .returning();

  return updated;
}

export async function togglePublishExercise(exerciseId: string) {
  if (!isDbAvailable) {
    const idx = inMemoryExercises.findIndex((e) => e.id === exerciseId);
    if (idx !== -1) {
      inMemoryExercises[idx]!.published = !inMemoryExercises[idx]!.published;
      return inMemoryExercises[idx];
    }
    return null;
  }

  const ex = await db.query.exercises.findFirst({
    where: eq(exercises.id, exerciseId),
  });
  if (!ex) return null;

  const [updated] = await db
    .update(exercises)
    .set({
      published: !ex.published,
      updatedAt: new Date(),
    })
    .where(eq(exercises.id, exerciseId))
    .returning();

  return updated;
}

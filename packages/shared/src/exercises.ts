import { z } from "zod";

/** Los ejercicios `free` son públicos para usuarios registrados; `premium` requiere suscripción. */
export const EXERCISE_TIERS = ["free", "premium"] as const;
export const exerciseTierSchema = z.enum(EXERCISE_TIERS);
export type ExerciseTier = z.infer<typeof exerciseTierSchema>;

/** Lenguajes/contextos de código y texto para los ejercicios. */
export const EXERCISE_LANGUAGES = [
  "text",
  "javascript",
  "typescript",
  "python",
  "sql",
  "bash",
  "html",
  "css",
] as const;
export const exerciseLanguageSchema = z.enum(EXERCISE_LANGUAGES);
export type ExerciseLanguage = z.infer<typeof exerciseLanguageSchema>;

export const EXERCISE_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const exerciseDifficultySchema = z.enum(EXERCISE_DIFFICULTIES);
export type ExerciseDifficulty = z.infer<typeof exerciseDifficultySchema>;

/** Esquema para crear un nuevo ejercicio (administrador). */
export const createExerciseSchema = z.object({
  levelId: z.string().min(1, "El ID de nivel es requerido"),
  title: z.string().trim().min(2, "El título debe tener al menos 2 caracteres").max(100),
  description: z.string().trim().max(300).optional().default(""),
  content: z.string().min(3, "El contenido debe tener al menos 3 caracteres"),
  language: exerciseLanguageSchema.default("typescript"),
  difficulty: exerciseDifficultySchema.default("beginner"),
  tier: exerciseTierSchema.default("free"),
  order: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});
export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;

/** Esquema para actualizar un ejercicio existente. */
export const updateExerciseSchema = createExerciseSchema.partial();
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;

/** Ejercicio completo almacenado en BD. */
export interface Exercise {
  id: string;
  levelId: string;
  title: string;
  description: string | null;
  content: string;
  language: ExerciseLanguage;
  difficulty: ExerciseDifficulty;
  tier: ExerciseTier;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Resumen de ejercicio para listados públicos/catálogo.
 * En ejercicios premium no autorizados, `content` nunca se expone y `isLocked` es true.
 */
export interface ExerciseSummary {
  id: string;
  levelId: string;
  title: string;
  description: string | null;
  language: ExerciseLanguage;
  difficulty: ExerciseDifficulty;
  tier: ExerciseTier;
  order: number;
  published: boolean;
  isLocked: boolean;
  characterCount: number;
  userBestWpm?: number | null;
  userBestAccuracy?: number | null;
  userCompleted?: boolean;
}

/** Detalle de ejercicio enviado a la pantalla de práctica. */
export interface ExerciseDetail {
  id: string;
  levelId: string;
  title: string;
  description: string | null;
  language: ExerciseLanguage;
  difficulty: ExerciseDifficulty;
  tier: ExerciseTier;
  order: number;
  isLocked: boolean;
  content: string | null; // NULO si el usuario no tiene acceso.
}

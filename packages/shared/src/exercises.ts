import { z } from "zod";

/** Los ejercicios `free` son públicos para usuarios registrados; `premium` requiere pago. */
export const EXERCISE_TIERS = ["free", "premium"] as const;
export const exerciseTierSchema = z.enum(EXERCISE_TIERS);
export type ExerciseTier = z.infer<typeof exerciseTierSchema>;

/** Lenguajes/contextos de texto que pueden usar los ejercicios. */
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

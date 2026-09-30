import { z } from "zod";
import type { ExerciseSummary } from "./exercises";

export const createLevelSchema = z.object({
  title: z.string().trim().min(2, "El título debe tener al menos 2 caracteres").max(80),
  description: z.string().trim().max(300).optional().default(""),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug inválido"),
  order: z.number().int().min(0).default(0),
});
export type CreateLevelInput = z.infer<typeof createLevelSchema>;

export const updateLevelSchema = createLevelSchema.partial();
export type UpdateLevelInput = z.infer<typeof updateLevelSchema>;

export interface Level {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LevelWithExercises extends Level {
  exercises: ExerciseSummary[];
  totalExercises: number;
  completedExercises: number;
  freeCount: number;
  premiumCount: number;
}

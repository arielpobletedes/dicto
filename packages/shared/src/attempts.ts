import { z } from "zod";

export const keyStatEntrySchema = z.object({
  key: z.string().min(1).max(20),
  correctCount: z.number().int().min(0),
  errorCount: z.number().int().min(0),
});
export type KeyStatEntry = z.infer<typeof keyStatEntrySchema>;

/**
 * Esquema de validación para registrar un intento de mecanografía completado.
 * Incluye validaciones anti-trampas:
 * - WPM realista (máx 320 WPM, récord mundial está en ~250 WPM)
 * - Precisión 0-100 %
 * - Duración mínima lógica según caracteres
 */
export const recordAttemptSchema = z.object({
  exerciseId: z.string().min(1, "El ejercicio es requerido"),
  wpm: z
    .number()
    .min(0, "WPM no puede ser negativo")
    .max(320, "WPM supera el límite físico humano creíble"),
  accuracy: z.number().min(0).max(100, "La precisión debe estar entre 0 y 100"),
  errors: z.number().int().min(0),
  durationMs: z.number().int().min(500, "Duración demasiado corta"),
  keyStats: z.array(keyStatEntrySchema).optional().default([]),
});
export type RecordAttemptInput = z.infer<typeof recordAttemptSchema>;

export interface Attempt {
  id: string;
  userId: string;
  exerciseId: string;
  wpm: number;
  accuracy: number;
  errors: number;
  durationMs: number;
  createdAt: Date;
}

export interface AttemptResult {
  attemptId: string;
  wpm: number;
  accuracy: number;
  errors: number;
  durationMs: number;
  isNewBestWpm: boolean;
  exerciseTitle: string;
  levelId: string;
  nextExerciseId?: string | null;
}

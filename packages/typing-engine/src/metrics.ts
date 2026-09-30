/** Convención estándar: una "palabra" equivale a 5 caracteres. */
export const CHARS_PER_WORD = 5;

const MS_PER_MINUTE = 60_000;

/**
 * WPM neto: (caracteres correctos / 5) por minuto.
 * Devuelve 0 si la duración no es positiva.
 */
export function calculateWpm(correctChars: number, durationMs: number): number {
  if (durationMs <= 0 || correctChars <= 0) return 0;
  const minutes = durationMs / MS_PER_MINUTE;
  return correctChars / CHARS_PER_WORD / minutes;
}

/**
 * Precisión como porcentaje (0–100) sobre el total de pulsaciones.
 * Sin pulsaciones se considera 100 %.
 */
export function calculateAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  const ratio = Math.min(correctKeystrokes, totalKeystrokes) / totalKeystrokes;
  return ratio * 100;
}

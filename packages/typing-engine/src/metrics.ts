/** Convención estándar: una "palabra" equivale a 5 caracteres. */
export const CHARS_PER_WORD = 5;

const MS_PER_MINUTE = 60_000;

/**
 * WPM neto: (caracteres correctos / 5) por minuto.
 * Devuelve 0 si la duración o los caracteres no son positivos.
 */
export function calculateWpm(correctChars: number, durationMs: number): number {
  if (durationMs <= 0 || correctChars <= 0) return 0;
  const minutes = durationMs / MS_PER_MINUTE;
  return Math.round((correctChars / CHARS_PER_WORD / minutes) * 10) / 10;
}

/**
 * WPM bruto: (total de caracteres pulsados / 5) por minuto, sin restar errores.
 */
export function calculateGrossWpm(totalKeystrokes: number, durationMs: number): number {
  if (durationMs <= 0 || totalKeystrokes <= 0) return 0;
  const minutes = durationMs / MS_PER_MINUTE;
  return Math.round((totalKeystrokes / CHARS_PER_WORD / minutes) * 10) / 10;
}

/**
 * Precisión como porcentaje (0–100) sobre el total de pulsaciones.
 * Sin pulsaciones se considera 100 %.
 */
export function calculateAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  const ratio = Math.max(0, Math.min(correctKeystrokes, totalKeystrokes)) / totalKeystrokes;
  return Math.round(ratio * 1000) / 10; // 1 decimal de precisión
}

/**
 * Calcula la consistencia del ritmo de tecleo (0–100 %).
 * 100 % representa un ritmo perfectamente uniforme entre pulsaciones.
 * Se basa en 100 - Coeficiente de Variación (desviación estándar / media).
 */
export function calculateConsistency(intervalsMs: number[]): number {
  if (intervalsMs.length < 3) return 100;

  // Filtrar pausas extraordinarias (> 3 segundos) para no distorsionar el ritmo continuo
  const filtered = intervalsMs.filter((t) => t > 10 && t < 3000);
  if (filtered.length < 3) return 100;

  const mean = filtered.reduce((acc, v) => acc + v, 0) / filtered.length;
  if (mean === 0) return 100;

  const variance =
    filtered.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (filtered.length - 1);
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean;

  // CV típico suele oscilar entre 0.2 (muy consistente) y 1.0 (errático)
  const score = Math.max(0, Math.min(100, Math.round((1 - cv * 0.7) * 100)));
  return score;
}

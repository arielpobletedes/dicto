import { hasAccessToExercise, type ExerciseTier } from "@ptt/shared";
import type { CurrentUser } from "./auth";

/**
 * Función central de autorización de acceso a ejercicios.
 * Garantiza que:
 * - Ejercicios gratuitos estén disponibles.
 * - Ejercicios premium requieran suscripción activa o rol admin.
 */
export function hasAccess(
  user: CurrentUser | null | undefined,
  exercise: { tier: ExerciseTier },
): boolean {
  return hasAccessToExercise(user, exercise);
}

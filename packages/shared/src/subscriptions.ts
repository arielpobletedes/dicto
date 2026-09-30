import { z } from "zod";
import type { ExerciseTier } from "./exercises";
import type { UserRole } from "./roles";

export const SUBSCRIPTION_PLANS = ["free", "pro_monthly", "pro_yearly", "lifetime"] as const;
export const subscriptionPlanSchema = z.enum(SUBSCRIPTION_PLANS);
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;

export const SUBSCRIPTION_STATUSES = [
  "active",
  "canceled",
  "past_due",
  "trialing",
  "inactive",
] as const;
export const subscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export interface UserEntitlementContext {
  role?: UserRole | string | null;
  hasActiveSubscription?: boolean;
}

/**
 * Determina si un usuario tiene permiso para acceder al contenido de un ejercicio.
 * Regla crítica de negocio:
 * - Ejercicios "free" son accesibles para todos los usuarios autenticados.
 * - Ejercicios "premium" requieren rol "admin" o suscripción activa.
 */
export function hasAccessToExercise(
  user: UserEntitlementContext | null | undefined,
  exercise: { tier: ExerciseTier },
): boolean {
  if (exercise.tier === "free") {
    return true;
  }
  if (!user) {
    return false;
  }
  if (user.role === "admin") {
    return true;
  }
  return Boolean(user.hasActiveSubscription);
}

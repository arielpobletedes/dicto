import { z } from "zod";

/** Roles iniciales de la plataforma. */
export const USER_ROLES = ["admin", "student"] as const;

export const userRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof userRoleSchema>;

/** Rol asignado por defecto al registrarse. */
export const DEFAULT_USER_ROLE: UserRole = "student";

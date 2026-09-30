import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { UserRole } from "@ptt/shared";
import { db, subscriptions } from "@ptt/db";
import { eq } from "drizzle-orm";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
  hasActiveSubscription: boolean;
}

/** Obtiene la sesión actual del usuario desde los headers del servidor. */
export async function getServerSession() {
  try {
    const reqHeaders = await headers();
    return await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch {
    return null;
  }
}

/**
 * Obtiene el usuario actual con sus roles y estado de suscripción.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }

  const role = ((session.user as { role?: string }).role as UserRole) || "student";
  let hasActiveSubscription = false;

  // Si es administrador tiene acceso total
  if (role === "admin") {
    hasActiveSubscription = true;
  } else if (process.env.DATABASE_URL) {
    try {
      const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
      });
      if (sub && (sub.status === "active" || sub.status === "trialing")) {
        hasActiveSubscription = true;
      }
    } catch {
      // Ignorar errores de BD en entorno de prueba
    }
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role,
    image: session.user.image,
    hasActiveSubscription,
  };
}

/**
 * Garantiza que haya un usuario autenticado. Lanza error si no hay sesión.
 */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado. Por favor inicia sesión.");
  }
  return user;
}

/**
 * Garantiza que el usuario autenticado tenga rol de administrador.
 * Se valida siempre en el servidor.
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Acceso denegado: se requieren permisos de Administrador.");
  }
  return user;
}

import { describe, expect, it } from "vitest";
import { getExerciseDetail, getLevelsWithExercises } from "./exercises";

describe("Server Exercises & Authorization", () => {
  it("permite acceso al contenido de ejercicios gratuitos para cualquier usuario", async () => {
    // ex-1-1 es gratuito
    const detail = await getExerciseDetail("ex-1-1", null);
    expect(detail).toBeDefined();
    expect(detail?.isLocked).toBe(false);
    expect(detail?.content).toBeDefined();
    expect(typeof detail?.content).toBe("string");
  });

  it("REGLA CRÍTICA: ejercicio premium devuelve content: null cuando el usuario no tiene acceso", async () => {
    // ex-2-3 es premium
    const studentWithoutSub = {
      id: "student-1",
      name: "Student",
      email: "s@test.com",
      role: "student" as const,
      hasActiveSubscription: false,
    };

    const detail = await getExerciseDetail("ex-2-3", studentWithoutSub);
    expect(detail).toBeDefined();
    expect(detail?.tier).toBe("premium");
    expect(detail?.isLocked).toBe(true);
    // ¡El contenido NUNCA debe serializarse hacia el cliente!
    expect(detail?.content).toBeNull();
  });

  it("permite acceso al contenido premium a administradores", async () => {
    const adminUser = {
      id: "admin-1",
      name: "Admin",
      email: "admin@test.com",
      role: "admin" as const,
      hasActiveSubscription: false,
    };

    const detail = await getExerciseDetail("ex-2-3", adminUser);
    expect(detail).toBeDefined();
    expect(detail?.isLocked).toBe(false);
    expect(detail?.content).toBeDefined();
    expect(typeof detail?.content).toBe("string");
  });

  it("devuelve los niveles con conteo correcto de ejercicios y candados", async () => {
    const levels = await getLevelsWithExercises(null);
    expect(levels.length).toBeGreaterThanOrEqual(6);

    const level2 = levels.find((l) => l.slug === "simbolos-programador");
    expect(level2).toBeDefined();
    expect(level2?.freeCount).toBe(2);
    expect(level2?.premiumCount).toBe(1);

    const lockedExercise = level2?.exercises.find((e) => e.tier === "premium");
    expect(lockedExercise?.isLocked).toBe(true);
  });
});

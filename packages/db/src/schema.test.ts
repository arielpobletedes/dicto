import { describe, expect, it } from "vitest";
import {
  exercises,
  levels,
  users,
  attempts,
  keyStats,
  userProgress,
  subscriptions,
} from "./schema";
import { SEED_EXERCISES, SEED_LEVELS } from "./seeds/data";

describe("Database Schema & Seeds", () => {
  it("contiene las tablas requeridas por el plan", () => {
    expect(levels).toBeDefined();
    expect(exercises).toBeDefined();
    expect(users).toBeDefined();
    expect(attempts).toBeDefined();
    expect(keyStats).toBeDefined();
    expect(userProgress).toBeDefined();
    expect(subscriptions).toBeDefined();
  });

  it("tiene niveles semilla estructurados progresivamente", () => {
    expect(SEED_LEVELS.length).toBeGreaterThanOrEqual(6);
    const slugs = SEED_LEVELS.map((l) => l.slug);
    expect(slugs).toContain("fila-base");
    expect(slugs).toContain("simbolos-programador");
    expect(slugs).toContain("operadores-especiales");
    expect(slugs).toContain("javascript-typescript");
    expect(slugs).toContain("python-indentacion");
    expect(slugs).toContain("sql-y-bash");
  });

  it("tiene ejercicios gratuitos y de pago con caracteres especiales de programador", () => {
    const freeExercises = SEED_EXERCISES.filter((e) => e.tier === "free");
    const premiumExercises = SEED_EXERCISES.filter((e) => e.tier === "premium");

    expect(freeExercises.length).toBeGreaterThan(0);
    expect(premiumExercises.length).toBeGreaterThan(0);

    // Verificar que los ejercicios incluyen caracteres especiales
    const allContent = SEED_EXERCISES.map((e) => e.content).join(" ");
    expect(allContent).toMatch(/[{}[\]()<>]/);
    expect(allContent).toMatch(/[;:]/);
    expect(allContent).toMatch(/[=\-+*]/);
    expect(allContent).toMatch(/[`$#@]/);
  });
});

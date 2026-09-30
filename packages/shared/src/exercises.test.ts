import { describe, expect, it } from "vitest";
import { createExerciseSchema, recordAttemptSchema } from "./index";

describe("createExerciseSchema", () => {
  it("valida un ejercicio correcto con valores por defecto", () => {
    const parsed = createExerciseSchema.parse({
      levelId: "level-1",
      title: "Variables y Constantes",
      content: "const count = 42;",
    });

    expect(parsed.language).toBe("typescript");
    expect(parsed.difficulty).toBe("beginner");
    expect(parsed.tier).toBe("free");
    expect(parsed.published).toBe(true);
  });

  it("rechaza títulos o contenidos demasiado cortos", () => {
    expect(() =>
      createExerciseSchema.parse({
        levelId: "level-1",
        title: "x",
        content: "const a = 1;",
      }),
    ).toThrow();
  });
});

describe("recordAttemptSchema", () => {
  it("valida intento con métricas creíbles", () => {
    const valid = recordAttemptSchema.parse({
      exerciseId: "ex-1",
      wpm: 75.4,
      accuracy: 98.2,
      errors: 2,
      durationMs: 32000,
      keyStats: [{ key: "a", correctCount: 10, errorCount: 1 }],
    });

    expect(valid.wpm).toBe(75.4);
    expect(valid.errors).toBe(2);
  });

  it("rechaza WPM humanamente imposible (anti-trampas)", () => {
    expect(() =>
      recordAttemptSchema.parse({
        exerciseId: "ex-1",
        wpm: 500,
        accuracy: 100,
        errors: 0,
        durationMs: 10000,
      }),
    ).toThrow();
  });
});

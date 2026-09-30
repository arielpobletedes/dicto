import { describe, expect, it } from "vitest";
import { hasAccessToExercise } from "./subscriptions";

describe("hasAccessToExercise", () => {
  it("permite acceso a ejercicios gratuitos a usuarios anónimos o no suscritos", () => {
    expect(hasAccessToExercise(null, { tier: "free" })).toBe(true);
    expect(hasAccessToExercise({ role: "student" }, { tier: "free" })).toBe(true);
    expect(
      hasAccessToExercise({ role: "student", hasActiveSubscription: false }, { tier: "free" }),
    ).toBe(true);
  });

  it("bloquea acceso a ejercicios premium si no hay usuario o no está suscrito", () => {
    expect(hasAccessToExercise(null, { tier: "premium" })).toBe(false);
    expect(hasAccessToExercise({ role: "student" }, { tier: "premium" })).toBe(false);
    expect(
      hasAccessToExercise({ role: "student", hasActiveSubscription: false }, { tier: "premium" }),
    ).toBe(false);
  });

  it("permite acceso a ejercicios premium si el usuario tiene suscripción activa", () => {
    expect(
      hasAccessToExercise({ role: "student", hasActiveSubscription: true }, { tier: "premium" }),
    ).toBe(true);
  });

  it("permite acceso a ejercicios premium siempre a administradores aunque no tengan suscripción", () => {
    expect(
      hasAccessToExercise({ role: "admin", hasActiveSubscription: false }, { tier: "premium" }),
    ).toBe(true);
    expect(hasAccessToExercise({ role: "admin" }, { tier: "premium" })).toBe(true);
  });
});

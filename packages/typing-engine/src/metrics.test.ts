import { describe, expect, it } from "vitest";
import { calculateAccuracy, calculateWpm } from "./metrics";

describe("calculateWpm", () => {
  it("300 caracteres correctos en 1 minuto son 60 WPM", () => {
    expect(calculateWpm(300, 60_000)).toBe(60);
  });

  it("escala con la duración", () => {
    expect(calculateWpm(150, 30_000)).toBe(60);
  });

  it("devuelve 0 con duración o caracteres no positivos", () => {
    expect(calculateWpm(100, 0)).toBe(0);
    expect(calculateWpm(0, 60_000)).toBe(0);
    expect(calculateWpm(100, -5)).toBe(0);
  });
});

describe("calculateAccuracy", () => {
  it("calcula el porcentaje de aciertos", () => {
    expect(calculateAccuracy(95, 100)).toBe(95);
  });

  it("sin pulsaciones es 100 %", () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it("no supera el 100 %", () => {
    expect(calculateAccuracy(120, 100)).toBe(100);
  });
});

import { describe, expect, it } from "vitest";
import {
  DEFAULT_KEYBOARD_LAYOUT,
  KEYBOARD_LAYOUT_OPTIONS,
  KEYBOARD_LAYOUTS,
  keyboardLayoutSchema,
} from "./keyboard";

describe("Keyboard Layout Shared Module", () => {
  it("incluye 'latam' y 'us' como distribuciones válidas", () => {
    expect(KEYBOARD_LAYOUTS).toContain("latam");
    expect(KEYBOARD_LAYOUTS).toContain("us");
    expect(keyboardLayoutSchema.parse("latam")).toBe("latam");
    expect(keyboardLayoutSchema.parse("us")).toBe("us");
  });

  it("rechaza distribuciones no soportadas", () => {
    expect(() => keyboardLayoutSchema.parse("dvorak")).toThrow();
  });

  it("establece 'latam' como distribución por defecto", () => {
    expect(DEFAULT_KEYBOARD_LAYOUT).toBe("latam");
  });

  it("provee metadatos descriptivos de las distribuciones", () => {
    expect(KEYBOARD_LAYOUT_OPTIONS.length).toBe(2);
    const latam = KEYBOARD_LAYOUT_OPTIONS.find((o) => o.id === "latam");
    expect(latam?.flag).toBe("🇨🇱");
    expect(latam?.name).toContain("Chile");
  });
});

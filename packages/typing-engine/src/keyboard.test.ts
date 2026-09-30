import { describe, expect, it } from "vitest";
import { getKeyGuidance, US_KEYBOARD_ROWS } from "./keyboard";
import { isProgrammerSpecialChar, PROGRAMMER_SYMBOL_INFO } from "./special-keys";

describe("Virtual Keyboard & Guidance", () => {
  it("define todas las filas del teclado QWERTY", () => {
    expect(US_KEYBOARD_ROWS.length).toBe(5);
    const totalKeys = US_KEYBOARD_ROWS.reduce((acc, row) => acc + row.length, 0);
    expect(totalKeys).toBeGreaterThanOrEqual(45);
  });

  it("ofrece guía de dedo correcta para teclas de la fila base", () => {
    const guideA = getKeyGuidance("a");
    expect(guideA?.finger).toBe("left-pinky");
    expect(guideA?.hand).toBe("left");

    const guideJ = getKeyGuidance("j");
    expect(guideJ?.finger).toBe("right-index");
    expect(guideJ?.hand).toBe("right");

    const guideSpace = getKeyGuidance(" ");
    expect(guideSpace?.finger).toBe("thumb");
  });

  it("ofrece guía para símbolos especiales de programador y combinaciones Shift / AltGr", () => {
    const guideBrace = getKeyGuidance("{");
    expect(guideBrace).toBeDefined();
    expect(guideBrace?.shiftRequired).toBe(true);

    const guideAt = getKeyGuidance("@");
    expect(guideAt).toBeDefined();
    expect(guideAt?.hint).toMatch(/Shift|AltGr/);

    const guideSemicolon = getKeyGuidance(";");
    expect(guideSemicolon?.finger).toBe("right-pinky");
  });

  it("reconoce caracteres de programación comunes", () => {
    expect(isProgrammerSpecialChar("{")).toBe(true);
    expect(isProgrammerSpecialChar("}")).toBe(true);
    expect(isProgrammerSpecialChar("[")).toBe(true);
    expect(isProgrammerSpecialChar("]")).toBe(true);
    expect(isProgrammerSpecialChar(";")).toBe(true);
    expect(isProgrammerSpecialChar("`")).toBe(true);
    expect(isProgrammerSpecialChar("$")).toBe(true);
    expect(isProgrammerSpecialChar("a")).toBe(false);

    expect(PROGRAMMER_SYMBOL_INFO["{"]?.category).toBe("delimiter");
    expect(PROGRAMMER_SYMBOL_INFO["="]?.category).toBe("operator");
  });
});

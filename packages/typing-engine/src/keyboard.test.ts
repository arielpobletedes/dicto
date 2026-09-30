import { describe, expect, it } from "vitest";
import { getKeyGuidance, getKeyboardRows, LATAM_KEYBOARD_ROWS, US_KEYBOARD_ROWS } from "./keyboard";
import { isProgrammerSpecialChar, PROGRAMMER_SYMBOL_INFO } from "./special-keys";

describe("Virtual Keyboard & Guidance", () => {
  it("define todas las filas para ambas distribuciones", () => {
    expect(US_KEYBOARD_ROWS.length).toBe(5);
    expect(LATAM_KEYBOARD_ROWS.length).toBe(5);

    expect(getKeyboardRows("us")).toBe(US_KEYBOARD_ROWS);
    expect(getKeyboardRows("latam")).toBe(LATAM_KEYBOARD_ROWS);

    const usKeyCount = US_KEYBOARD_ROWS.reduce((acc, row) => acc + row.length, 0);
    const latamKeyCount = LATAM_KEYBOARD_ROWS.reduce((acc, row) => acc + row.length, 0);
    expect(usKeyCount).toBeGreaterThanOrEqual(45);
    expect(latamKeyCount).toBeGreaterThanOrEqual(45);
  });

  it("ofrece guía de dedo correcta para teclas de la fila base", () => {
    for (const layout of ["latam", "us"] as const) {
      const guideA = getKeyGuidance("a", layout);
      expect(guideA?.finger).toBe("left-pinky");
      expect(guideA?.hand).toBe("left");

      const guideJ = getKeyGuidance("j", layout);
      expect(guideJ?.finger).toBe("right-index");
      expect(guideJ?.hand).toBe("right");

      const guideSpace = getKeyGuidance(" ", layout);
      expect(guideSpace?.finger).toBe("thumb");
    }
  });

  describe("Distribución US QWERTY", () => {
    it("mapea símbolos característicos de programación en US", () => {
      const guideBrace = getKeyGuidance("{", "us");
      expect(guideBrace?.code).toBe("BracketLeft");
      expect(guideBrace?.shiftRequired).toBe(true);
      expect(guideBrace?.altGrRequired).toBe(false);

      const guideAt = getKeyGuidance("@", "us");
      expect(guideAt?.code).toBe("Digit2");
      expect(guideAt?.shiftRequired).toBe(true);

      const guideSemicolon = getKeyGuidance(";", "us");
      expect(guideSemicolon?.code).toBe("Semicolon");
      expect(guideSemicolon?.shiftRequired).toBe(false);
      expect(guideSemicolon?.finger).toBe("right-pinky");

      const guideColon = getKeyGuidance(":", "us");
      expect(guideColon?.code).toBe("Semicolon");
      expect(guideColon?.shiftRequired).toBe(true);
    });
  });

  describe("Distribución Español Latinoamericano (Chile)", () => {
    it("ofrece guía para la tecla Ñ y caracteres específicos de Chile", () => {
      const guideEnye = getKeyGuidance("ñ", "latam");
      expect(guideEnye).toBeDefined();
      expect(guideEnye?.code).toBe("Semicolon");
      expect(guideEnye?.finger).toBe("right-pinky");
      expect(guideEnye?.shiftRequired).toBe(false);

      const guideEnyeUpper = getKeyGuidance("Ñ", "latam");
      expect(guideEnyeUpper?.code).toBe("Semicolon");
      expect(guideEnyeUpper?.shiftRequired).toBe(true);

      // En Latam, el punto y coma se obtiene con Shift + Coma
      const guideSemicolon = getKeyGuidance(";", "latam");
      expect(guideSemicolon?.code).toBe("Comma");
      expect(guideSemicolon?.shiftRequired).toBe(true);
      expect(guideSemicolon?.finger).toBe("right-middle");

      // Dos puntos con Shift + Punto
      const guideColon = getKeyGuidance(":", "latam");
      expect(guideColon?.code).toBe("Period");
      expect(guideColon?.shiftRequired).toBe(true);

      // En Chile @ con AltGr + Q
      const guideAt = getKeyGuidance("@", "latam");
      expect(guideAt?.code).toBe("KeyQ");
      expect(guideAt?.altGrRequired).toBe(true);

      // Llaves con AltGr
      const guideBraceOpen = getKeyGuidance("{", "latam");
      expect(guideBraceOpen?.altGrRequired).toBe(true);

      // Tecla física ISO < >
      const guideLt = getKeyGuidance("<", "latam");
      expect(guideLt?.code).toBe("IntlBackslash");
      expect(guideLt?.shiftRequired).toBe(false);

      const guideGt = getKeyGuidance(">", "latam");
      expect(guideGt?.code).toBe("IntlBackslash");
      expect(guideGt?.shiftRequired).toBe(true);
    });
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

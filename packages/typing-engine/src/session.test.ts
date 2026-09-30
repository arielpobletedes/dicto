import { describe, expect, it } from "vitest";
import { createTypingSession, handleKeystroke } from "./session";

describe("TypingSession", () => {
  it("inicializa la sesión correctamente", () => {
    const session = createTypingSession("const x = 10;");
    expect(session.cursorIndex).toBe(0);
    expect(session.isFinished).toBe(false);
    expect(session.charStates.length).toBe(13);
    expect(session.charStates.every((s) => s === "pending")).toBe(true);
  });

  it("avanza el cursor y registra aciertos", () => {
    let session = createTypingSession("abc");
    const t0 = 1000;

    const res1 = handleKeystroke(session, { key: "a", timestamp: t0 });
    session = res1.session;
    expect(session.cursorIndex).toBe(1);
    expect(session.charStates[0]).toBe("correct");
    expect(session.correctKeystrokes).toBe(1);
    expect(session.errorKeystrokes).toBe(0);

    const res2 = handleKeystroke(session, { key: "b", timestamp: t0 + 200 });
    session = res2.session;
    expect(session.cursorIndex).toBe(2);
    expect(session.charStates[1]).toBe("correct");
  });

  it("registra errores y teclas problemáticas", () => {
    let session = createTypingSession("code");
    const t0 = 1000;

    // Se esperaba 'c', pero pulsa 'x'
    const res = handleKeystroke(session, { key: "x", timestamp: t0 });
    session = res.session;

    expect(session.cursorIndex).toBe(1);
    expect(session.charStates[0]).toBe("incorrect");
    expect(session.correctKeystrokes).toBe(0);
    expect(session.errorKeystrokes).toBe(1);
    expect(session.keyStats["c"]?.errorCount).toBe(1);
  });

  it("retrocede con Backspace y restaura el estado a pending", () => {
    let session = createTypingSession("test");
    const t0 = 1000;

    session = handleKeystroke(session, { key: "t", timestamp: t0 }).session;
    session = handleKeystroke(session, { key: "e", timestamp: t0 + 100 }).session;
    expect(session.cursorIndex).toBe(2);

    session = handleKeystroke(session, { key: "Backspace", timestamp: t0 + 200 }).session;
    expect(session.cursorIndex).toBe(1);
    expect(session.charStates[1]).toBe("pending");
  });

  it("gestiona caracteres especiales de programador { } [ ] ; ` $", () => {
    const specialText = "{ [ ] } ; ` $";
    let session = createTypingSession(specialText);
    let time = 1000;

    for (const char of specialText) {
      const res = handleKeystroke(session, { key: char, timestamp: time });
      session = res.session;
      time += 150;
    }

    expect(session.isFinished).toBe(true);
    expect(session.charStates.every((s) => s === "correct")).toBe(true);
    expect(session.errorKeystrokes).toBe(0);
  });

  it("maneja indentación de código con tecla Tab", () => {
    const codeWithIndent = "function run() {\n  return true;\n}";
    let session = createTypingSession(codeWithIndent);
    let time = 1000;

    // Escribir "function run() {\n"
    const prefix = "function run() {\n";
    for (const char of prefix) {
      session = handleKeystroke(session, {
        key: char === "\n" ? "Enter" : char,
        timestamp: time,
      }).session;
      time += 100;
    }

    expect(session.cursorIndex).toBe(prefix.length);

    // En este punto el siguiente texto es "  " (2 espacios)
    // Pulsar Tab debe consumir la indentación
    const tabRes = handleKeystroke(session, { key: "Tab", timestamp: time });
    session = tabRes.session;

    expect(session.cursorIndex).toBe(prefix.length + 2);
    expect(session.charStates[prefix.length]).toBe("correct");
    expect(session.charStates[prefix.length + 1]).toBe("correct");
  });

  it("detecta finalización y emite métricas completas", () => {
    const session = createTypingSession("ok");
    const t0 = 10000;

    const r1 = handleKeystroke(session, { key: "o", timestamp: t0 });
    expect(r1.completedJustNow).toBe(false);

    const r2 = handleKeystroke(r1.session, { key: "k", timestamp: t0 + 1000 });
    expect(r2.completedJustNow).toBe(true);
    expect(r2.session.isFinished).toBe(true);
    expect(r2.metrics.accuracy).toBe(100);
    expect(r2.metrics.wpm).toBeGreaterThan(0);
  });

  it("ignora teclas muertas (Dead) y modificadores sin avanzar ni contar error", () => {
    let session = createTypingSession("ñandú");
    const t0 = 1000;

    // Pulsación de tecla muerta en teclado latinoamericano en Windows
    const deadRes = handleKeystroke(session, { key: "Dead", timestamp: t0 });
    session = deadRes.session;
    expect(session.cursorIndex).toBe(0);
    expect(session.totalKeystrokes).toBe(0);
    expect(session.errorKeystrokes).toBe(0);

    // Pulsación de Shift aislado
    const shiftRes = handleKeystroke(session, { key: "Shift", timestamp: t0 + 10 });
    session = shiftRes.session;
    expect(session.cursorIndex).toBe(0);
    expect(session.totalKeystrokes).toBe(0);

    // Carácter real 'ñ'
    const charRes = handleKeystroke(session, { key: "ñ", timestamp: t0 + 50 }, "latam");
    expect(charRes.session.cursorIndex).toBe(1);
    expect(charRes.session.correctKeystrokes).toBe(1);
  });

  it("ofrece keyGuidance coherente con el layout especificado", () => {
    const session = createTypingSession(";");
    const resLatam = handleKeystroke(session, { key: "Shift" }, "latam");
    expect(resLatam.keyGuidance?.code).toBe("Comma");
    expect(resLatam.keyGuidance?.shiftRequired).toBe(true);

    const resUS = handleKeystroke(session, { key: "Shift" }, "us");
    expect(resUS.keyGuidance?.code).toBe("Semicolon");
    expect(resUS.keyGuidance?.shiftRequired).toBe(false);
  });
});

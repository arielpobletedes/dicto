import {
  calculateAccuracy,
  calculateConsistency,
  calculateGrossWpm,
  calculateWpm,
} from "./metrics";
import { getKeyGuidance, type KeyGuidance } from "./keyboard";

export type CharState = "pending" | "correct" | "incorrect" | "extra";

export interface KeystrokeEvent {
  key: string;
  code?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  timestamp?: number;
}

export interface KeystrokeRecord {
  key: string;
  expectedKey: string;
  code?: string;
  timestamp: number;
  isCorrect: boolean;
  cursorIndex: number;
}

export interface KeyStatsRecord {
  key: string;
  correctCount: number;
  errorCount: number;
}

export interface TypingSession {
  targetText: string;
  cursorIndex: number;
  charStates: CharState[];
  typedChars: string[];
  keystrokes: KeystrokeRecord[];
  keyStats: Record<string, KeyStatsRecord>;
  startTime: number | null;
  endTime: number | null;
  isFinished: boolean;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
}

export interface SessionMetrics {
  wpm: number;
  grossWpm: number;
  accuracy: number;
  consistency: number;
  durationMs: number;
  errors: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  progressPercent: number;
}

export function createTypingSession(targetText: string): TypingSession {
  const chars = Array.from(targetText);
  return {
    targetText,
    cursorIndex: 0,
    charStates: chars.map(() => "pending"),
    typedChars: [],
    keystrokes: [],
    keyStats: {},
    startTime: null,
    endTime: null,
    isFinished: false,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errorKeystrokes: 0,
  };
}

/** Teclas que no generan caracteres y deben ignorarse si se pulsan solas. */
const IGNORED_KEYS = new Set([
  "Shift",
  "Control",
  "Alt",
  "AltGraph",
  "Meta",
  "CapsLock",
  "Escape",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "Insert",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "ContextMenu",
]);

/**
 * Procesa una pulsación de tecla sobre una sesión de mecanografía.
 * Maneja:
 * - Inicio automático del cronómetro en la primera pulsación.
 * - Backspace / Retroceso.
 * - Manejo de Tabulador para bloques de código e indentación (2 o 4 espacios).
 * - Comparación exacta de caracteres y caracteres especiales.
 * - Registro de errores por tecla y cálculo de métricas en tiempo real.
 */
export function handleKeystroke(
  session: TypingSession,
  event: KeystrokeEvent,
): {
  session: TypingSession;
  keyGuidance: KeyGuidance | null;
  metrics: SessionMetrics;
  completedJustNow: boolean;
} {
  if (session.isFinished) {
    return {
      session,
      keyGuidance: null,
      metrics: getSessionMetrics(session),
      completedJustNow: false,
    };
  }

  const key = event.key;
  const now = event.timestamp ?? Date.now();

  // Ignorar modificadores y teclas de navegación aisladas
  if (IGNORED_KEYS.has(key) || event.ctrlKey || event.metaKey) {
    return {
      session,
      keyGuidance: getCurrentKeyGuidance(session),
      metrics: getSessionMetrics(session),
      completedJustNow: false,
    };
  }

  // Iniciar tiempo si es la primera pulsación válida
  const startTime = session.startTime ?? now;

  // Clonar estado inmutable
  const charStates = [...session.charStates];
  const typedChars = [...session.typedChars];
  const keystrokes = [...session.keystrokes];
  const keyStats = { ...session.keyStats };
  let cursorIndex = session.cursorIndex;
  let totalKeystrokes = session.totalKeystrokes;
  let correctKeystrokes = session.correctKeystrokes;
  let errorKeystrokes = session.errorKeystrokes;

  // 1. Manejo de Retroceso (Backspace)
  if (key === "Backspace") {
    if (cursorIndex > 0) {
      cursorIndex -= 1;
      charStates[cursorIndex] = "pending";
      typedChars.pop();
    }
    const updatedSession: TypingSession = {
      ...session,
      cursorIndex,
      charStates,
      typedChars,
      startTime,
    };
    return {
      session: updatedSession,
      keyGuidance: getCurrentKeyGuidance(updatedSession),
      metrics: getSessionMetrics(updatedSession, now),
      completedJustNow: false,
    };
  }

  // 2. Manejo de Tabulador para código:
  // Si se pulsa Tab y el texto objetivo tiene espacios de indentación o un \t
  if (key === "Tab") {
    const targetSlice = session.targetText.slice(cursorIndex);
    let matchLength = 0;
    if (targetSlice.startsWith("    ")) {
      matchLength = 4;
    } else if (targetSlice.startsWith("  ")) {
      matchLength = 2;
    } else if (targetSlice.startsWith("\t")) {
      matchLength = 1;
    }

    if (matchLength > 0) {
      for (let i = 0; i < matchLength; i++) {
        const expected = session.targetText[cursorIndex + i]!;
        charStates[cursorIndex + i] = "correct";
        typedChars.push(expected);
        totalKeystrokes += 1;
        correctKeystrokes += 1;
        recordKeyStat(keyStats, expected, true);
      }
      cursorIndex += matchLength;
      keystrokes.push({
        key: "Tab",
        expectedKey: "Tab",
        code: event.code,
        timestamp: now,
        isCorrect: true,
        cursorIndex,
      });

      const isFinished = cursorIndex >= session.targetText.length;
      const updatedSession: TypingSession = {
        ...session,
        cursorIndex,
        charStates,
        typedChars,
        keystrokes,
        keyStats,
        startTime,
        endTime: isFinished ? now : null,
        isFinished,
        totalKeystrokes,
        correctKeystrokes,
        errorKeystrokes,
      };

      return {
        session: updatedSession,
        keyGuidance: getCurrentKeyGuidance(updatedSession),
        metrics: getSessionMetrics(updatedSession, now),
        completedJustNow: isFinished,
      };
    }
  }

  // 3. Procesar pulsación regular
  if (cursorIndex < session.targetText.length) {
    const expectedChar = session.targetText[cursorIndex]!;
    // Considerar saltos de línea (Enter puede ser "Enter" o "\n")
    const actualChar = key === "Enter" ? "\n" : key;
    const isCorrect = actualChar === expectedChar;

    totalKeystrokes += 1;
    if (isCorrect) {
      correctKeystrokes += 1;
      charStates[cursorIndex] = "correct";
      recordKeyStat(keyStats, expectedChar, true);
    } else {
      errorKeystrokes += 1;
      charStates[cursorIndex] = "incorrect";
      recordKeyStat(keyStats, expectedChar, false);
    }

    typedChars.push(actualChar);
    keystrokes.push({
      key: actualChar,
      expectedKey: expectedChar,
      code: event.code,
      timestamp: now,
      isCorrect,
      cursorIndex,
    });

    cursorIndex += 1;
  }

  const isFinished = cursorIndex >= session.targetText.length;
  const endTime = isFinished ? now : null;

  const updatedSession: TypingSession = {
    ...session,
    cursorIndex,
    charStates,
    typedChars,
    keystrokes,
    keyStats,
    startTime,
    endTime,
    isFinished,
    totalKeystrokes,
    correctKeystrokes,
    errorKeystrokes,
  };

  return {
    session: updatedSession,
    keyGuidance: getCurrentKeyGuidance(updatedSession),
    metrics: getSessionMetrics(updatedSession, now),
    completedJustNow: isFinished,
  };
}

function recordKeyStat(keyStats: Record<string, KeyStatsRecord>, key: string, isCorrect: boolean) {
  const normKey = key === "\n" ? "Enter" : key === "\t" ? "Tab" : key === " " ? "Space" : key;
  if (!keyStats[normKey]) {
    keyStats[normKey] = {
      key: normKey,
      correctCount: 0,
      errorCount: 0,
    };
  }
  const stat = keyStats[normKey]!;
  if (isCorrect) {
    stat.correctCount += 1;
  } else {
    stat.errorCount += 1;
  }
}

export function getCurrentKeyGuidance(session: TypingSession): KeyGuidance | null {
  if (session.isFinished || session.cursorIndex >= session.targetText.length) {
    return null;
  }
  const nextChar = session.targetText[session.cursorIndex]!;
  return getKeyGuidance(nextChar);
}

export function getSessionMetrics(session: TypingSession, currentTimeMs?: number): SessionMetrics {
  const now = currentTimeMs ?? Date.now();
  const startTime = session.startTime ?? now;
  const endTime = session.endTime ?? (session.isFinished ? now : now);
  const durationMs = Math.max(1, endTime - startTime);

  // Caracteres correctos contados hasta el cursor
  const correctChars = session.charStates.filter((s) => s === "correct").length;
  const wpm = calculateWpm(correctChars, durationMs);
  const grossWpm = calculateGrossWpm(session.totalKeystrokes, durationMs);
  const accuracy = calculateAccuracy(session.correctKeystrokes, session.totalKeystrokes);

  // Intervalos de tiempo entre pulsaciones
  const intervals: number[] = [];
  for (let i = 1; i < session.keystrokes.length; i++) {
    intervals.push(session.keystrokes[i]!.timestamp - session.keystrokes[i - 1]!.timestamp);
  }
  const consistency = calculateConsistency(intervals);

  const progressPercent =
    session.targetText.length > 0
      ? Math.round((session.cursorIndex / session.targetText.length) * 100)
      : 100;

  return {
    wpm,
    grossWpm,
    accuracy,
    consistency,
    durationMs,
    errors: session.errorKeystrokes,
    totalKeystrokes: session.totalKeystrokes,
    correctKeystrokes: session.correctKeystrokes,
    progressPercent,
  };
}

import type { KeyboardLayout } from "@ptt/shared";

export type Finger =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "thumb"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky";

export type Hand = "left" | "right";

export interface KeyLayoutDef {
  code: string;
  label: string;
  shiftLabel?: string;
  altGrLabel?: string;
  finger: Finger;
  hand: Hand;
  width?: string;
}

export interface KeyGuidance {
  code: string;
  keyLabel: string;
  finger: Finger;
  fingerName: string;
  hand: Hand;
  shiftRequired: boolean;
  altGrRequired: boolean;
  hint: string;
}

export const FINGER_NAMES: Record<Finger, string> = {
  "left-pinky": "Meñique izquierdo",
  "left-ring": "Anular izquierdo",
  "left-middle": "Medio izquierdo",
  "left-index": "Índice izquierdo",
  thumb: "Pulgar",
  "right-index": "Índice derecho",
  "right-middle": "Medio derecho",
  "right-ring": "Anular derecho",
  "right-pinky": "Meñique derecho",
};

/** Distribución estándar US QWERTY (ANSI) */
export const US_KEYBOARD_ROWS: KeyLayoutDef[][] = [
  // Fila de números y símbolos
  [
    { code: "Backquote", label: "`", shiftLabel: "~", finger: "left-pinky", hand: "left" },
    { code: "Digit1", label: "1", shiftLabel: "!", finger: "left-pinky", hand: "left" },
    { code: "Digit2", label: "2", shiftLabel: "@", finger: "left-ring", hand: "left" },
    { code: "Digit3", label: "3", shiftLabel: "#", finger: "left-middle", hand: "left" },
    { code: "Digit4", label: "4", shiftLabel: "$", finger: "left-index", hand: "left" },
    { code: "Digit5", label: "5", shiftLabel: "%", finger: "left-index", hand: "left" },
    { code: "Digit6", label: "6", shiftLabel: "^", finger: "right-index", hand: "right" },
    { code: "Digit7", label: "7", shiftLabel: "&", finger: "right-index", hand: "right" },
    { code: "Digit8", label: "8", shiftLabel: "*", finger: "right-middle", hand: "right" },
    { code: "Digit9", label: "9", shiftLabel: "(", finger: "right-ring", hand: "right" },
    { code: "Digit0", label: "0", shiftLabel: ")", finger: "right-pinky", hand: "right" },
    { code: "Minus", label: "-", shiftLabel: "_", finger: "right-pinky", hand: "right" },
    { code: "Equal", label: "=", shiftLabel: "+", finger: "right-pinky", hand: "right" },
    { code: "Backspace", label: "Backspace", finger: "right-pinky", hand: "right", width: "w-20" },
  ],
  // Fila superior (QWERTY)
  [
    { code: "Tab", label: "Tab", finger: "left-pinky", hand: "left", width: "w-16" },
    { code: "KeyQ", label: "q", shiftLabel: "Q", finger: "left-pinky", hand: "left" },
    { code: "KeyW", label: "w", shiftLabel: "W", finger: "left-ring", hand: "left" },
    { code: "KeyE", label: "e", shiftLabel: "E", finger: "left-middle", hand: "left" },
    { code: "KeyR", label: "r", shiftLabel: "R", finger: "left-index", hand: "left" },
    { code: "KeyT", label: "t", shiftLabel: "T", finger: "left-index", hand: "left" },
    { code: "KeyY", label: "y", shiftLabel: "Y", finger: "right-index", hand: "right" },
    { code: "KeyU", label: "u", shiftLabel: "U", finger: "right-index", hand: "right" },
    { code: "KeyI", label: "i", shiftLabel: "I", finger: "right-middle", hand: "right" },
    { code: "KeyO", label: "o", shiftLabel: "O", finger: "right-ring", hand: "right" },
    { code: "KeyP", label: "p", shiftLabel: "P", finger: "right-pinky", hand: "right" },
    { code: "BracketLeft", label: "[", shiftLabel: "{", finger: "right-pinky", hand: "right" },
    { code: "BracketRight", label: "]", shiftLabel: "}", finger: "right-pinky", hand: "right" },
    {
      code: "Backslash",
      label: "\\",
      shiftLabel: "|",
      finger: "right-pinky",
      hand: "right",
      width: "w-14",
    },
  ],
  // Fila central (Home Row)
  [
    { code: "CapsLock", label: "Caps", finger: "left-pinky", hand: "left", width: "w-18" },
    { code: "KeyA", label: "a", shiftLabel: "A", finger: "left-pinky", hand: "left" },
    { code: "KeyS", label: "s", shiftLabel: "S", finger: "left-ring", hand: "left" },
    { code: "KeyD", label: "d", shiftLabel: "D", finger: "left-middle", hand: "left" },
    { code: "KeyF", label: "f", shiftLabel: "F", finger: "left-index", hand: "left" },
    { code: "KeyG", label: "g", shiftLabel: "G", finger: "left-index", hand: "left" },
    { code: "KeyH", label: "h", shiftLabel: "H", finger: "right-index", hand: "right" },
    { code: "KeyJ", label: "j", shiftLabel: "J", finger: "right-index", hand: "right" },
    { code: "KeyK", label: "k", shiftLabel: "K", finger: "right-middle", hand: "right" },
    { code: "KeyL", label: "l", shiftLabel: "L", finger: "right-ring", hand: "right" },
    { code: "Semicolon", label: ";", shiftLabel: ":", finger: "right-pinky", hand: "right" },
    { code: "Quote", label: "'", shiftLabel: '"', finger: "right-pinky", hand: "right" },
    { code: "Enter", label: "Enter", finger: "right-pinky", hand: "right", width: "w-24" },
  ],
  // Fila inferior
  [
    { code: "ShiftLeft", label: "Shift", finger: "left-pinky", hand: "left", width: "w-24" },
    { code: "KeyZ", label: "z", shiftLabel: "Z", finger: "left-pinky", hand: "left" },
    { code: "KeyX", label: "x", shiftLabel: "X", finger: "left-ring", hand: "left" },
    { code: "KeyC", label: "c", shiftLabel: "C", finger: "left-middle", hand: "left" },
    { code: "KeyV", label: "v", shiftLabel: "V", finger: "left-index", hand: "left" },
    { code: "KeyB", label: "b", shiftLabel: "B", finger: "left-index", hand: "left" },
    { code: "KeyN", label: "n", shiftLabel: "N", finger: "right-index", hand: "right" },
    { code: "KeyM", label: "m", shiftLabel: "M", finger: "right-index", hand: "right" },
    { code: "Comma", label: ",", shiftLabel: "<", finger: "right-middle", hand: "right" },
    { code: "Period", label: ".", shiftLabel: ">", finger: "right-ring", hand: "right" },
    { code: "Slash", label: "/", shiftLabel: "?", finger: "right-pinky", hand: "right" },
    { code: "ShiftRight", label: "Shift", finger: "right-pinky", hand: "right", width: "w-28" },
  ],
  // Fila de barra espaciadora
  [
    { code: "ControlLeft", label: "Ctrl", finger: "left-pinky", hand: "left", width: "w-16" },
    { code: "AltLeft", label: "Alt", finger: "left-pinky", hand: "left", width: "w-14" },
    { code: "Space", label: "Space", finger: "thumb", hand: "right", width: "flex-1" },
    {
      code: "AltRight",
      label: "AltGr",
      altGrLabel: "AltGr",
      finger: "right-pinky",
      hand: "right",
      width: "w-16",
    },
    { code: "ControlRight", label: "Ctrl", finger: "right-pinky", hand: "right", width: "w-16" },
  ],
];

/** Distribución Español Latinoamericano (Chile - ISO) */
export const LATAM_KEYBOARD_ROWS: KeyLayoutDef[][] = [
  // Fila de números y símbolos
  [
    {
      code: "Backquote",
      label: "|",
      shiftLabel: "°",
      altGrLabel: "¬",
      finger: "left-pinky",
      hand: "left",
    },
    { code: "Digit1", label: "1", shiftLabel: "!", finger: "left-pinky", hand: "left" },
    {
      code: "Digit2",
      label: "2",
      shiftLabel: '"',
      altGrLabel: "@",
      finger: "left-ring",
      hand: "left",
    },
    { code: "Digit3", label: "3", shiftLabel: "#", finger: "left-middle", hand: "left" },
    {
      code: "Digit4",
      label: "4",
      shiftLabel: "$",
      altGrLabel: "~",
      finger: "left-index",
      hand: "left",
    },
    { code: "Digit5", label: "5", shiftLabel: "%", finger: "left-index", hand: "left" },
    { code: "Digit6", label: "6", shiftLabel: "&", finger: "right-index", hand: "right" },
    { code: "Digit7", label: "7", shiftLabel: "/", finger: "right-index", hand: "right" },
    {
      code: "Digit8",
      label: "8",
      shiftLabel: "(",
      altGrLabel: "[",
      finger: "right-middle",
      hand: "right",
    },
    {
      code: "Digit9",
      label: "9",
      shiftLabel: ")",
      altGrLabel: "]",
      finger: "right-ring",
      hand: "right",
    },
    { code: "Digit0", label: "0", shiftLabel: "=", finger: "right-pinky", hand: "right" },
    {
      code: "Minus",
      label: "'",
      shiftLabel: "?",
      altGrLabel: "\\",
      finger: "right-pinky",
      hand: "right",
    },
    { code: "Equal", label: "¿", shiftLabel: "¡", finger: "right-pinky", hand: "right" },
    { code: "Backspace", label: "Backspace", finger: "right-pinky", hand: "right", width: "w-20" },
  ],
  // Fila superior (QWERTY)
  [
    { code: "Tab", label: "Tab", finger: "left-pinky", hand: "left", width: "w-16" },
    {
      code: "KeyQ",
      label: "q",
      shiftLabel: "Q",
      altGrLabel: "@",
      finger: "left-pinky",
      hand: "left",
    },
    { code: "KeyW", label: "w", shiftLabel: "W", finger: "left-ring", hand: "left" },
    {
      code: "KeyE",
      label: "e",
      shiftLabel: "E",
      altGrLabel: "€",
      finger: "left-middle",
      hand: "left",
    },
    { code: "KeyR", label: "r", shiftLabel: "R", finger: "left-index", hand: "left" },
    { code: "KeyT", label: "t", shiftLabel: "T", finger: "left-index", hand: "left" },
    { code: "KeyY", label: "y", shiftLabel: "Y", finger: "right-index", hand: "right" },
    { code: "KeyU", label: "u", shiftLabel: "U", finger: "right-index", hand: "right" },
    { code: "KeyI", label: "i", shiftLabel: "I", finger: "right-middle", hand: "right" },
    { code: "KeyO", label: "o", shiftLabel: "O", finger: "right-ring", hand: "right" },
    { code: "KeyP", label: "p", shiftLabel: "P", finger: "right-pinky", hand: "right" },
    {
      code: "BracketLeft",
      label: "´",
      shiftLabel: "¨",
      altGrLabel: "{",
      finger: "right-pinky",
      hand: "right",
    },
    {
      code: "BracketRight",
      label: "+",
      shiftLabel: "*",
      altGrLabel: "}",
      finger: "right-pinky",
      hand: "right",
    },
  ],
  // Fila central (Home Row con Ñ)
  [
    { code: "CapsLock", label: "Caps", finger: "left-pinky", hand: "left", width: "w-18" },
    { code: "KeyA", label: "a", shiftLabel: "A", finger: "left-pinky", hand: "left" },
    { code: "KeyS", label: "s", shiftLabel: "S", finger: "left-ring", hand: "left" },
    { code: "KeyD", label: "d", shiftLabel: "D", finger: "left-middle", hand: "left" },
    { code: "KeyF", label: "f", shiftLabel: "F", finger: "left-index", hand: "left" },
    { code: "KeyG", label: "g", shiftLabel: "G", finger: "left-index", hand: "left" },
    { code: "KeyH", label: "h", shiftLabel: "H", finger: "right-index", hand: "right" },
    { code: "KeyJ", label: "j", shiftLabel: "J", finger: "right-index", hand: "right" },
    { code: "KeyK", label: "k", shiftLabel: "K", finger: "right-middle", hand: "right" },
    { code: "KeyL", label: "l", shiftLabel: "L", finger: "right-ring", hand: "right" },
    { code: "Semicolon", label: "ñ", shiftLabel: "Ñ", finger: "right-pinky", hand: "right" },
    {
      code: "Quote",
      label: "{",
      shiftLabel: "[",
      altGrLabel: "^",
      finger: "right-pinky",
      hand: "right",
    },
    {
      code: "Backslash",
      label: "}",
      shiftLabel: "]",
      altGrLabel: "`",
      finger: "right-pinky",
      hand: "right",
    },
    { code: "Enter", label: "Enter", finger: "right-pinky", hand: "right", width: "w-20 sm:w-24" },
  ],
  // Fila inferior (con tecla ISO < >)
  [
    {
      code: "ShiftLeft",
      label: "Shift",
      finger: "left-pinky",
      hand: "left",
      width: "w-16 sm:w-18",
    },
    { code: "IntlBackslash", label: "<", shiftLabel: ">", finger: "left-pinky", hand: "left" },
    { code: "KeyZ", label: "z", shiftLabel: "Z", finger: "left-pinky", hand: "left" },
    { code: "KeyX", label: "x", shiftLabel: "X", finger: "left-ring", hand: "left" },
    { code: "KeyC", label: "c", shiftLabel: "C", finger: "left-middle", hand: "left" },
    { code: "KeyV", label: "v", shiftLabel: "V", finger: "left-index", hand: "left" },
    { code: "KeyB", label: "b", shiftLabel: "B", finger: "left-index", hand: "left" },
    { code: "KeyN", label: "n", shiftLabel: "N", finger: "right-index", hand: "right" },
    { code: "KeyM", label: "m", shiftLabel: "M", finger: "right-index", hand: "right" },
    { code: "Comma", label: ",", shiftLabel: ";", finger: "right-middle", hand: "right" },
    { code: "Period", label: ".", shiftLabel: ":", finger: "right-ring", hand: "right" },
    { code: "Slash", label: "-", shiftLabel: "_", finger: "right-pinky", hand: "right" },
    {
      code: "ShiftRight",
      label: "Shift",
      finger: "right-pinky",
      hand: "right",
      width: "w-24 sm:w-28",
    },
  ],
  // Fila de barra espaciadora
  [
    { code: "ControlLeft", label: "Ctrl", finger: "left-pinky", hand: "left", width: "w-16" },
    { code: "AltLeft", label: "Alt", finger: "left-pinky", hand: "left", width: "w-14" },
    { code: "Space", label: "Space", finger: "thumb", hand: "right", width: "flex-1" },
    {
      code: "AltRight",
      label: "AltGr",
      altGrLabel: "AltGr",
      finger: "right-pinky",
      hand: "right",
      width: "w-16",
    },
    { code: "ControlRight", label: "Ctrl", finger: "right-pinky", hand: "right", width: "w-16" },
  ],
];

export function getKeyboardRows(layout: KeyboardLayout = "latam"): KeyLayoutDef[][] {
  return layout === "us" ? US_KEYBOARD_ROWS : LATAM_KEYBOARD_ROWS;
}

// -------------------------------------------------------------------------------------
// Mapeos de guía rápida por distribución
// -------------------------------------------------------------------------------------

function buildGuidanceMap(rows: KeyLayoutDef[][]): Record<string, KeyGuidance> {
  const map: Record<string, KeyGuidance> = {};

  for (const row of rows) {
    for (const key of row) {
      if (key.label && key.label.length === 1) {
        map[key.label] = {
          code: key.code,
          keyLabel: key.label,
          finger: key.finger,
          fingerName: FINGER_NAMES[key.finger],
          hand: key.hand,
          shiftRequired: false,
          altGrRequired: false,
          hint: `Usa el ${FINGER_NAMES[key.finger].toLowerCase()}`,
        };
      }
      if (key.shiftLabel && key.shiftLabel.length === 1) {
        map[key.shiftLabel] = {
          code: key.code,
          keyLabel: key.shiftLabel,
          finger: key.finger,
          fingerName: FINGER_NAMES[key.finger],
          hand: key.hand,
          shiftRequired: true,
          altGrRequired: false,
          hint: `Shift + ${key.label} con ${FINGER_NAMES[key.finger].toLowerCase()}`,
        };
      }
      if (key.altGrLabel && key.altGrLabel.length === 1) {
        map[key.altGrLabel] = {
          code: key.code,
          keyLabel: key.altGrLabel,
          finger: key.finger,
          fingerName: FINGER_NAMES[key.finger],
          hand: key.hand,
          shiftRequired: false,
          altGrRequired: true,
          hint: `AltGr + ${key.label} con ${FINGER_NAMES[key.finger].toLowerCase()}`,
        };
      }
    }
  }

  // Teclas estándar
  map[" "] = {
    code: "Space",
    keyLabel: "Espacio",
    finger: "thumb",
    fingerName: "Pulgar",
    hand: "right",
    shiftRequired: false,
    altGrRequired: false,
    hint: "Barra espaciadora con el pulgar",
  };

  map["\n"] = {
    code: "Enter",
    keyLabel: "Enter",
    finger: "right-pinky",
    fingerName: "Meñique derecho",
    hand: "right",
    shiftRequired: false,
    altGrRequired: false,
    hint: "Enter con el meñique derecho",
  };

  map["\t"] = {
    code: "Tab",
    keyLabel: "Tab",
    finger: "left-pinky",
    fingerName: "Meñique izquierdo",
    hand: "left",
    shiftRequired: false,
    altGrRequired: false,
    hint: "Tab con el meñique izquierdo para indentar",
  };

  return map;
}

const US_GUIDANCE_MAP = buildGuidanceMap(US_KEYBOARD_ROWS);
const LATAM_GUIDANCE_MAP = buildGuidanceMap(LATAM_KEYBOARD_ROWS);

// Adaptaciones específicas para programación en Latam (Chile):
// En Chile es sumamente común AltGr + Q para @, y combinaciones AltGr para delimitadores:
const LATAM_SPECIAL_OVERRIDES: Record<string, Partial<KeyGuidance>> = {
  ";": {
    code: "Comma",
    keyLabel: ";",
    shiftRequired: true,
    altGrRequired: false,
    hint: "Shift + , con dedo medio derecho",
  },
  ":": {
    code: "Period",
    keyLabel: ":",
    shiftRequired: true,
    altGrRequired: false,
    hint: "Shift + . con dedo anular derecho",
  },
  "@": {
    code: "KeyQ",
    keyLabel: "@",
    shiftRequired: false,
    altGrRequired: true,
    hint: "AltGr + Q con meñique izquierdo (o AltGr + 2)",
  },
  "{": {
    code: "BracketLeft",
    keyLabel: "{",
    shiftRequired: false,
    altGrRequired: true,
    hint: "AltGr + ' o tecla { con meñique derecho",
  },
  "}": {
    code: "BracketRight",
    keyLabel: "}",
    shiftRequired: false,
    altGrRequired: true,
    hint: "AltGr + + o tecla } con meñique derecho",
  },
  "[": {
    code: "Digit8",
    keyLabel: "[",
    shiftRequired: false,
    altGrRequired: true,
    hint: "AltGr + 8 o tecla [ con medio derecho",
  },
  "]": {
    code: "Digit9",
    keyLabel: "]",
    shiftRequired: false,
    altGrRequired: true,
    hint: "AltGr + 9 o tecla ] con anular derecho",
  },
  "(": {
    code: "Digit8",
    keyLabel: "(",
    shiftRequired: true,
    altGrRequired: false,
    hint: "Shift + 8 con dedo medio derecho",
  },
  ")": {
    code: "Digit9",
    keyLabel: ")",
    shiftRequired: true,
    altGrRequired: false,
    hint: "Shift + 9 con dedo anular derecho",
  },
  "=": {
    code: "Digit0",
    keyLabel: "=",
    shiftRequired: true,
    altGrRequired: false,
    hint: "Shift + 0 con meñique derecho",
  },
  "/": {
    code: "Digit7",
    keyLabel: "/",
    shiftRequired: true,
    altGrRequired: false,
    hint: "Shift + 7 con índice derecho",
  },
  "<": {
    code: "IntlBackslash",
    keyLabel: "<",
    shiftRequired: false,
    altGrRequired: false,
    hint: "Tecla < al lado de la Z con meñique izquierdo",
  },
  ">": {
    code: "IntlBackslash",
    keyLabel: ">",
    shiftRequired: true,
    altGrRequired: false,
    hint: "Shift + < con meñique izquierdo",
  },
  "|": {
    code: "Backquote",
    keyLabel: "|",
    shiftRequired: false,
    altGrRequired: false,
    hint: "Tecla | al lado del 1 con meñique izquierdo",
  },
  "\\": {
    code: "Minus",
    keyLabel: "\\",
    shiftRequired: false,
    altGrRequired: true,
    hint: "AltGr + ? con meñique derecho",
  },
  "~": {
    code: "BracketRight",
    keyLabel: "~",
    shiftRequired: false,
    altGrRequired: true,
    hint: "AltGr + + con meñique derecho",
  },
  "`": {
    code: "Backslash",
    keyLabel: "`",
    shiftRequired: false,
    altGrRequired: true,
    hint: "AltGr + } con meñique derecho",
  },
};

// Aplicar overrides al mapa de Latam
for (const [char, override] of Object.entries(LATAM_SPECIAL_OVERRIDES)) {
  const existing = LATAM_GUIDANCE_MAP[char];
  if (existing) {
    LATAM_GUIDANCE_MAP[char] = { ...existing, ...override };
  } else {
    LATAM_GUIDANCE_MAP[char] = {
      code: override.code ?? "Quote",
      keyLabel: override.keyLabel ?? char,
      finger: "right-pinky",
      fingerName: "Meñique derecho",
      hand: "right",
      shiftRequired: override.shiftRequired ?? false,
      altGrRequired: override.altGrRequired ?? false,
      hint: override.hint ?? `Presiona ${char}`,
    };
  }
}

/**
 * Obtiene la orientación y el dedo correspondiente para pulsar un carácter
 * según la distribución de teclado seleccionada ("latam" por defecto o "us").
 */
export function getKeyGuidance(char: string, layout: KeyboardLayout = "latam"): KeyGuidance | null {
  const map = layout === "us" ? US_GUIDANCE_MAP : LATAM_GUIDANCE_MAP;
  const base = map[char];

  if (!base) {
    // Si es letra mayúscula
    const lower = char.toLowerCase();
    const lowerGuidance = map[lower];
    if (lowerGuidance) {
      return {
        ...lowerGuidance,
        keyLabel: char,
        shiftRequired: true,
        hint: `Shift + ${lower.toUpperCase()} con ${lowerGuidance.fingerName.toLowerCase()}`,
      };
    }
    return null;
  }

  return base;
}

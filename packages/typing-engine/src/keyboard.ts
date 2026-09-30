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
  width?: string; // para CSS de teclas especiales (Tab, Caps, Shift, Space, etc.)
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

/** Distribución estándar US QWERTY */
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
  // Fila central / Fila Base (Home Row)
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

// Mapa rápido de carácter a guía de tecla
const CHAR_TO_GUIDANCE_MAP: Record<string, KeyGuidance> = {};

// Inicializar el mapa para US QWERTY con soporte para AltGr en distribución Latam/ES
for (const row of US_KEYBOARD_ROWS) {
  for (const key of row) {
    if (key.label && key.label.length === 1) {
      CHAR_TO_GUIDANCE_MAP[key.label] = {
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
      CHAR_TO_GUIDANCE_MAP[key.shiftLabel] = {
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
  }
}

// Casos especiales frecuentes
CHAR_TO_GUIDANCE_MAP[" "] = {
  code: "Space",
  keyLabel: "Espacio",
  finger: "thumb",
  fingerName: "Pulgar",
  hand: "right",
  shiftRequired: false,
  altGrRequired: false,
  hint: "Presiona la barra espaciadora con el pulgar",
};

CHAR_TO_GUIDANCE_MAP["\n"] = {
  code: "Enter",
  keyLabel: "Enter",
  finger: "right-pinky",
  fingerName: "Meñique derecho",
  hand: "right",
  shiftRequired: false,
  altGrRequired: false,
  hint: "Presiona Enter con el meñique derecho",
};

CHAR_TO_GUIDANCE_MAP["\t"] = {
  code: "Tab",
  keyLabel: "Tab",
  finger: "left-pinky",
  fingerName: "Meñique izquierdo",
  hand: "left",
  shiftRequired: false,
  altGrRequired: false,
  hint: "Presiona Tab con el meñique izquierdo para indentar",
};

// Soporte para caracteres AltGr en teclados de distribución española/latam:
// En teclados latinoamericanos: AltGr + Q = @, AltGr + 2 = @, AltGr + ' = {, AltGr + ¡ = }
// Ofrecemos orientación combinada:
const LATAM_ALTGR_OVERRIDES: Record<string, Partial<KeyGuidance>> = {
  "@": { hint: "Shift + 2 (US) o AltGr + Q / 2 (Latam)" },
  "{": { hint: "Shift + [ (US) o AltGr + ' (Latam)" },
  "}": { hint: "Shift + ] (US) o AltGr + ¡ (Latam)" },
  "[": { hint: "Tecla [ (US) o AltGr + 8 / ` (Latam)" },
  "]": { hint: "Tecla ] (US) o AltGr + 9 / + (Latam)" },
  "\\": { hint: "Tecla \\ (US) o AltGr + ? (Latam)" },
  "|": { hint: "Shift + \\ (US) o AltGr + 1 (Latam)" },
  "~": { hint: "Shift + ` (US) o AltGr + + (Latam)" },
};

export function getKeyGuidance(char: string): KeyGuidance | null {
  const base = CHAR_TO_GUIDANCE_MAP[char];
  if (!base) {
    // Si es mayúscula pero no está registrada
    const lower = char.toLowerCase();
    const lowerGuidance = CHAR_TO_GUIDANCE_MAP[lower];
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

  const override = LATAM_ALTGR_OVERRIDES[char];
  if (override) {
    return { ...base, ...override };
  }

  return base;
}

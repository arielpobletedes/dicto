/** Lista de caracteres especiales comúnmente utilizados en programación. */
export const PROGRAMMER_SPECIAL_CHARS = [
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "<",
  ">",
  "|",
  "\\",
  "/",
  "`",
  "~",
  "^",
  "$",
  "#",
  "@",
  "&",
  ";",
  ":",
  '"',
  "'",
  "=",
  "_",
  "+",
  "-",
  "*",
  "%",
  "!",
  "?",
] as const;

export type ProgrammerSpecialChar = (typeof PROGRAMMER_SPECIAL_CHARS)[number];

const PROGRAMMER_CHAR_SET = new Set<string>(PROGRAMMER_SPECIAL_CHARS);

/** Comprueba si un carácter es un símbolo especial de programador. */
export function isProgrammerSpecialChar(char: string): boolean {
  return PROGRAMMER_CHAR_SET.has(char);
}

export interface ProgrammerSymbolInfo {
  char: string;
  name: string;
  category: "delimiter" | "operator" | "punctuation" | "identifier" | "literal";
  usage: string;
}

export const PROGRAMMER_SYMBOL_INFO: Record<string, ProgrammerSymbolInfo> = {
  "{": {
    char: "{",
    name: "Llave de apertura",
    category: "delimiter",
    usage: "Bloques de código y objetos",
  },
  "}": {
    char: "}",
    name: "Llave de cierre",
    category: "delimiter",
    usage: "Cierre de bloques y objetos",
  },
  "[": {
    char: "[",
    name: "Corchete de apertura",
    category: "delimiter",
    usage: "Arreglos e indexación",
  },
  "]": {
    char: "]",
    name: "Corchete de cierre",
    category: "delimiter",
    usage: "Cierre de arreglos e indexación",
  },
  "(": {
    char: "(",
    name: "Paréntesis de apertura",
    category: "delimiter",
    usage: "Argumentos de funciones y grupos",
  },
  ")": {
    char: ")",
    name: "Paréntesis de cierre",
    category: "delimiter",
    usage: "Cierre de argumentos y grupos",
  },
  "<": {
    char: "<",
    name: "Menor que / Ángulo",
    category: "operator",
    usage: "Comparación y tipos genéricos",
  },
  ">": {
    char: ">",
    name: "Mayor que / Ángulo",
    category: "operator",
    usage: "Comparación y tipos genéricos",
  },
  "|": {
    char: "|",
    name: "Barra vertical (Pipe)",
    category: "operator",
    usage: "Unión de tipos, OR a nivel de bits, pipes Bash",
  },
  "\\": {
    char: "\\",
    name: "Barra invertida (Backslash)",
    category: "punctuation",
    usage: "Secuencias de escape en cadenas",
  },
  "/": {
    char: "/",
    name: "Barra diagonal (Slash)",
    category: "operator",
    usage: "División y expresiones regulares",
  },
  "`": {
    char: "`",
    name: "Acento grave (Backtick)",
    category: "literal",
    usage: "Template literals e interpolación",
  },
  "~": {
    char: "~",
    name: "Virgulilla (Tilde)",
    category: "operator",
    usage: "Directorio home y NOT de bits",
  },
  "^": { char: "^", name: "Circunflejo (Caret)", category: "operator", usage: "XOR y potencias" },
  $: {
    char: "$",
    name: "Signo de dólar",
    category: "identifier",
    usage: "Variables de entorno e interpolación",
  },
  "#": {
    char: "#",
    name: "Almohadilla (Hash)",
    category: "punctuation",
    usage: "Comentarios en Bash/Python y campos privados",
  },
  "@": { char: "@", name: "Arroba (At)", category: "identifier", usage: "Decoradores y menciones" },
  "&": {
    char: "&",
    name: "Ampersand",
    category: "operator",
    usage: "Operadores lógicos AND y referencias",
  },
  ";": {
    char: ";",
    name: "Punto y coma",
    category: "punctuation",
    usage: "Fin de sentencia en JS/TS/SQL/C/Java",
  },
  ":": {
    char: ":",
    name: "Dos puntos",
    category: "punctuation",
    usage: "Definición de tipos y bloques de Python",
  },
  "=": {
    char: "=",
    name: "Signo igual",
    category: "operator",
    usage: "Asignación y comparaciones",
  },
  _: {
    char: "_",
    name: "Guion bajo (Underscore)",
    category: "identifier",
    usage: "Snake_case y variables descartadas",
  },
};

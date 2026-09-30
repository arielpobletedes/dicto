import { z } from "zod";

/** Distribuciones de teclado soportadas. */
export const KEYBOARD_LAYOUTS = ["latam", "us"] as const;
export const keyboardLayoutSchema = z.enum(KEYBOARD_LAYOUTS);
export type KeyboardLayout = z.infer<typeof keyboardLayoutSchema>;

export function isKeyboardLayout(value: unknown): value is KeyboardLayout {
  return keyboardLayoutSchema.safeParse(value).success;
}

/** Distribución por defecto (Español Latinoamericano / Chile). */
export const DEFAULT_KEYBOARD_LAYOUT: KeyboardLayout = "latam";

export interface KeyboardLayoutOption {
  id: KeyboardLayout;
  name: string;
  shortName: string;
  flag: string;
  description: string;
}

export const KEYBOARD_LAYOUT_OPTIONS: KeyboardLayoutOption[] = [
  {
    id: "latam",
    name: "Español Latinoamericano (Chile)",
    shortName: "Latam (CL)",
    flag: "🇨🇱",
    description:
      "Distribución ISO estándar en Chile: tecla Ñ dedicada, delimitadores con AltGr/Shift",
  },
  {
    id: "us",
    name: "Inglés Norteamericano (ANSI)",
    shortName: "US QWERTY",
    flag: "🇺🇸",
    description: "Distribución ANSI estándar: teclas dedicadas para ; { } [ ] < > /",
  },
];

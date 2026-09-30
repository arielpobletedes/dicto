"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DEFAULT_KEYBOARD_LAYOUT, isKeyboardLayout, type KeyboardLayout } from "@ptt/shared";

export const KEYBOARD_LAYOUT_STORAGE_KEY = "ptt_keyboard_layout";
const CUSTOM_EVENT_NAME = "ptt-keyboard-layout-change";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(CUSTOM_EVENT_NAME, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CUSTOM_EVENT_NAME, callback);
  };
}

function getSnapshot(): KeyboardLayout {
  if (typeof window === "undefined") {
    return DEFAULT_KEYBOARD_LAYOUT;
  }
  try {
    const stored = localStorage.getItem(KEYBOARD_LAYOUT_STORAGE_KEY);
    if (stored && isKeyboardLayout(stored)) {
      return stored;
    }
  } catch {
    // Ignorar errores de acceso a almacenamiento
  }
  return DEFAULT_KEYBOARD_LAYOUT;
}

function getServerSnapshot(): KeyboardLayout {
  return DEFAULT_KEYBOARD_LAYOUT;
}

interface KeyboardLayoutContextValue {
  layout: KeyboardLayout;
  setLayout: (layout: KeyboardLayout) => void;
}

const KeyboardLayoutContext = createContext<KeyboardLayoutContextValue | undefined>(undefined);

export function KeyboardLayoutProvider({ children }: { children: ReactNode }) {
  const layout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLayout = useCallback((newLayout: KeyboardLayout) => {
    try {
      localStorage.setItem(KEYBOARD_LAYOUT_STORAGE_KEY, newLayout);
      window.dispatchEvent(new Event(CUSTOM_EVENT_NAME));
    } catch {
      // Ignorar errores en entornos con localStorage deshabilitado
    }
  }, []);

  return (
    <KeyboardLayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </KeyboardLayoutContext.Provider>
  );
}

export function useKeyboardLayout(): KeyboardLayoutContextValue {
  const context = useContext(KeyboardLayoutContext);
  if (!context) {
    return {
      layout: DEFAULT_KEYBOARD_LAYOUT,
      setLayout: () => {},
    };
  }
  return context;
}

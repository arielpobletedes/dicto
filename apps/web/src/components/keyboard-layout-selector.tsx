"use client";

import { KEYBOARD_LAYOUT_OPTIONS, type KeyboardLayout } from "@ptt/shared";
import { useKeyboardLayout } from "./keyboard-layout-context";
import { Keyboard } from "lucide-react";

interface KeyboardLayoutSelectorProps {
  variant?: "compact" | "full";
  className?: string;
}

export function KeyboardLayoutSelector({
  variant = "compact",
  className = "",
}: KeyboardLayoutSelectorProps) {
  const { layout, setLayout } = useKeyboardLayout();

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 shadow-xs ${className}`}
        role="group"
        aria-label="Selección de distribución de teclado"
      >
        {KEYBOARD_LAYOUT_OPTIONS.map((option) => {
          const isSelected = layout === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setLayout(option.id as KeyboardLayout)}
              className={`
                flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all
                ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }
              `}
              title={`${option.name}: ${option.description}`}
            >
              <span className="text-sm leading-none">{option.flag}</span>
              <span>{option.shortName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Keyboard className="h-4 w-4 text-blue-400" />
        <span>Distribución de Teclado</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {KEYBOARD_LAYOUT_OPTIONS.map((option) => {
          const isSelected = layout === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setLayout(option.id as KeyboardLayout)}
              className={`
                flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-all
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-950/40 text-white shadow-sm ring-1 ring-blue-500/50"
                    : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }
              `}
            >
              <div className="flex items-center gap-2 font-medium text-xs">
                <span className="text-base leading-none">{option.flag}</span>
                <span className={isSelected ? "text-white font-semibold" : ""}>{option.name}</span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight">{option.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

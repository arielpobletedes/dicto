"use client";

import { type KeyGuidance, type Finger, getKeyboardRows } from "@ptt/typing-engine";
import type { KeyAccuracyStat, KeyboardLayout } from "@ptt/shared";
import { useKeyboardLayout } from "./keyboard-layout-context";

interface VirtualKeyboardProps {
  activeGuidance?: KeyGuidance | null;
  heatmap?: Record<string, KeyAccuracyStat> | null;
  showFingerGuide?: boolean;
  layout?: KeyboardLayout;
}

const FINGER_COLORS: Record<Finger, string> = {
  "left-pinky": "border-rose-500/30 bg-rose-950/20 text-rose-200",
  "left-ring": "border-amber-500/30 bg-amber-950/20 text-amber-200",
  "left-middle": "border-emerald-500/30 bg-emerald-950/20 text-emerald-200",
  "left-index": "border-blue-500/30 bg-blue-950/20 text-blue-200",
  thumb: "border-purple-500/30 bg-purple-950/20 text-purple-200",
  "right-index": "border-blue-500/30 bg-blue-950/20 text-blue-200",
  "right-middle": "border-emerald-500/30 bg-emerald-950/20 text-emerald-200",
  "right-ring": "border-amber-500/30 bg-amber-950/20 text-amber-200",
  "right-pinky": "border-rose-500/30 bg-rose-950/20 text-rose-200",
};

export function VirtualKeyboard({
  activeGuidance,
  heatmap,
  showFingerGuide = true,
  layout: propLayout,
}: VirtualKeyboardProps) {
  const { layout: contextLayout } = useKeyboardLayout();
  const currentLayout = propLayout ?? contextLayout;

  const keyboardRows = getKeyboardRows(currentLayout);

  const activeCode = activeGuidance?.code;
  const needShift = activeGuidance?.shiftRequired;
  const needAltGr = activeGuidance?.altGrRequired;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur-md">
      {/* Barra superior de guía táctil */}
      {showFingerGuide && activeGuidance && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/80 px-4 py-2 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Siguiente tecla:</span>
            <kbd className="rounded bg-blue-600 px-2 py-0.5 font-mono text-sm font-bold text-white shadow">
              {activeGuidance.keyLabel}
            </kbd>
            <span className="text-slate-400">({activeGuidance.hint})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Dedo:</span>
            <span className="font-semibold text-blue-400">{activeGuidance.fingerName}</span>
          </div>
        </div>
      )}

      {/* Filas del teclado virtual */}
      <div className="flex flex-col gap-1.5 select-none font-mono">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const isKeyActive = key.code === activeCode;
              const isModifierActive =
                (needShift && (key.code === "ShiftLeft" || key.code === "ShiftRight")) ||
                (needAltGr && key.code === "AltRight");

              // Estilo de mapa de calor si está activo
              let heatmapColor = "";
              if (heatmap) {
                const stat =
                  heatmap[key.label] ||
                  (key.shiftLabel && heatmap[key.shiftLabel]) ||
                  (key.altGrLabel && heatmap[key.altGrLabel]);
                if (stat) {
                  if (stat.accuracy >= 95) {
                    heatmapColor = "bg-emerald-600/40 border-emerald-500 text-emerald-200";
                  } else if (stat.accuracy >= 80) {
                    heatmapColor = "bg-yellow-600/40 border-yellow-500 text-yellow-200";
                  } else {
                    heatmapColor = "bg-rose-600/40 border-rose-500 text-rose-200 animate-pulse";
                  }
                }
              }

              const baseColor = FINGER_COLORS[key.finger];
              const customWidth = key.width ?? "w-10 sm:w-11";

              return (
                <div
                  key={key.code}
                  className={`
                    relative flex flex-col items-center justify-between py-1 px-1 rounded-lg border h-10 sm:h-12 text-xs transition-all duration-150
                    ${customWidth}
                    ${heatmapColor || baseColor}
                    ${
                      isKeyActive
                        ? "!bg-blue-600 !border-blue-400 !text-white shadow-lg shadow-blue-500/50 scale-105 z-10 ring-2 ring-blue-300 font-bold"
                        : ""
                    }
                    ${
                      isModifierActive
                        ? "!bg-amber-600 !border-amber-400 !text-white animate-bounce ring-2 ring-amber-300"
                        : ""
                    }
                  `}
                >
                  {/* Fila superior de símbolos auxiliares (Shift y AltGr) */}
                  <div className="flex w-full justify-between items-center px-0.5 text-[9px] leading-none opacity-75">
                    <span>{key.shiftLabel ?? ""}</span>
                    <span className="text-amber-300/90 font-mono">{key.altGrLabel ?? ""}</span>
                  </div>

                  {/* Símbolo principal */}
                  <span className="font-semibold text-xs sm:text-sm leading-none">{key.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Leyenda de dedos */}
      {showFingerGuide && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span>Meñique</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span>Anular</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            <span>Medio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500/80" />
            <span>Índice</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500/80" />
            <span>Pulgar (Espacio)</span>
          </div>
        </div>
      )}
    </div>
  );
}

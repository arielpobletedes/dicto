"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  createTypingSession,
  handleKeystroke,
  getKeyGuidance,
  type KeyGuidance,
  type SessionMetrics,
  type TypingSession,
} from "@ptt/typing-engine";
import { VirtualKeyboard } from "./virtual-keyboard";
import {
  RotateCcw,
  Trophy,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  Timer,
  Gauge,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface PracticeViewProps {
  exercise: {
    id: string;
    levelId: string;
    title: string;
    description: string | null;
    content: string;
    language: string;
    difficulty: string;
    tier: string;
  };
  nextExerciseId?: string | null;
}

export function PracticeView({ exercise, nextExerciseId }: PracticeViewProps) {
  const [session, setSession] = useState<TypingSession>(() =>
    createTypingSession(exercise.content),
  );
  const [metrics, setMetrics] = useState<SessionMetrics>(() => ({
    wpm: 0,
    grossWpm: 0,
    accuracy: 100,
    consistency: 100,
    durationMs: 0,
    errors: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    progressPercent: 0,
  }));
  const [guidance, setGuidance] = useState<KeyGuidance | null>(() =>
    exercise.content.length > 0 ? getKeyGuidance(exercise.content[0]!) : null,
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    isNewBestWpm?: boolean;
    error?: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const restartExercise = useCallback(() => {
    const fresh = createTypingSession(exercise.content);
    setSession(fresh);
    setIsCompleted(false);
    setSaveResult(null);
    setMetrics({
      wpm: 0,
      grossWpm: 0,
      accuracy: 100,
      consistency: 100,
      durationMs: 0,
      errors: 0,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      progressPercent: 0,
    });
    setGuidance(fresh.targetText.length > 0 ? getKeyGuidance(fresh.targetText[0]!) : null);
  }, [exercise.content]);

  const saveAttempt = useCallback(
    async (finalSession: TypingSession, finalMetrics: SessionMetrics) => {
      setIsSaving(true);
      try {
        const keyStatsArray = Object.values(finalSession.keyStats).map((s) => ({
          key: s.key,
          correctCount: s.correctCount,
          errorCount: s.errorCount,
        }));

        const res = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exerciseId: exercise.id,
            wpm: finalMetrics.wpm,
            accuracy: finalMetrics.accuracy,
            errors: finalMetrics.errors,
            durationMs: Math.max(500, finalMetrics.durationMs),
            keyStats: keyStatsArray,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setSaveResult(data);
        } else {
          setSaveResult({ error: "No se pudo guardar el intento" });
        }
      } catch {
        setSaveResult({ error: "Error de conexión" });
      } finally {
        setIsSaving(false);
      }
    },
    [exercise.id],
  );

  // Actualizar el cronómetro mientras se escribe
  useEffect(() => {
    if (session.startTime && !session.isFinished) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const durationMs = now - session.startTime!;
        setMetrics((prev) => ({
          ...prev,
          durationMs,
        }));
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.startTime, session.isFinished]);

  // Manejo de pulsación de teclado
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Permitir F5, F12, atajos del sistema
      if (e.key === "F5" || e.key === "F12" || (e.ctrlKey && e.key === "r")) return;

      // Escape para reiniciar
      if (e.key === "Escape") {
        restartExercise();
        return;
      }

      // Prevenir scroll en barra espaciadora y cambio de foco en Tab
      if (e.key === " " || e.key === "Tab") {
        e.preventDefault();
      }

      const {
        session: newSession,
        keyGuidance,
        metrics: newMetrics,
        completedJustNow,
      } = handleKeystroke(session, {
        key: e.key,
        code: e.code,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        timestamp: Date.now(),
      });

      setSession(newSession);
      setGuidance(keyGuidance);
      setMetrics(newMetrics);

      if (completedJustNow) {
        setIsCompleted(true);
        saveAttempt(newSession, newMetrics);
      }
    },
    [session, restartExercise, saveAttempt],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6 outline-none select-none"
    >
      {/* Cabecera del ejercicio */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/catalog"
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Catálogo
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{exercise.title}</h1>
            {exercise.description && (
              <p className="text-xs text-slate-400">{exercise.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-950/80 px-2.5 py-1 text-xs font-mono font-medium text-blue-300 border border-blue-800/50">
            {exercise.language}
          </span>
          <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300 capitalize">
            {exercise.difficulty}
          </span>
          <button
            onClick={restartExercise}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            title="Reiniciar (Esc)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* HUD de métricas en vivo */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Gauge className="h-3.5 w-3.5 text-blue-400" />
            <span>WPM Neto</span>
          </div>
          <span className="font-mono text-2xl font-bold text-white">{metrics.wpm}</span>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Precisión</span>
          </div>
          <span className="font-mono text-2xl font-bold text-emerald-400">{metrics.accuracy}%</span>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
            <span>Errores</span>
          </div>
          <span className="font-mono text-2xl font-bold text-rose-400">{metrics.errors}</span>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Timer className="h-3.5 w-3.5 text-amber-400" />
            <span>Tiempo</span>
          </div>
          <span className="font-mono text-2xl font-bold text-amber-300">
            {formatTime(metrics.durationMs)}
          </span>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Progreso</span>
            <span className="font-mono font-medium">{metrics.progressPercent}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-blue-500 transition-all duration-150"
              style={{ width: `${metrics.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Caja de código para mecanografía */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl font-mono text-lg sm:text-xl leading-relaxed">
        {!session.startTime && (
          <div className="absolute top-3 right-4 flex items-center gap-1.5 text-xs text-blue-400 font-sans animate-pulse">
            <span>Empieza a teclear para iniciar el cronómetro...</span>
          </div>
        )}

        <div className="flex flex-wrap whitespace-pre-wrap break-all select-none">
          {Array.from(session.targetText).map((char, index) => {
            const state = session.charStates[index];
            const isCursor = index === session.cursorIndex;

            let charColor = "text-slate-500"; // pending
            if (state === "correct") {
              charColor = "text-emerald-400 bg-emerald-950/20";
            } else if (state === "incorrect") {
              charColor = "text-rose-300 bg-rose-900/60 underline decoration-rose-500 font-bold";
            }

            const displayChar = char === "\n" ? "↵\n" : char;

            return (
              <span
                key={index}
                className={`
                  relative transition-colors duration-75 rounded-xs
                  ${charColor}
                  ${
                    isCursor
                      ? "border-l-2 border-blue-400 bg-blue-500/20 font-bold animate-pulse text-white shadow"
                      : ""
                  }
                `}
              >
                {displayChar}
              </span>
            );
          })}
        </div>
      </div>

      {/* Teclado virtual sincronizado */}
      <VirtualKeyboard activeGuidance={guidance} />

      {/* Modal / Resumen final de ejercicio */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex w-full max-w-lg flex-col gap-6 rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/30">
                <Trophy className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white tracking-tight">
                ¡Ejercicio Completado!
              </h2>
              <p className="text-sm text-slate-400 mt-1">{exercise.title}</p>
              {saveResult?.isNewBestWpm && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/40">
                  <Sparkles className="h-3.5 w-3.5" />
                  ¡Nuevo récord personal de velocidad!
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col items-center rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-xs text-slate-400">WPM</span>
                <span className="font-mono text-2xl font-bold text-blue-400">{metrics.wpm}</span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-xs text-slate-400">Precisión</span>
                <span className="font-mono text-2xl font-bold text-emerald-400">
                  {metrics.accuracy}%
                </span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-xs text-slate-400">Errores</span>
                <span className="font-mono text-2xl font-bold text-rose-400">{metrics.errors}</span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-xs text-slate-400">Tiempo</span>
                <span className="font-mono text-2xl font-bold text-amber-300">
                  {formatTime(metrics.durationMs)}
                </span>
              </div>
            </div>

            {/* Estado de guardado */}
            {isSaving && (
              <p className="text-center text-xs text-slate-400 animate-pulse">
                Guardando tu intento en el servidor...
              </p>
            )}
            {!isSaving && saveResult && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Progreso guardado correctamente</span>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={restartExercise}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Repetir ejercicio
              </button>

              {nextExerciseId ? (
                <Link
                  href={`/practice/${nextExerciseId}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/catalog"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
                >
                  <span>Ver catálogo</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

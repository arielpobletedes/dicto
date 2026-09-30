"use client";

import { useState } from "react";
import { type ExerciseSummary } from "@ptt/shared";
import { Lock, Eye, EyeOff, Sparkles } from "lucide-react";

interface AdminExercisesTableProps {
  initialExercises: ExerciseSummary[];
}

export function AdminExercisesTable({ initialExercises }: AdminExercisesTableProps) {
  const [exercisesList, setExercisesList] = useState(initialExercises);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const togglePublish = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/exercises/${id}/toggle-publish`, {
        method: "POST",
      });
      if (res.ok) {
        setExercisesList((prev) =>
          prev.map((e) => (e.id === id ? { ...e, published: !e.published } : e)),
        );
      }
    } catch {
      alert("Error al cambiar estado de publicación");
    } finally {
      setLoadingId(null);
    }
  };

  const toggleTier = async (id: string, currentTier: "free" | "premium") => {
    setLoadingId(id);
    const newTier = currentTier === "free" ? "premium" : "free";
    try {
      const res = await fetch(`/api/admin/exercises/${id}/tier`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
      });
      if (res.ok) {
        setExercisesList((prev) => prev.map((e) => (e.id === id ? { ...e, tier: newTier } : e)));
      }
    } catch {
      alert("Error al cambiar nivel (tier) del ejercicio");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Título</th>
            <th className="px-4 py-3 font-semibold">Lenguaje</th>
            <th className="px-4 py-3 font-semibold">Dificultad</th>
            <th className="px-4 py-3 font-semibold">Acceso (Tier)</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
          {exercisesList.map((exercise) => {
            const isLoading = loadingId === exercise.id;
            return (
              <tr key={exercise.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3 font-sans font-medium text-white">{exercise.title}</td>
                <td className="px-4 py-3 text-slate-300">{exercise.language}</td>
                <td className="px-4 py-3 text-slate-400 capitalize">{exercise.difficulty}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleTier(exercise.id, exercise.tier)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-sans text-xs font-semibold transition-colors ${
                      exercise.tier === "premium"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                    }`}
                  >
                    {exercise.tier === "premium" ? (
                      <>
                        <Lock className="h-3 w-3" />
                        Premium
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        Gratuito
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-sans ${
                      exercise.published
                        ? "text-emerald-400 bg-emerald-950/40"
                        : "text-slate-400 bg-slate-800/40"
                    }`}
                  >
                    {exercise.published ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => togglePublish(exercise.id)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-sans text-xs text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    {exercise.published ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Despublicar
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Publicar
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

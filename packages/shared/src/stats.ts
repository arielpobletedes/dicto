import type { Attempt } from "./attempts";

export interface KeyAccuracyStat {
  key: string;
  correctCount: number;
  errorCount: number;
  totalPresses: number;
  accuracy: number;
}

export interface UserDashboardStats {
  totalAttempts: number;
  completedExercisesCount: number;
  totalExercisesAvailable: number;
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  totalPracticeTimeMs: number;
  recentAttempts: Array<
    Attempt & {
      exerciseTitle: string;
      levelTitle: string;
    }
  >;
  keyHeatmap: Record<string, KeyAccuracyStat>;
  weakestKeys: KeyAccuracyStat[];
}

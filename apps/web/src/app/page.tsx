import { calculateWpm } from "@ptt/typing-engine";
import { USER_ROLES } from "@ptt/shared";

// Prueba visible de que los paquetes del monorepo están enlazados.
const demoWpm = calculateWpm(300, 60_000);

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-4">
        <p className="text-brand-500 font-mono text-sm tracking-widest uppercase">
          Fase 0 · Fundaciones
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">ProTouchTyping</h1>
        <p className="text-lg opacity-80">
          Aprende y mejora tu dactilografía escribiendo código real: llaves, corchetes, símbolos e
          indentación.
        </p>
      </div>

      <pre className="overflow-x-auto rounded-xl border border-slate-500/30 bg-slate-500/10 p-4 font-mono text-sm">
        <code>{`const { motor, roles } = monorepo;\n// motor → ${demoWpm} WPM de ejemplo\n// roles → ${USER_ROLES.join(", ")}`}</code>
      </pre>
    </main>
  );
}

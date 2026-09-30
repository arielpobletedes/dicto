import Link from "next/link";
import { Code2, Keyboard, Flame, CheckCircle, ArrowRight, Sparkles, Cpu } from "lucide-react";
import { PracticeView } from "@/components/practice-view";

const DEMO_EXERCISE = {
  id: "demo-hero-1",
  levelId: "level-hero",
  title: "Pruébalo ahora: Arrow function con delimitadores",
  description: "Escribe directamente en esta caja para probar el motor de mecanografía:",
  content: "const square = (x: number) => x * x;",
  language: "typescript",
  difficulty: "beginner",
  tier: "free",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Sección Hero */}
      <section className="relative overflow-hidden pt-12 sm:pt-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
            <Cpu className="h-3.5 w-3.5" />
            <span>Dactilografía de alto rendimiento para desarrolladores</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-tight">
            Domina el teclado escribiendo{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              código real
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
            Aprende a digitar llaves, corchetes, indentación y símbolos de programación sin mirar el
            teclado. Diseñado desde cero para programadores.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-500 transition-all hover:scale-105"
            >
              <Keyboard className="h-4 w-4" />
              <span>Explorar ejercicios gratuitos</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
            >
              Crear cuenta de estudiante
            </Link>
          </div>

          {/* Playground en vivo en el Hero */}
          <div className="mt-14 w-full max-w-4xl">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-2 sm:p-4 shadow-2xl backdrop-blur-xl">
              <PracticeView exercise={DEMO_EXERCISE} />
            </div>
          </div>
        </div>
      </section>

      {/* Características principales */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-mono font-semibold uppercase text-blue-400 tracking-wider">
            ¿Por qué ProTouchTyping?
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Los cursos tradicionales no enseñan a teclear código
          </h2>
          <p className="mt-3 max-w-2xl text-slate-400 text-sm sm:text-base">
            El texto convencional no contiene llaves anidadas, sintaxis de tipos, flechas ni
            comandos de terminal. Nosotros entrenamos la memoria muscular que necesitas en tu IDE.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Símbolos Especiales</h3>
            <p className="text-sm text-slate-400">
              Entrena caracteres como{" "}
              <code className="rounded bg-slate-800 px-1 py-0.5 font-mono text-xs text-blue-300">
                {"{ } [ ] ( ) < > | \\ ` ~ ^ $ # @ & ; :"}
              </code>{" "}
              y combinaciones AltGr para teclados internacionales.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
              <Keyboard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Guía Dedo a Dedo</h3>
            <p className="text-sm text-slate-400">
              Teclado virtual reactivo con sugerencia inmediata del dedo exacto para cada tecla,
              ayudándote a abandonar malos hábitos de digitación.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-400">
              <Flame className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Mapa de Calor Personal</h3>
            <p className="text-sm text-slate-400">
              Detecta con precisión matemática qué teclas generan la mayor cantidad de fallos y
              recibe recomendaciones enfocadas en tus puntos ciegos.
            </p>
          </div>
        </div>
      </section>

      {/* Planes: Gratuito vs Premium */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-mono font-semibold uppercase text-emerald-400 tracking-wider">
            Modelo de Acceso
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Comienza gratis, escala a profesional
          </h2>
          <p className="mt-3 max-w-xl text-slate-400 text-sm">
            Accede a los ejercicios fundamentales sin costo y suscríbete para acceder al catálogo
            completo de código avanzado.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Plan Gratuito */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/40 p-8">
            <div>
              <div className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Plan Gratuito
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">Básico Dev</h3>
              <p className="mt-2 text-sm text-slate-400">
                Ideal para aprender la fila base y los delimitadores fundamentales de programación.
              </p>
              <div className="mt-6 font-mono text-4xl font-bold text-white">$0</div>

              <ul className="mt-8 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Acceso a ejercicios de nivel básico</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Cálculo de WPM neto y precisión</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Teclado virtual interactivo</span>
                </li>
              </ul>
            </div>

            <Link
              href="/catalog"
              className="mt-8 block rounded-xl border border-slate-700 bg-slate-800 py-3 text-center text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              Comenzar a practicar
            </Link>
          </div>

          {/* Plan Pro */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-blue-500/40 bg-gradient-to-b from-blue-950/40 to-slate-900/60 p-8 shadow-2xl shadow-blue-500/10">
            <div className="absolute -top-3 right-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 px-3 py-0.5 text-xs font-bold text-slate-950 shadow-md">
              RECOMENDADO
            </div>

            <div>
              <div className="inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/40">
                Plan Pro
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">Pro Developer</h3>
              <p className="mt-2 text-sm text-slate-300">
                Desbloquea el catálogo completo con código de producción en TypeScript, Python, SQL
                y Bash.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold text-white">$9</span>
                <span className="text-slate-400 text-sm">/ mes</span>
              </div>

              <ul className="mt-8 space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="font-medium text-white">Todos los ejercicios desbloqueados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Mapa de calor de teclado avanzado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Detección de teclas débiles y recomendaciones</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Historial completo de progreso</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="mt-8 block rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-colors"
            >
              Desbloquear Acceso Pro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

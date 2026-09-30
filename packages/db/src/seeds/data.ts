import type { ExerciseLanguage, ExerciseDifficulty, ExerciseTier } from "@ptt/shared";

export interface SeedLevel {
  id: string;
  title: string;
  description: string;
  slug: string;
  order: number;
}

export interface SeedExercise {
  id: string;
  levelId: string;
  title: string;
  description: string;
  content: string;
  language: ExerciseLanguage;
  difficulty: ExerciseDifficulty;
  tier: ExerciseTier;
  order: number;
  published: boolean;
}

export const SEED_LEVELS: SeedLevel[] = [
  {
    id: "level-1",
    title: "Fila Base y Teclas Clave",
    description:
      "Domina la posición de descanso de los dedos y el uso fundamental del punto y coma.",
    slug: "fila-base",
    order: 1,
  },
  {
    id: "level-2",
    title: "Delimitadores y Símbolos de Programación",
    description: "Llaves, corchetes, paréntesis y ángulos esenciales para cualquier lenguaje.",
    slug: "simbolos-programador",
    order: 2,
  },
  {
    id: "level-3",
    title: "Operadores y Caracteres Especiales",
    description: "Compara, asigna y usa operadores lógicos, flechas y símbolos como $, #, @, &.",
    slug: "operadores-especiales",
    order: 3,
  },
  {
    id: "level-4",
    title: "Código JavaScript y TypeScript",
    description:
      "Estructuras reales de TypeScript: interfaces, arrow functions, async/await y objetos.",
    slug: "javascript-typescript",
    order: 4,
  },
  {
    id: "level-5",
    title: "Python e Indentación",
    description: "Bloques indentados, dos puntos, f-strings, comprensión de listas y clases.",
    slug: "python-indentacion",
    order: 5,
  },
  {
    id: "level-6",
    title: "SQL y Terminal Bash",
    description: "Consultas relacionales con cláusulas JOIN y comandos con pipes y banderas.",
    slug: "sql-y-bash",
    order: 6,
  },
];

export const SEED_EXERCISES: SeedExercise[] = [
  // Nivel 1: Fila Base
  {
    id: "ex-1-1",
    levelId: "level-1",
    title: "Posición de descanso (asdf jkl;)",
    description: "Practica los dedos índice, medio, anular y meñique en la fila central.",
    content: "asdf jkl; asdf jkl; fdsa ;lkj asdf jkl;",
    language: "text",
    difficulty: "beginner",
    tier: "free",
    order: 1,
    published: true,
  },
  {
    id: "ex-1-2",
    levelId: "level-1",
    title: "Palabras con la fila base",
    description: "Construye secuencias usando únicamente las teclas de reposo.",
    content: "dad sad fad glad lass fall ask flask salad",
    language: "text",
    difficulty: "beginner",
    tier: "free",
    order: 2,
    published: true,
  },
  {
    id: "ex-1-3",
    levelId: "level-1",
    title: "Primeras sentencias con punto y coma",
    description: "Uso del meñique derecho para cerrar sentencias de programación.",
    content: "let ask; let all; let fall; let sad; let add;",
    language: "typescript",
    difficulty: "beginner",
    tier: "free",
    order: 3,
    published: true,
  },

  // Nivel 2: Delimitadores
  {
    id: "ex-2-1",
    levelId: "level-2",
    title: "Pares de delimitadores",
    description: "Alternancia de paréntesis, corchetes, llaves y ángulos.",
    content: "() {} [] <> (()) {{}} [[]] <<>> ({[]})",
    language: "text",
    difficulty: "beginner",
    tier: "free",
    order: 1,
    published: true,
  },
  {
    id: "ex-2-2",
    levelId: "level-2",
    title: "Arreglos y objetos literales",
    description: "Declaración combinada de colecciones y propiedades.",
    content: "const items = [{ id: 1, name: 'alpha' }, { id: 2, tags: ['ptt', 'code'] }];",
    language: "typescript",
    difficulty: "intermediate",
    tier: "free",
    order: 2,
    published: true,
  },
  {
    id: "ex-2-3",
    levelId: "level-2",
    title: "Tipos genéricos anidados (Pro)",
    description: "Sintaxis avanzada de genéricos y condicionales en TypeScript.",
    content:
      "type DeepReadonly<T> = { readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]; };",
    language: "typescript",
    difficulty: "advanced",
    tier: "premium",
    order: 3,
    published: true,
  },

  // Nivel 3: Operadores Especiales
  {
    id: "ex-3-1",
    levelId: "level-3",
    title: "Comparaciones y operadores lógicos",
    description: "Escribe rápidamente combinaciones de ===, !==, &&, || y !.",
    content: "const isValid = (a === b && c !== d) || (!hasError && count >= 10);",
    language: "typescript",
    difficulty: "intermediate",
    tier: "free",
    order: 1,
    published: true,
  },
  {
    id: "ex-3-2",
    levelId: "level-3",
    title: "Arrow functions y operadores matemáticos",
    description: "Flechas gruesas con transformaciones numéricas.",
    content: "const calculate = (x: number, y: number) => (x * 2) + (y / 4) - (x % 3);",
    language: "typescript",
    difficulty: "intermediate",
    tier: "free",
    order: 2,
    published: true,
  },
  {
    id: "ex-3-3",
    levelId: "level-3",
    title: "Símbolos especiales y template literals (Pro)",
    description: "Caracteres como backticks, $, #, @, ^ y ternarios encadenados.",
    content:
      "const msg = `User @${handle} #${id}: ${balance > 0 ? `$${balance.toFixed(2)}` : 'N/A'}`;",
    language: "typescript",
    difficulty: "advanced",
    tier: "premium",
    order: 3,
    published: true,
  },

  // Nivel 4: Código JS / TS
  {
    id: "ex-4-1",
    levelId: "level-4",
    title: "Petición asíncrona con fetch",
    description: "Bloque async/await con manejo de respuestas en JSON.",
    content:
      "async function fetchUser(id: string) {\n  const res = await fetch(`/api/users/${id}`);\n  if (!res.ok) throw new Error('Not found');\n  return res.json();\n}",
    language: "typescript",
    difficulty: "intermediate",
    tier: "free",
    order: 1,
    published: true,
  },
  {
    id: "ex-4-2",
    levelId: "level-4",
    title: "Métodos funcionales de arrays",
    description: "Encadenamiento de filter, map y reduce.",
    content:
      "const activeTotal = users\n  .filter((u) => u.isActive)\n  .map((u) => u.score)\n  .reduce((sum, score) => sum + score, 0);",
    language: "typescript",
    difficulty: "intermediate",
    tier: "free",
    order: 2,
    published: true,
  },
  {
    id: "ex-4-3",
    levelId: "level-4",
    title: "Interfaz de repositorio genérico (Pro)",
    description: "Contrato de software para capas de acceso a datos con Promesas.",
    content:
      "export interface Repository<T, ID> {\n  findById(id: ID): Promise<T | null>;\n  save(entity: T): Promise<T>;\n  delete(id: ID): Promise<boolean>;\n}",
    language: "typescript",
    difficulty: "advanced",
    tier: "premium",
    order: 3,
    published: true,
  },

  // Nivel 5: Python
  {
    id: "ex-5-1",
    levelId: "level-5",
    title: "Función con type hints y f-strings",
    description: "Estructura básica de función tipada en Python 3.",
    content:
      'def format_greeting(name: str, count: int) -> str:\n    return f"Bienvenido {name}, tienes {count} ejercicios pendientes."',
    language: "python",
    difficulty: "beginner",
    tier: "free",
    order: 1,
    published: true,
  },
  {
    id: "ex-5-2",
    levelId: "level-5",
    title: "Bucle for con condicionales",
    description: "Práctica de indentación de 4 espacios y operadores en Python.",
    content:
      "evens = []\nfor num in range(1, 21):\n    if num % 2 == 0:\n        evens.append(num * num)\nprint(evens)",
    language: "python",
    difficulty: "intermediate",
    tier: "free",
    order: 2,
    published: true,
  },
  {
    id: "ex-5-3",
    levelId: "level-5",
    title: "Clase y decoradores en Python (Pro)",
    description: "Métodos especiales __init__, propiedades y decorador @property.",
    content:
      "class BankAccount:\n    def __init__(self, owner: str, initial: float = 0.0):\n        self.owner = owner\n        self._balance = initial\n\n    @property\n    def balance(self) -> float:\n        return self._balance",
    language: "python",
    difficulty: "advanced",
    tier: "premium",
    order: 3,
    published: true,
  },

  // Nivel 6: SQL y Bash
  {
    id: "ex-6-1",
    levelId: "level-6",
    title: "Consulta SELECT con filtros y orden",
    description: "Sintaxis estándar ANSI SQL con WHERE y ORDER BY.",
    content:
      "SELECT id, email, role, created_at FROM users WHERE role = 'student' AND email_verified = true ORDER BY created_at DESC LIMIT 10;",
    language: "sql",
    difficulty: "beginner",
    tier: "free",
    order: 1,
    published: true,
  },
  {
    id: "ex-6-2",
    levelId: "level-6",
    title: "Pipeline de Bash con grep y awk",
    description: "Uso de tuberías |, comillas y banderas en terminal Linux/macOS.",
    content:
      "cat /var/log/nginx/access.log | grep \" 500 \" | awk '{print $1, $7}' | sort | uniq -c | sort -nr",
    language: "bash",
    difficulty: "intermediate",
    tier: "free",
    order: 2,
    published: true,
  },
  {
    id: "ex-6-3",
    levelId: "level-6",
    title: "Consulta SQL analítica con agregación y JOIN (Pro)",
    description: "Consulta compleja para reportes y estadísticas de desempeño.",
    content:
      "SELECT l.title AS level_name, COUNT(a.id) AS total_attempts, ROUND(AVG(a.wpm)::numeric, 1) AS avg_wpm FROM levels l INNER JOIN exercises e ON e.level_id = l.id LEFT JOIN attempts a ON a.exercise_id = e.id GROUP BY l.id, l.title ORDER BY l.order ASC;",
    language: "sql",
    difficulty: "advanced",
    tier: "premium",
    order: 3,
    published: true,
  },
];

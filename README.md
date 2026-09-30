# ProTouchTyping

Aplicación para aprender y mejorar la dactilografía con ejercicios de distinto nivel, pensada para programadores (llaves, corchetes, símbolos e indentación). Los usuarios registrados acceden a ejercicios básicos gratuitos; el resto del contenido es de pago.

El plan de implementación se encuentra en [`docs/PLAN0.md`](./docs/PLAN0.md) y [`docs/PLAN.md`](./docs/PLAN.md).

## Stack

- Monorepo con **pnpm workspaces**
- **TypeScript** estricto en todo el repo
- **Next.js** (App Router) sirviendo frontend React, API, auth y servicios
- **Tailwind CSS v4** con configuración compartida
- **PostgreSQL en Neon** + **Drizzle ORM**
- **Better Auth** con adaptador de Drizzle y roles (`admin` y `student`)
- **Zod** para esquemas compartidos y validación anti-trampas
- **Vitest** para tests unitarios y de integración, **ESLint** + **Prettier** + **Husky** para calidad
- **Concurrently** para orquestar el desarrollo

## Estructura del Monorepo

```
protouchtyping/
├─ apps/
│  └─ web/                 Next.js (App Router): UI React + API + Auth + Práctica
│     ├─ src/app/
│     │  ├─ (auth)/        Login y Registro con Better Auth
│     │  ├─ admin/         Panel de administración de niveles y ejercicios (rol admin)
│     │  ├─ catalog/       Catálogo de niveles con candados en premium (Server Component)
│     │  ├─ dashboard/     Dashboard del estudiante (WPM, precisión, mapa de calor)
│     │  ├─ practice/[id]/ Pantalla de práctica aislada (Client Component)
│     │  ├─ api/           Route Handlers: auth, intentos, administración, health
│     │  └─ page.tsx       Landing con playground de mecanografía en vivo
│     ├─ src/components/   Navbar, VirtualKeyboard, PracticeView, AdminExercisesTable
│     ├─ src/server/       Servicios: auth, ejercicios, intentos, estadísticas, permisos
│     └─ src/lib/          Configuración de Better Auth (cliente y servidor)
├─ packages/
│  ├─ config/              Configuración compartida: tsconfig, ESLint, Prettier y Tailwind
│  ├─ db/                  Drizzle ORM: schemas (auth, niveles, ejercicios, intentos,
│  │                       estadísticas de teclas, progreso, suscripciones), migraciones y seeds
│  ├─ shared/              Esquemas Zod, tipos y lógica de autorización de acceso
│  └─ typing-engine/       Lógica pura del motor: cálculo de WPM neto/bruto, precisión,
│                          ritmo/consistencia, gestión de errores, retroceso, tabulaciones y teclado
├─ .env.example            Variables de entorno requeridas
├─ package.json            Scripts raíz con concurrently
└─ pnpm-workspace.yaml     Definición de paquetes y catálogo de versiones
```

## Requisitos

- Node.js 22 o superior
- pnpm 12

## Puesta en marcha

1. Instalar dependencias:

   ```bash
   pnpm install
   ```

2. Configurar variables de entorno:

   ```bash
   # En Windows PowerShell:
   Copy-Item .env.example apps/web/.env.local
   # O en Linux/macOS:
   cp .env.example apps/web/.env.local
   ```

3. (Opcional si usas base de datos Neon):
   Configura `DATABASE_URL` en tu archivo `.env` y ejecuta las migraciones y la semilla:

   ```bash
   pnpm --filter @ptt/db db:generate
   pnpm --filter @ptt/db db:migrate
   pnpm --filter @ptt/db db:seed
   ```

   _Nota: La aplicación cuenta con un modo autónomo/demo que permite navegar el catálogo, registrar intentos y probar ejercicios incluso sin una instancia de base de datos activa._

4. Iniciar el entorno de desarrollo:

   ```bash
   pnpm dev
   ```

   La app queda disponible en <http://localhost:3000>.

## Cuentas de Demostración

La aplicación incluye dos cuentas preconfiguradas para pruebas locales:

- **Estudiante:** `student@protouchtyping.dev` (contraseña: `DemoPassword123!`)
- **Administrador:** `admin@protouchtyping.dev` (contraseña: `DemoPassword123!`)

## Scripts del Proyecto

| Comando                             | Descripción                                                   |
| ----------------------------------- | ------------------------------------------------------------- |
| `pnpm dev`                          | Servidor de Next.js + typecheck en modo watch de los paquetes |
| `pnpm build`                        | Build de producción optimizado con Turbopack                  |
| `pnpm lint`                         | Verificación con ESLint en todo el monorepo                   |
| `pnpm format`                       | Formateo con Prettier                                         |
| `pnpm typecheck`                    | Chequeo de tipos estricto con `tsc --noEmit`                  |
| `pnpm test`                         | Ejecución de suites de prueba con Vitest                      |
| `pnpm check`                        | Pipeline de calidad: lint + formato + typecheck + tests       |
| `pnpm --filter @ptt/db db:generate` | Generar archivos de migración SQL Drizzle                     |
| `pnpm --filter @ptt/db db:migrate`  | Aplicar migraciones a la base de datos Neon                   |
| `pnpm --filter @ptt/db db:seed`     | Cargar catálogo semilla de niveles/ejercicios                 |

## Características Clave del Motor de Mecanografía

1. **Caracteres especiales para programadores:** Soporte para `{ } [ ] ( ) < > | \ / ` ~ ^ $ # @ & ; : " ' = _`, identificadores y operadores.
2. **Indentación y tabulaciones:** Manejo inteligente de la tecla `Tab` para coincidir con 2 o 4 espacios de código.
3. **Métricas en tiempo real:** WPM neto ((caracteres correctos / 5) por minuto), WPM bruto, precisión porcentual y consistencia rítmica.
4. **Teclado virtual y guía de dedos:** Iluminación reactiva de la siguiente tecla y el dedo correspondiente (meñique, anular, medio, índice, pulgar) con indicaciones para combinaciones `Shift` y `AltGr`.
5. **Autorización estricta en el servidor:** El contenido de los ejercicios premium nunca se serializa ni se envía al cliente a menos que el usuario tenga los derechos de acceso correspondientes.

# ProTouchTyping

Aplicación para aprender y mejorar la dactilografía con ejercicios de distinto nivel, pensada para programadores (llaves, corchetes, símbolos e indentación). Los usuarios registrados acceden a ejercicios básicos gratuitos; el resto del contenido es de pago.

El plan completo está en [`PLAN.md`](./PLAN.md).

## Stack

- Monorepo con **pnpm workspaces**
- **TypeScript** estricto en todo el repo
- **Next.js** (App Router) sirviendo frontend React, API, auth y pagos
- **Tailwind CSS v4**
- **PostgreSQL en Neon** + **Drizzle ORM** (Fase 1)
- **Zod** para validación compartida
- **Vitest** para tests, **ESLint** + **Prettier** + **Husky** para calidad
- **Concurrently** para orquestar el desarrollo

## Estructura

```
apps/
  web/                 Next.js: UI React + API + auth + pagos
packages/
  config/              tsconfig, ESLint, Prettier y tema Tailwind compartidos
  db/                  Drizzle: schema, migraciones y seeds (Fase 1)
  shared/              Esquemas Zod, tipos y constantes (roles, niveles)
  typing-engine/       Lógica pura: WPM, precisión, comparación de texto
```

## Requisitos

- Node.js 22 o superior (ver `.nvmrc`)
- pnpm 12 (`corepack enable` lo activa automáticamente según `packageManager`)

## Empezar

```bash
pnpm install
cp .env.example apps/web/.env.local   # en Windows: copy .env.example apps\web\.env.local
pnpm dev
```

La app queda en <http://localhost:3000> y el healthcheck en <http://localhost:3000/api/health>.

## Scripts

| Comando          | Descripción                                                   |
| ---------------- | ------------------------------------------------------------- |
| `pnpm dev`       | Servidor de Next.js + typecheck en modo watch de los paquetes |
| `pnpm build`     | Build de producción de `apps/web`                             |
| `pnpm lint`      | ESLint en todo el monorepo                                    |
| `pnpm format`    | Prettier (escribe cambios). `format:check` solo verifica      |
| `pnpm typecheck` | `tsc --noEmit` en cada workspace                              |
| `pnpm test`      | Vitest en cada workspace                                      |
| `pnpm check`     | Lint + formato + typecheck + tests (lo mismo que hace el CI)  |

## Convenciones

- Los paquetes internos (`@ptt/*`) se publican como TypeScript fuente (`exports` apunta a `src/`) y Next los compila con `transpilePackages`.
- Los versiones compartidas viven en el `catalog:` de `pnpm-workspace.yaml`.
- Husky ejecuta `lint-staged` antes de cada commit.

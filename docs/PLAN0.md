# Plan de implementación: ProTouchTyping

> Aplicación para aprender y mejorar la dactilografía con ejercicios de distinto nivel, pensada para programadores (caracteres especiales, indentación, código real). Los usuarios se registran y acceden a ejercicios básicos gratuitos; el resto del contenido es de pago.

## 1. Supuestos y decisiones clave

El documento original deja algunos puntos abiertos. Se asume lo siguiente (todo es ajustable):

- **Una sola aplicación Next.js** sirve el frontend (React) y el backend (Route Handlers y Server Actions). Se usa App Router. El "frontend en React" y el "backend en Next.js" conviven en el mismo despliegue.
- **Monorepo con pnpm workspaces.** La app vive en `apps/web` y la lógica reutilizable en `packages/*`. Turborepo es opcional (caché de tareas). Concurrently orquesta los procesos de desarrollo.
- **Autenticación:** Better Auth con adaptador de Drizzle y plugin de roles. Al ser mismo origen, las cookies de sesión no requieren configuración de CORS. Verificar la versión vigente antes de fijarla.
- **Pagos:** proveedor por definir (Stripe, Lemon Squeezy, Paddle, Mercado Pago, etc., según el país donde se constituya el negocio). El plan incluye una capa de "suscripciones y derechos de acceso" independiente del proveedor.
- **Modelo de negocio:** ejercicios gratuitos (niveles básicos) y premium (el resto), mediante suscripción o compra por paquete.
- **Solo teclado físico** en la primera versión (móviles y tablets quedan fuera del alcance inicial).

### Por qué una sola app Next.js

| Ventaja | Detalle |
|---|---|
| Un solo despliegue | Un único proyecto en Vercel, sin coordinar versiones entre web y API. |
| Sin CORS | Mismo origen: cookies `SameSite=Lax` y sesión sin configuración cruzada. |
| Tipos de extremo a extremo | Server Actions y Route Handlers comparten tipos y esquemas Zod con los componentes. |
| Autorización en el servidor | Los Server Components consultan la base de datos directamente y deciden qué contenido enviar. |

**Contrapartida:** la pantalla de práctica es intensiva en cliente (captura de teclado, métricas en vivo). Se implementa como Client Component aislado, mientras que catálogo, dashboard y administración aprovechan Server Components.

## 2. Estructura del monorepo

```
protouchtyping/
├─ apps/
│  └─ web/                    # Next.js (App Router): UI React + API + auth + pagos
│     ├─ src/app/
│     │  ├─ (marketing)/      # landing, precios
│     │  ├─ (auth)/           # login, registro, recuperación
│     │  ├─ (app)/            # catálogo, práctica, dashboard (protegido)
│     │  ├─ admin/            # panel de administración (rol admin)
│     │  └─ api/              # Route Handlers: auth, webhooks de pago, etc.
│     ├─ src/components/
│     ├─ src/server/          # servicios, autorización, acceso a datos
│     └─ src/lib/
├─ packages/
│  ├─ db/                     # Drizzle: schema, migraciones, seeds, cliente Neon
│  ├─ shared/                 # Esquemas Zod, tipos, constantes (roles, niveles)
│  ├─ typing-engine/          # Lógica pura: WPM, precisión, comparación de texto
│  ├─ ui/                     # (opcional) componentes compartidos
│  └─ config/                 # tsconfig base, ESLint, Prettier, preset Tailwind
├─ .github/workflows/         # CI
├─ package.json               # scripts raíz con concurrently
├─ pnpm-workspace.yaml
└─ turbo.json                 # opcional
```

**Concurrently en desarrollo:** con una sola app, sirve para levantar en paralelo el servidor de Next.js, Drizzle Studio y el typecheck en modo watch.

```json
"dev": "concurrently -n web,studio,types -c cyan,magenta,yellow \"pnpm --filter web dev\" \"pnpm --filter db studio\" \"pnpm -r --parallel typecheck:watch\""
```

## 3. Stack por capa

| Capa | Herramientas |
|---|---|
| Lenguaje | TypeScript estricto en todo el repo |
| Frontend | React (Next.js App Router), Tailwind CSS, React Hook Form + Zod, TanStack Query solo donde haga falta estado de cliente |
| Backend | Next.js Route Handlers y Server Actions, validación con Zod, rate limiting |
| Base de datos | PostgreSQL en Neon, Drizzle ORM + drizzle-kit, driver `@neondatabase/serverless` |
| Auth | Better Auth (email y contraseña, OAuth con GitHub y Google, verificación de correo, recuperación de contraseña) |
| Calidad | ESLint, Prettier, Husky + lint-staged, Vitest, Playwright, GitHub Actions |
| Despliegue | Vercel + Neon, con una rama de Neon por entorno |

## 4. Modelo de datos (Drizzle)

- **users, sessions, accounts, verifications:** tablas de la librería de auth. `users.role` es `admin` o `student`.
- **levels:** agrupan ejercicios (ej.: "Fila base", "Símbolos", "Código JS/TS").
- **exercises:** `id`, `levelId`, `title`, `content`, `language` (texto, JS, Python, SQL, Bash…), `difficulty`, `tier` (`free` | `premium`), `order`, `published`.
- **attempts:** `userId`, `exerciseId`, `wpm`, `accuracy`, `errors`, `durationMs`, `createdAt`.
- **key_stats:** por usuario y tecla, con aciertos y errores. Alimenta el mapa de calor y las recomendaciones de práctica.
- **user_progress:** ejercicios completados, mejor marca y nivel desbloqueado.
- **subscriptions / entitlements:** `userId`, `plan`, `status`, `provider`, `providerCustomerId`, `currentPeriodEnd`.
- **payment_events:** registro idempotente de webhooks.

## 5. Fases

### Fase 0: Fundaciones (2–3 días)
- Inicializar el monorepo con pnpm, `tsconfig` base, ESLint, Prettier y Husky.
- Crear `apps/web` (Next.js + Tailwind) y los paquetes `db`, `shared`, `typing-engine` y `config`.
- Configurar el preset de Tailwind compartido y el script `dev` con Concurrently.
- Configurar CI (lint, typecheck, test, build).
- **Entregable:** `pnpm dev` levanta la app y el CI pasa en verde.

### Fase 1: Base de datos (2 días)
- Crear el proyecto en Neon con las ramas `main` y `dev`.
- Definir el schema Drizzle, generar migraciones y escribir seeds con ejercicios de ejemplo.
- Validar variables de entorno con Zod (`env.ts`).
- **Entregable:** migraciones aplicables con un comando y datos semilla cargados.

### Fase 2: Autenticación y roles (3 días)
- Configurar Better Auth en `apps/web` con Drizzle y el Route Handler `/api/auth/[...all]`.
- Implementar registro, login, logout, verificación de email y recuperación de contraseña.
- Añadir roles `admin` y `student` (por defecto `student`).
- Proteger rutas con middleware/proxy (según la versión de Next.js) para una redirección rápida, y **volver a comprobar sesión y rol en el servidor** dentro de cada Server Component, Server Action y Route Handler. El middleware por sí solo no es suficiente como barrera de seguridad.
- Pantallas de auth en el grupo de rutas `(auth)`.
- **Entregable:** un usuario puede registrarse e iniciar sesión, y las rutas de admin están protegidas.

### Fase 3: Motor de mecanografía (4–5 días)
Es el núcleo del producto y vive en `packages/typing-engine`, como lógica pura y testeable:
- Comparación carácter a carácter, gestión de errores y retroceso.
- Métricas: WPM neto (caracteres correctos / 5 por minuto), precisión, errores por tecla y consistencia.
- **Caracteres especiales para programadores:** `{ } [ ] ( ) < > | \ / ` ~ ^ $ # @ & ; : " ' = _`, además de tabulaciones e indentación.
- Diseñar el manejo de entrada con cuidado: `event.key` para el carácter y `event.code` para la tecla física. Considerar teclas muertas, AltGr (frecuente en teclados en español latinoamericano para `{ } [ ] | \ @`) y distintas distribuciones.
- Tests unitarios extensos con Vitest.
- **Entregable:** paquete con cobertura alta, listo para usarse desde la UI.

### Fase 4: Experiencia de práctica (5–6 días)
- Pantalla de ejercicio como **Client Component** (`"use client"`): texto objetivo, cursor, resaltado de errores, métricas en vivo y resumen final.
- Teclado virtual con la tecla siguiente resaltada y el dedo sugerido.
- Catálogo de niveles y ejercicios como **Server Components**, con candados en los premium.
- Dashboard del estudiante: historial, gráficos de WPM y precisión, y mapa de calor de teclas.
- Diseño responsive, modo oscuro y accesibilidad básica.
- **Entregable:** un estudiante puede completar ejercicios gratuitos y ver su progreso.

### Fase 5: Capa de servidor de contenido y progreso (3 días)
- Servicios en `src/server/` (consulta de niveles y ejercicios, registro de intentos, progreso), expuestos mediante Server Components, Server Actions y Route Handlers donde sea necesario.
- Esquemas Zod compartidos en `packages/shared` para validar entradas.
- **Regla crítica:** el servidor no debe enviar el contenido de un ejercicio premium a quien no tenga derecho de acceso. Ocultarlo solo en la UI no basta, y esto incluye no serializarlo en el payload de los Server Components.
- Rate limiting y validación de resultados de intentos para limitar trampas evidentes (ej.: WPM imposible).
- **Entregable:** la UI consume datos reales, sin mocks.

### Fase 6: Pagos y acceso premium (4–5 días)
- Elegir el proveedor y crear los productos y planes.
- Implementar checkout, webhook en un Route Handler con verificación de firma e idempotencia, y sincronización con `subscriptions`.
- Función central `hasAccess(user, exercise)`, usada por todo el código de servidor.
- Portal de facturación y cancelación, y manejo de estados (`active`, `past_due`, `canceled`).
- **Entregable:** un usuario que paga desbloquea contenido premium, y al cancelar lo pierde al terminar el periodo.

### Fase 7: Panel de administración (3–4 días)
- CRUD de niveles y ejercicios (con vista previa), publicar/despublicar y asignar `free` o `premium`.
- Gestión de usuarios y roles.
- Métricas básicas: usuarios, suscriptores y ejercicios más practicados.
- Todas las acciones de admin verifican el rol en el servidor.
- **Entregable:** el administrador gestiona el contenido sin tocar código.

### Fase 8: Calidad, seguridad y lanzamiento (3–4 días)
- Tests E2E con Playwright de los flujos críticos: registro, práctica, pago y bloqueo premium.
- Revisión de seguridad: CSRF en Server Actions y Route Handlers, cabeceras (CSP, HSTS), límites de tasa y gestión de secretos.
- Despliegue en Vercel con variables por entorno y migraciones automatizadas.
- Monitoreo de errores (Sentry) y analítica básica.
- Documentación: README, guía de contribución y `.env.example`.
- **Entregable:** producción funcionando con un checklist de lanzamiento cumplido.

## 6. Estimación

Unas **6–7 semanas** para una persona a tiempo completo. Al eliminar la coordinación entre dos aplicaciones (CORS, cookies entre dominios, dos despliegues), el plan es algo más corto que con web y API separadas. Las fases 3 y 4 concentran el mayor riesgo y valor.

## 7. Puntos críticos a vigilar

1. **Captura de teclado:** distribuciones internacionales, AltGr y teclas muertas. Decidir pronto que solo se soporta teclado físico.
2. **Autorización de contenido premium:** siempre en el servidor, incluyendo lo que se serializa hacia el cliente.
3. **Frontera servidor/cliente en Next.js:** mantener la pantalla de práctica como Client Component pequeño y aislado, y no mezclar acceso a datos dentro de componentes de cliente.
4. **Conexiones a Postgres en serverless:** usar el driver de Neon y su pooling.
5. **Middleware no es autorización:** cada acción sensible vuelve a validar sesión y rol.
6. **Contenido de los ejercicios:** planificar su creación (niveles, lenguajes, longitud), porque puede ser más laborioso que el código.

## 8. Siguiente paso recomendado

Empezar por la Fase 0 y validar cuanto antes el motor de mecanografía (Fase 3) con un prototipo simple, ya que define la calidad percibida del producto.

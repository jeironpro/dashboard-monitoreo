# Plan de implementación por tareas

> Generado siguiendo la convención de la skill **dicresoft/TASK.md** (modo **Sin Jira**).

## Contexto

Frontend de un **dashboard de monitoreo de infraestructura** ("Vigía") que muestra:

- Estado de servidores, uptime y latencia.
- Logs de errores y excepciones.
- Uso de base de datos, APIs y colas de trabajo.
- Alertas de seguridad o fallos.

**Stack:** React 19 + Vite + TypeScript + Yarn + Tailwind v4 + shadcn/ui + anime.js v4.
**Datos:** `src/data/mock-data.json` (MOCK con valores realistas).
**Diseño:** tokens Hallmark (tema Cobalt, género modern-minimal) en `tokens.css`.

## Modo de trabajo

- **Sin Jira**: no hay identificador `ABC-123`.
- Formato de rama: `prefijo/categoria`.
- Formato de commit y título de PR: `prefijo/categoria: mensaje` (imperativo, minúsculas, sin punto final).
- Ciclo por tarea: rama desde `main` → implementar → tests → commit → PR → CI → squash & merge + borrar rama.

## Convención de commits

`<prefijo>/<categoria>: <mensaje>` — ej. `feature/estado-servidores: agrega panel de servidores con uptime y latencia`.

## Tareas

| # | Rama | Commit / título de PR | Entregable | Definición de hecho |
|---|------|-----------------------|------------|---------------------|
| 1 | `chore/scaffold` | `chore/scaffold: inicializa proyecto react vite yarn y shadcn-ui` | Vite + React + TS + Yarn (node-modules), Tailwind v4, `components.json`, alias `@/`, ESLint + Prettier, `.nvmrc`, `.gitignore` | `yarn dev` y `yarn build` funcionan sin errores |
| 2 | `docs/style-guide` | `docs/style-guide: documenta paleta tipografia espaciado y componentes base` | `docs/style-guide.md` | Libro de estilo aprobado antes de componentes visuales |
| 3 | `feature/tokens-diseno` | `feature/tokens-diseno: agrega tokens hallmark y mapeo a shadcn-ui` | `tokens.css` + `src/index.css` | Tokens OKLCH referenciados por nombre, sin valores sueltos |
| 4 | `chore/mock-data` | `chore/mock-data: agrega json mock con datos realistas` | `src/data/mock-data.json` + tipos + cargador tipado | Tipos cubren todos los dominios (servidores, logs, db, apis, colas, alertas) |
| 5 | `feature/layout` | `feature/layout: agrega shell sidebar header y navegacion responsive` | `AppShell`, `Sidebar`, `Header` + Sheet móvil | Navegación usable en 320–1920 px, sin scroll horizontal |
| 6 | `feature/estado-servidores` | `feature/estado-servidores: agrega panel de servidores uptime y latencia` | Resumen de estado, tarjetas de servidores, gráfico de latencia, sparklines | KPIs (uptime %, latencia ms, CPU/RAM/disco) legibles y con color+texto |
| 7 | `feature/logs-errores` | `feature/logs-errores: agrega tabla de logs y excepciones con filtros` | Tabla de logs con niveles, filtros por nivel, excepciones destacadas | Filtrar por nivel funciona; tabla colapsa a tarjetas en móvil |
| 8 | `feature/metricas-uso` | `feature/metricas-uso: agrega paneles de base de datos apis y colas` | Paneles de BD (conexiones, latencia), APIs (RPM, errores) y colas (jobs) | Métricas con barras de progreso y estados |
| 9 | `feature/alertas-seguridad` | `feature/alertas-seguridad: agrega feed de alertas de seguridad` | Feed de alertas por severidad con icono + etiqueta | La severidad no depende solo del color |
| 10 | `feature/animaciones` | `feature/animaciones: agrega animaciones con animejs` | Contadores numéricos, reveal escalonado, pulso de alertas críticas | ≤ 3 primitivas, respeta `prefers-reduced-motion` |
| 11 | `feature/responsive` | `feature/responsive: garantiza responsive en 320 375 414 y 768` | Verificación de los 4 anchos, tablas→tarjetas, sheet móvil | Sin scroll horizontal; CTAs de una sola línea |
| 12 | `test/casos-criticos` | `test/casos-criticos: agrega tests de formatos y estado` | Tests de utilidades (`format`) y hook de datos | `yarn test` pasa; cubre lógica no trivial |
| 13 | `chore/verificacion` | `chore/verificacion: pasa typecheck build y slop test de diseño` | `yarn build` + `yarn lint` + slop test Hallmark 58/58 | Sin errores de tipos; registro en `.hallmark/log.json` |

## Flujo por tarea (resumen de TASK.md)

1. `git checkout main && git pull && git checkout -b <prefijo>/<categoria>`
2. Implementar la funcionalidad.
3. Verificar que los tests pasan.
4. `git add . && git commit -m "<prefijo>/<categoria>: <mensaje>"`
5. `gh pr create --base main --title "<prefijo>/<categoria>: <mensaje>" --body "<descripción>"`
6. Verificar CI; corregir en la misma rama (sin `amend`) si falla.
7. `gh pr merge --squash --delete-branch`

> **Nota:** en esta entrega se implementa el trabajo completo en `main` sin commits/PRs (no se solicitó un push); el plan queda como guía para ejecutar el flujo ticket a ticket.

# Vigía · Dashboard de monitoreo

Frontend de un dashboard de **observabilidad de infraestructura** en tiempo real. Forma parte de un portafolio personal y demuestra buenas prácticas de organización, documentación, diseño y accesibilidad.

## Qué muestra

- **Estado de servidores**: estado (operativo / degradado / crítico), uptime, latencia y uso de CPU, RAM y disco.
- **Latencia**: gráfico de latencia promedio y percentil 95 de la flota.
- **Logs de errores y excepciones**: registro filtrable por nivel + excepciones agrupadas por tipo.
- **Uso de recursos**: bases de datos (conexiones, latencia, replicación), APIs (latencia, RPM, errores, disponibilidad) y colas de trabajo (jobs activos / en espera / fallidos).
- **Alertas de seguridad**: eventos ordenados por severidad, con icono y etiqueta (nunca solo color).

## Stack

- **React 19** + **Vite** + **TypeScript** (modo estricto)
- **Yarn** (Berry, linker `node-modules`) con lockfile commiteado
- **shadcn/ui** (new-york) + **Tailwind CSS v4**
- **anime.js v4** para animaciones (contador, reveal de entrada y pulso de indicadores críticos)
- Datos **MOCK** en `src/data/mock-data.json`, con simulación de actualizaciones en vivo

## Diseño

Sistema de diseño generado con las skills **Hallmark** (género *modern-minimal*, tema *Cobalt*) y **frontend-design**. Los tokens (OKLCH, tipografía, espaciado, easings) viven en `tokens.css` y se mapean a las variables de shadcn/ui en `src/index.css`. El libro de estilo está en `docs/style-guide.md` y el plan de implementación por tareas (convención dicresoft/TASK.md) en `docs/plan-implementacion.md`.

## Convenciones de código

- **Código en inglés**: nombres de variables, funciones, tipos, componentes, claves de datos y valores de enums siempre en inglés (`useDashboardData`, `ServerStatus`, `cpuPct`, …).
- **Comentarios en español**: los comentarios, JSDoc y descripciones de tests se escriben en castellano; no se mezclan idiomas dentro de un mismo archivo.
- **Textos de interfaz en español**: la copia visible (etiquetas, descripciones, `aria-label`) y los datos del MOCK son contenido de producto en castellano, no «código».

## Puesta en marcha

```bash
yarn install   # o: yarn
yarn dev       # servidor de desarrollo
yarn build     # typecheck + build de producción
yarn preview   # sirve dist/
yarn lint      # ESLint
```

## Estructura

```
src/
├── components/
│   ├── ui/          # primitivas shadcn/ui
│   ├── layout/      # sidebar, header, footer, nav
│   └── dashboard/   # paneles: resumen, servidores, métricas, logs, seguridad
├── data/            # mock-data.json + cargador tipado
├── hooks/           # datos en vivo, scroll-spy, contadores animados, reveal
├── lib/             # utils, formateadores, metadatos de estado, envoltura anime.js
└── types/           # modelo de dominio
```

## Responsive

100 % responsive (mobile-first): la barra lateral se convierte en un *sheet* en móvil, las tablas ocultan columnas secundarias, las tarjetas se apilan y se garantiza ausencia de scroll horizontal con `overflow-x: clip`. Toda animación respeta `prefers-reduced-motion`.

## Licencia

MIT — ver [LICENSE](LICENSE).

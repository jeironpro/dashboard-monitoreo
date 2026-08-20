# Libro de estilo — Vigía

> Fuente de verdad de diseño. Tokens implementados en `tokens.css` (OKLCH) y mapeados a variables de shadcn/ui en `src/index.css`.
>
> Diseño generado con la skill **Hallmark** — género **modern-minimal**, tema **Cobalt** (registro técnico de infraestructura) — complementada con la skill **frontend-design**.

## 1. Paleta de colores

Colores en **OKLCH**, anclados a un matiz azul frío (hue ≈ 250–264). Un único acento cobalto; el resto neutros teñidos.

| Token                   | Valor                    | Uso                                          |
| ----------------------- | ------------------------ | -------------------------------------------- |
| `--color-paper`         | `oklch(98% 0.005 250)`   | Fondo principal (blanco frío)                |
| `--color-paper-2`       | `oklch(95.5% 0.006 250)` | Superficie secundaria (cards)                |
| `--color-paper-3`       | `oklch(92% 0.008 250)`   | Superficie hover / fondo sutil               |
| `--color-rule`          | `oklch(88% 0.008 250)`   | Bordes y hairlines                           |
| `--color-neutral`       | `oklch(58% 0.01 255)`    | Texto secundario                             |
| `--color-muted`         | `oklch(45% 0.01 255)`    | Texto atenuado                               |
| `--color-ink`           | `oklch(20% 0.012 258)`   | Texto principal                              |
| `--color-accent`        | `oklch(52% 0.19 264)`    | Acento cobalto: foco, activo, enlaces, datos |
| `--color-accent-strong` | `oklch(47% 0.19 264)`    | Hover del acento                             |
| `--color-success`       | `oklch(50% 0.14 155)`    | Operativo / saludable                        |
| `--color-warning`       | `oklch(58% 0.15 70)`     | Degradado / precaución                       |
| `--color-danger`        | `oklch(52% 0.19 25)`     | Crítico / caído / fallo                      |
| `--color-focus`         | `oklch(52% 0.19 264)`    | Anillo de foco (contraste ≥ 3:1)             |

Reglas:

- El acento ocupa **≤ 5 %** de cualquier vista: es un subrayado/marcador, nunca un bloque de relleno.
- Sin `#000`/`#fff` puros; neutros siempre con croma ≥ 0.005.
- Estados de severidad siempre con **color + icono + texto** (nunca solo color).

## 2. Tipografía

Tres familias (techo de la regla 2+1):

| Rol                           | Fuente         | Peso            |
| ----------------------------- | -------------- | --------------- |
| Display (títulos)             | Space Grotesk  | 500 / 600 / 700 |
| Body (texto e interfaz)       | Inter          | 400 / 500 / 600 |
| Mono (métricas, logs, código) | JetBrains Mono | 400 / 500       |

Escala (ratio 1.25, base 16 px):

`--text-xs 0.75rem · --text-sm 0.875rem · --text-base 1rem · --text-lg 1.25rem · --text-xl 1.5rem · --text-2xl 1.875rem · --text-3xl 2.375rem`

- Headings roman (`font-style: normal`); tracking apretado `-0.02em`.
- Datos numéricos: `font-variant-numeric: tabular-nums` para alinear columnas.
- Contraste: cuerpo ≥ 4.5:1, texto grande/iconos/foco ≥ 3:1.

## 3. Espaciado y grilla

Escala de 4 pt (`--space-*`):

`--space-3xs 2px · 2xs 4px · xs 8px · sm 12px · md 16px · lg 24px · xl 40px · 2xl 64px · 3xl 96px`

- Grid de página con CSS Grid; internos de componentes con Flexbox.
- Asimetría intencional: columna principal (contenido) + carril lateral (sidebar), paneles de distinto span.
- `gap` para hermanos; `margin` solo para ajustes ópticos.
- Z-index con escala nombrada (`--z-base/raised/dropdown/sticky/modal/toast`).

## 4. Breakpoints (mobile-first)

| Breakpoint | `rem`             | Uso                                                  |
| ---------- | ----------------- | ---------------------------------------------------- |
| Base       | < 40rem           | Móvil (320 / 375 / 414 px)                           |
| `md`       | ≥ 48rem (768 px)  | Sidebar visible, grid 2 columnas                     |
| `lg`       | ≥ 64rem (1024 px) | Grid 3–4 columnas, panel principal + resumen lateral |
| `xl`       | ≥ 80rem (1280 px) | Máxima densidad                                      |

Responsive no negociable: sin scroll horizontal (`overflow-x: clip` en `html` y `body`), CTAs de una línea, tablas que colapsan a tarjetas en móvil, `minmax(0, 1fr)` en tracks con contenido.

## 5. Componentes base y estados

### Botones (shadcn `Button`)

- Variantes: `default` (ink sobre paper, hover paper-3), `secondary`, `outline`, `ghost`, `link`.
- Estados: default · hover · `:focus-visible` (anillo instantáneo) · active · disabled · loading.
- Tamaño táctil ≥ 44 px en punteros gruesos.

### Cards (`Card`)

- Borde hairline `--color-rule`, radio 6 px, superficie `--color-paper-2`.
- Sin cards anidadas, sin franja lateral de color.

### Badges de estado (`StatusBadge`)

- Estados: `operational` (success), `degraded` (warning), `critical` (danger), `neutral`.
- Siempre con punto de color + texto además del color de fondo (nunca solo color).

### Tablas (`Table`)

- Números con `tabular-nums`; en móvil colapsan a tarjetas con `data-label`.

### Inputs

- `border-width` constante (1 px) entre estados; foco con `outline` (no `border`); helper con `min-height` reservado.

## 6. Iconografía

- Librería única: **lucide-react** (integrada con shadcn/ui y con un solo trazo de voz). No se mezclan librerías; **no se usan emojis** como iconos.

## 7. Movimiento

- Librería: **anime.js v4** (imports `animate` / `stagger`).
- Primitivas (≤ 3): contador numérico, reveal escalonado de entrada, pulso de alertas críticas.
- Solo `transform` y `opacity`. Easings tokenizados (`--ease-out/in/in-out`); duraciones `--dur-micro/short/long`.
- `prefers-reduced-motion: reduce` colapsa a crossfade ≤ 150 ms.

## 8. Voz y copia

- Castellano, declarativo y específico. Verbos concretos ("Reiniciar", "Ver logs").
- Errores en 3 partes: qué pasó, por qué, qué hacer.
- Sin métricas inventadas; los valores provienen de `src/data/mock-data.json`.

// Envoltura de anime.js v4: centraliza las animaciones y respeta prefers-reduced-motion.
// Primitivas (≤ 3): contador numérico · reveal escalonado de entrada · pulso de indicadores críticos.

import { animate, stagger } from 'animejs'

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Anima un contador numérico de `from` a `to` invocando `onUpdate` por frame. */
export function animateNumber(
  to: number,
  onUpdate: (value: number) => void,
  opts: { from?: number; duration?: number } = {},
): void {
  if (prefersReducedMotion()) {
    onUpdate(to)
    return
  }
  const state = { value: opts.from ?? 0 }
  animate(state, {
    value: to,
    duration: opts.duration ?? 700,
    ease: 'outExpo',
    onUpdate: () => onUpdate(Math.round(state.value)),
  })
}

/** Reveal escalonado de los descendientes `[data-reveal]` del contenedor dado. */
export function reveal(
  root: HTMLElement,
  opts: { staggerMs?: number; duration?: number; translateY?: number } = {},
): void {
  // Idempotente: evita re-ejecutar la animación si ya se reveló (p. ej. StrictMode en dev).
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
    (el) => !el.hasAttribute('data-revealed'),
  )
  if (targets.length === 0) return
  targets.forEach((el) => el.setAttribute('data-revealed', 'true'))

  if (prefersReducedMotion()) {
    targets.forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    return
  }

  animate(targets, {
    opacity: [0, 1],
    y: [opts.translateY ?? 10, 0],
    duration: opts.duration ?? 420,
    delay: stagger(opts.staggerMs ?? 55, { start: 0 }),
    ease: 'outExpo',
  })
}

/** Dibuja una línea SVG (trazo) como parte del reveal de entrada. */
export function drawLine(el: SVGPathElement, opts: { duration?: number } = {}): void {
  const length = el.getTotalLength()
  el.style.strokeDasharray = `${length}`
  el.style.strokeDashoffset = `${length}`
  if (prefersReducedMotion()) {
    el.style.strokeDashoffset = '0'
    el.style.strokeDasharray = 'none'
    return
  }
  animate(el, {
    strokeDashoffset: [length, 0],
    duration: opts.duration ?? 700,
    ease: 'outExpo',
    onComplete: () => {
      el.style.strokeDasharray = 'none'
    },
  })
}

/** Pulso único y sutil de los puntos `[data-pulse]` (indicadores de estado crítico). */
export function pulseIndicators(root: HTMLElement): void {
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-pulse]'))
  if (targets.length === 0 || prefersReducedMotion()) return
  animate(targets, {
    opacity: [1, 0.45, 1, 0.7, 1],
    duration: 1500,
    delay: stagger(110, { start: 0 }),
    ease: 'inOutSine',
  })
}

import { useEffect, useState } from 'react'

// Franja «actual» del viewport: la sección activa es la última cuyo encabezado ya
// superó la barra superior fija (56px) más un respiro. Coincide con .section-anchor.
const ACTIVE_OFFSET = 80

/**
 * Devuelve el id de la sección visible (scroll-spy) para resaltar el sidebar.
 * En la parte superior de la página la primera sección queda activa por defecto.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const update = () => {
      const pos = window.scrollY + ACTIVE_OFFSET
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) break
        if (el.getBoundingClientRect().top + window.scrollY <= pos) current = id
        else break
      }
      setActive(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')])

  return active
}

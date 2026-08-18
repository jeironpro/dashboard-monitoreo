import { useEffect, useState } from 'react'

/** Devuelve el id de la sección visible (scroll-spy) para resaltar el sidebar. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      // Franja central del viewport: la sección activa es la que ocupa esa zona.
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')])

  return active
}

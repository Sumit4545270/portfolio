import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently in view so the nav can highlight it.
 * Picks the entry closest to the top of the viewport rather than the first
 * intersecting one, which keeps the highlight stable on fast scrolls.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const visible = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top)
          else visible.delete(e.target.id)
        }
        if (!visible.size) return
        const best = [...visible.entries()].sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0]
        setActive(best[0])
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

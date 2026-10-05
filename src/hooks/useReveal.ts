import { useEffect } from 'react'

/**
 * Reveals elements carrying `.reveal` as they scroll into view.
 *
 * One shared IntersectionObserver for the whole page rather than one per
 * component, and each element is unobserved once shown.
 *
 * A MutationObserver picks up `.reveal` elements that mount later — the skills
 * list remounts its groups whenever the filter or search changes, and without
 * this those groups would stay at opacity 0 forever.
 *
 * If the visitor prefers reduced motion, everything is revealed immediately and
 * no observers are created.
 */
export function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const show = (el: HTMLElement) => el.classList.add('is-visible')

    if (reduced || !('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>('.reveal').forEach(show)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          const delay = Number(el.dataset.revealDelay ?? 0)
          if (delay) el.style.transitionDelay = `${delay}ms`
          show(el)
          io.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    const register = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.classList.contains('reveal')) {
        if (!root.classList.contains('is-visible')) io.observe(root)
      }
      root
        .querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')
        .forEach((el) => io.observe(el))
    }

    register(document)

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        for (const node of r.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) register(node as Element)
        }
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}

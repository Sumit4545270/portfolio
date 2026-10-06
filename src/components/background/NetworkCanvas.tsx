import { useEffect, useRef } from 'react'

/**
 * The hero's network backdrop: a loose, slowly drifting topology of nodes and
 * connections with occasional packets travelling along the edges. It evokes the
 * layering of an engineering system — application, delivery, platform, security,
 * intelligence — without drawing a literal diagram.
 *
 * Canvas rather than SVG/CSS because this is many small primitives redrawn every
 * frame; one canvas is a single composited layer, where ~100 animated SVG nodes
 * would each be their own style/layout cost. Everything else on the page uses
 * static CSS patterns, so this is the only thing on the site with a frame loop.
 *
 * It yields completely when it should: no loop under prefers-reduced-motion, no
 * loop while the tab is hidden or the hero is scrolled away, and it downgrades
 * or switches off on low-end devices and data-saver connections.
 */

type Tier = 'off' | 'minimal' | 'reduced' | 'rich'

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  /** 0 = application layer … 1 = intelligence layer. Drives colour and size. */
  depth: number
  hub: boolean
  phase: number
}

type Packet = { edge: number; t: number; speed: number }

/** Node budget per viewport width. Mobile stays deliberately sparse. */
function tierFor(width: number): Tier {
  if (width >= 1280) return 'rich'
  if (width >= 768) return 'reduced'
  return 'minimal'
}

const NODE_COUNT: Record<Exclude<Tier, 'off'>, number> = {
  rich: 44,
  reduced: 26,
  minimal: 13,
}

/** Edges only form between nodes closer than this fraction of the diagonal. */
const LINK_DISTANCE = 0.155

function readPalette() {
  const s = getComputedStyle(document.documentElement)
  const dark = document.documentElement.classList.contains('dark')
  return {
    dark,
    accent: s.getPropertyValue('--accent').trim() || '#60a5fa',
    secure: s.getPropertyValue('--secure').trim() || '#34d399',
    violet: dark ? '#8b7cf6' : '#6d5ae0',
    cyan: dark ? '#38bdf8' : '#0ea5e9',
    // Overall strength. Light mode needs far less ink to read as "subtle".
    nodeAlpha: dark ? 0.5 : 0.34,
    edgeAlpha: dark ? 0.24 : 0.16,
    packetAlpha: dark ? 0.85 : 0.6,
  }
}

export function NetworkCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    /* ---------------------------------------------------- capability gating */
    const lowPower = () => {
      const nav = navigator as Navigator & {
        deviceMemory?: number
        connection?: { saveData?: boolean }
      }
      if (nav.connection?.saveData) return true
      if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return true
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true
      return false
    }

    let tier: Tier = lowPower() ? 'off' : tierFor(window.innerWidth)
    let palette = readPalette()
    let width = 0
    let height = 0
    let dpr = 1
    let nodes: Node[] = []
    let edges: [number, number][] = []
    let packets: Packet[] = []
    let raf = 0
    let running = false
    let lastTime = 0
    let scrollOffset = 0
    let inView = true

    /* ------------------------------------------------------------- geometry */
    function build() {
      if (tier === 'off') {
        nodes = []
        edges = []
        packets = []
        return
      }
      const count = NODE_COUNT[tier]
      // Five loose horizontal bands, read top-down as intelligence → application.
      const bands = 5
      nodes = Array.from({ length: count }, (_, i) => {
        const band = Math.floor((i / count) * bands)
        const depth = 1 - band / (bands - 1)
        const bandTop = (band / bands) * height
        const bandHeight = height / bands
        const hub = i % 7 === 3
        return {
          x: Math.random() * width,
          y: bandTop + Math.random() * bandHeight,
          // Drift is intentionally near-imperceptible: px per second, not per frame.
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 3.5,
          r: hub ? 2.6 : 1.5,
          depth,
          hub,
          phase: Math.random() * Math.PI * 2,
        }
      })
      linkEdges()
      const packetCount = tier === 'rich' ? 10 : tier === 'reduced' ? 6 : 0
      packets = Array.from({ length: packetCount }, () => newPacket())
    }

    function linkEdges() {
      edges = []
      if (!nodes.length) return
      const max = LINK_DISTANCE * Math.hypot(width, height)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          if (d < max) edges.push([i, j])
        }
      }
    }

    function newPacket(): Packet {
      return {
        edge: Math.floor(Math.random() * Math.max(edges.length, 1)),
        t: Math.random(),
        speed: 0.05 + Math.random() * 0.07, // full edge traversal in ~8–20s
      }
    }

    /* --------------------------------------------------------------- sizing */
    function resize() {
      const rect = host!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      if (width === 0 || height === 0) return
      // Cap device pixel ratio: 3x on a phone is a lot of fill for a backdrop.
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const next = lowPower() ? 'off' : tierFor(window.innerWidth)
      if (next !== tier || !nodes.length) {
        tier = next
        build()
      } else {
        linkEdges()
      }
      draw(0)
    }

    /* -------------------------------------------------------------- drawing */
    function colourFor(depth: number) {
      // Intelligence layers lean violet/cyan, delivery layers lean accent blue.
      if (depth > 0.72) return palette.violet
      if (depth > 0.45) return palette.cyan
      if (depth < 0.15) return palette.secure
      return palette.accent
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height)
      if (!nodes.length) return

      const t = time / 1000

      // Edges first, so nodes sit on top of their own connections.
      ctx!.lineWidth = 1
      for (const [a, b] of edges) {
        const na = nodes[a]
        const nb = nodes[b]
        const d = Math.hypot(na.x - nb.x, na.y - nb.y)
        const max = LINK_DISTANCE * Math.hypot(width, height)
        const fade = 1 - d / max
        if (fade <= 0) continue
        ctx!.globalAlpha = fade * fade * palette.edgeAlpha
        ctx!.strokeStyle = palette.accent
        ctx!.beginPath()
        ctx!.moveTo(na.x, na.y)
        ctx!.lineTo(nb.x, nb.y)
        ctx!.stroke()
      }

      // Packets travelling along edges.
      for (const p of packets) {
        const edge = edges[p.edge]
        if (!edge) continue
        const na = nodes[edge[0]]
        const nb = nodes[edge[1]]
        const x = na.x + (nb.x - na.x) * p.t
        const y = na.y + (nb.y - na.y) * p.t
        // Fade in and out at the ends so packets never pop.
        const ease = Math.sin(p.t * Math.PI)
        ctx!.globalAlpha = ease * palette.packetAlpha
        ctx!.fillStyle = palette.cyan
        ctx!.beginPath()
        ctx!.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Nodes.
      for (const n of nodes) {
        const pulse = n.hub ? 0.75 + 0.25 * Math.sin(t * 0.6 + n.phase) : 1
        ctx!.globalAlpha = palette.nodeAlpha * (0.45 + n.depth * 0.55) * pulse
        ctx!.fillStyle = colourFor(n.depth)
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx!.fill()

        if (n.hub) {
          ctx!.globalAlpha = palette.nodeAlpha * 0.16 * pulse
          ctx!.beginPath()
          ctx!.arc(n.x, n.y, n.r * 3.4, 0, Math.PI * 2)
          ctx!.fill()
        }
      }

      ctx!.globalAlpha = 1
    }

    /* ----------------------------------------------------------------- loop */
    function step(time: number) {
      if (!running) return
      // Delta-time integration, clamped so a backgrounded tab returning does
      // not teleport every node across the canvas in one frame.
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0
      lastTime = time

      for (const n of nodes) {
        n.x += n.vx * dt
        n.y += n.vy * dt
        if (n.x < -20) n.x = width + 20
        if (n.x > width + 20) n.x = -20
        if (n.y < -20) n.y = height + 20
        if (n.y > height + 20) n.y = -20
      }

      for (const p of packets) {
        p.t += p.speed * dt
        if (p.t > 1) Object.assign(p, newPacket(), { t: 0 })
      }

      // Relink occasionally rather than every frame — it is O(n²) and the
      // geometry barely changes between frames at this drift speed.
      if (Math.floor(time / 1200) !== Math.floor((time - dt * 1000) / 1200)) linkEdges()

      // Subtle parallax: the layer lags the page slightly as you scroll.
      canvas!.style.transform = `translate3d(0, ${scrollOffset * 0.12}px, 0)`

      draw(time)
      raf = requestAnimationFrame(step)
    }

    function start() {
      // Phones render a single static frame: the brief calls for minimal nodes
      // there, and a continuous loop is not worth the main-thread cost.
      if (tier === 'minimal') {
        draw(0)
        return
      }
      if (running || tier === 'off' || motionQuery.matches || document.hidden || !inView) return
      running = true
      lastTime = 0
      raf = requestAnimationFrame(step)
    }

    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    /* -------------------------------------------------------------- wiring */
    const onScroll = () => {
      scrollOffset = window.scrollY
    }

    const onVisibility = () => (document.hidden ? stop() : start())

    const onMotionChange = () => {
      stop()
      if (motionQuery.matches) draw(0) // one static frame, no loop
      else start()
    }

    // Repaint with the new palette when the theme flips.
    const themeObserver = new MutationObserver(() => {
      palette = readPalette()
      if (!running) draw(0)
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // Stop entirely once the hero is scrolled past.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) start()
        else stop()
      },
      { threshold: 0 },
    )
    io.observe(host)

    const ro = new ResizeObserver(resize)
    ro.observe(host)

    resize()
    if (motionQuery.matches) draw(0)
    else start()

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      themeObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fx-canvas pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}

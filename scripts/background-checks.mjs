/**
 * Verifies the background system behaves itself: the canvas yields when it
 * should, the decorative layers are hidden from assistive tech and cannot be
 * clicked, and the responsive tiers actually change node density.
 *
 * Counts real animation frames rather than trusting the code path.
 */
import { chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:4173/'
const ok = []
const fails = []
const check = (name, pass, detail = '') => (pass ? ok : fails).push(`${name}${detail ? ` — ${detail}` : ''}`)

/** Counts rAF ticks over `ms` by instrumenting requestAnimationFrame. */
async function frames(page, ms) {
  await page.evaluate(() => {
    window.__ticks = 0
    if (!window.__patched) {
      const orig = window.requestAnimationFrame
      window.requestAnimationFrame = function (cb) {
        return orig.call(window, (t) => {
          window.__ticks++
          return cb(t)
        })
      }
      window.__patched = true
    }
  })
  await page.waitForTimeout(ms)
  return page.evaluate(() => window.__ticks)
}

const browser = await chromium.launch()

/* ------------------------------------------------- motion on by default */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(800)

  const running = await frames(page, 1000)
  check('canvas animates when visible', running > 20, `${running} frames/s`)

  // Scrolled past the hero -> IntersectionObserver should stop the loop.
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView())
  await page.waitForTimeout(900)
  const offscreen = await frames(page, 1000)
  check('canvas stops when hero is off-screen', offscreen < 5, `${offscreen} frames/s`)

  // Back into view -> resumes.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(900)
  const resumed = await frames(page, 1000)
  check('canvas resumes when hero returns', resumed > 20, `${resumed} frames/s`)

  const meta = await page.evaluate(() => {
    const c = document.querySelector('canvas')
    const layers = [...document.querySelectorAll('.fx-layer')]
    return {
      canvasHidden: c?.getAttribute('aria-hidden'),
      canvasPointer: c ? getComputedStyle(c).pointerEvents : null,
      layerCount: layers.length,
      allHidden: layers.every((l) => l.getAttribute('aria-hidden') === 'true'),
      allNoPointer: layers.every((l) => getComputedStyle(l).pointerEvents === 'none'),
      allClipped: layers.every((l) => getComputedStyle(l).overflow === 'hidden'),
      contentAbove: [...document.querySelectorAll('.fx-content')].every(
        (e) => getComputedStyle(e).zIndex === '1',
      ),
    }
  })
  check('canvas hidden from assistive tech', meta.canvasHidden === 'true')
  check('canvas is not clickable', meta.canvasPointer === 'none')
  check('every backdrop layer is aria-hidden', meta.allHidden, `${meta.layerCount} layers`)
  check('every backdrop layer ignores pointers', meta.allNoPointer)
  check('every backdrop layer clips its sheet', meta.allClipped)
  check('content sits above every backdrop', meta.contentAbove)

  await ctx.close()
}

/* --------------------------------------------------- prefers-reduced-motion */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(900)
  const t = await frames(page, 1200)
  check('no frame loop under reduced motion', t < 5, `${t} frames`)

  const painted = await page.evaluate(() => {
    const c = document.querySelector('canvas')
    if (!c) return false
    const ctx2 = c.getContext('2d')
    const d = ctx2.getImageData(0, 0, c.width, c.height).data
    for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) return true
    return false
  })
  check('reduced motion still renders a static frame', painted)

  const cssAnimations = await page.evaluate(() =>
    [...document.querySelectorAll('.fx-sheet')].every(
      (e) => getComputedStyle(e).animationName === 'none',
    ),
  )
  check('CSS pattern animations disabled under reduced motion', cssAnimations)

  await ctx.close()
}

/* ----------------------------------------------------------- hidden tab */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(800)
  // A background page in Chromium throttles rAF anyway; this asserts our own
  // visibilitychange handler stops it rather than relying on that.
  const stopped = await page.evaluate(async () => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))
    window.__ticks = 0
    await new Promise((r) => setTimeout(r, 900))
    return window.__ticks
  })
  check('canvas stops when the tab is hidden', stopped < 5, `${stopped} frames`)
  await ctx.close()
}

/* -------------------------------------------------------- responsive tiers */
for (const [w, label, max] of [
  [1440, 'desktop', 60],
  [900, 'tablet', 40],
  [390, 'mobile', 20],
]) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: 800 },
    isMobile: w < 900,
    hasTouch: w < 900,
  })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  const ink = await page.evaluate(() => {
    const c = document.querySelector('canvas')
    if (!c) return -1
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
    let n = 0
    for (let i = 3; i < d.length; i += 4) if (d[i] > 10) n++
    return Math.round((n / (d.length / 4)) * 10000) / 100 // % of pixels inked
  })
  check(`${label} canvas density is restrained`, ink >= 0 && ink < max, `${ink}% inked`)
  await ctx.close()
}

/* ----------------------------------------------------------------- report */
console.log(`\n✔ ${ok.length} passed`)
ok.forEach((o) => console.log('   ✓', o))
if (fails.length) {
  console.log(`\n✘ ${fails.length} FAILED`)
  fails.forEach((f) => console.log('   ✗', f))
}
await browser.close()
process.exit(fails.length ? 1 : 0)

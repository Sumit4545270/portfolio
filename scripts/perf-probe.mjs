/**
 * Direct performance measurement under mobile-class CPU throttling, via CDP.
 *
 * Lighthouse on this machine has become flaky (NO_FCP) after a long session of
 * headless Chrome churn, so this measures the same things first-hand: paint
 * timings, long tasks, blocking time, and layout shift.
 *
 * Usage: node scripts/perf-probe.mjs [url] [cpuThrottle]
 */
import { chromium } from 'playwright'

const URL = process.argv[2] || 'http://localhost:4173/'
const THROTTLE = Number(process.argv[3]) || 4
/* "reduce" disables every background animation and the canvas loop, giving a
   same-build control to measure the animation cost against. */
const MOTION = process.argv[4] === 'reduce' ? 'reduce' : 'no-preference'

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
  reducedMotion: MOTION,
})
const page = await ctx.newPage()
const cdp = await ctx.newCDPSession(page)

await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE })

await page.addInitScript(() => {
  window.__perf = { longTasks: [], cls: 0, fcp: 0, lcp: 0 }
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__perf.longTasks.push(e.duration)
  }).observe({ type: 'longtask', buffered: true })
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      if (!e.hadRecentInput) window.__perf.cls += e.value
  }).observe({ type: 'layout-shift', buffered: true })
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      if (e.name === 'first-contentful-paint') window.__perf.fcp = e.startTime
  }).observe({ type: 'paint', buffered: true })
  new PerformanceObserver((l) => {
    const e = l.getEntries().at(-1)
    if (e) window.__perf.lcp = e.startTime
  }).observe({ type: 'largest-contentful-paint', buffered: true })
})

await page.goto(URL, { waitUntil: 'load' })
await page.waitForTimeout(5000) // let the hero animate under throttling

const m = await page.evaluate(() => {
  const p = window.__perf
  // Total Blocking Time: the part of each long task beyond 50ms.
  const tbt = p.longTasks.reduce((n, d) => n + Math.max(0, d - 50), 0)
  return {
    fcp: Math.round(p.fcp),
    lcp: Math.round(p.lcp),
    cls: Math.round(p.cls * 1000) / 1000,
    longTasks: p.longTasks.length,
    tbt: Math.round(tbt),
    longest: Math.round(Math.max(0, ...p.longTasks)),
  }
})

console.log(`CPU throttle   : ${THROTTLE}x   motion: ${MOTION}`)
console.log(`FCP            : ${m.fcp} ms`)
console.log(`LCP            : ${m.lcp} ms`)
console.log(`CLS            : ${m.cls}`)
console.log(`Long tasks     : ${m.longTasks} (longest ${m.longest} ms)`)
console.log(`Blocking time  : ${m.tbt} ms`)

await browser.close()

/**
 * Targeted screenshots for visual review.
 * Usage: node scripts/shot.mjs <width> <selectorOrTop> [theme] [outName]
 */
import { chromium } from 'playwright'

const [, , wArg, target = 'top', theme = 'dark', name] = process.argv
const width = Number(wArg) || 1440

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width, height: width < 700 ? 860 : Math.round(width * 0.62) },
  colorScheme: theme === 'light' ? 'light' : 'dark',
  reducedMotion: 'reduce',
  isMobile: width < 900,
  hasTouch: width < 900,
})
const page = await ctx.newPage()
await page.addInitScript((t) => {
  try { localStorage.setItem('theme', t) } catch {}
}, theme)
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await page.evaluate(() =>
  document.querySelectorAll('.reveal').forEach((n) => n.classList.add('is-visible')),
)
await page.waitForTimeout(400)

const out = `audit-shots/${name || `${width}-${target.replace(/[^a-z0-9]/gi, '')}-${theme}`}.png`

if (target === 'top') {
  await page.screenshot({ path: out })
} else {
  const el = page.locator(target).first()
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  await el.screenshot({ path: out })
}

console.log('wrote', out)
await browser.close()

/**
 * Behavioural checks that the layout audit cannot catch: theme persistence,
 * skill filtering (including that remounted groups actually become visible),
 * the case-study dialog, keyboard access and the resume download.
 */
import { chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:4173/'
const fails = []
const ok = []
const check = (name, pass, detail = '') =>
  (pass ? ok : fails).push(`${name}${detail ? ` — ${detail}` : ''}`)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()
page.on('pageerror', (e) => check('no page errors', false, e.message))
await page.goto(BASE, { waitUntil: 'networkidle' })

/* ---------------------------------------------------------------- theme */
const initial = await page.evaluate(() => document.documentElement.classList.contains('dark'))
await page.getByRole('button', { name: /switch to/i }).click()
await page.waitForTimeout(200)
const toggled = await page.evaluate(() => document.documentElement.classList.contains('dark'))
check('theme toggles', initial !== toggled)

const stored = await page.evaluate(() => localStorage.getItem('theme'))
check('theme persists to localStorage', stored === (toggled ? 'dark' : 'light'), `stored=${stored}`)

await page.reload({ waitUntil: 'networkidle' })
const afterReload = await page.evaluate(() => document.documentElement.classList.contains('dark'))
check('theme survives reload', afterReload === toggled)

/* ------------------------------------------------- skills filter + reveal */
await page.locator('#skills').scrollIntoViewIfNeeded()
await page.waitForTimeout(700)

const allCount = await page.locator('#skills li .surface-card').count()
await page.getByRole('tab', { name: 'DevSecOps', exact: true }).click()
await page.waitForTimeout(700)
const filtered = await page.locator('#skills li .surface-card').count()
check('filter narrows the list', filtered > 0 && filtered < allCount, `${allCount} → ${filtered}`)

// The regression this test exists for: remounted groups must not stay at opacity 0.
const opacity = await page.evaluate(() => {
  const g = document.querySelector('#skills .reveal:not(header)')
  return g ? getComputedStyle(g).opacity : 'none'
})
check('remounted skill group is visible', opacity === '1', `opacity=${opacity}`)

await page.getByRole('tab', { name: 'All', exact: true }).click()
await page.waitForTimeout(300)
await page.getByPlaceholder(/search technologies/i).fill('terraform')
await page.waitForTimeout(600)
const searched = await page.locator('#skills li .surface-card').count()
check('search finds Terraform', searched > 0, `${searched} results`)

const searchOpacity = await page.evaluate(() => {
  const g = document.querySelector('#skills .reveal:not(header)')
  return g ? getComputedStyle(g).opacity : 'none'
})
check('searched group is visible', searchOpacity === '1', `opacity=${searchOpacity}`)

await page.getByRole('button', { name: /clear search/i }).click()
await page.getByRole('tab', { name: 'All', exact: true }).click()
await page.waitForTimeout(400)

/* ------------------------------------------------------- deep dive tabs */
await page.locator('#deep-dive').scrollIntoViewIfNeeded()
await page.getByRole('tab', { name: /aws architecture/i }).click()
await page.waitForTimeout(300)
check('architecture tab renders', await page.getByText('Kubernetes Control Plane').isVisible())
await page.getByRole('tab', { name: /ci\/cd pipeline/i }).click()
await page.waitForTimeout(300)

const stage = page.getByRole('button', { name: /image scan/i }).first()
await stage.click()
await page.waitForTimeout(250)
check('pipeline stage detail updates', await page.getByText(/blocks on CRITICAL/i).isVisible())

/* ---------------------------------------------------- case study dialog */
await page.locator('#projects').scrollIntoViewIfNeeded()
const openBtn = page.getByRole('button', { name: /view case study/i }).first()
await openBtn.click()
await page.waitForTimeout(400)
const dlg = page.getByRole('dialog')
check('dialog opens', await dlg.isVisible())
check('dialog is labelled', (await dlg.getAttribute('aria-labelledby')) === 'case-study-title')

const focusInside = await page.evaluate(() =>
  document.querySelector('[role="dialog"]')?.contains(document.activeElement),
)
check('focus moves into dialog', !!focusInside)

const locked = await page.evaluate(() => getComputedStyle(document.body).overflow)
check('page scroll locked behind dialog', locked === 'hidden', `overflow=${locked}`)

await page.keyboard.press('Escape')
await page.waitForTimeout(300)
check('Escape closes dialog', (await page.getByRole('dialog').count()) === 0)
const restored = await page.evaluate(() => getComputedStyle(document.body).overflow)
check('scroll restored after close', restored !== 'hidden', `overflow=${restored}`)

/* -------------------------------------------------------------- resume */
const link = page.locator('a[download]').first()
const href = await link.getAttribute('href')
const res = await page.request.get(new URL(href, BASE).toString())
const ct = res.headers()['content-type'] || ''
const len = Number(res.headers()['content-length'] || 0)
check('resume downloads as a real PDF', res.ok() && ct.includes('pdf') && len > 50_000,
  `${res.status()} ${ct} ${len}B`)
check('resume has a download filename', (await link.getAttribute('download'))?.endsWith('.pdf') === true)

/* ------------------------------------------------------- copy email cta */
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'])
await page.locator('#contact').scrollIntoViewIfNeeded()
await page.getByRole('button', { name: /copy email/i }).click()
await page.waitForTimeout(300)
const clip = await page.evaluate(() => navigator.clipboard.readText())
check('copy email button works', clip === 'Sumitcdac39@gmail.com', `got "${clip}"`)

/* ------------------------------------------------------- keyboard / a11y */
// Reload so the sequential-focus starting point really is the document start;
// blur() alone leaves Chromium resuming from the last focused element.
await page.reload({ waitUntil: 'networkidle' })
await page.keyboard.press('Tab')
const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim())
check('skip link is the first tab stop', /skip to content/i.test(firstFocus || ''), `got "${firstFocus}"`)

const headings = await page.evaluate(() =>
  [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1])),
)
check('exactly one h1', headings.filter((l) => l === 1).length === 1)
let jump = null
for (let i = 1; i < headings.length; i++)
  if (headings[i] - headings[i - 1] > 1) { jump = `h${headings[i - 1]} → h${headings[i]}`; break }
check('no heading level is skipped', jump === null, jump || '')

const imgsOk = await page.evaluate(() =>
  [...document.querySelectorAll('img')].every((i) => i.hasAttribute('alt')),
)
check('all images have alt text', imgsOk)

const svgOk = await page.evaluate(() =>
  [...document.querySelectorAll('svg')].every(
    (s) => s.getAttribute('aria-hidden') === 'true' || s.hasAttribute('aria-label') || s.querySelector('title'),
  ),
)
check('all svgs are labelled or hidden', svgOk)

/* ----------------------------------------------- anchors clear the header */
// The header is fixed, so every in-page link relies on scroll-padding-top.
// Smooth scrolling is disabled here so the assertion measures the settled
// position rather than racing an in-flight animation.
await page.addStyleTag({ content: 'html { scroll-behavior: auto !important }' })
// Settle at the top first: measuring during the browser's own post-reload
// scroll restoration raced the first assertion.
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(300)
let covered = null
for (const id of ['about', 'projects', 'skills', 'experience', 'achievements', 'contact']) {
  await page.evaluate((i) => { location.hash = '#' + i }, id)
  await page.waitForTimeout(400)
  const r = await page.evaluate((i) => {
    const head = document.getElementById(i).querySelector('h2')
    const hdr = document.querySelector('header')
    return { top: head.getBoundingClientRect().top, bottom: hdr.getBoundingClientRect().bottom }
  }, id)
  if (r.top < r.bottom) {
    covered = `#${id} heading sits under the header (${r.top.toFixed(0)} < ${r.bottom.toFixed(0)})`
    break
  }
}
check('anchor links clear the sticky header', covered === null, covered || '')

/* ------------------------------------------------------------- report */
console.log(`\n✔ ${ok.length} passed`)
ok.forEach((o) => console.log('   ✓', o))
if (fails.length) {
  console.log(`\n✘ ${fails.length} FAILED`)
  fails.forEach((f) => console.log('   ✗', f))
}
await browser.close()
process.exit(fails.length ? 1 : 0)

/**
 * Responsive + accessibility audit.
 *
 * Loads the built site at every breakpoint in the brief, in both themes, and
 * reports: horizontal overflow, elements escaping the viewport, text clipping,
 * and touch targets that are too small. Also exercises the mobile nav and the
 * case-study modal.
 *
 * Usage: node scripts/audit.mjs [baseUrl] [--shots]
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.argv[2]?.startsWith('http') ? process.argv[2] : 'http://localhost:4173/'
const SHOTS = process.argv.includes('--shots')
const OUT = 'audit-shots'

const VIEWPORTS = [
  { name: '320  mobile-min', width: 320, height: 720, mobile: true },
  { name: '375  iphone-se', width: 375, height: 812, mobile: true },
  { name: '430  iphone-max', width: 430, height: 932, mobile: true },
  { name: '768  tablet', width: 768, height: 1024, mobile: true },
  { name: '1024 tablet-ls', width: 1024, height: 768, mobile: false },
  { name: '1280 laptop', width: 1280, height: 800, mobile: false },
  { name: '1440 laptop-lg', width: 1440, height: 900, mobile: false },
  { name: '1920 desktop', width: 1920, height: 1080, mobile: false },
  { name: '2560 qhd', width: 2560, height: 1440, mobile: false },
  { name: '3840 4k', width: 3840, height: 2160, mobile: false },
]

const problems = []
const note = (vp, theme, kind, msg) =>
  problems.push({ vp: vp.name, theme, kind, msg })

/** Runs in the page: find layout defects. */
function collect() {
  const vw = document.documentElement.clientWidth
  const out = { scrollW: document.documentElement.scrollWidth, vw, overflow: [], tiny: [], clipped: [] }

  const skip = (el) => {
    const s = getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden' || s.position === 'fixed') return true
    // Visually-hidden (sr-only) content is clipped to 1px by design.
    if (s.clipPath && s.clipPath !== 'none') return true
    if (el.closest('.sr-only')) return true
    return false
  }

  /** True when some ancestor is a horizontal scroll container or clips overflow. */
  const insideScroller = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p)
      if (['auto', 'scroll', 'hidden', 'clip'].includes(s.overflowX)) return true
    }
    return false
  }

  for (const el of document.body.querySelectorAll('*')) {
    if (skip(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue

    // Escapes the viewport horizontally.
    if (r.right > vw + 1 || r.left < -1) {
      const s = getComputedStyle(el)
      // Content inside a scroller or a clipping ancestor cannot cause page scroll.
      if (!['auto', 'scroll', 'hidden', 'clip'].includes(s.overflowX) && !insideScroller(el)) {
        out.overflow.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.toString?.() || '').slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
        })
      }
    }

    // Text clipped by a fixed height.
    if (el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
      const s = getComputedStyle(el)
      if (s.overflowY === 'hidden' && el.textContent.trim().length > 0 && !el.closest('.sr-only')) {
        out.clipped.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.toString?.() || '').slice(0, 60),
          text: el.textContent.trim().slice(0, 40),
        })
      }
    }
  }

  // Touch targets — only meaningful where the pointer is coarse.
  const coarse = matchMedia('(pointer: coarse)').matches
  for (const el of coarse ? document.querySelectorAll('a, button, input, [role="tab"]') : []) {
    if (skip(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (r.height < 36 || r.width < 24) {
      out.tiny.push({
        tag: el.tagName.toLowerCase(),
        text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 34),
        w: Math.round(r.width),
        h: Math.round(r.height),
      })
    }
  }

  return out
}

const run = async () => {
  if (SHOTS) mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch()

  for (const vp of VIEWPORTS) {
    for (const theme of ['dark', 'light']) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        hasTouch: vp.mobile,
        isMobile: vp.mobile,
        colorScheme: theme,
        reducedMotion: 'reduce', // deterministic layout, no animation flake
      })
      const page = await ctx.newPage()
      page.on('pageerror', (e) => note(vp, theme, 'JS ERROR', e.message))
      page.on('console', (m) => {
        if (m.type() === 'error') note(vp, theme, 'CONSOLE', m.text().slice(0, 120))
      })

      await page.addInitScript((t) => {
        try { localStorage.setItem('theme', t) } catch {}
      }, theme)

      await page.goto(BASE, { waitUntil: 'load' })
      await page.waitForTimeout(600) // settle; networkidle can hang on a rate-limited GitHub call
      // Reveal everything so hidden sections are measured too.
      await page.evaluate(() =>
        document.querySelectorAll('.reveal').forEach((n) => n.classList.add('is-visible')),
      )
      await page.waitForTimeout(250)

      const r = await page.evaluate(collect)

      if (r.scrollW > r.vw + 1)
        note(vp, theme, 'H-SCROLL', `scrollWidth ${r.scrollW} > viewport ${r.vw}`)

      for (const o of r.overflow.slice(0, 15))
        note(vp, theme, 'OVERFLOW', `<${o.tag}> ${o.left}..${o.right} · ${o.cls}`)

      for (const c of r.clipped.slice(0, 4))
        note(vp, theme, 'CLIPPED', `<${c.tag}> "${c.text}" · ${c.cls}`)

      for (const t of r.tiny.slice(0, 25))
        note(vp, theme, 'TAP-SIZE', `<${t.tag}> "${t.text}" ${t.w}x${t.h}`)

      if (SHOTS && theme === 'dark') {
        await page.screenshot({
          path: `${OUT}/${vp.width}-full.png`,
          fullPage: vp.width <= 1440,
        })
      }

      // --- interaction checks, mobile only ---
      if (vp.width < 1024 && theme === 'dark') {
        const menu = page.getByRole('button', { name: /open navigation menu/i })
        if (await menu.count()) {
          await menu.click()
          await page.waitForTimeout(250)
          const dlg = page.getByRole('dialog', { name: /navigation/i })
          if (!(await dlg.isVisible())) note(vp, theme, 'NAV', 'drawer did not open')
          else if (SHOTS)
            await page.screenshot({ path: `${OUT}/${vp.width}-nav.png` })
          await page.keyboard.press('Escape')
          await page.waitForTimeout(200)
        } else {
          note(vp, theme, 'NAV', 'hamburger not found')
        }
      }

      // --- case study modal ---
      if (theme === 'dark') {
        const cta = page.getByRole('button', { name: /view case study/i }).first()
        if (await cta.count()) {
          await cta.scrollIntoViewIfNeeded()
          await cta.click()
          await page.waitForTimeout(350)
          const dlg = page.getByRole('dialog', { name: /devsecops|inventory|lab/i })
          if (!(await dlg.count())) note(vp, theme, 'MODAL', 'case study did not open')
          else {
            const m = await page.evaluate(() => {
              const d = document.querySelector('[role="dialog"]')
              const r = d.getBoundingClientRect()
              return { right: r.right, vw: document.documentElement.clientWidth, h: r.height, vh: window.innerHeight }
            })
            if (m.right > m.vw + 1) note(vp, theme, 'MODAL', `overflows right ${m.right}>${m.vw}`)
            if (m.h > m.vh + 1) note(vp, theme, 'MODAL', `taller than viewport ${m.h}>${m.vh}`)
            if (SHOTS && vp.width <= 1440)
              await page.screenshot({ path: `${OUT}/${vp.width}-modal.png` })
          }
          await page.keyboard.press('Escape')
          await page.waitForTimeout(200)
        }
      }

      await ctx.close()
    }
  }

  await browser.close()

  // ---- report ----
  if (!problems.length) {
    console.log('\n✅ No layout, overflow, tap-size or runtime problems found.\n')
    return
  }
  const byKind = {}
  for (const p of problems) (byKind[p.kind] ??= []).push(p)
  console.log(`\n⚠️  ${problems.length} findings\n`)
  for (const [kind, list] of Object.entries(byKind)) {
    console.log(`── ${kind} (${list.length})`)
    const seen = new Set()
    for (const p of list) {
      const key = p.msg
      if (seen.has(key)) continue
      seen.add(key)
      console.log(`   [${p.vp} ${p.theme}] ${p.msg}`)
    }
    console.log()
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

/**
 * Fails loudly if any `icon:` slug referenced in the data files has no brand
 * mark and no fallback glyph — those render as empty boxes, which looks broken.
 */
import { readFileSync } from 'node:fs'

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')

const used = new Set()
for (const f of ['src/data/profile.ts', 'src/data/projects.ts', 'src/components/HeroVisual.tsx']) {
  for (const m of read(f).matchAll(/icon:\s*'([a-z0-9]+)'/gi)) used.add(m[1])
}
// Icons passed inline as a prop rather than through data.
for (const f of ['src/components/Contact.tsx', 'src/components/Hero.tsx']) {
  for (const m of read(f).matchAll(/icon:\s*'([a-z0-9]+)'/gi)) used.add(m[1])
}

const brand = new Set([...read('src/data/techIcons.ts').matchAll(/^\s{2}([a-z0-9]+):/gim)].map((m) => m[1]))
const custom = new Set([...read('src/data/customIcons.ts').matchAll(/^\s{2}([a-z0-9]+):\s*\{/gim)].map((m) => m[1]))
const fallback = new Set(
  [...read('src/components/TechIcon.tsx').matchAll(/^\s{2}([a-z0-9]+):\s*[A-Z]\w+,/gim)].map((m) => m[1]),
)
const missing = [...used].filter((s) => !brand.has(s) && !custom.has(s) && !fallback.has(s))

console.log(`${used.size} icon slugs referenced · ${brand.size} brand · ${custom.size} custom · ${fallback.size} fallback`)
if (missing.length) {
  console.error(`\n❌ UNRESOLVED (will render blank): ${missing.join(', ')}\n`)
  process.exit(1)
}
console.log('✅ every referenced icon resolves')

/**
 * Builds the responsive profile-image assets from one source photo.
 *
 * Source of truth: Sumit's own professional headshot from his GitHub profile
 * (LinkedIn blocks all programmatic access with HTTP 999). Nothing is generated
 * or substituted — this only resizes and re-encodes his actual photograph.
 *
 * To swap in a different photo (e.g. the LinkedIn one), drop it at
 * assets/profile-source.jpg and re-run: npm run image
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const SRC_LOCAL = new URL('../assets/profile-source.jpg', import.meta.url)
const SRC_REMOTE = 'https://avatars.githubusercontent.com/u/142529795?v=4'
const OUT = new URL('../public/profile/', import.meta.url)

// Rendered at 88px in the hero and 36px in the nav; 3x covers the densest
// displays we care about without shipping a needlessly large file.
const SIZES = [96, 176, 264]

mkdirSync(OUT, { recursive: true })

let input
if (existsSync(SRC_LOCAL)) {
  console.log('source: assets/profile-source.jpg (local override)')
  input = SRC_LOCAL
} else {
  console.log(`source: ${SRC_REMOTE}`)
  const res = await fetch(SRC_REMOTE)
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
  input = Buffer.from(await res.arrayBuffer())
  mkdirSync(new URL('../assets/', import.meta.url), { recursive: true })
  writeFileSync(SRC_LOCAL, input) // keep a copy so builds do not depend on the network
}

const meta = await sharp(input).metadata()
console.log(`input : ${meta.width}x${meta.height} ${meta.format}`)

for (const size of SIZES) {
  const base = sharp(input).resize(size, size, { fit: 'cover', position: 'top' })

  const webp = await base.clone().webp({ quality: 82, effort: 6 }).toBuffer()
  writeFileSync(new URL(`profile-${size}.webp`, OUT), webp)

  const jpg = await base.clone().jpeg({ quality: 84, mozjpeg: true }).toBuffer()
  writeFileSync(new URL(`profile-${size}.jpg`, OUT), jpg)

  console.log(`  ${size}px  webp ${(webp.length / 1024).toFixed(1)}kB  jpg ${(jpg.length / 1024).toFixed(1)}kB`)
}

console.log('done -> public/profile/')

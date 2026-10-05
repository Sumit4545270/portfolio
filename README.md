# Sumit Sanjay Badgujar — Portfolio

A recruiter-facing personal site: React 19 + TypeScript + Vite 8 + Tailwind CSS 4.

Every factual claim on the site traces to the resume, to Sumit's confirmation, or to code
read directly out of the public repositories at <https://github.com/Sumit4545270>.
Nothing is invented, and there are no outstanding gaps.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

## Checks

```bash
npm run icons        # regenerate brand marks from simple-icons
npm run check:icons  # fail if any icon slug would render blank
npm run audit        # responsive + overflow + tap-target sweep, 320px → 4K, both themes
npm run test:ui      # behavioural tests: theme, filters, dialog, downloads, a11y
```

`audit` and `test:ui` need `npm run preview` running in another terminal.

## Verified on this build

| | Perf | A11y | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Lighthouse desktop | **99** | **100** | 96 | **100** |
| Lighthouse mobile | **95** | **100** | 96 | **100** |

Desktop LCP 0.9s · CLS 0. Mobile LCP 2.7s · CLS 0.009. Accessibility audits clean on both.

The 96 on best-practices is GitHub's public API rate-limiting the test machine after
repeated automated runs — the section handles it with a visible error state. A real
visitor spends one request.

- `npm run audit` — 320 / 375 / 430 / 768 / 1024 / 1280 / 1440 / 1920 / 2560 / 3840 px
  × light and dark: **no horizontal scroll, no overflow, no clipped text, no undersized
  touch targets, no runtime errors.**
- `npm run test:ui` — **24/24** behavioural checks pass.
- `npm run check:icons` — all 53 icon slugs resolve to a real glyph.

---

## Before you deploy — 2 things to change

### 1. Your domain

`https://sumitbadgujar.com` is a placeholder. Replace it in:

- `index.html` — `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`,
  and the `url` field in the JSON-LD block
- `public/sitemap.xml`
- `public/robots.txt`

### 2. Check two accuracy notes

- **Inventory project stack.** Your resume lists it as HTML/CSS/JavaScript/MySQL; the
  repository is a **Laravel** application. The site describes the repository (the accurate
  version) and shows a note about the discrepancy. Update your resume, or remove the note
  in `src/data/projects.ts` → `projects[1].note`.
- **Docker Hub namespace.** The DevSecOps pipeline pushes to
  `ketanmahajan24/computer-academy-webapp`. If you present this as solo work, re-tag the
  image under your own registry namespace before an interviewer inspects the Jenkinsfile.

---

## ⚠️ Security issue in a linked repository

`CDAC-Final-Project` is public and contains a **committed SSH private key** at
`CDAC Project/private-keys-to-login/devsecops-key`, plus `Sonarqube credentials_.docx`.

This portfolio links recruiters straight to that repository. Before launch:

1. Revoke the key pair in AWS and rotate the SonarQube credentials.
2. Purge both from git history (`git filter-repo` or BFG) — deleting the file in a new
   commit is not enough, the blob stays reachable.
3. Add `*.pem`, `*_rsa`, `*-key` and `*.docx` credential files to `.gitignore`.

---

## Where the content lives

All copy and data sit in two files. Editing them changes the site; no component
needs touching.

| File | Contains |
| --- | --- |
| `src/data/profile.ts` | Identity, links, value proposition, differentiators, About, skills, experience, education, certifications, achievements |
| `src/data/projects.ts` | Project case studies, the CI/CD pipeline stages, the AWS topology |

Each entry is tagged in comments with its source: `[resume]`, `[github]` or `[user]`.

`src/data/techIcons.ts` is **generated** — run `npm run icons`, do not hand-edit.

## Structure

```
src/
  data/          content + generated icon paths (the only files you normally edit)
  components/    one file per section, plus TechIcon and shared ui primitives
  hooks/         useTheme, useReveal, useActiveSection
  index.css      design tokens, both themes, component classes, motion rules
scripts/
  gen-icons.mjs    pulls only the needed brand marks out of simple-icons
  check-icons.mjs  guards against icons that would render blank
  audit.mjs        responsive sweep across 11 viewports × 2 themes
  interactions.mjs behavioural + accessibility tests
  shot.mjs         targeted screenshots for visual review
```

### Section order

The page follows the order a recruiter's questions arrive in:

Hero (who) → Why consider me → About → **Projects** → Engineering deep dive → Skills →
Experience → Live GitHub → Proof of work → Education → Achievements → Contact

Projects sit ahead of Skills on purpose. Skills is the tallest section on the page; with
it first, the strongest evidence started ~15 screens down on a phone. Moving it up brought
Projects to ~7. If you prefer the original order, swap the two lines in `src/App.tsx` and
the matching entries in `NAV` (`src/components/Nav.tsx`) and `LINKS` (`Footer.tsx`).

---

## The Genzeon entry

Role, employer, start date (11/03/2026, read as 11 March) and the five responsibility
bullets were supplied directly by Sumit. The chip row under it is labelled **Technical
background**, not presented as the stack of that role: those technologies come from the
resume and the public repositories, and neither source establishes which of them this
particular job uses day to day. Change `techLabel` in `src/data/profile.ts` →
`experience[0]` if that role's real stack is confirmed later.

## Two deliberate omissions

- **Nothing from LinkedIn.** `linkedin.com` returns HTTP 999 to every automated request,
  so the profile could not be read. Everything on the site comes from the resume, from
  GitHub, or from what you confirmed directly. If your LinkedIn lists anything the resume
  does not — a Claude certification, endorsements, extra roles — send it over and it can
  be added to `src/data/profile.ts`.
- **No contact form.** The site is fully static, so a form needs a third-party endpoint
  (Formspree, Web3Forms) and an account key. Recruiters also tend to prefer replying from
  their own mail client. Contact is handled with a mailto link, a one-click copy-email
  button, LinkedIn and GitHub. A form can be added if you want one — it just needs your
  endpoint key.

## Design system

Three things are defined once and reused everywhere, so nothing drifts:

- **Type scale** (`src/index.css`) — `.display-name`, `.display-role`,
  `.heading-section`, `.heading-card`, `.lead`, `.body-sm`, `.eyebrow`. All sized with
  `clamp()`, so text interpolates with the viewport instead of jumping at breakpoints.
  The hero name tops out at 3rem deliberately: large enough to anchor the page, small
  enough that the role, value proposition and CTAs all stay above the fold.
- **Cards** — one `.surface-card` definition (radius `--radius-card`, 1px border,
  `--shadow-sm`), plus `.surface-card-hover` for the lift. No component sets its own
  radius or shadow.
- **Icon tiles** — `.icon-tile` with `-sm` / `-lg` / `-accent` / `-hover` modifiers. Every
  icon container on the page is one of these three sizes.

Sections alternate tinted and untinted strictly in page order, and each carries a
`.section-seam` hairline that fades out at both ends — connected, but distinct.

## Profile photo

`public/profile/` is generated by `npm run image` from Sumit's own professional headshot.
LinkedIn returns HTTP 999 to every automated request and cannot be read, so the source is
his GitHub avatar — the same photograph, not a substitute or a generated image. Output is
96/176/264px WebP with JPEG fallbacks; the largest is under 6 kB.

To use a different photo, drop it at `assets/profile-source.jpg` and re-run `npm run image`.
The script prefers that file over the remote one.

## Design notes

- **Themes are designed separately.** Light is paper-white with deep navy text; dark is a
  cool near-black with a blue cast and softened borders. Neither is an inversion of the
  other. The choice persists in `localStorage` and is applied by an inline script in
  `index.html` before first paint, so there is no flash.
- **No proficiency percentages.** "AWS — 90%" is a number nobody can verify. Skills carry
  a note about where each was actually used instead. The one bar chart on the site shows
  PG-DITISS module marks, which are real scores out of 40.
- **Brand marks are real,** pulled from `simple-icons` at build time and trimmed to only
  what renders. Colours are adjusted per theme — GitHub's `#181717` is invisible on a dark
  background, so near-greyscale brands are lightened for dark mode. AWS and Slack were
  withdrawn from `simple-icons` on trademark grounds and use neutral glyphs.
- **Motion is suppressed entirely** under `prefers-reduced-motion`.

## Accessibility

Semantic landmarks, one `h1`, no skipped heading levels, a skip link as the first tab
stop, focus trapping and `Escape` in both dialogs, focus restored on close, visible focus
rings throughout, 44px touch targets on coarse pointers, and `aria-live` on the skills
result count. All muted text clears WCAG AA (4.5:1) on every surface it appears on.

## Deploying

Live at **https://sumit-badgujar.netlify.app** · repo **https://github.com/Sumit4545270/portfolio**

Netlify builds from `main` on every push. `netlify.toml` holds the whole configuration —
build command, publish directory, Node version, cache headers and a Content-Security-Policy
scoped to exactly what the page uses (Google Fonts and the GitHub API).

```bash
git add -A
git commit -m "..."
git push          # Netlify redeploys automatically
```

### If the site URL ever changes

The canonical URL is written into four places. Update all of them together:

- `index.html` — `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, and
  `url` in the JSON-LD block
- `public/sitemap.xml`
- `public/robots.txt`
- `homepage` on the GitHub repo

### Building elsewhere

The output is plain static files, so any host works:

```bash
npm ci && npm run build   # -> dist/
```

Verified in a clean clone: `npm ci` then `npm run build` produces a 771 kB `dist/` with no
build-time network dependency (the profile photo source is committed at
`assets/profile-source.jpg`).
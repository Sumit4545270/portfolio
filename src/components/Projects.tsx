import { useState } from 'react'
import { ArrowUpRight, Star } from 'lucide-react'
import { projects, type CaseStudy } from '../data/projects'
import { Section, SectionHeading } from './ui'
import { CaseStudyModal } from './CaseStudyModal'
import { TechIcon } from './TechIcon'

const featured = projects.filter((p) => p.featured)
const others = projects.filter((p) => !p.featured)

export function Projects() {
  const [open, setOpen] = useState<CaseStudy | null>(null)

  return (
    <Section id="projects">
      <SectionHeading
        id="projects"
        eyebrow="Featured work"
        title="Systems I have designed, built and shipped"
        lead="Each case study follows the same path: the problem, how I thought about it, the architecture, what broke, and where it ended up. Every technical detail is verifiable in the linked repository."
      />

      {/* Featured */}
      <div className="mt-12 space-y-5">
        {featured.map((p, i) => (
          <article
            key={p.id}
            className="reveal group surface-card surface-card-hover overflow-hidden"
            data-reveal-delay={i * 80}
          >
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              {/* Main */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2 py-1 font-mono text-[10.5px] font-bold tracking-wider text-accent-on-soft uppercase">
                    <Star size={11} aria-hidden="true" />
                    Featured
                  </span>
                  <span className="font-mono text-[11px] text-text-faint">{p.category}</span>
                  {p.period && <span className="chip">{p.period}</span>}
                </div>

                <h3 className="mt-4 text-xl leading-snug font-bold sm:text-2xl">{p.name}</h3>

                <p className="mt-3 text-[15px] leading-relaxed text-text-muted">{p.tagline}</p>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 10).map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                  {p.tech.length > 10 && (
                    <li className="chip border-dashed">+{p.tech.length - 10} more</li>
                  )}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOpen(p)}
                    className="tap-target inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
                  >
                    View Case Study
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target inline-flex items-center gap-2 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
                  >
                    <TechIcon name="github" size={16} />
                    Source
                  </a>
                </div>
              </div>

              {/* Highlights rail */}
              <div className="border-t border-border-base bg-surface-2 p-6 sm:p-8 lg:border-t-0 lg:border-l">
                <h4 className="font-mono text-[11px] tracking-[0.14em] text-text-faint uppercase">
                  At a glance
                </h4>
                <dl className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-3.5">
                  {p.highlights.map((h) => (
                    <div key={h.label}>
                      <dt className="text-[11.5px] leading-snug text-text-faint">{h.label}</dt>
                      <dd className="mt-0.5 font-mono text-[15px] font-bold text-accent">
                        {h.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Additional work */}
      <h3 className="reveal mt-14 mb-5 text-sm font-semibold tracking-wide text-text-faint uppercase">
        More engineering work
      </h3>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {others.map((p, i) => (
          <li key={p.id} className="reveal" data-reveal-delay={i * 60}>
            <article className="surface-card surface-card-hover flex h-full flex-col p-5">
              <p className="font-mono text-[10.5px] tracking-wider text-text-faint uppercase">
                {p.category}
              </p>
              <h4 className="mt-2.5 text-base leading-snug font-semibold">{p.name}</h4>
              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-text-muted">{p.tagline}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.slice(0, 5).map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-3 border-t border-border-base pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  className="tap-target -ml-2 inline-flex items-center rounded-md px-2 py-2 text-[13px] font-semibold text-accent transition-colors hover:bg-accent-soft"
                >
                  Case study
                </button>
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} source on GitHub`}
                  className="tap-target -mr-2 ml-auto grid place-items-center rounded-md px-2 py-2 text-text-faint transition-colors hover:bg-surface-2 hover:text-text-base"
                >
                  <TechIcon name="github" size={17} />
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {open && <CaseStudyModal project={open} onClose={() => setOpen(null)} />}
    </Section>
  )
}

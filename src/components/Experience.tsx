import { Briefcase } from 'lucide-react'
import { experience } from '../data/profile'
import { Section, SectionHeading } from './ui'

export function Experience() {
  return (
    <Section id="experience" tinted>
      <SectionHeading
        id="experience"
        eyebrow="Career journey"
        title="How I got here"
        lead="A short path, deliberately chosen: an engineering degree, then a specialist diploma in infrastructure and security, then full stack work."
      />

      <ol className="mt-12 space-y-4">
        {experience.map((item, i) => (
          <li
            key={item.id}
            className="reveal relative pl-8 sm:pl-10"
            data-reveal-delay={i * 70}
          >
            {/* Rail */}
            {i < experience.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-10 bottom-[-1rem] left-[0.6875rem] w-px bg-border-base sm:left-[0.9375rem]"
              />
            )}
            {/* Node */}
            <span
              aria-hidden="true"
              className={`absolute top-6 left-0 grid h-6 w-6 place-items-center rounded-full border-2 sm:h-8 sm:w-8 ${
                item.current
                  ? 'border-accent bg-accent text-accent-contrast'
                  : 'border-border-strong bg-surface text-text-faint'
              }`}
            >
              <Briefcase size={12} aria-hidden="true" />
            </span>

            <div className="surface-card surface-card-hover p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div>
                  <h3 className="text-[1.05rem] leading-snug font-semibold">{item.role}</h3>
                  <p className="mt-0.5 text-sm font-medium text-accent">{item.org}</p>
                </div>

                <span className="chip shrink-0">{item.period}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-text-muted">{item.summary}</p>

              <ul className="mt-4 space-y-2">
                {item.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    {p}
                  </li>
                ))}
              </ul>

              {item.tech.length > 0 && (
                <div className="mt-5">
                  {/* Labelled where the chips are background rather than the stack of that role. */}
                  {'techLabel' in item && item.techLabel && (
                    <p className="mb-2 font-mono text-[10.5px] tracking-[0.14em] text-text-faint uppercase">
                      {item.techLabel}
                    </p>
                  )}
                  <ul className="flex flex-wrap gap-1.5">
                    {item.tech.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

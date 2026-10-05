import { GraduationCap } from 'lucide-react'
import { education } from '../data/profile'
import { Section, SectionHeading } from './ui'

export function Education() {
  return (
    <Section id="education">
      <SectionHeading
        id="education"
        eyebrow="Education"
        title="Academic background"
      />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {education.map((e, i) => (
          <li
            key={e.id}
            className={`reveal surface-card surface-card-hover flex flex-col p-5 ${
              e.highlight ? 'ring-1 ring-accent/30' : ''
            }`}
            data-reveal-delay={i * 60}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={`icon-tile ${
                  e.highlight
                    ? '!border-transparent !bg-accent text-accent-contrast'
                    : 'text-text-faint'
                }`}
              >
                <GraduationCap size={17} aria-hidden="true" />
              </span>
              {e.year && (
                <span className="font-mono text-xs text-text-faint tabular-nums">{e.year}</span>
              )}
            </div>

            <h3 className="mt-4 text-base font-semibold">{e.degree}</h3>
            {e.field && <p className="mt-0.5 text-[13px] text-text-muted">{e.field}</p>}

            <p className="mt-3 flex-1 text-[13px] leading-snug text-text-faint">{e.institute}</p>

            <p className="mt-4 border-t border-border-base pt-3 font-mono text-sm font-semibold text-accent">
              {e.score}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

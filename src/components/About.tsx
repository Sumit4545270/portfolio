import { about, education } from '../data/profile'
import { Section, SectionHeading } from './ui'

const ditiss = education.find((e) => e.id === 'ditiss')

export function About() {
  return (
    <Section id="about" tinted backdrop="flow">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="about"
            eyebrow="About"
            title="Application developer, infrastructure engineer, in one person"
          />

          <div className="reveal mt-7 space-y-5">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 28)} className="text-[15px] leading-relaxed text-text-muted sm:text-base">
                {p}
              </p>
            ))}
          </div>

          <dl className="reveal mt-9 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {about.facts.map((f) => (
              <div key={f.label} className="border-l-2 border-accent/30 pl-4">
                <dt className="font-mono text-[11px] tracking-[0.12em] text-text-faint uppercase">
                  {f.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* PG-DITISS module breakdown — the credential that anchors the security side. */}
        {ditiss && (
          <aside className="reveal" data-reveal-delay="120">
            <div className="surface-card p-6 lg:sticky lg:top-24">
              <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
                Specialist credential
              </p>
              <h3 className="mt-2 text-lg font-semibold">
                PG-DITISS — IT Infrastructure, Systems &amp; Security
              </h3>
              <p className="mt-1 text-sm text-text-muted">C-DAC · {ditiss.score}</p>

              <ul className="mt-6 space-y-3.5">
                {ditiss.modules.map((m) => (
                  <li key={m.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] leading-snug text-text-muted">{m.name}</span>
                      <span className="shrink-0 font-mono text-xs font-semibold tabular-nums">
                        {m.score}
                      </span>
                    </div>
                    {/* Real marks out of 40 — an actual score, not an invented proficiency bar. */}
                    <div
                      className="mt-1.5 h-1 overflow-hidden rounded-full bg-border-base"
                      role="img"
                      aria-label={`${m.name}: ${m.score} out of 40`}
                    >
                      <div
                        className="h-full rounded-full bg-accent/70"
                        style={{ width: `${(m.score / 40) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-5 border-t border-border-base pt-4 text-[11px] leading-relaxed text-text-faint">
                Scores are the actual marks awarded, out of 40 per module.
              </p>
            </div>
          </aside>
        )}
      </div>
    </Section>
  )
}

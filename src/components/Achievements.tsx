import { Award, CalendarDays, Trophy, Users, type LucideIcon } from 'lucide-react'
import { achievements, certifications } from '../data/profile'
import { Section, SectionHeading } from './ui'
import { TechIcon } from './TechIcon'

const icons: Record<string, LucideIcon> = {
  trophy: Trophy,
  users: Users,
  calendar: CalendarDays,
}

export function Achievements() {
  return (
    <Section id="achievements" tinted backdrop="constellation">
      <SectionHeading
        id="achievements"
        eyebrow="Certifications & achievements"
        title="Evidence of technical ability and leadership"
      />

      <div className="mt-11 grid gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Certifications */}
        <div className="reveal">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-text-faint uppercase">
            <Award size={15} aria-hidden="true" />
            Certifications
          </h3>
          <ul className="space-y-3">
            {certifications.map((c) => (
              <li key={c.name} className="surface-card surface-card-hover flex gap-4 p-5">
                <span className="icon-tile icon-tile-lg">
                  <TechIcon name={c.icon} size={20} brandColor />
                </span>
                <div className="min-w-0">
                  <h4 className="text-[15px] leading-snug font-semibold">{c.name}</h4>
                  <p className="mt-0.5 text-[13px] text-accent">{c.issuer}</p>
                  <p className="mt-2 text-[13px] leading-snug text-text-muted">{c.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Achievements */}
        <div className="reveal" data-reveal-delay="90">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-text-faint uppercase">
            <Trophy size={15} aria-hidden="true" />
            Leadership &amp; competition
          </h3>
          <ul className="space-y-3">
            {achievements.map((a) => {
              const Icon = icons[a.icon] ?? Trophy
              return (
                <li key={a.name} className="surface-card surface-card-hover flex gap-4 p-5">
                  <span className="icon-tile icon-tile-lg icon-tile-accent">
                    <Icon size={19} aria-hidden="true" strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-[15px] leading-snug font-semibold">{a.name}</h4>
                    <p className="mt-2 text-[13px] leading-snug text-text-muted">{a.note}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </Section>
  )
}

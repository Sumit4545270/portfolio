import { Cloud, Code, Layers, Lock, Shield, Users, type LucideIcon } from 'lucide-react'
import { differentiators } from '../data/profile'
import { Section, SectionHeading } from './ui'

const icons: Record<string, LucideIcon> = {
  layers: Layers,
  shield: Shield,
  cloud: Cloud,
  code: Code,
  lock: Lock,
  users: Users,
}

export function WhyMe() {
  return (
    <Section id="why" backdrop="nodes">
      <SectionHeading
        id="why"
        eyebrow="Why consider me"
        title="What I actually bring to an engineering team"
        lead="Not a list of technologies — the specific things I can do on day one, and the evidence behind each claim."
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {differentiators.map((d, i) => {
          const Icon = icons[d.icon] ?? Layers
          return (
            <li
              key={d.id}
              className="reveal group surface-card surface-card-hover flex flex-col p-6"
              data-reveal-delay={i * 60}
            >
              <span className="icon-tile icon-tile-lg icon-tile-accent mb-5 transition-transform duration-300 group-hover:scale-105">
                <Icon size={20} aria-hidden="true" strokeWidth={1.9} />
              </span>

              <h3 className="text-[1.05rem] leading-snug font-semibold">{d.title}</h3>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">{d.pitch}</p>

              <p className="mt-5 border-t border-border-base pt-4 font-mono text-[11px] leading-snug text-text-faint">
                {d.evidence}
              </p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

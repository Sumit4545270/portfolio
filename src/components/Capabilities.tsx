import { Hammer, Rocket, ShieldCheck } from 'lucide-react'
import { valueProp } from '../data/profile'

const icons = [Hammer, Rocket, ShieldCheck]

/**
 * A slim band directly under the hero carrying the build / ship / secure
 * proposition. Lifting these out of the hero keeps that composition balanced,
 * and the band doubles as the visual seam between the hero and the page body.
 */
export function Capabilities() {
  return (
    <section
      aria-label="What I do"
      className="relative border-y border-border-base bg-bg-sub"
    >
      <div className="container-page">
        <ul className="grid divide-y divide-border-base sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {valueProp.map((v, i) => {
            const Icon = icons[i] ?? Hammer
            return (
              <li
                key={v.label}
                className="reveal group py-7 sm:px-6 sm:py-8 sm:first:pl-0 sm:last:pr-0 lg:px-8"
                data-reveal-delay={i * 70}
              >
                <div className="flex items-center gap-3">
                  <span className="icon-tile icon-tile-sm icon-tile-accent">
                    <Icon size={15} aria-hidden="true" strokeWidth={2} />
                  </span>
                  <h2 className="eyebrow">{v.label}</h2>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">{v.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

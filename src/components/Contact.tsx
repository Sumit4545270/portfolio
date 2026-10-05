import { Mail, MapPin, ArrowUpRight } from 'lucide-react'
import { profile } from '../data/profile'
import { CopyEmailButton, ResumeButton, Section } from './ui'
import { TechIcon } from './TechIcon'

const CHANNELS = [
  {
    icon: 'linkedin',
    label: 'LinkedIn',
    value: 'Connect or message me',
    href: profile.links.linkedin,
    external: true,
  },
  {
    icon: 'github',
    label: 'GitHub',
    value: 'Read the code behind every claim',
    href: profile.links.github,
    external: true,
  },
] as const

export function Contact() {
  return (
    <Section id="contact">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow reveal mb-3">Get in touch</p>

        <h2 id="contact-heading" className="heading-section reveal">
          Let&apos;s build something that holds up in production.
        </h2>

        <p className="lead reveal mx-auto mt-5 max-w-2xl">
          I&apos;m open to software engineering roles across full stack development, DevOps and
          DevSecOps. If you have a role in mind — or just want to talk through anything on this page
          — I reply to every message.
        </p>

        {/* Primary actions */}
        <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent('Opportunity for Sumit Badgujar')}`}
            className="tap-target inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-accent-contrast shadow-sm transition-colors hover:bg-accent-hover"
          >
            <Mail size={17} aria-hidden="true" />
            Email me
          </a>
          <CopyEmailButton />
          <ResumeButton variant="secondary" />
        </div>

        <p className="reveal mt-5 font-mono text-sm break-all text-text-muted">{profile.email}</p>

        {/* Channels */}
        <ul className="reveal mt-11 grid gap-3 text-left sm:grid-cols-2">
          {CHANNELS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card surface-card-hover group flex items-center gap-4 p-5"
              >
                <span className="icon-tile icon-tile-lg icon-tile-hover">
                  <TechIcon name={c.icon} size={19} brandColor />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">{c.label}</span>
                  <span className="block truncate text-[13px] text-text-muted">{c.value}</span>
                </span>
                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                  className="shrink-0 text-text-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </a>
            </li>
          ))}
        </ul>

        <p className="reveal mt-8 inline-flex items-center gap-2 text-sm text-text-faint">
          <MapPin size={15} aria-hidden="true" />
          Based in {profile.location} · open to relocation and remote
        </p>
      </div>
    </Section>
  )
}

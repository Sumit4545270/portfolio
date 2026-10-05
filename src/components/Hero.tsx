import { ArrowRight, MapPin, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { ButtonLink, ResumeButton } from './ui'
import { TechIcon } from './TechIcon'
import { HeroVisual } from './HeroVisual'
import { Avatar } from './Avatar'

const SOCIALS = [
  { label: 'LinkedIn', href: profile.links.linkedin, icon: 'linkedin' },
  { label: 'GitHub', href: profile.links.github, icon: 'github' },
]

const FOCUS = ['Full Stack', 'DevSecOps', 'Cloud Infrastructure']

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-24 pb-14 sm:pt-28 lg:pt-32 lg:pb-20"
    >
      <div aria-hidden="true" className="grid-backdrop pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-16rem] left-1/2 hidden h-[28rem] w-[min(56rem,105vw)] -translate-x-1/2 rounded-full bg-accent/7 blur-[120px] md:block"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-16 xl:gap-20">
          {/* ---------------------------------------------------------- copy */}
          <div className="reveal max-w-2xl">
            {/* Identity, in reading order: photo → availability → name → role. */}
            <div>
              <div className="relative inline-block">
                <span
                  aria-hidden="true"
                  className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-accent/45 via-accent/10 to-transparent"
                />
                <Avatar size={84} priority className="relative ring-[3px] ring-bg" />
                <span
                  aria-hidden="true"
                  className="absolute right-1 bottom-1 h-3.5 w-3.5 rounded-full border-2 border-bg bg-secure"
                />
              </div>
            </div>

            <p className="chip mt-5 border-secure/30 bg-secure-soft font-medium text-secure">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secure opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secure" />
              </span>
              Open to software engineering roles
            </p>

            <h1 className="display-name mt-3 text-text-base">Sumit Sanjay Badgujar</h1>

            <p className="display-role mt-3 text-text-base">
              Full Stack Software Engineer{' '}
              <span className="font-normal text-text-muted">at {profile.company}</span>
            </p>

            <ul className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
              {FOCUS.map((f) => (
                <li key={f} className="chip border-accent/25 bg-accent-soft font-medium text-accent-on-soft">
                  {f}
                </li>
              ))}
            </ul>

            <p className="lead mt-5">
              I build web applications and the infrastructure that delivers them — Express
              and Laravel services, Terraform-provisioned AWS, and CI/CD pipelines that block
              insecure builds before they reach production.
            </p>

            {/*
              CTAs: a tidy 2-up grid on phones with the tertiary action spanning
              beneath, collapsing to a single inline row from 640px up.
            */}
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center">
              <ButtonLink href="#projects" variant="primary" className="w-full sm:w-auto">
                View Projects
                <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
              <ResumeButton variant="secondary" className="w-full sm:w-auto" />
              <ButtonLink
                href="#contact"
                variant="ghost"
                className="col-span-2 w-full sm:col-auto sm:w-auto"
              >
                Let&apos;s Connect
              </ButtonLink>
            </div>

            {/* Contact strip */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-border-base pt-5 text-[13px]">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target inline-flex items-center gap-2 font-medium text-text-muted transition-colors hover:text-accent"
                >
                  <TechIcon name={s.icon} size={16} />
                  {s.label}
                </a>
              ))}
              <a
                href={`mailto:${profile.email}`}
                className="tap-target inline-flex items-center gap-2 font-medium text-text-muted transition-colors hover:text-accent"
              >
                <Mail size={16} aria-hidden="true" />
                <span className="hidden xs:inline">{profile.email}</span>
                <span className="xs:hidden">Email</span>
              </a>
              <span className="inline-flex items-center gap-2 text-text-faint">
                <MapPin size={15} aria-hidden="true" />
                Pune, India
              </span>
            </div>
          </div>

          {/* -------------------------------------------------------- visual */}
          <div className="reveal" data-reveal-delay="110">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}

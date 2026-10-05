import { Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { TechIcon } from './TechIcon'
import { Avatar } from './Avatar'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  return (
    <footer className="border-t border-border-base bg-bg">
      <div className="container-page py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <a href="#home" className="inline-flex items-center gap-2.5 font-bold">
              <Avatar size={36} alt="" className="ring-1 ring-border-base" />
              {profile.shortName}
            </a>
            <p className="mt-4 text-[13px] leading-relaxed text-text-muted">
              Full Stack Engineer building applications and the secure, automated cloud pipelines
              that ship them.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:ml-auto">
            <h2 className="mb-3 font-mono text-[11px] tracking-[0.14em] text-text-faint uppercase">
              Sections
            </h2>
            <ul className="grid grid-cols-2 gap-x-10">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="tap-target -mx-2 inline-flex items-center rounded-md px-2 py-2 text-[13px] text-text-muted transition-colors hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-3 font-mono text-[11px] tracking-[0.14em] text-text-faint uppercase">
              Elsewhere
            </h2>
            <ul className="space-y-0.5">
              <li>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target -mx-2 inline-flex items-center gap-2 rounded-md px-2 py-2 text-[13px] text-text-muted transition-colors hover:text-accent"
                >
                  <TechIcon name="linkedin" size={15} />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target -mx-2 inline-flex items-center gap-2 rounded-md px-2 py-2 text-[13px] text-text-muted transition-colors hover:text-accent"
                >
                  <TechIcon name="github" size={15} />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="tap-target -mx-2 inline-flex items-center gap-2 rounded-md px-2 py-2 text-[13px] break-all text-text-muted transition-colors hover:text-accent"
                >
                  <Mail size={15} aria-hidden="true" />
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.links.resume}
                  download={profile.resumeFileName}
                  className="tap-target -mx-2 inline-flex items-center gap-2 rounded-md px-2 py-2 text-[13px] font-medium text-accent hover:underline"
                >
                  Download Resume
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border-base pt-6 text-[12px] text-text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p>Built with React, TypeScript and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  )
}

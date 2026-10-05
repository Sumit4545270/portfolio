import { useEffect, useRef, useState } from 'react'
import { Menu, Moon, Sun, X, Download } from 'lucide-react'
import { profile } from '../data/profile'
import { Avatar } from './Avatar'
import { useTheme } from '../hooks/useTheme'
import { useActiveSection } from '../hooks/useActiveSection'

// Mirrors the section order in App.tsx so the highlight tracks the scroll.
const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
]

const NAV_IDS = NAV.map((n) => n.id)

export function Nav() {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(NAV_IDS)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the mobile drawer and restore focus on close.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-300 ${
          scrolled ? 'glass-bar border-b border-border-base shadow-sm' : ''
        }`}
      >
        <nav aria-label="Primary" className="container-page">
          <div className="flex h-16 items-center justify-between gap-6 lg:h-[4.75rem] lg:gap-10">
            <a
              href="#home"
              className="group flex shrink-0 items-center gap-2.5 text-sm font-bold tracking-tight"
            >
              <Avatar
                size={36}
                alt=""
                className="ring-1 ring-border-base transition-transform duration-200 group-hover:scale-105"
              />
              {/*
                Visually hidden rather than removed below 640px: the text stays
                in the accessibility tree, so the link keeps its name on phones
                without an aria-label that would contradict the visible text.
              */}
              <span className="sr-only leading-tight sm:not-sr-only sm:block">
                {profile.shortName}
                <span className="mt-0.5 block text-[11px] font-medium text-text-faint">
                  Full Stack · DevSecOps
                </span>
              </span>
            </a>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex xl:gap-2">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={`relative block rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors ${
                      active === item.id
                        ? 'text-accent'
                        : 'text-text-muted hover:text-text-base'
                    }`}
                  >
                    {item.label}
                    {active === item.id && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 lg:gap-2.5">
              <button
                type="button"
                onClick={toggle}
                className="tap-target grid h-10 w-10 place-items-center rounded-lg border border-border-base bg-surface text-text-muted transition-colors hover:border-border-strong hover:text-text-base"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun size={17} aria-hidden="true" />
                ) : (
                  <Moon size={17} aria-hidden="true" />
                )}
              </button>

              {/* Always reachable: icon-only on phones, labelled from 640px up. */}
              <a
                href={profile.links.resume}
                download={profile.resumeFileName}
                aria-label="Download resume (PDF)"
                className="tap-target inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-3 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover sm:px-4"
              >
                <Download size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Resume</span>
              </a>

              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(true)}
                className="tap-target grid h-10 w-10 place-items-center rounded-lg border border-border-base bg-surface text-text-base lg:hidden"
                aria-label="Open navigation menu"
                aria-expanded={open}
                aria-controls="mobile-nav"
              >
                <Menu size={19} aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[55] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute inset-y-0 right-0 flex w-[min(21rem,88vw)] flex-col border-l border-border-base bg-surface shadow-lg"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border-base px-5">
              <span className="text-sm font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="tap-target grid h-10 w-10 place-items-center rounded-lg border border-border-base text-text-muted"
                aria-label="Close navigation menu"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto px-3 py-4">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={`flex min-h-[48px] items-center rounded-lg px-4 text-[15px] font-medium transition-colors ${
                      active === item.id
                        ? 'bg-accent-soft text-accent-on-soft'
                        : 'text-text-muted hover:bg-surface-2 hover:text-text-base'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="shrink-0 space-y-2 border-t border-border-base p-4">
              <a
                href={profile.links.resume}
                download={profile.resumeFileName}
                onClick={() => setOpen(false)}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-accent-contrast"
              >
                <Download size={16} aria-hidden="true" />
                Download Resume
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-border-strong text-sm font-semibold"
              >
                Email me
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import { useEffect, useRef } from 'react'
import { X, ExternalLink, AlertTriangle } from 'lucide-react'
import type { CaseStudy } from '../data/projects'
import { TechIcon } from './TechIcon'

/** Accessible case-study dialog: focus trap, Escape to close, scroll lock. */
export function CaseStudyModal({ project, onClose }: { project: CaseStudy; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
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
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden border border-border-base bg-surface shadow-lg sm:max-h-[88vh] sm:max-w-4xl sm:rounded-2xl rounded-t-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start gap-4 border-b border-border-base bg-surface-2 px-5 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
              {project.category}
            </p>
            <h2 id="case-study-title" className="mt-1.5 text-lg leading-snug font-bold sm:text-xl">
              {project.name}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="tap-target grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border-base bg-surface text-text-muted transition-colors hover:text-text-base"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
          {project.note && (
            <p className="mb-6 flex gap-2.5 rounded-lg border border-warn/40 bg-warn/5 p-3.5 text-[13px] leading-relaxed text-text-muted">
              <AlertTriangle size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-warn" />
              {project.note}
            </p>
          )}

          {project.highlights.length > 0 && (
            <dl className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {project.highlights.map((h) => (
                <div key={h.label} className="rounded-xl border border-border-base bg-surface-2 p-3.5">
                  <dt className="text-[11px] leading-snug text-text-faint">{h.label}</dt>
                  <dd className="mt-1 font-mono text-base font-bold text-accent">{h.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="space-y-8">
            <Block label="01 · Problem" title="What was wrong">
              <p className="text-sm leading-relaxed text-text-muted">{project.problem}</p>
            </Block>

            <Block label="02 · Approach" title="What I did about it">
              <p className="text-sm leading-relaxed text-text-muted">{project.solution}</p>
            </Block>

            <Block label="03 · My contribution" title="The work that was mine">
              <ul className="space-y-2.5">
                {project.contribution.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </Block>

            <Block label="04 · Architecture" title="How it is put together">
              <dl className="space-y-3">
                {project.architecture.map((a) => (
                  <div key={a.layer} className="rounded-lg border border-border-base bg-surface-2 p-4">
                    <dt className="text-[13px] font-semibold text-accent">{a.layer}</dt>
                    <dd className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{a.detail}</dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block label="05 · Functionality" title="What it does">
              <ul className="grid gap-2 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 rounded-lg bg-surface-2 p-3 text-[13px] leading-snug text-text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-secure"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </Block>

            <Block label="06 · Engineering challenges" title="What went wrong, and the fix">
              <div className="space-y-4">
                {project.challenges.map((c) => (
                  <div key={c.challenge} className="rounded-lg border border-border-base p-4">
                    <p className="flex gap-2.5 text-[13px] leading-relaxed font-medium">
                      <span className="font-mono text-[11px] text-gate">ISSUE</span>
                      <span className="flex-1">{c.challenge}</span>
                    </p>
                    <p className="mt-3 flex gap-2.5 text-[13px] leading-relaxed text-text-muted">
                      <span className="font-mono text-[11px] text-secure">FIX</span>
                      <span className="flex-1">{c.resolution}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Block>

            <Block label="07 · Result" title="Where it ended up">
              <ul className="space-y-2.5">
                {project.outcome.map((o) => (
                  <li key={o} className="flex gap-2.5 text-sm leading-relaxed text-text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-secure"
                    />
                    {o}
                  </li>
                ))}
              </ul>
            </Block>

            <Block label="08 · Stack" title="Technologies used">
              <ul className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-wrap gap-2.5 border-t border-border-base bg-surface-2 px-5 py-4 sm:px-7">
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            <TechIcon name="github" size={16} />
            View source on GitHub
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex items-center gap-2 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              <ExternalLink size={16} aria-hidden="true" />
              Live demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function Block({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <p className="font-mono text-[11px] tracking-[0.14em] text-text-faint uppercase">{label}</p>
      <h3 className="mt-1 mb-4 text-base font-semibold">{title}</h3>
      {children}
    </section>
  )
}

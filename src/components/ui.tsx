import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { profile } from '../data/profile'

/* ------------------------------------------------------------------ layout */

export function Section({
  id,
  children,
  className = '',
  tinted = false,
}: {
  id: string
  children: ReactNode
  className?: string
  tinted?: boolean
}) {
  return (
    <section
      id={id}
      className={`section-pad section-seam relative scroll-mt-20 ${
        tinted ? 'section-wash bg-bg-sub' : ''
      } ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = 'left',
}: {
  id: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
}) {
  const centered = align === 'center'
  return (
    <header className={`reveal max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 id={`${id}-heading`} className="heading-section">
        {title}
      </h2>
      {lead && <p className="lead mt-4">{lead}</p>}
    </header>
  )
}

/* ----------------------------------------------------------------- buttons */

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  external?: boolean
  download?: string
  className?: string
  onClick?: () => void
  ariaLabel?: string
}

const base =
  'tap-target inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98]'

const variants = {
  primary:
    'bg-accent text-accent-contrast shadow-sm hover:bg-accent-hover hover:shadow-md',
  secondary:
    'border border-border-strong bg-surface text-text-base hover:border-accent hover:text-accent',
  ghost: 'text-text-muted hover:bg-surface-2 hover:text-text-base',
} as const

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external,
  download,
  className = '',
  onClick,
  ariaLabel,
}: ButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      download={download}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  )
}

/** Download button with a brief confirmation state after the click. */
export function ResumeButton({
  variant = 'primary',
  className = '',
  label = 'Download Resume',
}: {
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  label?: string
}) {
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    if (!clicked) return
    const t = setTimeout(() => setClicked(false), 2200)
    return () => clearTimeout(t)
  }, [clicked])

  return (
    <ButtonLink
      href={profile.links.resume}
      download={profile.resumeFileName}
      variant={variant}
      className={className}
      onClick={() => setClicked(true)}
      // The accessible name must contain the visible text, so it leads with it.
      ariaLabel={`${label} — ${profile.name} (PDF)`}
    >
      {clicked ? (
        <>
          <Check size={17} aria-hidden="true" />
          Downloading…
        </>
      ) : (
        <>
          <Download size={17} aria-hidden="true" />
          {label}
        </>
      )}
    </ButtonLink>
  )
}

/** Copies the email to the clipboard, falling back to a mailto link. */
export function CopyEmailButton({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(t)
  }, [copied])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }, [])

  return (
    <button
      type="button"
      onClick={copy}
      className={`tap-target inline-flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {copied ? (
        <>
          <Check size={16} className="text-secure" aria-hidden="true" />
          Email copied
        </>
      ) : (
        <>
          <Copy size={16} aria-hidden="true" />
          Copy email
        </>
      )}
      <span className="sr-only">{profile.email}</span>
    </button>
  )
}

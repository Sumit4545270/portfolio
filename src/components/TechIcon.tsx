import {
  Boxes,
  CalendarDays,
  Cloud,
  Code,
  Database,
  KeyRound,
  Layers,
  Lock,
  MessageSquare,
  Server,
  Shield,
  ShieldCheck,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { techIcons } from '../data/techIcons'
import { customIcons } from '../data/customIcons'

/**
 * Neutral glyphs for slugs with no vendor mark: brands withdrawn from
 * simple-icons (AWS, Slack), plus the generic concept icons used by the
 * pipeline and card data. Every slug the data can contain resolves here, so a
 * missing brand never renders as an empty box.
 */
const fallbacks: Record<string, LucideIcon> = {
  amazonwebservices: Cloud,
  amazonec2: Server,
  amazons3: Boxes,
  amazondynamodb: Database,
  amazoniam: KeyRound,
  slack: MessageSquare,
  shieldcheck: ShieldCheck,
  code: Code,
  cloud: Cloud,
  shield: Shield,
  lock: Lock,
  layers: Layers,
  users: Users,
  trophy: Trophy,
  calendar: CalendarDays,
}

type Props = {
  /** Icon slug as used in the data files. */
  name?: string
  size?: number
  className?: string
  /** Paint in the brand colour instead of inheriting currentColor. */
  brandColor?: boolean
}

/**
 * Renders a technology mark. Decorative by default — the readable label always
 * sits beside it in the DOM, so the icon is hidden from assistive tech.
 *
 * Brand colours are supplied as two CSS custom properties and selected by the
 * `dark` class, so a single static render is correct in both themes with no
 * JavaScript involved in the switch.
 */
export function TechIcon({ name, size = 18, className = '', brandColor = false }: Props) {
  if (!name) return null

  const icon = techIcons[name] ?? customIcons[name]

  if (icon) {
    return (
      <svg
        role="img"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={`${brandColor ? 'text-[var(--ic-l)] dark:text-[var(--ic-d)]' : ''} ${className}`}
        style={
          brandColor
            ? ({ '--ic-l': icon.light, '--ic-d': icon.dark } as React.CSSProperties)
            : undefined
        }
        fill="currentColor"
      >
        <path d={icon.path} />
      </svg>
    )
  }

  const Fallback = fallbacks[name]
  if (Fallback) {
    return <Fallback size={size} className={className} aria-hidden="true" strokeWidth={1.75} />
  }

  return null
}

/** The human-readable brand name for a slug, where we have one. */
export function techTitle(name?: string) {
  if (!name) return undefined
  return (techIcons[name] ?? customIcons[name])?.title
}

import { ShieldCheck } from 'lucide-react'
import { TechIcon } from './TechIcon'

/**
 * The hero graphic: a compact, honest rendering of the delivery pipeline Sumit
 * actually built. Every stage and label matches the real Jenkinsfile.
 *
 * Deliberately frameless — no card border, no window chrome. It sits directly
 * on the hero background with the grid showing through, so it reads as part of
 * the composition rather than a widget dropped beside it.
 *
 * Built from DOM + CSS rather than a fixed-size SVG so it reflows cleanly from
 * 320px to 4K, and the cascade animation is pure CSS (it stops entirely under
 * prefers-reduced-motion).
 */

const STAGES = [
  { icon: 'git', label: 'Commit', meta: 'webhook', tone: 'neutral' },
  { icon: 'jenkins', label: 'Jenkins build', meta: 'npm install', tone: 'neutral' },
  { icon: 'sonarqubeserver', label: 'SonarQube', meta: 'SAST · passed', tone: 'gate' },
  { icon: 'owasp', label: 'Dependency-Check', meta: 'SCA · CVSS < 9', tone: 'gate' },
  { icon: 'docker', label: 'Image build', meta: 'node:18-alpine', tone: 'neutral' },
  { icon: 'trivy', label: 'Trivy scan', meta: 'no CRITICAL', tone: 'gate' },
  { icon: 'argo', label: 'Argo CD sync', meta: 'GitOps', tone: 'neutral' },
  { icon: 'kubernetes', label: 'Canary rollout', meta: '20% → 100%', tone: 'accent' },
] as const

const metaTone = {
  neutral: 'text-text-faint',
  gate: 'text-secure',
  accent: 'text-accent',
} as const

export function HeroVisual() {
  return (
    <figure className="relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -inset-y-10 hidden rounded-[2.5rem] bg-accent/[0.055] blur-2xl md:block"
      />

      <div className="relative">
        {/* Caption line, not a title bar */}
        <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-border-base pb-3">
          <p className="eyebrow-muted">Delivery pipeline</p>
          <p className="font-mono text-[11px] text-text-faint">
            computer-academy · <span className="text-accent">#213</span>
          </p>
        </div>

        <ol className="relative">
          {/* Gradient rail threading the stages together */}
          <span
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-[1.0625rem] w-px bg-gradient-to-b from-transparent via-border-strong to-transparent"
          />

          {STAGES.map((stage, i) => (
            <li
              key={stage.label}
              className="hero-stage relative flex items-center gap-3.5 rounded-lg px-1.5 py-[0.4rem]"
              style={{ animationDelay: `${i * 0.42}s` }}
            >
              <span className="icon-tile icon-tile-sm relative z-10 !bg-surface">
                <TechIcon name={stage.icon} size={15} brandColor />
              </span>

              <span className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                <span className="truncate text-[13px] font-medium text-text-base">
                  {stage.label}
                </span>
                <span
                  className={`shrink-0 truncate font-mono text-[10.5px] ${metaTone[stage.tone]}`}
                >
                  {stage.meta}
                </span>
              </span>

              <span
                aria-hidden="true"
                className={`hero-stage-dot h-1.5 w-1.5 shrink-0 rounded-full ${
                  stage.tone === 'gate'
                    ? 'bg-secure'
                    : stage.tone === 'accent'
                      ? 'bg-accent'
                      : 'bg-border-strong'
                }`}
              />
            </li>
          ))}
        </ol>

        <figcaption className="mt-4 flex items-start gap-2 border-t border-border-base pt-3.5">
          <ShieldCheck size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-secure" />
          <p className="text-[11.5px] leading-relaxed text-text-faint">
            Three security gates, GitOps delivery and a canary release — rendered from the real
            stages of my DevSecOps platform.
          </p>
        </figcaption>
      </div>
    </figure>
  )
}

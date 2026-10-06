import { useState } from 'react'
import { ChevronRight, ShieldAlert, Globe, Lock, Boxes } from 'lucide-react'
import { pipeline, awsTopology } from '../data/projects'
import { Section, SectionHeading } from './ui'
import { TechIcon } from './TechIcon'

type Tab = 'pipeline' | 'architecture'

export function DeepDive() {
  const [tab, setTab] = useState<Tab>('pipeline')

  return (
    <Section id="deep-dive" tinted backdrop="pipeline">
      <SectionHeading
        id="deep-dive"
        eyebrow="Engineering deep dive"
        title="The system behind the claims"
        lead="Two views of the same DevSecOps platform: the pipeline a commit travels through, and the AWS environment it runs on. Both are rendered from the real Jenkinsfile and Terraform."
      />

      <div
        role="tablist"
        aria-label="Deep dive view"
        className="reveal mt-8 inline-flex rounded-xl border border-border-base bg-surface p-1"
      >
        <TabButton active={tab === 'pipeline'} onClick={() => setTab('pipeline')} controls="panel-pipeline">
          CI/CD Pipeline
        </TabButton>
        <TabButton active={tab === 'architecture'} onClick={() => setTab('architecture')} controls="panel-architecture">
          AWS Architecture
        </TabButton>
      </div>

      <div className="mt-8">
        {tab === 'pipeline' ? <PipelineView /> : <ArchitectureView />}
      </div>
    </Section>
  )
}

function TabButton({
  active,
  onClick,
  controls,
  children,
}: {
  active: boolean
  onClick: () => void
  controls: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={`tap-target rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
        active ? 'bg-accent text-accent-contrast' : 'text-text-muted hover:text-text-base'
      }`}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ pipeline */

const kindStyles = {
  source: 'border-border-base',
  build: 'border-border-base',
  security: 'border-gate/35',
  registry: 'border-border-base',
  deploy: 'border-accent/35',
  runtime: 'border-accent/35',
  observe: 'border-secure/35',
} as const

function PipelineView() {
  const [selected, setSelected] = useState(pipeline[3].id) // open on the first security gate
  const stage = pipeline.find((s) => s.id === selected) ?? pipeline[0]

  return (
    <div id="panel-pipeline" role="tabpanel" className="reveal">
      <p className="mb-5 text-sm text-text-muted">
        Select any stage to see what it does.{' '}
        <span className="inline-flex items-center gap-1.5 font-medium text-gate">
          <ShieldAlert size={14} aria-hidden="true" />
          Red stages can stop the build.
        </span>
      </p>

      {/*
        Flows as a wrapping row on wide screens and a vertical list on narrow
        ones, with the connector arrows swapping direction via CSS only.
      */}
      <ol className="flex flex-col gap-1.5 lg:flex-row lg:flex-wrap lg:items-stretch lg:gap-2">
        {pipeline.map((s, i) => {
          const isActive = s.id === selected
          return (
            <li key={s.id} className="flex items-center gap-1.5 lg:gap-2">
              <button
                type="button"
                onClick={() => setSelected(s.id)}
                aria-pressed={isActive}
                className={`tap-target group flex w-full items-center gap-3 rounded-xl border bg-surface px-3 py-2.5 text-left transition-all duration-200 lg:w-auto lg:flex-col lg:items-center lg:gap-2 lg:px-4 lg:py-3.5 ${
                  isActive
                    ? 'border-accent shadow-[var(--shadow-md)] lg:-translate-y-0.5'
                    : `${kindStyles[s.kind]} hover:border-border-strong`
                }`}
              >
                <span
                  className={`icon-tile icon-tile-sm ${isActive ? 'icon-tile-accent' : ''}`}
                >
                  <TechIcon name={s.icon} size={17} brandColor />
                </span>

                <span className="min-w-0 flex-1 lg:flex-none lg:text-center">
                  <span className="block truncate text-[13px] font-semibold lg:max-w-[7.5rem] lg:text-xs">
                    {s.label}
                  </span>
                  <span className="block truncate font-mono text-[10.5px] text-text-faint lg:max-w-[7.5rem]">
                    {s.tool}
                  </span>
                </span>

                {s.gate && (
                  <span className="shrink-0 rounded-md bg-gate-soft px-1.5 py-0.5 font-mono text-[9.5px] font-bold tracking-wide text-gate uppercase">
                    gate
                  </span>
                )}
              </button>

              {i < pipeline.length - 1 && (
                <ChevronRight
                  size={15}
                  aria-hidden="true"
                  className="hidden shrink-0 text-text-faint lg:block"
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* Detail panel */}
      <div className="surface-card mt-6 p-5 sm:p-6" aria-live="polite">
        <div className="flex flex-wrap items-center gap-3">
          <span className="icon-tile">
            <TechIcon name={stage.icon} size={19} brandColor />
          </span>
          <div>
            <h3 className="text-base font-semibold">{stage.label}</h3>
            <p className="font-mono text-[11px] text-text-faint">{stage.tool}</p>
          </div>
          {stage.gate && (
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gate-soft px-2.5 py-1.5 text-xs font-semibold text-gate">
              <ShieldAlert size={13} aria-hidden="true" />
              {stage.gate}
            </span>
          )}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">{stage.detail}</p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- architecture */

function ArchitectureView() {
  return (
    <div id="panel-architecture" role="tabpanel" className="reveal">
      <div className="surface-card overflow-hidden">
        {/* VPC header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-base bg-surface-2 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Boxes size={17} aria-hidden="true" className="text-accent" />
            <span className="text-sm font-semibold">VPC</span>
            <code className="font-mono text-xs text-text-faint">{awsTopology.vpc}</code>
          </div>
          <span className="chip">{awsTopology.region}</span>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {awsTopology.zones.map((zone) => (
            <div
              key={zone.id}
              className={`rounded-xl border p-4 ${
                zone.id === 'public'
                  ? 'border-warn/30 bg-warn/[0.035]'
                  : 'border-secure/30 bg-secure/[0.035]'
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {zone.id === 'public' ? (
                  <Globe size={15} aria-hidden="true" className="text-warn" />
                ) : (
                  <Lock size={15} aria-hidden="true" className="text-secure" />
                )}
                <h3 className="text-sm font-semibold">{zone.name}</h3>
                <code className="font-mono text-[11px] text-text-faint">{zone.cidr}</code>
                <p className="w-full text-[12px] text-text-muted sm:w-auto sm:flex-1">{zone.note}</p>
              </div>

              <ul className="grid gap-2.5 sm:grid-cols-2">
                {zone.nodes.map((n) => (
                  <li key={n.name} className="surface-card surface-card-hover p-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-[13px] font-semibold">{n.name}</h4>
                    </div>
                    <code className="mt-1 block font-mono text-[10.5px] text-accent">{n.type}</code>
                    <p className="mt-2 text-[11.5px] leading-snug text-text-faint">{n.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Managed services */}
          <div>
            <h3 className="mb-3 font-mono text-[11px] tracking-[0.14em] text-text-faint uppercase">
              Managed services &amp; gateways
            </h3>
            <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {awsTopology.managed.map((m) => (
                <li key={m.name} className="rounded-lg border border-border-base bg-surface-2 p-3">
                  <p className="text-[13px] font-semibold">{m.name}</p>
                  <p className="mt-1 text-[11.5px] leading-snug text-text-faint">{m.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-text-faint">
        Every instance type, CIDR block and service above is taken from the Terraform files in the
        repository — not an idealised diagram.
      </p>
    </div>
  )
}

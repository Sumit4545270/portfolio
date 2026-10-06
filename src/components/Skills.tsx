import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { skillCategories } from '../data/profile'
import { Section, SectionHeading } from './ui'
import { TechIcon } from './TechIcon'

export function Skills() {
  const [active, setActive] = useState<string>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return skillCategories
      .filter((c) => active === 'all' || c.id === active)
      .map((c) => ({
        ...c,
        skills: q
          ? c.skills.filter(
              (s) => s.name.toLowerCase().includes(q) || s.note?.toLowerCase().includes(q),
            )
          : c.skills,
      }))
      .filter((c) => c.skills.length > 0)
  }, [active, query])

  const total = useMemo(
    () => filtered.reduce((n, c) => n + c.skills.length, 0),
    [filtered],
  )

  return (
    <Section id="skills" backdrop="nodes">
      <SectionHeading
        id="skills"
        eyebrow="Technical skills"
        title="Technologies I have built with"
        lead="Grouped by what they are for, with a note on where I have actually used each one. No proficiency percentages — those are guesses, and you can verify these in the repositories instead."
      />

      {/* Controls */}
      <div className="reveal mt-9 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-5 overflow-x-auto px-5 no-scrollbar lg:mx-0 lg:min-w-0 lg:flex-1 lg:overflow-visible lg:px-0">
          <div
            role="tablist"
            aria-label="Filter skills by category"
            className="flex w-max gap-2 lg:w-auto lg:flex-wrap lg:gap-y-2.5"
          >
            <FilterTab active={active === 'all'} onClick={() => setActive('all')}>
              All
            </FilterTab>
            {skillCategories.map((c) => (
              <FilterTab key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
                {c.name}
              </FilterTab>
            ))}
          </div>
        </div>

        <div className="relative lg:w-72 lg:shrink-0">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-text-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              const v = e.target.value
              setQuery(v)
              // Searching spans every category; a match hidden behind the
              // active tab would otherwise look like no match at all.
              if (v && active !== 'all') setActive('all')
            }}
            placeholder="Search technologies…"
            aria-label="Search technologies"
            className="w-full rounded-lg border border-border-base bg-surface py-2.5 pr-9 pl-10 text-sm text-text-base placeholder:text-text-faint focus:border-accent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-text-faint hover:text-text-base"
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {total} technologies shown.
      </p>

      {/* Groups */}
      {filtered.length === 0 ? (
        <p className="mt-12 rounded-xl border border-dashed border-border-strong px-6 py-12 text-center text-sm text-text-muted">
          No technologies match “{query}”.
        </p>
      ) : (
        <div className="mt-8 space-y-9">
          {filtered.map((cat) => (
            <div key={cat.id} className="reveal">
              <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-base font-semibold">{cat.name}</h3>
                <p className="text-[13px] text-text-faint">{cat.blurb}</p>
              </div>

              <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {cat.skills.map((s) => (
                  <li key={`${cat.id}-${s.name}`}>
                    <div className="group surface-card surface-card-hover h-full p-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="icon-tile icon-tile-sm icon-tile-hover">
                          <TechIcon name={s.icon} size={16} brandColor />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                          {s.name}
                        </span>
                      </div>
                      {s.note && (
                        <p className="mt-2.5 text-[11.5px] leading-snug text-text-faint">
                          {s.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`tap-target shrink-0 rounded-lg border px-3.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors ${
        active
          ? 'border-accent bg-accent text-accent-contrast'
          : 'border-border-base bg-surface text-text-muted hover:border-border-strong hover:text-text-base'
      }`}
    >
      {children}
    </button>
  )
}

import { useEffect, useState } from 'react'
import { AlertTriangle, GitFork, Star, ExternalLink } from 'lucide-react'
import { profile } from '../data/profile'
import { Section, SectionHeading } from './ui'
import { TechIcon } from './TechIcon'

type Repo = {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  fork: boolean
}

type State =
  | { status: 'loading' }
  | { status: 'ready'; repos: Repo[] }
  | { status: 'error' }

const CACHE_KEY = 'gh-repos-v1'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

/** Reads a still-fresh cached response, if there is one. */
function readCache(): Repo[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { at, repos } = JSON.parse(raw)
    return Date.now() - at < CACHE_TTL ? repos : null
  } catch {
    return null
  }
}

/**
 * Live repository data from the public GitHub API — unauthenticated, so it is
 * rate-limited per visitor IP. Responses are cached in sessionStorage so a
 * visitor who returns to the page does not spend another request.
 *
 * Loading and failure are both handled visibly: on failure we say so and link
 * out, rather than inventing numbers.
 */
export function GitHubRepos() {
  const [state, setState] = useState<State>(() => {
    const cached = readCache()
    return cached ? { status: 'ready', repos: cached } : { status: 'loading' }
  })

  useEffect(() => {
    if (state.status === 'ready') return
    const controller = new AbortController()

    fetch(`https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<Repo[]>
      })
      .then((repos) => {
        const top = repos
          .filter((r) => !r.fork)
          .sort(
            (a, b) =>
              b.stargazers_count + b.forks_count - (a.stargazers_count + a.forks_count) ||
              Date.parse(b.pushed_at) - Date.parse(a.pushed_at),
          )
          .slice(0, 6)
        setState({ status: 'ready', repos: top })
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos: top }))
        } catch {
          /* storage unavailable — the list still renders, just uncached */
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setState({ status: 'error' })
      })

    return () => controller.abort()
    // Runs once: the guard above stops a refetch when the cache already filled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Section id="github">
      <SectionHeading
        id="github"
        eyebrow="Open source"
        title="Live from my GitHub"
        lead="Pulled from the GitHub API when this page loads — not a screenshot, and not numbers I typed in myself."
      />

      <div className="mt-10">
        {state.status === 'loading' && <SkeletonGrid />}

        {state.status === 'error' && (
          <div className="surface-card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
            <span className="icon-tile icon-tile-lg !border-warn/25 !bg-warn/10 text-warn">
              <AlertTriangle size={20} aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold">Could not load repositories just now</h3>
              <p className="mt-1 text-[13px] text-text-muted">
                GitHub&apos;s public API rate-limits by IP address. The repositories are still there
                — have a look directly.
              </p>
            </div>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex shrink-0 items-center gap-2 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              <TechIcon name="github" size={16} />
              Open GitHub
            </a>
          </div>
        )}

        {state.status === 'ready' && (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {state.repos.map((repo) => (
              <li key={repo.id}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card surface-card-hover group flex h-full flex-col p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-mono text-[13px] leading-snug font-semibold break-words text-accent group-hover:underline">
                      {repo.name}
                    </h3>
                    <ExternalLink
                      size={15}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-text-faint transition-colors group-hover:text-accent"
                    />
                  </div>

                  <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-text-muted">
                    {repo.description ?? (
                      <span className="text-text-faint italic">No description on GitHub</span>
                    )}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border-base pt-3.5 text-[12px] text-text-faint">
                    {repo.language && (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full bg-accent"
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Star size={13} aria-hidden="true" />
                        {repo.stargazers_count}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <GitFork size={13} aria-hidden="true" />
                        {repo.forks_count}
                      </span>
                    )}
                    <time
                      dateTime={repo.pushed_at}
                      className="ml-auto"
                      title={new Date(repo.pushed_at).toLocaleString()}
                    >
                      {new Date(repo.pushed_at).toLocaleDateString(undefined, {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            <TechIcon name="github" size={16} />
            See all repositories on GitHub
          </a>
        </div>
      </div>
    </Section>
  )
}

function SkeletonGrid() {
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading repositories">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="surface-card p-5">
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-border-base" />
          <div className="mt-3.5 h-2.5 w-full animate-pulse rounded bg-border-base" />
          <div className="mt-2 h-2.5 w-4/5 animate-pulse rounded bg-border-base" />
          <div className="mt-5 h-2.5 w-1/3 animate-pulse rounded bg-border-base" />
        </li>
      ))}
    </ul>
  )
}

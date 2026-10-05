import { Code2, FileCheck, GitBranch, Network, ScanLine, Users } from 'lucide-react'
import { Section, SectionHeading } from './ui'

/**
 * Answers "why should I believe this developer can contribute?" with checkable
 * evidence only. No testimonials, no client logos, no invented metrics —
 * everything here points at something a reviewer can open and verify.
 */
const EVIDENCE = [
  {
    icon: GitBranch,
    claim: 'The pipeline exists and you can read it',
    detail:
      'An eleven-stage declarative Jenkinsfile is committed in the repository — including the exact scanner invocations, failure thresholds and credential handling.',
    where: 'CDAC-Final-Project / Jenkinsfile',
  },
  {
    icon: Network,
    claim: 'The infrastructure is code, not a diagram',
    detail:
      'Ten Terraform files define the VPC, subnets, gateways, route tables, five EC2 instances, per-tier security groups, IAM and an S3 + DynamoDB state backend.',
    where: 'CDAC-Final-Project / terraform/',
  },
  {
    icon: ScanLine,
    claim: 'Security findings were fixed, not suppressed',
    detail:
      'The Dockerfile upgrades Alpine OpenSSL packages to clear the CVEs Trivy reported, and a tuned suppression file documents what was deliberately excluded and why.',
    where: 'Dockerfile · dependency-check-suppressions.xml',
  },
  {
    icon: Code2,
    claim: 'Working systems in three backend ecosystems',
    detail:
      'Node.js/Express with Mongoose models, Laravel with Eloquent controllers, and Django — each a separate project with its own data model and interface.',
    where: '3 independent repositories',
  },
  {
    icon: FileCheck,
    claim: 'The work is documented, not just written',
    detail:
      'Infrastructure setup, Kubernetes bring-up, scanner configuration, encountered errors and their resolutions are all written up alongside the code.',
    where: 'CDAC-Final-Project / CDAC Project/',
  },
  {
    icon: Users,
    claim: 'Other people use what I publish',
    detail:
      'My module-wise CCEE preparation repository has been forked by other candidates, and the README automation I wrote runs in a second repository of mine.',
    where: 'Public forks and stars on GitHub',
  },
]

export function ProofOfWork() {
  return (
    <Section id="proof" tinted>
      <SectionHeading
        id="proof"
        eyebrow="Proof of work"
        title="Why you can believe any of this"
        lead="Everything on this site points at something you can open. No testimonials, no client logos, no numbers I made up — if a claim is here, the artefact behind it is public."
      />

      <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {EVIDENCE.map((e, i) => (
          <li
            key={e.claim}
            className="reveal surface-card surface-card-hover flex flex-col p-5"
            data-reveal-delay={i * 60}
          >
            <span className="icon-tile !border-secure/25 !bg-secure/10 text-secure">
              <e.icon size={18} aria-hidden="true" strokeWidth={1.9} />
            </span>
            <h3 className="mt-4 text-[15px] leading-snug font-semibold">{e.claim}</h3>
            <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-text-muted">{e.detail}</p>
            <p className="mt-4 border-t border-border-base pt-3 font-mono text-[11px] break-words text-text-faint">
              {e.where}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

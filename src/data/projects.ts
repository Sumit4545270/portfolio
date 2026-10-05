/**
 * PROJECT CASE STUDIES.
 *
 * Every technical claim here was verified by reading the actual repository
 * source on github.com/Sumit4545270 — Jenkinsfile, terraform/*.tf,
 * argocd-apps/*.yaml, k8s-manifests/*.yaml, Dockerfile, package.json and
 * the application source tree. Nothing is inferred or embellished.
 */

export type CaseStudy = {
  id: string
  name: string
  tagline: string
  category: string
  featured: boolean
  period?: string
  problem: string
  solution: string
  contribution: string[]
  architecture: { layer: string; detail: string }[]
  features: string[]
  challenges: { challenge: string; resolution: string }[]
  outcome: string[]
  tech: string[]
  highlights: { label: string; value: string }[]
  repo: string
  demo?: string
  /** Rendered as a caveat chip on the card so claims stay honest. */
  note?: string
}

export const projects: CaseStudy[] = [
  {
    id: 'devsecops',
    name: 'DevSecOps Infra Automation for Secure Cloud Delivery',
    tagline:
      'An end-to-end GitOps delivery platform on AWS: Terraform-provisioned Kubernetes, a Jenkins pipeline with three security gates, canary releases through Argo Rollouts, and Prometheus/Grafana monitoring.',
    category: 'DevSecOps · Cloud · Kubernetes',
    featured: true,
    period: 'PG-DITISS capstone',
    problem:
      'A Node.js academy management application was being deployed by hand. There was no reproducible infrastructure, no record of which image was running, and no point in the process where insecure code or a vulnerable dependency would be stopped. Any rollback meant rebuilding from memory, and a bad release reached every user at once.',
    solution:
      'I rebuilt delivery as a single automated path. Terraform declares the whole AWS environment so it can be destroyed and recreated identically. A Jenkins pipeline builds the application and refuses to continue when SonarQube, OWASP Dependency-Check or Trivy report findings above the thresholds I set. Passing builds are pushed to Docker Hub tagged with the build number, the pipeline commits that tag into the manifest repository, and Argo CD reconciles the cluster to match — releasing through a weighted canary so a bad version is caught on a fraction of traffic before it reaches everyone.',
    contribution: [
      'Wrote the full Terraform configuration: VPC with public and private subnets, internet and NAT gateways, route tables, per-tier security groups, IAM, key pairs and five EC2 instances.',
      'Configured remote state in an encrypted S3 bucket with a DynamoDB lock table, so infrastructure state is shared and concurrent applies cannot corrupt it.',
      'Built the declarative Jenkins pipeline end to end — eleven stages from workspace clean through to the GitOps commit that triggers deployment.',
      'Integrated three distinct classes of security scanning (SAST, SCA and container image scanning) and tuned each gate so it blocks genuinely dangerous findings without failing on noise.',
      'Hardened the container image: Alpine base, production-only dependency install, OpenSSL packages upgraded to clear the CVEs Trivy reported, and Puppeteer’s Chromium download skipped to cut image size.',
      'Built the Kubernetes cluster — one control plane and two workers with Flannel CNI — and wrote the Rollout, Service and Ingress manifests including readiness and liveness probes.',
      'Set up Prometheus, Alertmanager and Grafana, routing cluster alerts into Slack.',
    ],
    architecture: [
      {
        layer: 'Network',
        detail:
          'A 10.0.0.0/16 VPC in ap-south-1 split into a public subnet (10.0.1.0/24) and a private subnet (10.0.2.0/24). An internet gateway fronts the public tier; a NAT gateway with an elastic IP gives private instances outbound access without being reachable from the internet.',
      },
      {
        layer: 'Compute',
        detail:
          'Five EC2 instances: a t3.large CI/CD node in the public subnet acting as the bastion and Jenkins host, a t2.medium Kubernetes control plane, two t2.medium workers, and a t2.micro MongoDB server — all four of those in the private subnet on gp3 volumes.',
      },
      {
        layer: 'Access control',
        detail:
          'Security groups are written per tier. SSH is restricted to a single declared IP, the Kubernetes API (6443) is open only inside the VPC, NodePort access is granted only to the CI/CD security group, and pod-to-pod traffic is scoped to the 10.244.0.0/16 Flannel CIDR with VXLAN on UDP 8472.',
      },
      {
        layer: 'State',
        detail:
          'Terraform state lives in an encrypted S3 bucket with a DynamoDB table providing lock coordination, so the environment has one authoritative definition rather than whatever is on someone’s laptop.',
      },
      {
        layer: 'Build',
        detail:
          'Jenkins runs SonarQube static analysis, then OWASP Dependency-Check for known-vulnerable libraries, then builds the Docker image and scans it with Trivy before any registry push. Docker Hub and GitHub credentials are injected through Jenkins credential bindings and piped via stdin, never written into the log.',
      },
      {
        layer: 'Delivery',
        detail:
          'The pipeline rewrites the image tag in argocd-apps/rollouts.yaml and commits it. Argo CD watches that repository and applies the change — so the Git history is the deployment history, and reverting a commit reverts production.',
      },
      {
        layer: 'Release',
        detail:
          'Argo Rollouts shifts 20% of traffic to the new version against a separate canary service before promoting to 100%, with two replicas behind stable and canary services and HTTP readiness and liveness probes on port 3000.',
      },
      {
        layer: 'Observability',
        detail:
          'Prometheus scrapes cluster and node metrics, Grafana dashboards visualise them, and Alertmanager routes firing alerts into a Slack channel. AWS Billing is tracked so the cost of the environment stays visible.',
      },
    ],
    features: [
      'Eleven-stage declarative Jenkins pipeline triggered by GitHub webhooks',
      'SonarQube static analysis on every build',
      'OWASP Dependency-Check with a CVSS 9 failure threshold and a tuned suppression file',
      'Trivy image scanning — a report for HIGH and CRITICAL, a hard build failure on CRITICAL',
      'Images tagged with the Jenkins build number, so every running pod is traceable to a build',
      'GitOps deployment: the manifest repository is the single source of deployment truth',
      'Canary release with weighted traffic steps and automatic promotion',
      'Readiness and liveness probes so Kubernetes never routes traffic to an unready pod',
      'Prometheus, Grafana and Slack-routed Alertmanager notifications',
      'Dependency-Check and Trivy reports archived as build artifacts for audit',
    ],
    challenges: [
      {
        challenge:
          'Trivy initially failed every build. The base image carried known OpenSSL vulnerabilities, and the scanner was also reading the HTML dependency report generated earlier in the pipeline.',
        resolution:
          'I upgraded libcrypto3 and libssl3 in the Dockerfile to patch the real finding rather than ignore it, and excluded the generated report path from the scan. I also split the gate in two — a non-blocking JSON report covering HIGH and CRITICAL for visibility, and a blocking scan on CRITICAL only — so the pipeline stays strict about what actually matters without stalling on every medium-severity advisory.',
      },
      {
        challenge:
          'The private subnet is the right place for the cluster and the database, but it makes everything unreachable for administration and deployment.',
        resolution:
          'I placed the CI/CD node in the public subnet as a bastion and granted NodePort access by referencing its security group rather than a CIDR block. Private instances reach the internet outbound through the NAT gateway for package installs, but nothing on the internet can open a connection to them.',
      },
      {
        challenge:
          'Kubernetes networking broke on first cluster bring-up — pods could not reach each other across nodes.',
        resolution:
          'Flannel uses VXLAN encapsulation, which needs UDP 8472 open between nodes, and the pod CIDR itself needs to be allowed. I added explicit security group rules for UDP 8472 and for full TCP and UDP within 10.244.0.0/16, which is the kind of detail that is invisible until the overlay fails.',
      },
      {
        challenge:
          'Deployments could not be traced. Using the latest tag meant there was no way to know which build was actually running.',
        resolution:
          'Every image is tagged with the Jenkins build number, and the pipeline writes that exact tag into the Rollout manifest and commits it. Any running pod can be traced back to a specific build, and rolling back is a Git revert rather than a manual rebuild.',
      },
    ],
    outcome: [
      'Deployment went from a manual sequence of steps to a single automated path from commit to canary release.',
      'Three classes of vulnerability — source, dependency and container image — are now checked on every build, with the build blocked rather than warned.',
      'The complete environment is reproducible from Terraform, with state stored remotely and locked.',
      'Running versions are traceable to a build number, and rollback is a Git operation.',
      'Cluster health is visible in Grafana, with alerts reaching Slack rather than sitting unread.',
    ],
    tech: [
      'AWS', 'Terraform', 'Kubernetes', 'Docker', 'Jenkins', 'Argo CD', 'Argo Rollouts',
      'SonarQube', 'Trivy', 'OWASP Dependency-Check', 'Prometheus', 'Grafana',
      'Alertmanager', 'Node.js', 'Express.js', 'MongoDB', 'EJS', 'Linux', 'Git',
    ],
    highlights: [
      { label: 'Pipeline stages', value: '11' },
      { label: 'Security gates', value: '3' },
      { label: 'EC2 instances as code', value: '5' },
      { label: 'Canary traffic step', value: '20% → 100%' },
    ],
    repo: 'https://github.com/Sumit4545270/CDAC-Final-Project',
  },
  {
    id: 'inventory',
    name: 'Lab Inventory & Resource Management System',
    tagline:
      'A Laravel application for managing college laboratory equipment — inventory records, bookings, reservations and maintenance history behind a charted dashboard.',
    category: 'Full Stack · Laravel · MySQL',
    featured: true,
    problem:
      'Laboratory equipment was tracked on paper and in spreadsheets. Nobody could answer simple questions reliably — what is in the lab, who currently has a given item, when it is next booked, and when it was last serviced. Double bookings happened, and maintenance was reactive because no history existed.',
    solution:
      'I designed and built a web application around four related entities — equipment, reservations, maintenance records and users — so each question has one authoritative answer. Staff manage inventory through CRUD screens, book equipment through a reservation flow that references real availability, and log maintenance against the specific item, which builds the service history over time. A dashboard aggregates the current state into charts.',
    contribution: [
      'Designed the system and its data model; the design document in the repository is credited to me.',
      'Built the Laravel MVC structure: Equipment, Reservation, MaintenanceRecord and User models with controllers for each.',
      'Implemented the dashboard controller that aggregates inventory and booking state into the charted overview.',
      'Built CRUD screens for inventory management, the booking and reservation workflow, and maintenance record logging.',
      'Added a GitHub Actions workflow for repository automation.',
    ],
    architecture: [
      {
        layer: 'Pattern',
        detail:
          'Laravel MVC. Four controllers — Dashboard, Equipment, MaintenanceRecord and Reservation — each owning one area of the system, keeping request handling separate from the data model.',
      },
      {
        layer: 'Data model',
        detail:
          'Eloquent models for Equipment, Reservation, MaintenanceRecord and User. Reservations and maintenance records both reference equipment, so an item carries both its booking schedule and its full service history.',
      },
      {
        layer: 'Views',
        detail:
          'Blade templates rendering the dashboard, inventory listing, individual item views, booking management and reservation management screens.',
      },
      { layer: 'Persistence', detail: 'MySQL relational storage.' },
      {
        layer: 'Visualisation',
        detail: 'amCharts renders the dashboard summaries of inventory and booking state.',
      },
    ],
    features: [
      'Full CRUD over laboratory equipment records',
      'Equipment booking workflow',
      'Reservation management with a dedicated view',
      'Maintenance records logged against individual items, building service history',
      'Charted dashboard summarising inventory and activity',
      'Item detail views for individual equipment',
    ],
    challenges: [
      {
        challenge:
          'Equipment, bookings and maintenance are three different concerns that all describe the same physical object, and collapsing them into one table would have made every query awkward.',
        resolution:
          'I modelled them as separate related entities. An item can be queried for what it is, who has it booked, and what has been done to it — independently — without duplicating equipment data into the booking or maintenance rows.',
      },
      {
        challenge:
          'A dashboard that reads raw tables is useless to staff who need an answer at a glance.',
        resolution:
          'I put aggregation in a dedicated DashboardController rather than in the views, so the summary logic lives in one place and the charts consume prepared data.',
      },
    ],
    outcome: [
      'Replaced paper and spreadsheet tracking with one system holding a single authoritative record per item.',
      'Bookings and maintenance are tied to specific equipment, so service history accumulates automatically.',
      'Current lab state is visible on a dashboard rather than requiring someone to compile it.',
    ],
    tech: ['Laravel', 'PHP', 'Blade', 'MySQL', 'JavaScript', 'amCharts', 'HTML5', 'CSS3', 'GitHub Actions'],
    highlights: [
      { label: 'Core entities', value: '4' },
      { label: 'Controllers', value: '4' },
      { label: 'Pattern', value: 'MVC' },
    ],
    repo: 'https://github.com/Sumit4545270/Inventory-Management-System',
    note: 'My resume lists this project’s stack as HTML, CSS, JavaScript and MySQL. The repository is a Laravel application — worth aligning the two.',
  },
  {
    id: 'result-analyser',
    name: 'MSBTE Result Analyser System',
    tagline:
      'A Django application for analysing MSBTE semester results across multiple courses and semesters.',
    category: 'Full Stack · Django · Python',
    featured: false,
    problem:
      'Semester result data arrives in bulk and is tedious to interpret. Reading per-student outcomes and spotting patterns across a cohort by hand does not scale.',
    solution:
      'A Django web application that ingests result data across courses and semesters and presents the analysis through a web interface, with a CI workflow checking the project on each push.',
    contribution: [
      'Built the Django application structure and views.',
      'Handled result datasets spanning multiple courses and semesters 1, 3 and 5.',
      'Added a GitHub Actions workflow for Django CI.',
      'Documented the interface extensively with screenshots in the repository.',
    ],
    architecture: [
      { layer: 'Framework', detail: 'Django, following its MVT request/response structure.' },
      { layer: 'Frontend', detail: 'HTML, SCSS and JavaScript templates for the result views.' },
      { layer: 'CI', detail: 'A GitHub Actions Django workflow running on push.' },
    ],
    features: [
      'Result analysis across multiple courses and semesters',
      'Web interface for browsing outcomes',
      'Automated CI on every push',
    ],
    challenges: [
      {
        challenge: 'Result data spans several courses and semesters in differing shapes.',
        resolution: 'Organised the data handling so multiple course and semester datasets feed one analysis interface.',
      },
    ],
    outcome: ['Turned bulk result files into a browsable analysis interface.'],
    tech: ['Django', 'Python', 'JavaScript', 'SCSS', 'HTML5', 'CSS3', 'GitHub Actions'],
    highlights: [
      { label: 'Framework', value: 'Django' },
      { label: 'CI', value: 'GitHub Actions' },
    ],
    repo: 'https://github.com/Sumit4545270/Result-Analyser-System-Django-Project',
  },
  {
    id: 'devops-assignment',
    name: 'Containerised Laravel Stack — DevOps Assignment',
    tagline:
      'A Laravel application containerised with Nginx and MySQL via Docker, covering migrations and deployment, documented end to end.',
    category: 'DevOps · Docker · Laravel',
    featured: false,
    problem:
      'A Laravel application needed to run reproducibly with its web server and database, rather than depending on whatever is installed on a given machine.',
    solution:
      'Containerised the full stack — Laravel application, Nginx as the web server and MySQL for persistence — with a Dockerfile and supporting configuration, and verified both the normal and post-migration states.',
    contribution: [
      'Wrote the Dockerfile for the Laravel application.',
      'Configured the Nginx and MySQL stack alongside it.',
      'Ran and verified database migrations inside the containerised environment.',
      'Produced full written documentation of the setup and outcomes.',
    ],
    architecture: [
      { layer: 'Application', detail: 'Laravel with Blade and Vue components.' },
      { layer: 'Web server', detail: 'Nginx fronting the application.' },
      { layer: 'Database', detail: 'MySQL with Laravel migrations.' },
      { layer: 'Packaging', detail: 'Docker, so the stack starts the same way anywhere.' },
    ],
    features: [
      'Containerised Laravel, Nginx and MySQL stack',
      'Database migrations run inside containers',
      'Verified outcomes documented with evidence',
      'Full written setup documentation',
    ],
    challenges: [
      {
        challenge: 'Laravel needs its database reachable and migrated before the application is usable.',
        resolution: 'Sequenced the container setup so migrations run against the MySQL service, and captured both the pre- and post-migration states as evidence.',
      },
    ],
    outcome: ['A Laravel stack that starts reproducibly from containers, with the process documented.'],
    tech: ['Docker', 'Laravel', 'PHP', 'Nginx', 'MySQL', 'Blade', 'Vue'],
    highlights: [
      { label: 'Services', value: '3' },
      { label: 'Packaging', value: 'Docker' },
    ],
    repo: 'https://github.com/Sumit4545270/devops-assignment-CloudTechServices',
  },
  {
    id: 'cleanup-dashboard',
    name: 'GitHub Repository Cleanup Dashboard',
    tagline:
      'A GitHub Actions automation that audits a repository for unused files and keeps a live file-tree view in the README.',
    category: 'Automation · GitHub Actions',
    featured: false,
    problem:
      'Repositories accumulate files nobody is using, and READMEs describing structure go stale the moment anything moves.',
    solution:
      'A pair of Node.js scripts driven by a GitHub Actions workflow: one audits the repository and records candidates for removal, the other regenerates a file-tree section in the README so the documented structure matches the actual repository.',
    contribution: [
      'Wrote the cleanup audit script that identifies unused files.',
      'Wrote the README generation script that renders the live repository tree.',
      'Built the GitHub Actions workflow that runs both automatically.',
      'Deployed it to a second repository, where it maintains the README in production.',
    ],
    architecture: [
      { layer: 'Trigger', detail: 'A GitHub Actions workflow running the audit on schedule.' },
      { layer: 'Audit', detail: 'cleanup-check.js scans the repository and writes its findings to unused-files.json.' },
      { layer: 'Documentation', detail: 'update-readme.js regenerates the repository tree section in the README.' },
    ],
    features: [
      'Automated unused-file detection',
      'Self-updating README repository tree',
      'Findings recorded as structured JSON',
      'Runs with no manual intervention',
    ],
    challenges: [
      {
        challenge: 'Documentation of repository structure drifts from reality as soon as files move.',
        resolution: 'Generated the structure section from the repository itself rather than writing it by hand, so it cannot drift.',
      },
    ],
    outcome: [
      'Running in a second repository, where it keeps the README file tree current automatically.',
    ],
    tech: ['Node.js', 'JavaScript', 'GitHub Actions', 'YAML'],
    highlights: [
      { label: 'Fully automated', value: 'Yes' },
      { label: 'In use on', value: '2 repos' },
    ],
    repo: 'https://github.com/Sumit4545270/github-cleanup-dashboard',
  },
]

/** Section 9 — interactive DevSecOps pipeline visualisation. All stages verified in the Jenkinsfile. */
export type PipelineStage = {
  id: string
  label: string
  tool: string
  icon: string
  kind: 'source' | 'build' | 'security' | 'registry' | 'deploy' | 'runtime' | 'observe'
  detail: string
  /** Shown as a red chip — this stage can stop the pipeline. */
  gate?: string
}

export const pipeline: PipelineStage[] = [
  {
    id: 'developer',
    label: 'Developer',
    tool: 'Commit',
    icon: 'code',
    kind: 'source',
    detail: 'A change is committed to the application repository.',
  },
  {
    id: 'git',
    label: 'Source Control',
    tool: 'GitHub',
    icon: 'github',
    kind: 'source',
    detail: 'GitHub holds the application source. A webhook notifies Jenkins that new work has landed.',
  },
  {
    id: 'jenkins',
    label: 'CI Pipeline',
    tool: 'Jenkins',
    icon: 'jenkins',
    kind: 'build',
    detail:
      'A declarative pipeline cleans the workspace, checks out the code and installs dependencies before any analysis runs.',
  },
  {
    id: 'sonarqube',
    label: 'Static Analysis',
    tool: 'SonarQube',
    icon: 'sonarqubeserver',
    kind: 'security',
    detail:
      'SAST. The sonar-scanner analyses the JavaScript source for code quality issues and security vulnerabilities in code I wrote.',
    gate: 'Quality gate',
  },
  {
    id: 'owasp',
    label: 'Dependency Scan',
    tool: 'OWASP Dependency-Check',
    icon: 'owasp',
    kind: 'security',
    detail:
      'SCA. Every third-party library is checked against known CVEs, with XML and HTML reports published back to Jenkins.',
    gate: 'Fails on CVSS 9+',
  },
  {
    id: 'docker',
    label: 'Image Build',
    tool: 'Docker',
    icon: 'docker',
    kind: 'build',
    detail:
      'A node:18-alpine image is built with production-only dependencies, patched OpenSSL packages and layer caching on package.json.',
  },
  {
    id: 'trivy',
    label: 'Image Scan',
    tool: 'Trivy',
    icon: 'trivy',
    kind: 'security',
    detail:
      'The built image is scanned for OS and library vulnerabilities. A JSON report covers HIGH and CRITICAL; the gate blocks on CRITICAL.',
    gate: 'Fails on CRITICAL',
  },
  {
    id: 'registry',
    label: 'Registry',
    tool: 'Docker Hub',
    icon: 'docker',
    kind: 'registry',
    detail:
      'Only scanned images are pushed, tagged with the Jenkins build number so every deployment traces back to one build. Credentials are bound at runtime and piped through stdin.',
  },
  {
    id: 'gitops',
    label: 'GitOps Commit',
    tool: 'Git',
    icon: 'git',
    kind: 'deploy',
    detail:
      'The pipeline rewrites the image tag in the Rollout manifest and commits it. The manifest repository becomes the deployment record.',
  },
  {
    id: 'argocd',
    label: 'GitOps Sync',
    tool: 'Argo CD',
    icon: 'argo',
    kind: 'deploy',
    detail:
      'Argo CD watches the manifest repository and reconciles the cluster to match it. Reverting the commit reverts the deployment.',
  },
  {
    id: 'rollouts',
    label: 'Canary Release',
    tool: 'Argo Rollouts',
    icon: 'argo',
    kind: 'deploy',
    detail:
      'Traffic shifts to 20% on the canary service before promotion to 100%, so a bad release is contained to a fraction of users.',
  },
  {
    id: 'kubernetes',
    label: 'Runtime',
    tool: 'Kubernetes on AWS',
    icon: 'kubernetes',
    kind: 'runtime',
    detail:
      'Two replicas run on a control plane plus two workers in a private subnet, with HTTP readiness and liveness probes on port 3000. The Deployment manifest sources the database URL from a Kubernetes Secret.',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    tool: 'Prometheus · Grafana',
    icon: 'prometheus',
    kind: 'observe',
    detail:
      'Prometheus scrapes metrics, Grafana dashboards display cluster and application health, and Alertmanager routes firing alerts into Slack.',
  },
]

/** AWS topology for the architecture diagram. Verified against terraform/*.tf. */
export const awsTopology = {
  region: 'ap-south-1 (Mumbai)',
  vpc: '10.0.0.0/16',
  zones: [
    {
      id: 'public',
      name: 'Public Subnet',
      cidr: '10.0.1.0/24',
      note: 'Internet-facing. Reached through the internet gateway.',
      nodes: [
        {
          name: 'CI/CD + Bastion Node',
          type: 't3.large · 40 GB gp3',
          detail: 'Hosts Jenkins, SonarQube and the scanning toolchain. The only SSH entry point, restricted to a single declared IP.',
        },
      ],
    },
    {
      id: 'private',
      name: 'Private Subnet',
      cidr: '10.0.2.0/24',
      note: 'No inbound internet route. Outbound only, via the NAT gateway.',
      nodes: [
        {
          name: 'Kubernetes Control Plane',
          type: 't2.medium · 30 GB gp3',
          detail: 'API server reachable only inside the VPC on port 6443.',
        },
        {
          name: 'Worker Node 1',
          type: 't2.medium · 30 GB gp3',
          detail: 'Runs application pods. Flannel VXLAN overlay on UDP 8472.',
        },
        {
          name: 'Worker Node 2',
          type: 't2.medium · 30 GB gp3',
          detail: 'Second worker providing capacity for the two-replica canary rollout.',
        },
        {
          name: 'MongoDB Server',
          type: 't2.micro',
          detail: 'Application database, unreachable from the internet. Reached only by pods inside the VPC.',
        },
      ],
    },
  ],
  managed: [
    { name: 'S3', detail: 'Encrypted remote Terraform state backend.' },
    { name: 'DynamoDB', detail: 'State lock table preventing concurrent applies.' },
    { name: 'NAT Gateway', detail: 'Elastic IP; outbound-only internet for private instances.' },
    { name: 'Internet Gateway', detail: 'Inbound route for the public subnet only.' },
    { name: 'IAM', detail: 'Roles and instance permissions.' },
  ],
}

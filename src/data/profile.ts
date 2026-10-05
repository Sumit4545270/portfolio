/**
 * SINGLE SOURCE OF TRUTH.
 *
 * Every fact below is traceable to one of:
 *   [resume]  Sumit_Badgujar_Resume.pdf
 *   [github]  Verified by reading actual repository code/config at github.com/Sumit4545270
 *   [user]    Confirmed directly by Sumit
 *
 * Do not add skills, metrics, employers or achievements that lack a source.
 * If something cannot be sourced, leave it out rather than inferring it.
 */

export const profile = {
  name: 'Sumit Sanjay Badgujar',
  shortName: 'Sumit Badgujar',
  role: 'Full Stack Software Engineer', // [user]
  company: 'Genzeon', // [user]
  headline: 'Full Stack Engineer who ships through secure, automated cloud pipelines.',
  location: 'Ravet, Pune, Maharashtra, India', // [resume]
  email: 'Sumitcdac39@gmail.com', // [user]
  links: {
    linkedin: 'https://www.linkedin.com/in/sumit-badgujar-9703091b5/', // [resume]
    github: 'https://github.com/Sumit4545270', // [resume]
    resume: '/resume/Sumit_Badgujar_Resume.pdf',
  },
  resumeFileName: 'Sumit_Badgujar_Resume.pdf',
  githubUser: 'Sumit4545270',
}

/** Hero value proposition — three clauses readable in five seconds. */
export const valueProp = [
  {
    label: 'I build',
    text: 'Full stack web applications — Node.js/Express, Laravel and Django backends with real data models, authentication and admin workflows.',
  },
  {
    label: 'I ship',
    text: 'Through pipelines I write myself: Jenkins, Docker, Terraform-provisioned AWS, and GitOps delivery onto Kubernetes.',
  },
  {
    label: 'I secure',
    text: 'With scanning gates that actually block bad builds — SonarQube SAST, OWASP Dependency-Check SCA and Trivy image scanning.',
  },
]

/** Section 5 — Why companies should consider me. Differentiators, not a tech list. */
export const differentiators = [
  {
    id: 'end-to-end',
    icon: 'layers',
    title: 'I own the path from code to production',
    pitch:
      'Many engineers at my stage stop at the pull request. I have written the application, the Dockerfile, the Terraform that creates the VPC it runs in, the Jenkins pipeline that builds it and the Argo Rollout that releases it — so I understand what my code costs to operate.',
    evidence: 'Verified end-to-end across the DevSecOps platform repository.',
  },
  {
    id: 'security',
    icon: 'shield',
    title: 'I treat security as a build step, not a review meeting',
    pitch:
      'My pipeline fails the build on CRITICAL container vulnerabilities and on dependency CVEs scoring 9 or above. I have fixed real findings — upgrading Alpine OpenSSL packages in the base image after Trivy flagged them — rather than suppressing them.',
    evidence: 'SonarQube, OWASP Dependency-Check and Trivy gates in the Jenkinsfile.',
  },
  {
    id: 'iac',
    icon: 'cloud',
    title: 'I provision infrastructure reproducibly',
    pitch:
      'The entire AWS environment is declarative Terraform with remote S3 state and DynamoDB locking — public and private subnet split, NAT gateway, per-tier security groups. It can be destroyed and rebuilt, which is what makes an environment trustworthy.',
    evidence: 'Ten Terraform files covering VPC, EC2, IAM, security groups and state backend.',
  },
  {
    id: 'polyglot',
    icon: 'code',
    title: 'I pick up unfamiliar stacks quickly',
    pitch:
      'Across my repositories I have shipped working systems in Node.js/Express, Laravel/PHP and Django/Python, plus Terraform HCL and Kubernetes YAML. I optimise for solving the problem, not for defending one framework.',
    evidence: 'Independent projects in three different backend ecosystems.',
  },
  {
    id: 'foundation',
    icon: 'lock',
    title: 'I have formal security and infrastructure training',
    pitch:
      'PG-DITISS covered network defense and compliance, PKI, cyber forensics and operating system administration. That gives me fundamentals and vocabulary most application developers only pick up later on the job.',
    evidence: 'PG-DITISS — 183/240 across six modules.',
  },
  {
    id: 'leadership',
    icon: 'users',
    title: 'I have led, not just participated',
    pitch:
      'Tech Club President organising national workshops, Fest Coordinator running an event for 200+ participants, and a first-place hackathon finish. I can run something end to end and explain it to people who are not engineers.',
    evidence: 'Leadership and competition record from my resume.',
  },
]

/** Section 6 — About. Deliberately tight. */
export const about = {
  paragraphs: [
    'I am a Computer Engineering graduate who went looking for the other half of software delivery. I finished my B.Tech in 2025, then took PG-DITISS, a post-graduate diploma in IT infrastructure, systems and security, because I wanted to understand what happens to code after it is merged.',
    'That combination is how I work. I build the application, then I build the pipeline that proves it is safe to release: static analysis, dependency scanning, container scanning, declarative infrastructure, and a progressive rollout that can be reversed. I currently work as a Full Stack Software Engineer at Genzeon.',
    'I care most about systems where the engineering is visible — where you can point at the architecture and explain why each decision was made. That is the work I am looking to do more of.',
  ],
  facts: [
    { label: 'Based in', value: 'Ravet, Pune, Maharashtra' },
    { label: 'Current role', value: 'Full Stack Software Engineer at Genzeon' },
    { label: 'Focus', value: 'Full Stack · DevSecOps · Cloud Infrastructure' },
    { label: 'Public repositories', value: '16 on GitHub' },
  ],
}

export type SkillCategory = {
  id: string
  name: string
  blurb: string
  skills: { name: string; icon?: string; note?: string }[]
}

/** Section 7 — Skills. No proficiency percentages, by design. */
export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Languages',
    blurb: 'What I write day to day.',
    skills: [
      { name: 'JavaScript', icon: 'javascript', note: 'Primary language across Node.js and browser work' },
      { name: 'Java', icon: 'openjdk', note: 'Java Training certification; practice applications repository' },
      { name: 'Python', icon: 'python', note: 'Django project and automation scripting' },
      { name: 'PHP', icon: 'php', note: 'Laravel applications' },
      { name: 'SQL', icon: 'mysql', note: 'Relational schema and query work' },
      { name: 'HCL', icon: 'terraform', note: 'Terraform infrastructure definitions' },
      { name: 'Bash', icon: 'gnubash', note: 'Pipeline steps and Linux administration' },
      { name: 'HTML5', icon: 'html5', note: 'Semantic markup' },
      { name: 'CSS3', icon: 'css', note: 'Responsive layout and styling' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    blurb: 'Three ecosystems, each with a shipped project behind it.',
    skills: [
      { name: 'Node.js', icon: 'nodedotjs', note: 'Runtime for the Computer Academy platform' },
      { name: 'Express.js', icon: 'express', note: 'Routing, middleware and the auth layer' },
      { name: 'Laravel', icon: 'laravel', note: 'MVC controllers and Eloquent models' },
      { name: 'Django', icon: 'django', note: 'Result Analyser System' },
      { name: 'Mongoose', icon: 'mongoose', note: 'Schema modelling over MongoDB' },
      { name: 'REST APIs', icon: 'jsonwebtokens', note: 'Resource routing and JSON endpoints' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend',
    blurb: 'Server-rendered views and dashboard interfaces.',
    skills: [
      { name: 'EJS', icon: 'ejs', note: 'Templating with layouts and partials' },
      { name: 'Blade', icon: 'laravel', note: 'Laravel templating engine' },
      { name: 'Responsive CSS', icon: 'css', note: 'Mobile-first layouts' },
      { name: 'amCharts', icon: 'chartdotjs', note: 'Dashboard data visualisation' },
      { name: 'Bootstrap', icon: 'bootstrap', note: 'Component styling' },
    ],
  },
  {
    id: 'database',
    name: 'Databases',
    blurb: 'Document and relational, plus state storage for infrastructure.',
    skills: [
      { name: 'MongoDB', icon: 'mongodb', note: 'Self-hosted on a private-subnet EC2 instance' },
      { name: 'MySQL', icon: 'mysql', note: 'Inventory and Laravel applications' },
      { name: 'DynamoDB', icon: 'amazondynamodb', note: 'Terraform state locking table' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud',
    blurb: 'AWS provisioned as code, in ap-south-1.',
    skills: [
      { name: 'AWS EC2', icon: 'amazonec2', note: 'Five-instance Kubernetes and CI/CD topology' },
      { name: 'AWS VPC', icon: 'amazonwebservices', note: 'Public and private subnets, IGW, NAT gateway, route tables' },
      { name: 'AWS S3', icon: 'amazons3', note: 'Encrypted remote Terraform state backend' },
      { name: 'AWS IAM', icon: 'amazoniam', note: 'Roles and instance permissions' },
      { name: 'Security Groups', icon: 'amazonwebservices', note: 'Per-tier least-privilege network rules' },
      { name: 'Google Cloud', icon: 'googlecloud', note: 'Google Cloud Arcade Facilitator Program' },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps',
    blurb: 'Build, package, provision, deploy.',
    skills: [
      { name: 'Jenkins', icon: 'jenkins', note: 'Declarative multi-stage pipeline with credential binding' },
      { name: 'Docker', icon: 'docker', note: 'Alpine images with layer-cache optimisation' },
      { name: 'Kubernetes', icon: 'kubernetes', note: 'Master and two workers, Flannel CNI, probes, Ingress' },
      { name: 'Terraform', icon: 'terraform', note: 'Full AWS environment as code with remote locked state' },
      { name: 'Argo CD', icon: 'argo', note: 'GitOps reconciliation from the manifest repository' },
      { name: 'Argo Rollouts', icon: 'argo', note: 'Canary releases with weighted traffic steps' },
      { name: 'GitHub Actions', icon: 'githubactions', note: 'Repository automation workflows' },
      { name: 'Git', icon: 'git', note: 'Branching, webhooks and automated commits' },
      { name: 'Docker Hub', icon: 'docker', note: 'Build-number-tagged image registry' },
      { name: 'Nginx', icon: 'nginx', note: 'Reverse proxy and containerised web serving' },
      { name: 'Linux', icon: 'linux', note: 'Server administration; PG-DITISS OS & Administration module' },
    ],
  },
  {
    id: 'devsecops',
    name: 'DevSecOps',
    blurb: 'Security gates wired into the build, with real findings fixed.',
    skills: [
      { name: 'SonarQube', icon: 'sonarqubeserver', note: 'SAST stage — code quality and vulnerability analysis' },
      { name: 'Trivy', icon: 'trivy', note: 'Image scanning; the build fails on CRITICAL severity' },
      { name: 'OWASP Dependency-Check', icon: 'owasp', note: 'SCA stage; fails on CVSS 9 and above' },
      { name: 'Kubernetes Secrets', icon: 'kubernetes', note: 'Database URL sourced from a Secret in the Deployment manifest' },
      { name: 'Jenkins Credentials', icon: 'jenkins', note: 'Registry and Git tokens bound at runtime, never echoed' },
      { name: 'CVE Remediation', icon: 'shieldcheck', note: 'Patched Alpine OpenSSL packages flagged by scanning' },
    ],
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    blurb: 'Knowing the system is healthy after it ships.',
    skills: [
      { name: 'Prometheus', icon: 'prometheus', note: 'Metrics collection across the cluster' },
      { name: 'Grafana', icon: 'grafana', note: 'Dashboards for cluster and application health' },
      { name: 'Alertmanager', icon: 'prometheus', note: 'Alert routing wired to Slack' },
      { name: 'Slack Alerting', icon: 'slack', note: 'Incident notifications to the team channel' },
      { name: 'Health Probes', icon: 'kubernetes', note: 'Readiness and liveness checks on every pod' },
    ],
  },
  {
    id: 'security',
    name: 'Security & Networking',
    blurb: 'Formal grounding from PG-DITISS, applied in infrastructure work.',
    skills: [
      { name: 'Network Defense', icon: 'shieldcheck', note: 'PG-DITISS: Network Defense & Compliance' },
      { name: 'PKI', icon: 'letsencrypt', note: 'PG-DITISS: PKI & Cyber Forensics' },
      { name: 'Cyber Forensics', icon: 'kalilinux', note: 'PG-DITISS module' },
      { name: 'TCP/IP Networking', icon: 'cisco', note: 'PG-DITISS: highest module score, 35' },
      { name: 'Network Segmentation', icon: 'amazonwebservices', note: 'Private-subnet workloads behind a bastion host' },
      { name: 'Security Concepts', icon: 'shieldcheck', note: 'PG-DITISS module' },
    ],
  },
]

/** Section 10 — Experience. */
export const experience = [
  {
    id: 'genzeon',
    role: 'Full Stack Software Engineer', // [user]
    org: 'Genzeon', // [user]
    period: 'March 2026 – Present', // [user] started 11/03/2026
    current: true,
    summary:
      'Building and maintaining web applications end to end — frontend, backend, databases, APIs and application integrations.',
    points: [
      'Develop and maintain web-based applications and full-stack features.',
      'Design, implement, test, debug and enhance software functionality.',
      'Work across frontend, backend, databases, APIs and application integrations.',
      'Follow established software development, testing, version-control and deployment practices.',
      'Collaborate with team members to analyse requirements and deliver reliable solutions.',
    ],
    /*
     * Labelled as background, not as the Genzeon stack. These are the
     * technologies evidenced by the resume and the public repositories; which
     * of them this specific role uses day to day is not something either
     * source establishes, so the site does not claim it.
     */
    techLabel: 'Technical background',
    tech: [
      'Java', 'JavaScript', 'HTML', 'CSS', 'MySQL', 'Git', 'Docker', 'Jenkins',
      'Terraform', 'Kubernetes', 'AWS', 'Google Cloud', 'Prometheus', 'Grafana',
    ],
  },
  {
    id: 'ditiss',
    role: 'PG-DITISS — IT Infrastructure, Systems & Security',
    org: 'C-DAC',
    period: 'Post-graduate diploma',
    current: false,
    summary:
      'Post-graduate diploma covering networking, Linux administration, DevOps, network defense, PKI, cyber forensics and security concepts. The capstone was an end-to-end DevSecOps delivery platform on AWS.',
    points: [
      'Scored 183/240 across six modules, strongest in Fundamentals of Computer Networks at 35.',
      'Built and documented a GitOps Kubernetes platform with integrated SAST, SCA and container scanning as the final project.',
      'Published module-wise CCEE preparation material that other candidates have since forked.',
    ],
    tech: ['Linux', 'Networking', 'Jenkins', 'Docker', 'Kubernetes', 'Terraform', 'AWS'],
  },
  {
    id: 'btech',
    role: 'B.Tech, Computer Engineering',
    org: 'Godavari College of Engineering (DBATU)',
    period: 'Graduated 2025 · 85%',
    current: false,
    summary: 'Computer Engineering degree alongside technical leadership roles and competitive events.',
    points: [
      'Tech Club President — organised national-level workshops.',
      'Fest Coordinator — managed an event with 200+ participants.',
      'Hackathon winner, first place.',
    ],
    tech: ['Java', 'Python', 'JavaScript', 'MySQL'],
  },
]

/** Section 11 — Education. [resume] */
export const education = [
  {
    id: 'ditiss',
    degree: 'PG-DITISS',
    field: 'IT Infrastructure, Systems & Security',
    institute: 'C-DAC',
    year: '',
    score: '183 / 240',
    highlight: true,
    modules: [
      { name: 'Fundamentals of Computer Networks', score: 35 },
      { name: 'PKI & Cyber Forensics', score: 32 },
      { name: 'Operating Systems & Administration', score: 31 },
      { name: 'Programming & DevOps', score: 30 },
      { name: 'Security Concepts', score: 29 },
      { name: 'Network Defense & Compliance', score: 26 },
    ],
  },
  {
    id: 'btech',
    degree: 'B.Tech',
    field: 'Computer Engineering',
    institute: 'Godavari College of Engineering (DBATU)',
    year: '2025',
    score: '85%',
    highlight: false,
    modules: [],
  },
  {
    id: 'diploma',
    degree: 'Diploma',
    field: 'Computer Engineering',
    institute: 'R.C. Patel College (MSBTE)',
    year: '2022',
    score: '80.91%',
    highlight: false,
    modules: [],
  },
  {
    id: 'ssc',
    degree: 'SSC',
    field: 'Secondary School Certificate',
    institute: 'M.H.S.S High School',
    year: '2019',
    score: '76.6%',
    highlight: false,
    modules: [],
  },
]

/** Section 12 — Certifications & achievements. [resume] */
export const certifications = [
  {
    name: 'Google Cloud Arcade Facilitator Program',
    issuer: 'Google Cloud',
    icon: 'googlecloud',
    note: 'Hands-on Google Cloud labs and challenges.',
  },
  {
    name: 'Java Training',
    issuer: 'Certification',
    icon: 'openjdk',
    note: 'Core Java programming certification.',
  },
]

export const achievements = [
  {
    name: 'Hackathon Winner — 1st Place',
    icon: 'trophy',
    note: 'First place in competitive engineering.',
  },
  {
    name: 'Tech Club President',
    icon: 'users',
    note: 'Led the club and organised national-level workshops.',
  },
  {
    name: 'Fest Coordinator',
    icon: 'calendar',
    note: 'Planned and ran a technical fest for 200+ participants.',
  },
]

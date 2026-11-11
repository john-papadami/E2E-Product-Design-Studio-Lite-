/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProductProject, StoryType, LifecyclePhase, UXMethodology } from '../types/framework';

export interface StoryOverviewInfo {
  type: StoryType;
  title: string;
  shortDesc: string;
  focus: string;
  coreQuestion: string;
  typicalArtifacts: string[];
  keySignals: string[];
  uxMethodologies: UXMethodology[];
}

export const STORY_OVERVIEWS: Record<StoryType, StoryOverviewInfo> = {
  market: {
    type: 'market',
    title: 'Market Story',
    shortDesc: 'Articulates market opportunity, strategic timing, competitive differentiation, and macro business context.',
    focus: 'Why this product, why now, and where it wins in the competitive arena.',
    coreQuestion: 'What macro economic shift or market gap justifies this strategic investment today?',
    typicalArtifacts: [
      'Market Sizing (TAM/SAM/SOM)',
      'Competitive Feature Matrix',
      'Macro Industry Trend Synthesis',
      'Value Proposition Canvas'
    ],
    keySignals: [
      'Regulatory tailwinds or compliance mandates',
      'Emerging competitor vulnerabilities',
      'Shifting buyer spending priorities'
    ],
    uxMethodologies: [
      {
        id: 'ux-m-1',
        name: 'Competitive UX Teardowns & Heuristic Benchmarking',
        category: 'Market Discovery',
        description: 'Systematic side-by-side analysis of rival product interaction flows to uncover ergonomic bottlenecks, cognitive friction, and differentiation opportunities.',
        whenToUse: 'Early discovery phase when evaluating market landscape and positioning against incumbents.',
        keyOutputs: ['Comparative Interaction Scorecard', 'Friction & Dark Pattern Audit', 'Competitive Feature Matrix'],
        isPrimary: true
      },
      {
        id: 'ux-m-2',
        name: 'Value Proposition Canvas & Strategic Opportunity Mapping',
        category: 'Strategic UX',
        description: 'Direct mapping of observed customer workflow pains and desired gains to core product capabilities and economic defensibility.',
        whenToUse: 'When defining product scope to ensure design features align directly with strategic market bets.',
        keyOutputs: ['Value Proposition Matrix', 'Strategic Capability Roadmap', 'Feature Differentiation Map'],
        isPrimary: true
      },
      {
        id: 'ux-m-3',
        name: 'Market-Fit & TAM/SAM UX Landscape Audit',
        category: 'Market Discovery',
        description: 'Sizing addressable operator cohorts and benchmarking current interaction expectations across enterprise verticals.',
        whenToUse: 'When identifying underserved user segments or evaluating market expansion into regulated industries.',
        keyOutputs: ['Cohort Expectation Baseline', 'Segment Persona Profiles']
      }
    ]
  },
  customer: {
    type: 'customer',
    title: 'Customer Story',
    shortDesc: 'Maps the organizational buyer, decision-makers, commercial pain points, and commercial purchase drivers.',
    focus: 'Who authorizes the purchase, what business friction keeps them up at night, and what ROI they demand.',
    coreQuestion: 'Which organizational problem is severe enough that leadership will allocate budget to solve it?',
    typicalArtifacts: [
      'B2B Buyer Personas & Procurement Journey',
      'Jobs-to-be-Done (JTBD) Framework',
      'Pain-Gain Severity Audit',
      'Willingness-to-Pay / Pricing Model'
    ],
    keySignals: [
      'Excessive operational expenditure on manual workarounds',
      'High churn in incumbent enterprise vendor contracts',
      'Strict security/compliance procurement hurdles'
    ],
    uxMethodologies: [
      {
        id: 'ux-c-1',
        name: 'Jobs-to-be-Done (JTBD) Qualitative Framework',
        category: 'Generative Research',
        description: 'Structured methodology uncovering the functional, emotional, and organizational jobs that economic buyers and team leads hire the solution to accomplish.',
        whenToUse: 'During customer discovery to shift focus from feature requests to fundamental operational jobs.',
        keyOutputs: ['Job Statements Matrix', 'Outcome-Driven Innovation (ODI) Table', 'Pain Prioritization Grid'],
        isPrimary: true
      },
      {
        id: 'ux-c-2',
        name: 'B2B Buyer & Stakeholder Journey Mapping',
        category: 'Customer Discovery',
        description: 'End-to-end visualization of the procurement path, security review committees, vendor evaluation criteria, and buyer-to-operator handoffs.',
        whenToUse: 'Prior to sales collateral and onboarding design to prevent organizational adoption friction.',
        keyOutputs: ['Procurement Journey Blueprint', 'Stakeholder Decision Matrix', 'Onboarding Drop-off Audit'],
        isPrimary: true
      },
      {
        id: 'ux-c-3',
        name: 'In-Depth Stakeholder Discovery Interviews (IDIs)',
        category: 'Generative Research',
        description: 'Semi-structured 1-on-1 qualitative interviews with VP/Director-level buyers examining workflow waste, compliance anxieties, and contract churn drivers.',
        whenToUse: 'In problem definition to gather qualitative evidence and verbatim customer quotes.',
        keyOutputs: ['Interview Synthesis Synthesis Dossier', 'Verbatim Voice-of-Customer Quotes', 'Willingness-to-Pay Curve']
      }
    ]
  },
  technology: {
    type: 'technology',
    title: 'Technology Story',
    shortDesc: 'Ensures feasibility, architectural scalability, system integrations, and non-functional engineering standards.',
    focus: 'How we engineer the solution reliably, securely, and within technical constraints.',
    coreQuestion: 'How can the underlying architecture sustainably deliver the customer and user promise?',
    typicalArtifacts: [
      'System Architecture Blueprint',
      'Data Ingestion & Integration Contracts',
      'Non-Functional Requirements (SLA/Latency/Security)',
      'Technical Spike & Proof-of-Concept Logs'
    ],
    keySignals: [
      'Integration latency under high-concurrency loads',
      'Compliance with SOC2 / HIPAA / ISO standards',
      'Maintainability and developer velocity tradeoffs'
    ],
    uxMethodologies: [
      {
        id: 'ux-t-1',
        name: 'Technical POC Feasibility Spikes & Interaction Testing',
        category: 'Technical UX',
        description: 'Collaborative spikes between UX and engineering to test complex data rendering (e.g. 100k-node dependency graphs, 60fps streaming telemetry) before design finalization.',
        whenToUse: 'Early in definition when UI concepts push performance, bandwidth, or browser rendering limits.',
        keyOutputs: ['Feasibility Spike Report', 'Interaction Performance Benchmarks', 'Tech Constraint Spec'],
        isPrimary: true
      },
      {
        id: 'ux-t-2',
        name: 'Latency Perception & Cognitive Response Time Auditing',
        category: 'Technical UX',
        description: 'Rigorous enforcement of perceptual thresholds (sub-100ms feedback, sub-1s task responses, optimistic UI updates, and measured loading skeletons).',
        whenToUse: 'During API contract definition and design token setup to prevent UI lag in high-stakes workflows.',
        keyOutputs: ['Perceptual Latency Budget Table', 'Optimistic UI State Spec', 'Skeleton Screen Matrix'],
        isPrimary: true
      },
      {
        id: 'ux-t-3',
        name: 'Error Recovery & Graceful Degradation UX Modeling',
        category: 'Architectural UX',
        description: 'Comprehensive interaction modeling for partial network failures, offline sync, API rate-limiting, and non-punitive system fallback states.',
        whenToUse: 'When architecting distributed microservices and mobile/edge client interfaces.',
        keyOutputs: ['System Failure State Inventory', 'Offline Recovery Flowchart', 'Reconnection UX Affordances']
      }
    ]
  },
  user: {
    type: 'user',
    title: 'User Story',
    shortDesc: 'Translates functional capability into ergonomic workflows, design systems, usability, and accessible UI interactions.',
    focus: 'The hands-on daily experience of the human operator navigating the product.',
    coreQuestion: 'How can we eliminate friction and make high-stakes workflows effortless and error-free?',
    typicalArtifacts: [
      'Primary Operator Personas & Context of Use',
      'Task Flow Diagrams & Information Architecture',
      'Component Design System & UI Specifications',
      'WCAG 2.2 AA Accessibility Audit'
    ],
    keySignals: [
      'Cognitive load during crisis or dense operations',
      'Time-to-first-successful-task completion',
      'Input error rates and recovery speed'
    ],
    uxMethodologies: [
      {
        id: 'ux-u-1',
        name: 'Task Flow Modeling & Cognitive Walkthroughs',
        category: 'Interaction Design',
        description: 'Step-by-step mapping of operator decision paths, keyboard-first navigations, contextual shortcuts, and cognitive load assessment in stressful situations.',
        whenToUse: 'Throughout UI conceptualization to eliminate unnecessary clicks and context-switching.',
        keyOutputs: ['Detailed Task Flow Schematics', 'Cognitive Load Friction Audit', 'Happy & Edge-Case Clickpaths'],
        isPrimary: true
      },
      {
        id: 'ux-u-2',
        name: 'Enterprise Design System & Token Architecture (Clarity/SAP)',
        category: 'Design Systems',
        description: 'Modular component library with strict tokens, tabular numeral alignment, optical compensation, and standardized dark/light mode surface systems.',
        whenToUse: 'When building scalable enterprise UI interfaces that require consistent visual and interaction language.',
        keyOutputs: ['Figma Design System Token Library', 'Component States Specification', 'Spacing & Radius Math Scale'],
        isPrimary: true
      },
      {
        id: 'ux-u-3',
        name: 'Information Architecture (IA) & Object-Oriented UX (OOUX)',
        category: 'Architecture & IA',
        description: 'Entity-relationship modeling for domain concepts (assets, policies, clusters) to ensure navigation matches operator mental models.',
        whenToUse: 'Before wireframing complex multi-tiered consoles, analytics views, or nested tables.',
        keyOutputs: ['OOUX Entity Matrix', 'Taxonomy & Navigation Tree', 'Card-Sorting Validation Report']
      },
      {
        id: 'ux-u-4',
        name: 'Accessibility & Inclusive Design Compliance (WCAG 2.2 AA / VPAT)',
        category: 'Compliance & Accessibility',
        description: 'Comprehensive compliance protocol ensuring 4.5:1 text contrast, visible focus indicators, screen reader ARIA trees, and touch targets >= 44px.',
        whenToUse: 'Throughout design and component development to expand TAM and meet enterprise procurement mandates.',
        keyOutputs: ['WCAG 2.2 AA Compliance Checklist', 'VPAT Ready Accessibility Audit', 'Keyboard Navigation Matrix'],
        isPrimary: true
      }
    ]
  },
  success: {
    type: 'success',
    title: 'Success Story',
    shortDesc: 'Defines quantifiable metrics, North Star KPIs, go-to-market execution, and continuous feedback loops.',
    focus: 'How we measure real-world value realization and sustain product evolution over time.',
    coreQuestion: 'What verifiable metrics prove that both business and user outcomes were successfully met?',
    typicalArtifacts: [
      'North Star Metric & OKR Scorecard',
      'Rollout Phase & Pilot Validation Plan',
      'Telemetry & Product Analytics Schema',
      'Post-Launch Feedback & Retrospective Rhythm'
    ],
    keySignals: [
      'Weekly Active Operator retention curve',
      'Measurable reduction in operational cycle time',
      'Net Promoter Score (NPS) and Customer Health score'
    ],
    uxMethodologies: [
      {
        id: 'ux-s-1',
        name: 'Empirical Usability Benchmarking (Lab & Remote, N=8+)',
        category: 'Quantitative UX',
        description: 'Empirical testing with representative operators to quantify Task Success Rate (TSR), Time-on-Task (ToT), Single Ease Question (SEQ), and SUS scores.',
        whenToUse: 'In validation phase prior to production freeze and post-launch to verify ROI.',
        keyOutputs: ['Usability Benchmark Report', 'System Usability Scale (SUS) Score', 'Task Completion Speedup Ratio'],
        isPrimary: true
      },
      {
        id: 'ux-s-2',
        name: 'HEART Framework (Happiness, Engagement, Adoption, Retention, Task Success)',
        category: 'Product Analytics',
        description: 'Standardized quantitative UX framework bridging qualitative user sentiment to measurable product and business KPIs.',
        whenToUse: 'When defining product analytics goals, telemetry events, and quarterly executive scorecards.',
        keyOutputs: ['HEART Metric Scorecard', 'Telemetry Event Dictionary', 'Retention & Adoption Curves'],
        isPrimary: true
      },
      {
        id: 'ux-s-3',
        name: 'Telemetry & Behavioral Analytics Event Schema',
        category: 'Analytics & Instrumentation',
        description: 'Comprehensive instrumentation plan tracking feature adoption curves, drop-off funnels, error recovery rates, and session durations.',
        whenToUse: 'Sprint handoff to ensure developer instrumentation matches design and business measurement goals.',
        keyOutputs: ['Analytics Instrumentation Spec', 'Funnel Drop-off Dashboard', 'Telemetry Data Dictionary']
      },
      {
        id: 'ux-s-4',
        name: 'Continuous Feedback Loops & Customer Advisory Board (CAB)',
        category: 'Continuous Discovery',
        description: 'Post-launch cadence involving weekly power-user sessions, in-app micro-surveys, and direct customer feedback grooming into sprint backlogs.',
        whenToUse: 'Post-delivery to sustain product evolution and feed insights back into Phase 01 (Discover).',
        keyOutputs: ['CAB Feedback Summary', 'Quarterly UX Debt Backlog', 'Net Promoter Score (NPS) Log']
      }
    ]
  }
};

export interface PhaseInfo {
  phase: LifecyclePhase;
  name: string;
  tagline: string;
  description: string;
  keyOutputs: string[];
}

export const LIFECYCLE_PHASES: PhaseInfo[] = [
  {
    phase: 'discover',
    name: '01. Discover',
    tagline: 'Discover the right problem',
    description: 'Thorough discovery across market signals, customer interviews, user observations, and technical investigations to uncover the root friction.',
    keyOutputs: ['Discovery Interview Transcripts', 'Competitive Teardown', 'Tech Feasibility Spikes', 'Baseline Problem Brief']
  },
  {
    phase: 'define',
    name: '02. Define',
    tagline: 'Define the value proposition & alignment',
    description: 'Synthesize insights into an aligned multi-story strategic proposition, establishing shared understanding across product, design, and engineering.',
    keyOutputs: ['Aligned 5-Story PRD', 'Value Proposition Architecture', 'Scope Boundaries & Non-Goals', 'Target Metric Baselines']
  },
  {
    phase: 'design',
    name: '03. Design',
    tagline: 'Design the right solution',
    description: 'Iterative crafting of user journeys, system architecture, component libraries, high-fidelity prototypes, and design tokens.',
    keyOutputs: ['Information Architecture Map', 'Component Design Specs', 'Clickable Prototype', 'Integration Contracts']
  },
  {
    phase: 'validate',
    name: '04. Validate',
    tagline: 'Validate the experience',
    description: 'Empirical stress-testing of usability, accessibility, technical performance, and customer acceptance before production code lock.',
    keyOutputs: ['Usability Study Report (N=8+)', 'WCAG 2.2 AA Accessibility Report', 'Load & Latency Benchmark', 'Pilot Customer Sign-off']
  },
  {
    phase: 'deliver',
    name: '05. Deliver',
    tagline: 'Deliver measurable value',
    description: 'Phased rollout, live telemetry monitoring, sprint handoff, team retrospectives, and continuous iteration tracking.',
    keyOutputs: ['GTM Launch Checklist', 'Telemetry Analytics Dashboard', 'Operator Onboarding Guides', '90-Day Impact Retrospective']
  }
];

export const TEMPLATE_PROJECTS: ProductProject[] = [
  {
    id: 'cloud-governance-engine',
    name: 'CloudGuard: Autonomous Policy & Cost Engine',
    domain: 'Enterprise Cloud Infrastructure & FinOps',
    targetAudience: 'Chief Information Security Officers, Cloud Platform Directors, & DevOps Engineers',
    visionStatement: 'Unify real-time multi-cloud compliance and FinOps cost orchestration into an automated, zero-friction developer experience.',
    lastUpdated: 'Nov 2026',
    stories: {
      market: {
        type: 'market',
        title: 'Market Story',
        subtitle: 'The Multi-Cloud Sprawl Dilemma',
        objective: 'Capture the expanding $14B cloud FinOps and compliance governance market by eliminating friction between security audits and developer velocity.',
        primaryStakeholders: ['Chief Strategy Officer', 'VP Product Management', 'Head of Sales'],
        sections: [
          {
            id: 'm1',
            title: 'Market Dynamics & Industry Shift',
            description: 'Enterprises manage multi-cloud footprints across AWS, Azure, and GCP, resulting in 32% cloud spend waste and fragmented audit trails.',
            content: 'Global enterprise spend on multi-cloud infrastructure reached $600B+ with estimated 28-35% in idle or misconfigured resources. Strict ESG and cybersecurity compliance directives (EU DORA, NIS2, SOC2 Type II) now penalize governance gaps with severe fines.',
            keyQuestions: [
              'What macro shift is creating urgent spend on this solution now?',
              'Why can incumbent point solutions not address this holistically?'
            ],
            deliverables: [
              'Competitive benchmark across Datadog, Wiz, and Cloudability',
              'Addressable market analysis (TAM $14.2B, SAM $3.8B)'
            ],
            risks: [
              'Hyperscalers bundling native rudimentary cost tools for free',
              'Lengthening enterprise procurement cycles during macro downturns'
            ]
          },
          {
            id: 'm2',
            title: 'Value Proposition & Defensibility',
            description: 'Provide predictive policy simulation before infrastructure deployment rather than reactive post-mortem alerts.',
            content: 'Our defensible wedge is automated CI/CD policy synthesis: catching resource misconfigurations and cost regressions inside Git pull requests before provisioning occurs, turning security from a blocker into an automated guardrail.',
            keyQuestions: [
              'How does this create asymmetric defensibility against competitors?',
              'What makes the value immediate on Day 1 of deployment?'
            ],
            deliverables: [
              'Economic ROI model demonstrating 4.2x payback in 6 months',
              'Core differentiation brief for sales enablement'
            ],
            risks: [
              'Vendor fatigue in the DevSecOps tooling ecosystem'
            ]
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.market.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Does the Technology Story validate our CI/CD shift-left integration feasibility?',
            targetStory: 'technology',
            status: 'aligned',
            notes: 'Architecture uses lightweight eBPF agents and GitHub Actions Webhooks with sub-2s execution.'
          },
          {
            question: 'Does the Customer Story confirm buyers are willing to pay for proactive vs reactive tools?',
            targetStory: 'customer',
            status: 'aligned',
            notes: '14 enterprise buyer interviews ranked CI/CD cost checks as their #1 unmet capability.'
          }
        ]
      },
      customer: {
        type: 'customer',
        title: 'Customer Story',
        subtitle: 'The Executive Buyer & Procurement Persona',
        objective: 'Address the dual pain points of budget overruns (CFO/VP Cloud) and compliance liabilities (CISO) through unified executive reporting.',
        primaryStakeholders: ['Enterprise Buyer', 'Procurement Committee', 'Security Review Board'],
        sections: [
          {
            id: 'c1',
            title: 'Buyer Personas & Organizational Friction',
            description: 'The VP of Infrastructure is caught between board mandates to cut cloud run-rates and engineering resistance to strict guardrails.',
            content: 'Primary Economic Buyer: VP Cloud Infrastructure / Head of Platform. Secondary Influencer: CISO & Chief Architect. Main friction: Engineers ignore 200+ daily Slack alerts from legacy scanners because they lack context and actionable remediation.',
            keyQuestions: [
              'Who signs the annual recurring contract, and who has veto power?',
              'What organizational friction prevents them from solving this internally?'
            ],
            deliverables: [
              'Enterprise Buyer & Influencer Journey Map',
              'Procurement Security & Compliance Questionnaire pack'
            ],
            risks: [
              'Split budget ownership between Security and Cloud Engineering teams'
            ]
          },
          {
            id: 'c2',
            title: 'Jobs-to-be-Done & Willingness to Pay',
            description: 'Provide automated, auditable compliance signoffs without slowing down sprint release cadences.',
            content: 'When an engineering team pushes code changes to Terraform scripts, the VP wants instant certainty that monthly burn will not surge and security policies remain intact, so that quarterly budgets remain predictable.',
            keyQuestions: [
              'What is the threshold pricing model (per-node vs tiered cloud spend)?',
              'What ROI timeline does the customer procurement committee demand?'
            ],
            deliverables: [
              'Usage-based Tiered Pricing Model',
              'Customer Success Onboarding SLA Blueprint'
            ],
            risks: [
              'Internal IT attempting to build an in-house script alternative'
            ]
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.customer.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Does the User Story respect the daily workflow of the platform engineer?',
            targetStory: 'user',
            status: 'aligned',
            notes: 'No context switching: notifications embed 1-click remediation directly in PR reviews.'
          },
          {
            question: 'Does the Success Story track the exact ROI metric the VP Cloud evaluates?',
            targetStory: 'success',
            status: 'aligned',
            notes: 'Dashboard surfaces monthly net dollars saved and policy violations averted.'
          }
        ]
      },
      technology: {
        type: 'technology',
        title: 'Technology Story',
        subtitle: 'High-Concurrency Event Stream & Policy Evaluator',
        objective: 'Deliver sub-second policy evaluation across 100,000+ cloud assets with zero-credential read access and strict tenant isolation.',
        primaryStakeholders: ['Principal Architect', 'Staff Security Engineer', 'Data Platform Lead'],
        sections: [
          {
            id: 't1',
            title: 'System Architecture & Data Pipeline',
            description: 'Event-driven serverless evaluator ingesting AWS CloudTrail, Azure Event Hub, and GCP Audit Logs into an Open Policy Agent (OPA) engine.',
            content: 'Ingestion pipeline utilizes distributed Kafka partitions with Rust-based policy evaluators. Read-only cross-account IAM roles with least-privilege scoping ensure customer credentials are never exposed.',
            keyQuestions: [
              'How does the system scale to millions of daily infrastructure mutations?',
              'What are the cold-start and end-to-end evaluation latency constraints?'
            ],
            deliverables: [
              'Architecture Topology Diagram & Data Ingestion Flow',
              'Zero-Trust IAM Cross-Account Access Specification'
            ],
            risks: [
              'Cloud provider API rate-limiting during high-volume estate discovery scans'
            ]
          },
          {
            id: 't2',
            title: 'Security, Compliance & Non-Functional Specs',
            description: 'SOC2 Type II, ISO 27001, and FedRAMP readiness with client-side field-level encryption for asset metadata.',
            content: 'Target SLA of 99.99% availability with <150ms P99 policy simulation latency. All persistent state stored in encrypted PostgreSQL with automated partition rollups and cold S3 audit tiering.',
            keyQuestions: [
              'What are the disaster recovery (RPO/RTO) guarantees?',
              'How do we handle multi-region data residency mandates?'
            ],
            deliverables: [
              'SOC2 Readiness Security Controls Matrix',
              'Benchmarked Latency & Throughput Spikes'
            ],
            risks: [
              'High egress data transfer charges across multi-cloud peering'
            ]
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.technology.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Can the UI render high-volume policy events without browser frame drops?',
            targetStory: 'user',
            status: 'aligned',
            notes: 'UI uses virtualized windowing and web workers for streaming 10,000+ node graphs.'
          },
          {
            question: 'Does the architecture satisfy customer security review constraints?',
            targetStory: 'customer',
            status: 'aligned',
            notes: 'Zero-agent read-only IAM policies approved by preliminary CISO advisory board.'
          }
        ]
      },
      user: {
        type: 'user',
        title: 'User Story',
        subtitle: 'The DevOps Engineer & Security Auditor Experience',
        objective: 'Empower engineers to diagnose and resolve policy violations in under 3 minutes with zero contextual friction.',
        primaryStakeholders: ['Lead Product Designer', 'Frontend Architect', 'DevOps Community'],
        sections: [
          {
            id: 'u1',
            title: 'Persona Scenarios & Workflow Ergonomics',
            description: 'DevOps Lead Sarah needs clear, non-punitive explanations of why an IAM role or S3 bucket is rejected with a 1-click diff patch.',
            content: 'Context of use: Sarah is reviewing 12 pull requests before release freeze. Instead of cryptic JSON errors, she receives an annotated visual diff showing the blast radius, estimated cost delta, and recommended fix in 2 clicks.',
            keyQuestions: [
              'What is the user emotional state when encountering system alerts?',
              'How can we minimize cognitive load in high-stress deployment windows?'
            ],
            deliverables: [
              'Persona Cards: Sarah (DevOps Lead) & Marcus (Security Auditor)',
              'End-to-End Pull Request Remediation Flow Wireframe'
            ],
            risks: [
              'Alert fatigue if false-positive threshold is not calibrated strictly'
            ]
          },
          {
            id: 'u2',
            title: 'Information Architecture & Design System Patterns',
            description: 'High-density tabular consoles, interactive dependency graphs, and WCAG 2.2 AA compliant typography.',
            content: 'Unified design system featuring crisp tabular numbers, dark/light optical compensation, intuitive keyboard shortcuts (J/K navigation, Cmd+K quick actions), and clear severity hierarchies.',
            keyQuestions: [
              'Are touch/click targets and color contrasts accessible across all monitors?',
              'How is complex nested asset dependency mapped cleanly?'
            ],
            deliverables: [
              'Design System Component Tokens & Figma Library Spec',
              'Usability Test Benchmark Report across 10 engineer participants'
            ],
            risks: [
              'Information density overwhelming first-time junior operators'
            ]
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.user.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Are the UI interactions feasible within the 150ms backend latency budget?',
            targetStory: 'technology',
            status: 'aligned',
            notes: 'Optimistic UI state updates and client-side caching ensure instant feedback.'
          },
          {
            question: 'Do user efficiency gains translate directly into customer ROI metrics?',
            targetStory: 'customer',
            status: 'aligned',
            notes: 'Resolution time dropped from 4 hours to 3.5 minutes per misconfiguration.'
          }
        ]
      },
      success: {
        type: 'success',
        title: 'Success Story',
        subtitle: 'Measurable Outcomes, KPIs & Expansion Roadmap',
        objective: 'Demonstrate tangible $1.2M annual run-rate savings per enterprise customer and achieve 85%+ weekly operator retention.',
        primaryStakeholders: ['VP Customer Success', 'Product Analytics Lead', 'Executive Team'],
        sections: [
          {
            id: 's1',
            title: 'North Star Metric & Quantifiable OKRs',
            description: 'Track Dollars Saved per Month and Average Remediation Cycle Time (Target: < 5 minutes).',
            content: 'North Star Metric: Autonomous Dollars Optimized (ADO). Key Results: 1) Reduce critical unpatched policy vulnerabilities by 75% within 30 days of deploy. 2) Cut cloud spend waste by >20% across monitored estates. 3) Maintain CSAT >= 4.7/5.0.',
            keyQuestions: [
              'What single metric proves both business value and user delight?',
              'How will customer success verify outcomes during renewal reviews?'
            ],
            deliverables: [
              'Executive Telemetry Dashboard Mockup & Metric Dictionary',
              'Quarterly Business Review (QBR) Automated Value Report'
            ],
            risks: [
              'Attribution ambiguity between tool savings vs organic engineering cleanups'
            ]
          },
          {
            id: 's2',
            title: 'Phased Rollout & Expansion Flywheel',
            description: 'Begin with passive audit-only mode for 14 days, transitioning to active automated PR guardrails in Month 2.',
            content: 'Phase 1: Zero-impact discovery scan (Days 1-14). Phase 2: Pilot team PR comments (Days 15-45). Phase 3: Organization-wide enforcement & automated ticketing integration (Month 3+).',
            keyQuestions: [
              'What is the transition trigger between audit-only and active enforcement?',
              'How does customer expansion occur organically across squads?'
            ],
            deliverables: [
              'Pilot-to-Production Migration Guide',
              'Customer Success Retrospective Cadence'
            ],
            risks: [
              'Stalled adoption if initial scan surfaces 10,000 unprioritized legacy backlog alerts'
            ]
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.success.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Does the telemetry architecture support continuous audit reporting?',
            targetStory: 'technology',
            status: 'aligned',
            notes: 'Historical data warehouse pipeline streams aggregated metrics to the analytics UI.'
          },
          {
            question: 'Do the success metrics reinforce the initial Market Story value proposition?',
            targetStory: 'market',
            status: 'aligned',
            notes: 'Realized 24% cloud spend reduction validates the 4x ROI marketing narrative.'
          }
        ]
      }
    },
    deliverables: [
      { id: 'del-1', phase: 'discover', storyType: 'market', title: 'Competitive FinOps Landscape Matrix', description: 'Deep-dive comparison of 6 major market alternatives.', completed: true, ownerRole: 'product' },
      { id: 'del-2', phase: 'discover', storyType: 'customer', title: '15 Enterprise CISO Discovery Interviews', description: 'Qualitative synthesis of governance pain points.', completed: true, ownerRole: 'design' },
      { id: 'del-3', phase: 'discover', storyType: 'technology', title: 'Cross-Cloud IAM Read-Only Spike', description: 'Tested zero-credential access on AWS and GCP.', completed: true, ownerRole: 'engineering' },
      { id: 'del-4', phase: 'define', storyType: 'market', title: '5-Story Strategic Value Architecture', description: 'Cross-functional narrative consensus document.', completed: true, ownerRole: 'product' },
      { id: 'del-5', phase: 'define', storyType: 'customer', title: 'B2B Procurement Questionnaire Pack', description: 'SOC2 & compliance documentation package.', completed: true, ownerRole: 'business' },
      { id: 'del-6', phase: 'design', storyType: 'user', title: 'Pull Request Remediation Wireframes & Prototype', description: 'Figma interactive prototype of 1-click diff review.', completed: true, ownerRole: 'design' },
      { id: 'del-7', phase: 'design', storyType: 'technology', title: 'Kafka & Rust Evaluator Ingestion Contract', description: 'API specification for streaming policy evaluations.', completed: true, ownerRole: 'engineering' },
      { id: 'del-8', phase: 'validate', storyType: 'user', title: 'Usability Benchmarking with 8 DevOps Teams', description: 'Measured completion rate and cognitive friction.', completed: false, ownerRole: 'design' },
      { id: 'del-9', phase: 'validate', storyType: 'technology', title: 'High-Concurrency Stress Test (100k nodes)', description: 'Simulated multi-region latency under burst events.', completed: false, ownerRole: 'engineering' },
      { id: 'del-10', phase: 'deliver', storyType: 'success', title: 'Automated QBR Executive Value Generator', description: 'Dashboard reporting monthly verified dollar savings.', completed: false, ownerRole: 'product' },
      { id: 'del-11', phase: 'deliver', storyType: 'success', title: 'Phased Enterprise Rollout Playbook', description: 'Step-by-step migration guide for pilot squads.', completed: false, ownerRole: 'business' }
    ]
  },
  {
    id: 'clinical-telemetry-stream',
    name: 'PulseFlow: Critical Care Telemetry & Patient Stream',
    domain: 'Digital Health & Clinical Decision Support',
    targetAudience: 'Hospital ICU Directors, Chief Medical Officers, & Intensive Care Nurses',
    visionStatement: 'Transform overwhelming ICU alarm fatigue into predictive, prioritized clinical alerts that safeguard patient lives and reduce nurse burnout.',
    lastUpdated: 'Nov 2026',
    stories: {
      market: {
        type: 'market',
        title: 'Market Story',
        subtitle: 'The Healthcare Staffing & Alarm Fatigue Crisis',
        objective: 'Penetrate the $9.6B hospital telemetry and clinical decision support market by reducing false-positive medical alarms by 65%.',
        primaryStakeholders: ['Chief Strategy Officer', 'Clinical Advisory Board', 'VP Regulatory Affairs'],
        sections: [
          {
            id: 'm1',
            title: 'Macro Healthcare Pressures',
            description: 'Severe registered nurse shortages and sensory overload from 350+ medical alarms per patient bed per day.',
            content: 'Up to 94% of hospital physiological alarms are clinically non-actionable, creating catastrophic desensitization ("alarm fatigue") recognized by the Joint Commission as a leading sentinel event cause.',
            keyQuestions: ['Why is clinical leadership willing to approve software budgets now?'],
            deliverables: ['Regulatory Pathway Analysis (FDA 510(k) Class II Exemption)', 'Hospital Economics Cost-of-Burnout Model'],
            risks: ['Strict 18-month hospital procurement cycles and clinical trial mandates']
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.market.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Does the Technology Story meet HIPAA and FDA medical device software reliability standards?',
            targetStory: 'technology',
            status: 'aligned',
            notes: 'Redundant IEC 62304 compliant telemetry ingestion with sub-second failover.'
          }
        ]
      },
      customer: {
        type: 'customer',
        title: 'Customer Story',
        subtitle: 'The Hospital Buying Committee',
        objective: 'Align Chief Nursing Officers (staff retention) with Chief Medical Officers (patient mortality reduction) and Hospital CFOs (malpractice risk mitigation).',
        primaryStakeholders: ['Chief Nursing Officer', 'Chief Information Officer', 'Director of Biomedical Engineering'],
        sections: [
          {
            id: 'c1',
            title: 'Clinical Stakeholder Hierarchy',
            description: 'The CNO cares about nurse retention; the CIO cares about HL7/FHIR EHR interoperability with Epic and Cerner.',
            content: 'Software must seamlessly bridge legacy bedside monitors (GE, Philips) into centralized hospital EHR records without requiring rip-and-replace hardware expenditures.',
            keyQuestions: ['What interoperability proof points are required for hospital IT approval?'],
            deliverables: ['Hospital EHR Integration Compliance Blueprint', 'Clinical ROI Calculator'],
            risks: ['Biomedical engineering pushback over third-party monitor data interception']
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.customer.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Does the User Story prioritize bedside nurse ergonomics during shift changes?',
            targetStory: 'user',
            status: 'aligned',
            notes: 'Nurse UI features glanceable bed-status strips visible from 15 feet away.'
          }
        ]
      },
      technology: {
        type: 'technology',
        title: 'Technology Story',
        subtitle: 'Fault-Tolerant Clinical Event Engine',
        objective: 'Process 500Hz multi-lead ECG, SpO2, and arterial pressure wave forms with 99.999% uptime and zero lost cardiac events.',
        primaryStakeholders: ['Medical Device Systems Architect', 'Edge Computing Lead', 'Cybersecurity Director'],
        sections: [
          {
            id: 't1',
            title: 'Edge Ingestion & Real-Time Filtering',
            description: 'On-premise edge gateway running isolated microservices for artifact noise rejection before cloud ML inference.',
            content: 'Hybrid architecture keeps critical local alarm synthesis running even during total hospital WAN internet disconnection, ensuring patient safety.',
            keyQuestions: ['How is zero patient telemetry loss guaranteed during network jitter?'],
            deliverables: ['Edge Hardware Reliability Spec', 'IEC 62304 Software Architecture Dossier'],
            risks: ['Hospital internal Wi-Fi deadzones in older masonry medical facilities']
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.technology.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Can the UI display real-time 60fps ECG waveforms smoothly without lag?',
            targetStory: 'user',
            status: 'aligned',
            notes: 'Canvas-based WebGL waveform renderer maintains locked 60fps on bedside tablets.'
          }
        ]
      },
      user: {
        type: 'user',
        title: 'User Story',
        subtitle: 'The Intensive Care Nurse Experience',
        objective: 'Enable nurses to assess a 12-patient ICU pod in 5 seconds and act on true decompensation warnings 20 minutes before cardiac arrest.',
        primaryStakeholders: ['Lead Clinical UX Researcher', 'ICU Charge Nurse Working Group'],
        sections: [
          {
            id: 'u1',
            title: 'Ergonomics Under Cognitive Load',
            description: 'Color-coded physiological trends with strict WCAG AA contrast and high-legibility tabular telemetry.',
            content: 'Nurses operate in dimly lit rooms wearing protective nitrile gloves. Controls require large touch targets (>= 48px), unambiguous auditory cues, and instant 1-tap snoozing with mandatory safety checkoffs.',
            keyQuestions: ['How does the interface behave during urgent code-blue emergencies?'],
            deliverables: ['High-Stress ICU Persona Workflows', 'Auditory & Visual Alarm Ergonomics Spec'],
            risks: ['Screen brightness causing sleep disruption for recovering patients']
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.user.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Does nurse workflow testing confirm alarms are actionable?',
            targetStory: 'customer',
            status: 'aligned',
            notes: 'Simulation trials confirmed 68% drop in spurious auditory alerts.'
          }
        ]
      },
      success: {
        type: 'success',
        title: 'Success Story',
        subtitle: 'Clinical & Hospital Economic Outcomes',
        objective: 'Achieve zero missed critical decompensation events and document 40% reduction in nurse telemetry-induced stress.',
        primaryStakeholders: ['VP Clinical Outcomes', 'Hospital Quality Committee'],
        sections: [
          {
            id: 's1',
            title: 'Clinical Efficacy & Economic KPIs',
            description: 'Measured reduction in ICU length of stay (LOS), rapid response call accuracy, and nurse turnover rates.',
            content: 'Primary metric: Unplanned ICU Readmissions within 48 Hours. Secondary: Mean Time to Detect Clinical Decompensation (MTTD).',
            keyQuestions: ['What clinical evidence is necessary for peer-reviewed journal validation?'],
            deliverables: ['Institutional Review Board (IRB) Study Protocol', 'Post-Market Clinical Follow-up Plan'],
            risks: ['Confounding clinical variables impacting mortality metric attribution']
          }
        ],
        uxMethodologies: STORY_OVERVIEWS.success.uxMethodologies,
        alignmentChecks: [
          {
            question: 'Does the clinical success data substantiate the market positioning?',
            targetStory: 'market',
            status: 'aligned',
            notes: 'Published trial results serve as key commercial differentiator in RFP bids.'
          }
        ]
      }
    },
    deliverables: [
      { id: 'del-p1', phase: 'discover', storyType: 'customer', title: 'ICU Nurse Shadowing & Alarm Audit (72 Hours)', description: 'Cataloged 2,400 physical alarm events in level 1 trauma center.', completed: true, ownerRole: 'design' },
      { id: 'del-p2', phase: 'define', storyType: 'market', title: 'FDA 510(k) Pre-Submission Dossier', description: 'Clarified regulatory boundaries and clinical claims.', completed: true, ownerRole: 'product' },
      { id: 'del-p3', phase: 'design', storyType: 'user', title: 'Bedside Tablet UI & High-Visibility Scrim System', description: 'Design tokens tailored for dark hospital wards.', completed: true, ownerRole: 'design' },
      { id: 'del-p4', phase: 'validate', storyType: 'technology', title: 'Network Failover & Local Alarm Ring Buffer Test', description: 'Verified zero alarm drops during simulated switch failure.', completed: true, ownerRole: 'engineering' },
      { id: 'del-p5', phase: 'deliver', storyType: 'success', title: '30-Day Multi-Center Clinical Pilot Review', description: 'Evaluating nurse alarm response latency and satisfaction.', completed: false, ownerRole: 'business' }
    ]
  }
];

# 03 Business Review Document

## Purpose
Capture the startup business case for DARCHIE, including market problem, competition, customer profile, pricing assumptions, business goals, and key risks.

## Decisions This Document Owns
- Market framing
- Initial customer segment
- Revenue hypothesis
- Business goals for v1
- Major business risks and mitigations

## Inputs / Dependencies
- `docs/00-governance/01-master-index.md`
- `docs/01-product/02-product-vision.md`

## Required Sections
- Market problem
- ICP
- competitor map
- pricing hypothesis
- goals
- risks

## Output Format
Startup-focused business strategy document.

## Completion Criteria
- The business model is good enough to guide v1 scope and launch decisions.
- Competitor landscape is explicit.
- Revenue and adoption assumptions are stated rather than implied.

## Executive Summary
DARCHIE targets job-seeking data engineers who need a practical, interview-aligned prep environment that current coding-only or ETL-only tools do not provide. The product enters the market as a B2C SaaS and later expands into cohort and hiring workflows.

## Market Problem
Data engineering interviews often combine:
- SQL
- Python
- schema design
- data modeling
- ETL architecture
- orchestration and reliability tradeoffs

Most existing products focus on only one layer of this stack, which leaves candidates with broken workflows and weak preparation for systems-style questions.

## Ideal Customer Profile
- Job seeker actively preparing for data engineering roles
- Learner already familiar with basic SQL and Python
- Willing to pay for structured practice that saves time and improves interview performance
- Typically uses LinkedIn, YouTube, Reddit, blogs, and mock interview communities for preparation

## Competitor Map
| Category | Competitors | Strength | Gap vs DARCHIE |
| --- | --- | --- | --- |
| SQL / coding prep | DataLemur, StrataScratch, Interview Query, HackerRank | Strong question libraries and coding workflows | Weak on end-to-end visual DE practice |
| Coaching / community | Data Engineer Academy, interview coaches, paid cohorts | Expert guidance and accountability | Less productized, lower scale, service-heavy |
| Visual ETL tooling | Matillion, Alteryx, Azure Data Factory, Google Cloud Data Fusion | Mature visual pipeline interactions | Built for production teams, not interview prep |
| Data modeling tools | dbdiagram, ERD tools | Strong schema visualization | No interview-led learning flow |

## Positioning
DARCHIE is positioned as the interview lab for data engineers, not as a generic learning platform or production ETL builder.

## Revenue Hypothesis
### Initial model
- Free tier for limited practice
- Paid individual subscription for full access

### Suggested pricing for v1
- Free: 3 exercises per module, limited saved attempts, dashboard preview only
- Pro monthly: `$19/month`
- Pro quarterly: `$49/quarter`
- Pro annual: `$149/year`

### Monetization rationale
- Pricing is accessible for job seekers
- Value is tied to interview outcomes and repeated practice
- Annual plan supports discounted commitment for active job seekers

## Business Goals For First 12 Months
- Launch MVP and acquire first 200 registered users
- Convert at least 5 percent of active users to paid plans
- Achieve at least 25 users completing exercises in 3 or more modules
- Validate that the visual pipeline builder materially improves retention or conversion

## Distribution Strategy
- Founder-led content on LinkedIn and YouTube
- Short demo clips of the visual builder
- SEO landing pages for SQL, ETL, and data modeling interview prep
- Free sample exercises to attract organic traffic
- Partnerships with instructors and bootcamps later

## Risks And Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Product scope becomes too broad | Slow launch | Lock v1 scope in PRD and defer hiring-team workflows |
| Visual builder takes too long | Delivery risk | Build high-level simulation, not production orchestration |
| Python execution adds security complexity | High | Use sandboxed execution service with strict limits |
| Market is smaller than generic coding prep | Medium | Differentiate deeply and expand to cohort and hiring use cases later |
| Users may prefer free scattered resources | Medium | Emphasize workflow integration, guided feedback, and progress tracking |

## Launch Assumptions
- Founder is comfortable leading product and backend decisions.
- Design system and UX docs must compensate for limited frontend design experience.
- v1 should favor a sharp and polished workflow over a huge content library.

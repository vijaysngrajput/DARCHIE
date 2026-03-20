# 05 User Personas And Journey Maps

## Purpose
Define the core user personas and map their journeys through DARCHIE so product, UX, content, and engineering choices reflect real user behavior.

## Decisions This Document Owns
- Primary and secondary v1 personas
- Key motivations, frustrations, and success markers
- Journey stages and friction points

## Inputs / Dependencies
- `docs/01-product/02-product-vision.md`
- `docs/01-product/04-prd.md`

## Required Sections
- Personas
- jobs to be done
- journey stages
- design implications

## Output Format
Persona and journey mapping document.

## Completion Criteria
- Each major UX flow is grounded in a named user need.
- Design and content teams can use this without inventing user motivations.

## Persona 1: Aspiring Data Engineer
- Experience: 0 to 2 years
- Background: analyst, BI developer, bootcamp graduate, software engineer switching into data
- Main goals: break into a data engineering role, reduce interview anxiety, learn system concepts
- Main frustrations: knows SQL basics but lacks end-to-end confidence, gets stuck translating theory into interview answers
- Success looks like: can complete realistic exercises, explain choices, and track progress across weak areas

## Persona 2: Mid-Level Candidate
- Experience: 2 to 6 years
- Background: already working with data pipelines but wants a stronger interview edge
- Main goals: refresh concepts quickly, practice timed scenarios, sharpen system-design answers
- Main frustrations: fragmented prep resources, limited realistic practice, no clean way to benchmark across modules
- Success looks like: targeted practice in weak areas, confidence under time pressure, clear progress data

## Jobs To Be Done
- Help me practice what real data engineering interviews actually test.
- Help me see how pipeline pieces fit together, not just memorize answers.
- Help me identify where I am weak so I can focus my prep time.
- Help me rehearse under realistic constraints before the interview.

## Journey Map
### Stage 1: Discovery
- Trigger: user is preparing for interviews or changing jobs
- Questions: what should I study, where do I start, how do I practice ETL design
- Product need: clear messaging and examples on the public website

### Stage 2: Sign-up And Onboarding
- Trigger: user decides to try the platform
- Questions: is this for my level, which modules matter most, how much time do I need
- Product need: fast onboarding with goal selection and confidence-based recommendations

### Stage 3: Guided Practice
- Trigger: user enters dashboard
- Questions: what should I do first, how hard is it, what if I fail
- Product need: recommended exercises, friendly feedback, obvious resume path

### Stage 4: Mock Interview
- Trigger: user wants simulation under pressure
- Questions: can I do this in time, how close am I to interview-ready
- Product need: timed mode, scoring, review summaries

### Stage 5: Retention And Upgrade
- Trigger: user sees progress or reaches a free-tier limit
- Questions: is this worth paying for, can it help me get the role
- Product need: visible value through progress history, saved attempts, premium content

## Design Implications
- Avoid overwhelming first-time users with all modules at once.
- Show progress in language that feels motivating rather than punitive.
- Provide gentle guidance for beginners and direct control for experienced users.
- Make the visual builder feel educational, not like enterprise software.

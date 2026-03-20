# 16 Visual Builder Interaction Spec

## Purpose
Define the interaction rules for the visual pipeline builder and data modeling builder so implementation does not rely on interpretation.

## Decisions This Document Owns
- Canvas interactions
- node and edge rules
- simulation behavior
- save/load semantics
- builder-specific validation copy patterns

## Inputs / Dependencies
- `docs/02-design/09-component-finalization.md`
- `docs/02-design/10-wireframes-screen-specs.md`
- `docs/03-architecture/12-low-level-design.md`
- `docs/03-architecture/15-practice-engine-specification.md`

## Required Sections
- Interaction model
- pipeline rules
- modeling rules
- simulation

## Output Format
Detailed canvas interaction specification.

## Completion Criteria
- Frontend engineers can implement the builders without unresolved UX or logic choices.

## Shared Canvas Interaction Model
- Drag from palette to canvas to create a node/entity.
- Click selects one item.
- Shift-click supports multi-select.
- Drag between ports to create an edge.
- Delete action removes selected nodes or edges with confirmation when it breaks downstream connections.
- Autosave triggers after 2 seconds of inactivity after a change.

## Pipeline Builder Rules
### Launch Node Types
- Source
- Transform
- Join
- Filter
- Aggregate
- Quality Check
- Branch
- Sink
- Scheduler Trigger
- Alert

### Connection Rules
- Source nodes cannot accept inbound edges.
- Sink nodes cannot emit outbound edges.
- Scheduler Trigger connects only to root pipeline nodes.
- Alert nodes may receive from failure-capable nodes only.
- Cycles are invalid in v1.

### Node Configuration Rules
- Each node type has required config fields.
- Invalid nodes show inline badge plus summary in the validation panel.
- Config changes update node status immediately on save.

## Data Modeling Builder Rules
- Entities are created from a modal or keyboard shortcut.
- Each entity requires a name and at least one field before save.
- Primary key toggle required for persistent entities.
- Relationship creation requires cardinality selection.
- Validation warnings can suggest normalization issues without blocking submission.

## Simulation Behavior
- Validate before simulate; invalid graphs cannot start simulation.
- Simulation highlights active node in sequence.
- Failure nodes show red status and pause playback with explanation.
- User can step, pause, replay, and reset.
- Simulation never mutates the saved canonical exercise definition.

## Save / Load Semantics
- Workspace JSON stores node positions, config, edges, version, and view settings.
- Server stores latest draft and last successful submission snapshot separately.

## Feedback Copy Pattern
- `Issue`: what is invalid or weak
- `Why it matters`: interview or system implication
- `Suggested fix`: next action in plain language

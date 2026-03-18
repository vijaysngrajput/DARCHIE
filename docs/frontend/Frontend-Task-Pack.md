# D-ARCHIE Frontend Code Engine Task Pack

Source specs:
- [`Frontend-Design-Spec.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Design-Spec.md)
- [`Frontend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-CDS.md)

## 1. Shell and Design-System Tasks
1. Implement shared design tokens for color, typography, spacing, radius, shadow, and motion.
2. Implement `AppHeader`, `SideNav`, and `UtilityFooter`.
3. Create shell variants for public, candidate, recruiting, admin, and reviewer areas.
4. Freeze stable loading/error/status regions so async states do not disturb layout.

## 2. Route and Layout Tasks
1. Generate the Next.js route tree from CDS section 2.
2. Bind each route to its canonical shell variant.
3. Apply the route-to-layout mapping from the design spec.
4. Keep candidate task route as a specialized workspace inside the candidate shell.

## 3. Candidate-First Redesign Tasks
1. Redesign the login page around a concise two-panel entry layout.
2. Redesign `SessionLandingCard` as a compact operational page.
3. Redesign `TaskShell` as a left-rail + right-editor workspace.
4. Redesign `ResponseEditorShell` so the editor is the dominant surface.
5. Redesign `ProgressHeader` as compact rail content.
6. Keep `AutosaveStatusBadge`, `TransitionOverlay`, and `CandidatePageSkeletons` aligned to the stable-motion rules.
7. Redesign the completion page as a calm acknowledgment screen.

## 4. Internal Role Shell Tasks
1. Create recruiting shell and route placeholders for list/detail/comparison patterns.
2. Create admin shell and route placeholders for overview/editor/review/publish/library patterns.
3. Create reviewer shell and route placeholders for queue/review/completion patterns.
4. Ensure these shells inherit shared chrome and design tokens.

## 5. Client and State Tasks
1. Keep typed API clients in `lib/api` aligned to candidate-first backend endpoints.
2. Keep auth and session state stores aligned to shell-driven loading behavior.
3. Maintain `useCurrentUser`, `useCandidateSession`, `useAutosaveDraft`, and `useDelayedFlag`.
4. Freeze shared TypeScript interfaces from CDS section 7.

## 6. Guard and Error Tasks
1. Keep `AuthGate` aligned with candidate shell rendering.
2. Implement unauthorized and unavailable states inside shell structure, not outside it.
3. Keep autosave and route-transition feedback subtle and non-jarring.

## 7. Test Tasks
1. Add shell-layout tests for public and candidate areas.
2. Add/update component and hook tests from CDS section 9.
3. Verify candidate flow behavior remains intact after redesign.
4. Verify stable loading behavior and delayed overlay behavior.

## 8. Completion Criteria
- shared shell chrome exists for all role areas,
- candidate-first flow uses the redesigned shell and workspace patterns,
- route-to-layout mapping is explicit in code,
- status/loading/error behavior is visually stable,
- role-area placeholders exist for recruiting/admin/reviewer,
- candidate-route tests and shell tests pass.

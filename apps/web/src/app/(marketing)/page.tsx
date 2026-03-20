import { SectionHero } from '@/components/marketing/section-hero';
import { SectionContainer } from '@/components/marketing/section-container';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/ui/panel';

export default function HomePage() {
  return (
    <>
      <SectionHero />
      <SectionContainer className="pb-20 sm:pb-24 lg:pb-28">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel variant="elevated" className="p-7 sm:p-8">
            <Badge variant="premium" className="mb-5 w-fit">Why DARCHIE</Badge>
            <h2 className="max-w-[18ch] font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Practice the full shape of the interview, not isolated drills.
            </h2>
            <p className="mt-5 max-w-[58ch] text-base leading-8 text-[var(--text-secondary)]">
              DARCHIE combines coding, modeling, and pipeline reasoning into one premium workspace so candidates can rehearse the same decisions interviewers actually care about.
            </p>
          </Panel>
          <div className="grid gap-6">
            <Panel className="p-6 sm:p-7">
              <Badge variant="neutral" className="mb-4 w-fit">How it works</Badge>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em]">
                Guided practice first, realistic pressure second.
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                Start with focused modules, then move into integrated exercises that connect SQL, transformations, schemas, and execution tradeoffs.
              </p>
            </Panel>
            <Panel variant="highlighted" className="p-6 sm:p-7">
              <Badge variant="premium" className="mb-4 w-fit">Why it sticks</Badge>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em]">
                Visual reasoning makes architectural tradeoffs easier to retain.
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                Instead of memorizing generic answers, candidates can see how pieces connect, where failures occur, and why a stronger design is stronger.
              </p>
            </Panel>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}

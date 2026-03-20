import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shell/page-header';
import { SectionContainer } from '@/components/marketing/section-container';
import { Panel } from '@/components/ui/panel';

export default function PricingPage() {
  const plans = [
    { name: 'Free', price: '$0', note: 'Explore the workflow and preview the interview lab.', highlight: false },
    { name: 'Pro', price: '$19', note: 'Full access to guided practice, saved history, and realistic workflow simulations.', highlight: true },
    { name: 'Annual', price: '$149', note: 'A better fit for focused interview cycles and longer readiness tracking.', highlight: false },
  ];

  return (
    <SectionContainer className="py-20 sm:py-24">
      <PageHeader
        title="Simple pricing for serious practice"
        description="Choose a plan that matches how intensely you want to prepare. The value comes from structure, realism, and visible progress rather than a large question bank alone."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.1fr_0.95fr]">
        {plans.map((plan) => (
          <Panel
            key={plan.name}
            variant={plan.highlight ? 'elevated' : 'default'}
            className={plan.highlight ? 'flex flex-col p-8 lg:-translate-y-2' : 'flex flex-col p-7'}
          >
            {plan.highlight ? <Badge variant="premium" className="mb-5 w-fit">Recommended</Badge> : <Badge variant="neutral" className="mb-5 w-fit">{plan.name === 'Free' ? 'Entry' : 'Alternative'}</Badge>}
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em]">{plan.name}</h2>
            <p className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
              {plan.price}
              <span className="ml-2 text-base font-medium text-[var(--text-muted)]">/ month</span>
            </p>
            <p className="mt-4 flex-1 text-sm leading-7 text-[var(--text-secondary)]">{plan.note}</p>
            <Button className="mt-8" variant={plan.highlight ? 'primary' : 'secondary'}>
              {plan.highlight ? 'Start Pro' : 'Choose plan'}
            </Button>
          </Panel>
        ))}
      </div>
    </SectionContainer>
  );
}

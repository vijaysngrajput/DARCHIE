'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/ui/panel';
import type { ResultPanelModel } from '@/types/practice';
import { cn } from '@/lib/utils';

export function ResultPanel({ model }: { model: ResultPanelModel }) {
  const [activeTab, setActiveTab] = useState(model.tabs[0]?.id ?? 'output');
  const current = model.tabs.find((tab) => tab.id === activeTab) ?? model.tabs[0];

  return (
    <Panel variant="default" className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
          Review panel
        </h2>
        <Badge variant={model.status === 'idle' ? 'neutral' : 'info'}>{model.status}</Badge>
      </div>
      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{model.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {model.tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'inline-flex h-9 items-center rounded-full border px-3 text-sm font-medium transition-colors duration-[130ms] ease-[var(--ease-standard)]',
              activeTab === tab.id
                ? 'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                : 'border-transparent bg-transparent text-[var(--text-muted)] hover:border-[var(--border-soft)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-4">
        <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">{current?.body}</p>
      </div>
      <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Why it matters</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">{model.explanation}</p>
      </div>
    </Panel>
  );
}

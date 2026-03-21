'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ExerciseWorkspaceProps } from '@/types/practice';
import { ExerciseHeader } from '@/components/practice/exercise-header';
import { PromptPanel } from '@/components/practice/prompt-panel';
import { ResultPanel } from '@/components/practice/result-panel';
import { WorkspaceStatusBar } from '@/components/practice/workspace-status-bar';
import { cn } from '@/lib/utils';

const mobileTabs = [
  { id: 'prompt', label: 'Prompt' },
  { id: 'work', label: 'Workspace' },
  { id: 'result', label: 'Review' },
] as const;

export function WorkspaceShell({
  workspace,
  surface,
  headerActions,
}: {
  workspace: ExerciseWorkspaceProps;
  surface: ReactNode;
  headerActions?: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<(typeof mobileTabs)[number]['id']>('work');

  return (
    <div className="space-y-6">
      <ExerciseHeader exercise={workspace.exerciseMeta} saveState={workspace.saveState} actions={headerActions} />
      <div className="lg:hidden">
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {mobileTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-[130ms] ease-[var(--ease-standard)]',
                activeTab === tab.id
                  ? 'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                  : 'border-transparent bg-transparent text-[var(--text-muted)] hover:border-[var(--border-soft)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {activeTab === 'prompt' ? <PromptPanel sections={workspace.promptSections} starterHint={workspace.starterHint} /> : null}
          {activeTab === 'work' ? <>{surface}<WorkspaceStatusBar saveState={workspace.saveState} feedbackState={workspace.feedbackState} /></> : null}
          {activeTab === 'result' ? <ResultPanel model={workspace.resultPanel} /> : null}
        </div>
      </div>
      <div className="hidden gap-6 lg:grid lg:grid-cols-[320px_minmax(0,1fr)_360px]">
        <div>
          <PromptPanel sections={workspace.promptSections} starterHint={workspace.starterHint} />
        </div>
        <div className="space-y-4">
          {surface}
          <WorkspaceStatusBar saveState={workspace.saveState} feedbackState={workspace.feedbackState} />
        </div>
        <div>
          <ResultPanel model={workspace.resultPanel} />
        </div>
      </div>
    </div>
  );
}

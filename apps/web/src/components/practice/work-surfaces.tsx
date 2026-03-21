import { Panel } from '@/components/ui/panel';
import type { PracticeModuleId } from '@/types/practice';

export function WorkSurface({
  module,
  title,
  description,
}: {
  module: PracticeModuleId;
  title: string;
  description: string;
}) {
  return (
    <Panel variant="elevated" className="p-0 overflow-hidden">
      <div className="border-b border-[var(--border-soft)] px-5 py-4 sm:px-6">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
      </div>
      {module === 'sql' ? <SqlSurface /> : null}
      {module === 'python' ? <PythonSurface /> : null}
      {module === 'data-modeling' ? <DataModelingSurface /> : null}
      {module === 'pipeline-builder' ? <PipelineBuilderSurface /> : null}
    </Panel>
  );
}

function EditorChrome({ language, body }: { language: string; body: string }) {
  return (
    <div className="grid gap-4 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_260px]">
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[#11141b] p-4 text-[13px] leading-6 text-[#d6d0c5] shadow-[var(--shadow-soft)]">
        <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#9c988f]">
          <span>{language}</span>
          <span>Mock workspace</span>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap font-[family-name:var(--font-mono)]">{body}</pre>
      </div>
      <div className="space-y-4">
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Reference</p>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            Keep the main flow legible enough to narrate. This center surface stays module-specific while the workspace shell remains shared.
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Examples</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
            <li>Input shape summary</li>
            <li>Expected result outline</li>
            <li>Edge-case reminder</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SqlSurface() {
  return (
    <EditorChrome
      language="SQL"
      body={`WITH user_signup AS (\n  SELECT user_id, MIN(signup_week) AS cohort_week\n  FROM user_events\n  GROUP BY 1\n),\nweekly_activity AS (\n  SELECT DISTINCT user_id, active_week\n  FROM user_events\n)\nSELECT cohort_week, active_week, COUNT(*) AS retained_users\nFROM ...`}
    />
  );
}

function PythonSurface() {
  return (
    <EditorChrome
      language="Python"
      body={`def normalize_events(records):\n    normalized = []\n    errors = []\n\n    for raw in records:\n        # normalize, validate, and keep the latest valid event\n        ...\n\n    return normalized, errors`}
    />
  );
}

function DataModelingSurface() {
  return (
    <div className="grid gap-4 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_260px]">
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            'users',
            'listings',
            'orders',
            'payments',
          ].map((entity) => (
            <div key={entity} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-4">
              <p className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{entity}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">id, status, created_at, foreign keys</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Inspector</p>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Entity structure, keys, and relationship notes will appear here.</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Canvas note</p>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">This is a layout-first ERD surface placeholder for the real builder implementation.</p>
        </div>
      </div>
    </div>
  );
}

function PipelineBuilderSurface() {
  return (
    <div className="grid gap-4 p-5 sm:p-6 xl:grid-cols-[220px_minmax(0,1fr)_220px]">
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Palette</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
          <li>Source</li>
          <li>Transform</li>
          <li>Quality check</li>
          <li>Sink</li>
        </ul>
      </div>
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5">
        <div className="grid gap-4">
          {['Source ingest', 'Validation transform', 'Warehouse sink'].map((node, index) => (
            <div key={node} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-4" style={{ marginLeft: `${index * 24}px` }}>
              <p className="font-medium text-[var(--text-primary)]">{node}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Config</p>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Node requirements, scheduling notes, and failure handling settings will appear here.</p>
      </div>
    </div>
  );
}

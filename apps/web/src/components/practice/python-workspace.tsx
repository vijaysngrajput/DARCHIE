'use client';

import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Braces, Play, RefreshCcw, Send } from 'lucide-react';
import { ExerciseHeader } from '@/components/practice/exercise-header';
import { PromptPanel } from '@/components/practice/prompt-panel';
import { ResultPanel } from '@/components/practice/result-panel';
import { WorkspaceStatusBar } from '@/components/practice/workspace-status-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import type { ExerciseWorkspaceProps, ResultPanelModel } from '@/types/practice';

const STARTER_CODE = `def normalize_events(records):
    normalized = []
    errors = []
    latest_by_session = {}

    for raw in records:
        # parse timestamps safely
        # keep only the latest valid event per user-session pair
        # collect malformed rows into the error summary
        ...

    return normalized, errors
`;

function buildIdleResult(summary: string): ResultPanelModel {
  return {
    status: 'idle',
    summary,
    tabs: [
      { id: 'output', label: 'Output', body: 'Run the transform to inspect normalized rows and error summaries.' },
      { id: 'checks', label: 'Checks', body: 'Structure and edge-case checks will appear here after you run or submit.' },
      { id: 'explanation', label: 'Explanation', body: 'Review feedback will focus on flow clarity, validation handling, and deduplication choices.' },
    ],
    explanation: 'Readable transformation flow matters here just as much as final output correctness.',
  };
}

function buildRunResult(): ResultPanelModel {
  return {
    status: 'success',
    summary: 'Mock preview produced 3 normalized rows and 1 validation issue.',
    tabs: [
      {
        id: 'output',
        label: 'Output',
        body: `normalized_rows
user_id | session_id | event_name     | event_ts
42      | s-100      | page_view      | 2026-03-20T09:00:00Z
42      | s-100      | add_to_cart    | 2026-03-20T09:04:00Z
77      | s-301      | checkout_start | 2026-03-20T11:18:00Z

errors
- Row 7 dropped: malformed timestamp`,
        status: 'success',
      },
      {
        id: 'checks',
        label: 'Checks',
        body: 'Latest-valid event logic applied.\nMalformed timestamp captured.\nOutput keys stayed analytics-ready.',
        status: 'success',
      },
      {
        id: 'explanation',
        label: 'Explanation',
        body: 'This preview stays mocked for now, but it mirrors the shape of the future Python execution workflow.',
      },
    ],
    explanation: 'Use the preview to confirm output shape and error handling before you submit.',
  };
}

function buildSubmitResult(): ResultPanelModel {
  return {
    status: 'success',
    summary: 'Submission feedback is ready for the mocked Python reviewer.',
    tabs: [
      {
        id: 'output',
        label: 'Output',
        body: 'Normalized output shape is consistent and the latest-event deduplication path is represented.',
      },
      {
        id: 'checks',
        label: 'Checks',
        body: 'Correctness: 92\nStructure: 95\nValidation handling: 90\nOverall: 93',
        status: 'success',
      },
      {
        id: 'explanation',
        label: 'Explanation',
        body: 'Strong separation between transformation and validation. Next improvement: make the deduplication key explicit in one helper so it is easier to narrate.',
      },
    ],
    explanation: 'Python interview feedback should help the candidate explain why the code is structured that way, not only whether it passes.',
  };
}

export function PythonWorkspace({
  exerciseId,
  initialWorkspace,
}: {
  exerciseId: string;
  initialWorkspace: ExerciseWorkspaceProps;
}) {
  const [code, setCode] = useState(STARTER_CODE);
  const [saveState, setSaveState] = useState(initialWorkspace.saveState);
  const [feedbackState, setFeedbackState] = useState(initialWorkspace.feedbackState);
  const [resultModel, setResultModel] = useState<ResultPanelModel>(
    buildIdleResult(initialWorkspace.resultPanel.summary),
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const latestSavedCode = useRef(STARTER_CODE);

  useEffect(() => {
    if (code === latestSavedCode.current) return;

    setSaveState('Saving draft...');
    const timeout = window.setTimeout(() => {
      latestSavedCode.current = code;
      setSaveState('Draft saved in preview mode');
    }, 700);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [code]);

  function handleReset() {
    setCode(STARTER_CODE);
    setSaveState('Editor reset to the starter implementation');
    setFeedbackState('idle');
    setResultModel(buildIdleResult(initialWorkspace.resultPanel.summary));
  }

  function handleRun() {
    setIsRunning(true);
    setFeedbackState('running');
    setResultModel({
      status: 'running',
      summary: 'Running the mocked Python transform preview...',
      tabs: [
        { id: 'output', label: 'Output', body: 'Previewing normalized rows.' },
        { id: 'checks', label: 'Checks', body: 'Checking deduplication and validation flow.' },
        { id: 'explanation', label: 'Explanation', body: 'The preview runner is simulating Python exercise feedback.' },
      ],
      explanation: 'This first Python module still uses a mocked execution path.',
    });

    window.setTimeout(() => {
      setIsRunning(false);
      setFeedbackState('success');
      setResultModel(buildRunResult());
    }, 450);
  }

  function handleSubmit() {
    setIsSubmitting(true);
    setFeedbackState('running');
    setResultModel({
      status: 'running',
      summary: 'Submitting the mocked Python solution for review...',
      tabs: [
        { id: 'output', label: 'Output', body: 'Submission preview queued.' },
        { id: 'checks', label: 'Checks', body: 'Scoring flow is preparing structure feedback.' },
        { id: 'explanation', label: 'Explanation', body: 'Submission adds review-oriented commentary on top of the run preview.' },
      ],
      explanation: 'Submission feedback stays mocked in this Python slice.',
    });

    window.setTimeout(() => {
      setIsSubmitting(false);
      setFeedbackState('success');
      setResultModel(buildSubmitResult());
    }, 500);
  }

  return (
    <div className="space-y-6">
      <ExerciseHeader exercise={initialWorkspace.exerciseMeta} saveState={saveState} />
      <div className="grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <div className="xl:sticky xl:top-6">
          <PromptPanel sections={initialWorkspace.promptSections} starterHint={initialWorkspace.starterHint} />
        </div>
        <div className="space-y-6">
          <Panel variant="elevated" className="overflow-hidden p-0">
            <div className="border-b border-[var(--border-soft)] px-5 py-4 sm:px-6">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {initialWorkspace.workSurfaceTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                {initialWorkspace.workSurfaceDescription}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[#11141b] p-3 shadow-[var(--shadow-soft)]">
                <div className="mb-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-[#9c988f]">
                  <span>Python</span>
                  <span>{exerciseId.replaceAll('-', ' ')}</span>
                </div>
                <Editor
                  height="420px"
                  defaultLanguage="python"
                  language="python"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value ?? '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbersMinChars: 3,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
              <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="neutral">Mocked Python preview</Badge>
                    <Badge variant="neutral">ETL-style transform prompt</Badge>
                    <Badge variant="neutral">Structure-first review</Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Button size="lg" variant="outline" onClick={handleReset} className="w-full">
                      <RefreshCcw className="size-4" />
                      Reset
                    </Button>
                    <Button size="lg" variant="secondary" onClick={handleRun} loading={isRunning} className="w-full">
                      <Play className="size-4" />
                      Run
                    </Button>
                    <Button size="lg" onClick={handleSubmit} loading={isSubmitting} className="w-full">
                      <Send className="size-4" />
                      Submit
                    </Button>
                  </div>
                  <WorkspaceStatusBar saveState={saveState} feedbackState={feedbackState} className="bg-[var(--bg-elevated)]" />
                </div>
              </div>
            </div>
          </Panel>
          <Panel variant="default" className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Braces className="size-4 text-[var(--accent-secondary)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Input and review reference</p>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Incoming payload shape</p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">{`{
  "user_id": 42,
  "session_id": "s-100",
  "event_name": "page_view",
  "event_ts": "2026-03-20T09:00:00Z"
}`}</pre>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Expected output contract</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
                  <li>Return normalized dictionaries with stable keys.</li>
                  <li>Keep only the newest valid event per user-session pair.</li>
                  <li>Collect malformed rows into an explicit error list.</li>
                </ul>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Review lens</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Interviewers will look for clear helper boundaries, readable validation flow, and a deduplication path that is easy to explain aloud.
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--accent-secondary)_10%,var(--bg-panel))] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-secondary)]">Implementation note</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  This Python module now shares the SQL workspace structure, but its run and submit flows remain mocked until the Python execution runtime is implemented.
                </p>
              </div>
            </div>
          </Panel>
        </div>
        <div className="xl:sticky xl:top-6">
          <ResultPanel model={resultModel} />
        </div>
      </div>
    </div>
  );
}

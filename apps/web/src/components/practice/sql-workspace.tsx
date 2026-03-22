'use client';

import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { AlertTriangle, Database, Play, RefreshCcw, Send } from 'lucide-react';
import { ExerciseHeader } from '@/components/practice/exercise-header';
import { PromptPanel } from '@/components/practice/prompt-panel';
import { ResultPanel } from '@/components/practice/result-panel';
import { WorkspaceStatusBar } from '@/components/practice/workspace-status-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import {
  fetchSqlExercise,
  getApiBaseUrl,
  runSqlQuery,
  saveSqlDraft,
  submitSqlQuery,
} from '@/lib/practice-api';
import { formatRubricLines, formatTabularRows } from '@/lib/sql-format';
import type {
  ExerciseWorkspaceProps,
  ResultPanelModel,
  SchemaTable,
  SqlExerciseResponse,
  SqlRunResponse,
  SqlSubmitResponse,
} from '@/types/practice';

function buildIdleResult(summary: string): ResultPanelModel {
  return {
    status: 'idle',
    summary,
    tabs: [
      { id: 'output', label: 'Output', body: 'Run the SQL query to inspect preview rows.' },
      { id: 'checks', label: 'Checks', body: 'Submission checks will appear here after you submit the exercise.' },
      { id: 'explanation', label: 'Explanation', body: 'The reviewer will explain what changed in your output and what to try next.' },
    ],
    explanation: 'Use the run preview to validate shape and deduplication before you submit.',
  };
}

function buildRunResult(result: SqlRunResponse): ResultPanelModel {
  const outputBody = result.error?.message
    ? result.error.message
    : formatTabularRows(result.columns, result.rows, 'Run the query to inspect preview rows.');

  return {
    status: result.status,
    summary: result.summary,
    tabs: [
      { id: 'output', label: 'Output', body: outputBody, status: result.status === 'success' ? 'success' : 'warning' },
      {
        id: 'checks',
        label: 'Checks',
        body: result.status === 'success'
          ? `Returned ${result.rowCount} row${result.rowCount === 1 ? '' : 's'}.\nUse this preview to verify cohort weeks and retained-user counts before submission.`
          : 'The query did not run successfully, so no submission checks are available yet.',
      },
      { id: 'explanation', label: 'Explanation', body: result.explanation },
    ],
    explanation: result.explanation,
  };
}

function buildSubmitResult(result: SqlSubmitResponse): ResultPanelModel {
  const previewBody = result.outputPreview
    ? formatTabularRows(result.outputPreview.columns, result.outputPreview.rows, 'No output preview was returned.')
    : 'No output preview was returned.';

  const checksBody = formatRubricLines([
    ['Correctness', result.rubric.correctness],
    ['Structure', result.rubric.structure],
    ['Efficiency / design', result.rubric.efficiencyOrDesign],
    ['Overall', result.rubric.overall],
  ]);

  const explanationBody = [
    result.issues.length ? `Issues:\n${result.issues.map((issue) => `- ${issue}`).join('\n')}` : 'Issues:\n- No major issues were flagged in this submission.',
    `\nStrengths:\n${result.strengths.map((strength) => `- ${strength}`).join('\n') || '- Submission produced the expected output.'}`,
    `\nNext best improvement:\n- ${result.nextBestImprovement}`,
  ].join('\n');

  return {
    status: result.status,
    summary: result.summary,
    tabs: [
      { id: 'output', label: 'Output', body: previewBody, status: 'neutral' },
      { id: 'checks', label: 'Checks', body: checksBody, status: result.status === 'success' ? 'success' : 'warning' },
      { id: 'explanation', label: 'Explanation', body: explanationBody, status: 'neutral' },
    ],
    explanation: result.explanation,
  };
}

export function SqlWorkspace({
  exerciseId,
  initialWorkspace,
}: {
  exerciseId: string;
  initialWorkspace: ExerciseWorkspaceProps;
}) {
  const [workspace, setWorkspace] = useState(initialWorkspace);
  const [sql, setSql] = useState('');
  const [starterSql, setStarterSql] = useState('');
  const [schema, setSchema] = useState<SchemaTable[]>([]);
  const [resultModel, setResultModel] = useState<ResultPanelModel>(
    buildIdleResult(initialWorkspace.resultPanel.summary),
  );
  const [saveState, setSaveState] = useState(initialWorkspace.saveState);
  const [feedbackState, setFeedbackState] = useState(initialWorkspace.feedbackState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const latestSavedSql = useRef('');

  useEffect(() => {
    let cancelled = false;

    fetchSqlExercise(exerciseId)
      .then((response: SqlExerciseResponse) => {
        if (cancelled) return;

        const detail = response.exerciseDetail;
        const nextWorkspace: ExerciseWorkspaceProps = {
          module: 'sql',
          exerciseMeta: detail.exercise,
          promptSections: detail.promptSections,
          starterHint: detail.starterHint,
          saveState: detail.saveState,
          feedbackState: 'idle',
          resultPanel: buildIdleResult(detail.resultSummary),
          workSurfaceTitle: detail.workSurfaceTitle,
          workSurfaceDescription: detail.workSurfaceDescription,
        };

        const initialSql = response.draftAttempt?.sql ?? detail.starterSql;

        setWorkspace(nextWorkspace);
        setSchema(detail.schema);
        setSql(initialSql);
        setStarterSql(detail.starterSql);
        setSaveState(response.draftAttempt ? `Draft restored from preview API (${response.draftAttempt.updatedAt.slice(11, 19)} UTC)` : detail.saveState);
        setResultModel(buildIdleResult(detail.resultSummary));
        latestSavedSql.current = initialSql;
        setIsLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setSaveState(`SQL preview API unavailable. Expected backend at ${getApiBaseUrl()}.`);
        setResultModel({
          status: 'executionError',
          summary: 'The SQL preview backend could not be reached.',
          tabs: [
            { id: 'output', label: 'Output', body: `Start the FastAPI backend at ${getApiBaseUrl()} to enable run and submit behavior.` },
            { id: 'checks', label: 'Checks', body: 'Once the backend is running, the workspace will load schema details and execution feedback here.' },
            { id: 'explanation', label: 'Explanation', body: 'The rest of the practice shell is still available, but SQL execution needs the backend service.' },
          ],
          explanation: 'This SQL module depends on the first FastAPI sandbox backend, not only the frontend shell.',
        });
        setIsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!sql.trim()) {
      setSaveState('Draft is empty');
      return;
    }
    if (sql === latestSavedSql.current) return;

    setSaveState('Saving draft...');
    const timeout = window.setTimeout(() => {
      saveSqlDraft(exerciseId, sql)
        .then((response) => {
          latestSavedSql.current = response.draftAttempt.sql;
          setSaveState(response.saveState);
        })
        .catch(() => {
          setSaveState('Draft save failed. Keep working locally and retry later.');
        });
    }, 900);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [exerciseId, isLoaded, sql]);

  async function handleRun() {
    setIsRunning(true);
    setFeedbackState('running');
    setResultModel({
      status: 'running',
      summary: 'Running your SQL query against the sandboxed preview dataset...',
      tabs: [
        { id: 'output', label: 'Output', body: 'Execution in progress.' },
        { id: 'checks', label: 'Checks', body: 'Submission checks run only after the query preview completes.' },
        { id: 'explanation', label: 'Explanation', body: 'The sandbox is executing a read-only preview query.' },
      ],
      explanation: 'Run previews are intended for inspection before final submission.',
    });

    try {
      const result = await runSqlQuery(exerciseId, sql);
      setFeedbackState(result.status);
      setResultModel(buildRunResult(result));
    } catch {
      setFeedbackState('executionError');
      setResultModel({
        status: 'executionError',
        summary: 'The SQL preview request failed before the sandbox could respond.',
        tabs: [
          { id: 'output', label: 'Output', body: 'Backend request failed. Confirm the API is running and reachable from the web app.' },
          { id: 'checks', label: 'Checks', body: 'No checks ran because the request never reached the execution sandbox.' },
          { id: 'explanation', label: 'Explanation', body: 'This usually means the FastAPI backend is not running on the expected port.' },
        ],
        explanation: 'The frontend shell is healthy, but SQL execution depends on the backend preview API.',
      });
    } finally {
      setIsRunning(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setFeedbackState('running');
    setResultModel({
      status: 'running',
      summary: 'Submitting your SQL query for scored evaluation...',
      tabs: [
        { id: 'output', label: 'Output', body: 'Submission queued in the preview evaluator.' },
        { id: 'checks', label: 'Checks', body: 'Rubric scoring is running.' },
        { id: 'explanation', label: 'Explanation', body: 'The evaluator compares your output to the expected retention breakdown.' },
      ],
      explanation: 'Submission adds scoring and reviewer feedback beyond the raw run preview.',
    });

    try {
      const result = await submitSqlQuery(exerciseId, sql);
      setFeedbackState(result.status);
      setResultModel(buildSubmitResult(result));
    } catch {
      setFeedbackState('executionError');
      setResultModel({
        status: 'executionError',
        summary: 'Submission failed before reaching the SQL evaluator.',
        tabs: [
          { id: 'output', label: 'Output', body: 'No submission preview is available because the request failed.' },
          { id: 'checks', label: 'Checks', body: 'No rubric checks were generated.' },
          { id: 'explanation', label: 'Explanation', body: 'Confirm the backend is running and then submit again.' },
        ],
        explanation: 'Submission depends on the same backend sandbox used for run previews.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    if (!starterSql) {
      setSql('');
      setSaveState('Editor cleared locally. Refresh the page to restore the starter SQL.');
      return;
    }

    setSql(starterSql);
    setSaveState('Editor reset to the starter SQL. Saving updated draft...');
    setFeedbackState('idle');
    setResultModel(buildIdleResult(workspace.resultPanel.summary));
  }

  return (
    <div className="space-y-6">
      <ExerciseHeader exercise={workspace.exerciseMeta} saveState={saveState} />
      <div className="grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <div className="xl:sticky xl:top-6">
          <PromptPanel sections={workspace.promptSections} starterHint={workspace.starterHint} />
        </div>
        <div className="space-y-6">
          <Panel variant="metallic" className="overflow-hidden p-0">
            <div className="border-b border-[var(--border-soft)] px-5 py-4 sm:px-6">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {workspace.workSurfaceTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">{workspace.workSurfaceDescription}</p>
            </div>
            <div className="p-5 sm:p-6">
              <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[#11141b] p-3 shadow-[var(--shadow-soft)]">
                <div className="mb-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-[#9c988f]">
                  <span>SQL</span>
                  <span>{isLoaded ? 'FastAPI preview sandbox' : 'Loading SQL workspace'}</span>
                </div>
                <Editor
                  height="420px"
                  defaultLanguage="sql"
                  language="sql"
                  theme="vs-dark"
                  value={sql}
                  onChange={(value) => setSql(value ?? '')}
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
                    <Badge variant="neutral">SELECT-only preview</Badge>
                    <Badge variant="neutral">Sandboxed dataset</Badge>
                    <Badge variant="neutral">MySQL-oriented runtime decision</Badge>
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
            <div>
              <div className="flex items-center gap-2">
                <Database className="size-4 text-[var(--accent-secondary)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Schema browser</p>
              </div>
              <div className="mt-4 space-y-4">
                {schema.map((table) => (
                  <div key={table.name} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-5">
                    <div className="flex flex-col gap-3 border-b border-[var(--border-soft)] pb-4">
                      <p className="font-[family-name:var(--font-heading)] text-[30px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                        {table.name}
                      </p>
                      <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">{table.description}</p>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {table.columns.map((column) => (
                        <div key={column.name} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-4">
                          <p className="text-lg font-semibold text-[var(--text-primary)]">
                            {column.name} <span className="text-[var(--text-muted)]">({column.type})</span>
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{column.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-[var(--accent-secondary)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Execution rules</p>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
                    <li>Only one read-only SELECT-style query is supported in this first SQL module slice.</li>
                    <li>Preview results are row-limited to keep the sandbox stable.</li>
                    <li>Submission compares final output to the expected retention result and returns first-pass rubric feedback.</li>
                  </ul>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--accent-secondary)_10%,var(--bg-panel))] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-secondary)]">Interview note</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    Keep the final query readable enough to explain aloud. The preview runtime is useful, but clear intermediate logic is still part of the signal.
                  </p>
                </div>
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

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SqlWorkspace } from '@/components/practice/sql-workspace';
import { getWorkspaceExercise } from '@/lib/practice-data';

vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: { value: string; onChange?: (value: string) => void }) => (
    <textarea
      aria-label="SQL editor"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ),
}));

const initialWorkspace = getWorkspaceExercise('sql', 'session-retention-breakdown');

const exerciseDetailResponse = {
  exerciseDetail: {
    exercise: {
      id: 'session-retention-breakdown',
      module: 'sql',
      title: 'Session retention breakdown',
      difficulty: 'Foundations',
      estimatedTime: '25 min',
      tags: ['Window functions', 'Retention', 'Joins'],
      summary: 'Write a query that traces returning-user retention by signup cohort and active week.',
    },
    promptSections: [
      { label: 'Prompt', body: 'Prompt body' },
      { label: 'Constraints', body: 'Constraint body', collapsible: true },
    ],
    starterHint: 'Starter hint',
    starterSql: 'select * from user_events',
    schema: [
      {
        name: 'user_events',
        description: 'Activity rows',
        columns: [
          { name: 'user_id', type: 'INTEGER', description: 'User id' },
          { name: 'signup_week', type: 'INTEGER', description: 'Signup week' },
        ],
        sampleRows: [{ user_id: 1, signup_week: 1 }],
      },
    ],
    workSurfaceTitle: 'SQL editor',
    workSurfaceDescription: 'Workspace description',
    saveState: 'Draft not saved yet',
    resultSummary: 'Run the query to inspect shaped output before submitting.',
  },
  draftAttempt: null,
  entitlement: {
    canAttempt: true,
    plan: 'preview',
  },
};

function jsonResponse(body: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

describe('SqlWorkspace', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('loads the SQL exercise and renders schema-aware editor content', async () => {
    vi.spyOn(global, 'fetch').mockImplementation((input) => {
      const url = String(input);
      if (url.includes('/api/exercises/')) {
        return jsonResponse(exerciseDetailResponse);
      }
      throw new Error(`Unexpected fetch call: ${url}`);
    });

    if (!initialWorkspace) throw new Error('initial workspace missing');
    render(<SqlWorkspace exerciseId="session-retention-breakdown" initialWorkspace={initialWorkspace} />);

    expect((await screen.findAllByDisplayValue('select * from user_events')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/schema browser/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/user_events/i).length).toBeGreaterThan(0);
  });

  it('shows run output after a successful preview execution', async () => {
    vi.spyOn(global, 'fetch').mockImplementation((input, init) => {
      const url = String(input);
      if (url.includes('/api/exercises/')) {
        return jsonResponse(exerciseDetailResponse);
      }
      if (url.includes('/api/attempts/') && init?.method === 'POST') {
        return jsonResponse({
          status: 'success',
          summary: 'Returned 2 rows from the sandboxed SQL dataset.',
          columns: ['cohort_week', 'retained_users'],
          rows: [[1, 2], [2, 1]],
          rowCount: 2,
          explanation: 'Use the preview to validate your query shape.',
          error: null,
        });
      }
      throw new Error(`Unexpected fetch call: ${url}`);
    });

    if (!initialWorkspace) throw new Error('initial workspace missing');
    render(<SqlWorkspace exerciseId="session-retention-breakdown" initialWorkspace={initialWorkspace} />);

    expect((await screen.findAllByDisplayValue('select * from user_events')).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole('button', { name: /^run$/i }).at(-1)!);

    expect((await screen.findAllByText(/returned 2 rows from the sandboxed sql dataset/i)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/cohort_week \| retained_users/i).length).toBeGreaterThan(0);
  });

  it('shows submission feedback and rubric summary after submit', async () => {
    vi.spyOn(global, 'fetch').mockImplementation((input, init) => {
      const url = String(input);
      if (url.includes('/api/exercises/')) {
        return jsonResponse(exerciseDetailResponse);
      }
      if (url.includes('/api/attempts/') && init?.method === 'POST') {
        return jsonResponse({
          status: 'success',
          summary: 'Submission matched the expected retention output for the sandbox dataset.',
          rubric: {
            correctness: 100,
            structure: 95,
            efficiencyOrDesign: 80,
            overall: 95,
          },
          strengths: ['Result rows match expected output.'],
          issues: [],
          nextBestImprovement: 'Tighten naming if you refine further.',
          explanation: 'Output matched the expected result.',
          outputPreview: {
            status: 'success',
            summary: 'Returned 2 rows from the sandboxed SQL dataset.',
            columns: ['cohort_week', 'retained_users'],
            rows: [[1, 2], [2, 1]],
            rowCount: 2,
            explanation: 'Preview explanation',
            error: null,
          },
        });
      }
      throw new Error(`Unexpected fetch call: ${url}`);
    });

    if (!initialWorkspace) throw new Error('initial workspace missing');
    render(<SqlWorkspace exerciseId="session-retention-breakdown" initialWorkspace={initialWorkspace} />);

    expect((await screen.findAllByDisplayValue('select * from user_events')).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole('button', { name: /^submit$/i }).at(-1)!);

    expect((await screen.findAllByText(/submission matched the expected retention output/i)).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole('button', { name: /^checks$/i }).at(-1)!);
    expect(screen.getAllByText(/correctness: 100/i).length).toBeGreaterThan(0);
  });

  it('autosaves draft changes and updates the save-state copy', async () => {
    vi.spyOn(global, 'fetch').mockImplementation((input, init) => {
      const url = String(input);
      if (url.includes('/api/exercises/')) {
        return jsonResponse(exerciseDetailResponse);
      }
      if (url.includes('/api/attempts/') && init?.method === 'PUT') {
        return jsonResponse({
          draftAttempt: {
            sql: 'select user_id from user_events',
            updatedAt: '2026-03-21T13:45:10Z',
          },
          saveState: 'Draft saved at 13:45:10 UTC',
        });
      }
      throw new Error(`Unexpected fetch call: ${url}`);
    });

    if (!initialWorkspace) throw new Error('initial workspace missing');
    render(<SqlWorkspace exerciseId="session-retention-breakdown" initialWorkspace={initialWorkspace} />);

    const editor = (await screen.findAllByLabelText(/sql editor/i))[0];
    fireEvent.change(editor, { target: { value: 'select user_id from user_events' } });

    expect(screen.getAllByText(/saving draft/i).length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getAllByText(/draft saved at 13:45:10 utc/i).length).toBeGreaterThan(0);
    }, { timeout: 2500 });
  });
});

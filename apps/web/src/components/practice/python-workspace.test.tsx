import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PythonWorkspace } from '@/components/practice/python-workspace';
import { getWorkspaceExercise } from '@/lib/practice-data';

vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: { value: string; onChange?: (value: string) => void }) => (
    <textarea
      aria-label="Python editor"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ),
}));

const initialWorkspace = getWorkspaceExercise('python', 'events-normalization-job');

describe('PythonWorkspace', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('renders the prompt, editor, and review layout', async () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<PythonWorkspace exerciseId="events-normalization-job" initialWorkspace={initialWorkspace} />);

    expect(screen.getByText(/input and review reference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/python editor/i)).toBeInTheDocument();
    expect(screen.getByText(/review panel/i)).toBeInTheDocument();
  });

  it('shows mocked review feedback after run', async () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<PythonWorkspace exerciseId="events-normalization-job" initialWorkspace={initialWorkspace} />);

    fireEvent.click(screen.getByRole('button', { name: /^run$/i }));

    expect(await screen.findByText(/mock preview produced 3 normalized rows and 1 validation issue/i)).toBeInTheDocument();
  });
});

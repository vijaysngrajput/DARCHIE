import React from 'react';
import { render, screen } from '@testing-library/react';
import { WorkspaceShell } from '@/components/practice/workspace-shell';
import { getWorkspaceExercise } from '@/lib/practice-data';

describe('WorkspaceShell', () => {
  it('renders the shared workspace structure', () => {
    const workspace = getWorkspaceExercise('sql', 'session-retention-breakdown');
    if (!workspace) throw new Error('workspace missing');

    render(<WorkspaceShell workspace={workspace} surface={<div>Editor surface</div>} />);

    expect(screen.getByRole('heading', { name: /session retention breakdown/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /prompt/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /review panel/i })).toBeInTheDocument();
    expect(screen.getAllByText(/editor surface/i).length).toBeGreaterThan(0);
  });
});

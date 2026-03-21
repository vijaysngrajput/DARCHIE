import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModuleLandingPage } from '@/components/practice/module-landing-page';
import { getModuleExercises, getModuleSummary } from '@/lib/practice-data';

describe('ModuleLandingPage', () => {
  it('renders starter exercises for a module', () => {
    const module = getModuleSummary('sql');
    if (!module) throw new Error('module not found');

    render(<ModuleLandingPage module={module} exercises={getModuleExercises('sql')} />);

    expect(screen.getByRole('heading', { name: /sql/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /session retention breakdown/i, level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/recommended starting point/i)).toBeInTheDocument();
  });
});

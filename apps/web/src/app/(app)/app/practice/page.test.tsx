import React from 'react';
import { render, screen } from '@testing-library/react';
import PracticePage from '@/app/(app)/app/practice/page';

describe('PracticePage', () => {
  it('renders the four practice modules', () => {
    render(<PracticePage />);

    expect(screen.getByRole('heading', { name: /practice hub/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'SQL' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Python' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Data Modeling' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pipeline Builder' })).toBeInTheDocument();
  });
});

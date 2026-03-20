import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders primary variant content', () => {
    render(<Button>Start practicing</Button>);
    expect(screen.getByRole('button', { name: /start practicing/i })).toBeInTheDocument();
  });

  it('supports loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });
});

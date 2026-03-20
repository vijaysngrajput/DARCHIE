import React from 'react';
import { render, screen } from '@testing-library/react';
import { Panel } from '@/components/ui/panel';

describe('Panel', () => {
  it('renders children', () => {
    render(<Panel>Panel content</Panel>);
    expect(screen.getByText(/panel content/i)).toBeInTheDocument();
  });
});

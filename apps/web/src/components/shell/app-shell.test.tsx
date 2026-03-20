import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppShell } from '@/components/shell/app-shell';

vi.mock('next/navigation', () => ({
  usePathname: () => '/app/dashboard',
}));

describe('AppShell', () => {
  it('renders dashboard navigation and content', () => {
    render(<AppShell>Dashboard content</AppShell>);
    expect(screen.getByText(/dashboard content/i)).toBeInTheDocument();
    expect(screen.getAllByText(/dashboard/i).length).toBeGreaterThan(0);
  });
});

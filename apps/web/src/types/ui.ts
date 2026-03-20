import type { ReactNode } from 'react';

export type PanelVariant = 'default' | 'elevated' | 'inset' | 'highlighted' | 'danger';

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  variant?: 'default' | 'dashboard' | 'workspace';
};

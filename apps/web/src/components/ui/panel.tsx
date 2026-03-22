import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const panelVariants = cva(
  'rounded-[var(--radius-lg)] border transition-colors duration-[180ms] ease-[var(--ease-standard)]',
  {
    variants: {
      variant: {
        default:
          'border-[var(--border-soft)] bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-[var(--shadow-soft)]',
        elevated:
          'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-[var(--shadow-panel)]',
        inset:
          'border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-secondary)]',
        highlighted:
          'border-[color-mix(in_oklab,var(--accent-primary)_26%,var(--border-soft))] bg-[color-mix(in_oklab,var(--bg-panel)_94%,var(--accent-primary)_6%)] text-[var(--text-primary)] shadow-[var(--shadow-soft)]',
        danger:
          'border-[color-mix(in_oklab,var(--accent-error)_36%,var(--border-soft))] bg-[color-mix(in_oklab,var(--bg-panel)_94%,var(--accent-error)_6%)] text-[var(--text-primary)] shadow-[var(--shadow-soft)]',
        metallic:
          'border-[color-mix(in_oklab,var(--accent-metallic)_58%,var(--border-strong))] bg-[color-mix(in_oklab,var(--bg-panel)_95%,var(--accent-metallic)_5%)] text-[var(--text-primary)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-metallic)_18%,transparent),0_18px_48px_var(--accent-metallic-glow)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface PanelProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof panelVariants> {}

export function Panel({ className, variant, ...props }: PanelProps) {
  return <div className={cn(panelVariants({ variant }), className)} {...props} />;
}

import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
  {
    variants: {
      variant: {
        neutral: 'border-[var(--border-soft)] bg-transparent text-[var(--text-muted)]',
        info: 'border-[color-mix(in_oklab,var(--accent-primary)_20%,transparent)] bg-[color-mix(in_oklab,var(--accent-primary)_8%,transparent)] text-[var(--text-secondary)]',
        success: 'border-[color-mix(in_oklab,var(--accent-success)_26%,transparent)] bg-[color-mix(in_oklab,var(--accent-success)_10%,transparent)] text-[var(--accent-success)]',
        warning: 'border-[color-mix(in_oklab,var(--accent-warning)_26%,transparent)] bg-[color-mix(in_oklab,var(--accent-warning)_10%,transparent)] text-[var(--accent-warning)]',
        error: 'border-[color-mix(in_oklab,var(--accent-error)_26%,transparent)] bg-[color-mix(in_oklab,var(--accent-error)_10%,transparent)] text-[var(--accent-error)]',
        premium: 'border-[color-mix(in_oklab,var(--accent-secondary)_34%,transparent)] bg-[color-mix(in_oklab,var(--accent-secondary)_10%,transparent)] text-[var(--accent-secondary)]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

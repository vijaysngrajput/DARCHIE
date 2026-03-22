import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 text-sm font-semibold tracking-[-0.01em] transition-colors duration-[130ms] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:pointer-events-none disabled:opacity-55',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--accent-primary)] text-[#f8f6f1] shadow-[var(--shadow-soft)] hover:bg-[var(--accent-primary-strong)]',
        secondary:
          'border border-[var(--border-strong)] bg-[var(--bg-panel)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
        ghost:
          'bg-transparent px-3 text-[var(--text-secondary)] hover:bg-[color-mix(in_oklab,var(--bg-surface)_82%,transparent)] hover:text-[var(--text-primary)]',
        outline:
          'border border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface)]',
        danger:
          'bg-[var(--accent-error)] text-white hover:brightness-105',
        premiumLock:
          'border border-[color-mix(in_oklab,var(--accent-metallic)_52%,transparent)] bg-[color-mix(in_oklab,var(--accent-metallic)_14%,transparent)] text-[var(--accent-metallic)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-metallic)_16%,transparent)] hover:bg-[color-mix(in_oklab,var(--accent-metallic)_18%,transparent)]',
      },
      size: {
        default: '',
        sm: 'h-9 px-3 text-[13px]',
        lg: 'h-12 px-5 text-[15px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        <span className="inline-flex min-w-0 items-center justify-center gap-2">
          {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
          <span>{children}</span>
        </span>
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

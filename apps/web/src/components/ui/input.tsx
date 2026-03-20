import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputState = 'default' | 'error';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: InputState;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, state = 'default', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-[var(--radius-md)] border bg-[var(--bg-panel)] px-4 text-sm text-[var(--text-primary)] transition-colors duration-[130ms] ease-[var(--ease-standard)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:cursor-not-allowed disabled:opacity-60',
        state === 'error'
          ? 'border-[color-mix(in_oklab,var(--accent-error)_78%,var(--border-strong))]'
          : 'border-[var(--border-soft)] hover:border-[var(--border-strong)] focus-visible:border-[color-mix(in_oklab,var(--accent-primary)_60%,var(--border-strong))]',
        className
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };

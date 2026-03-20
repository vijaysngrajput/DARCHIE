import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function SectionContainer({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <section className={cn('mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8', className)}>{children}</section>;
}

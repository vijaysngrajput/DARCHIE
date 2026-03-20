'use client';

import { Moon, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  return (
    <Button variant="ghost" size="sm" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Toggle theme">
      {isDark ? <SunMedium className="size-4" /> : <Moon className="size-4" />}
      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </Button>
  );
}

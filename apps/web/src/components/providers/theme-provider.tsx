'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { themeConfig } from '@/lib/design-tokens';

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider
      attribute={themeConfig.attribute}
      defaultTheme={themeConfig.defaultTheme}
      enableSystem={false}
      themes={themeConfig.themes}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

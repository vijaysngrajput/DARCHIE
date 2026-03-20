export type DesignTokenContract = {
  colors: {
    brand: Record<string, string>;
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  typography: {
    families: {
      heading: string;
      body: string;
      mono: string;
    };
    scale: Record<string, string>;
  };
  radius: Record<string, string>;
  spacing: string[];
  shadows: Record<string, string>;
  focus: {
    dark: string;
    light: string;
  };
};

export type MotionTokenSet = {
  durations: Record<string, string>;
  easing: Record<string, string>;
};

export type ThemeConfig = {
  defaultTheme: 'dark' | 'light';
  themes: Array<'dark' | 'light'>;
  attribute: 'class';
};

export const designTokens: DesignTokenContract = {
  colors: {
    brand: {
      deepNavy: '#293B5F',
      steelBlue: '#47597E',
      softIce: '#DBE6FD',
      warmSand: '#B2AB8C',
      ink: '#2C2E43',
    },
    dark: {
      bgBase: '#2C2E43',
      bgSurface: '#293B5F',
      bgPanel: '#33486E',
      bgElevated: '#47597E',
      textPrimary: '#DBE6FD',
      textSecondary: '#C9D5EE',
      textMuted: '#9EABC2',
      accentPrimary: '#B2AB8C',
      accentPrimaryStrong: '#9F9775',
      accentSecondary: '#DBE6FD',
      accentWarning: '#D9A441',
      accentError: '#D46A6A',
      accentSuccess: '#5BB98C',
      borderSoft: 'rgba(219, 230, 253, 0.14)',
      borderStrong: 'rgba(219, 230, 253, 0.24)',
      focusRing: 'rgba(178, 171, 140, 0.38)',
    },
    light: {
      bgBase: '#F7F5EF',
      bgSurface: '#EEF2FA',
      bgPanel: '#DBE6FD',
      bgElevated: '#FFFFFF',
      textPrimary: '#2C2E43',
      textSecondary: '#293B5F',
      textMuted: '#5C6780',
      accentPrimary: '#293B5F',
      accentPrimaryStrong: '#22324F',
      accentSecondary: '#B2AB8C',
      accentWarning: '#B07B22',
      accentError: '#C45858',
      accentSuccess: '#2F8A60',
      borderSoft: 'rgba(41, 59, 95, 0.10)',
      borderStrong: 'rgba(41, 59, 95, 0.18)',
      focusRing: 'rgba(41, 59, 95, 0.22)',
    },
  },
  typography: {
    families: {
      heading: 'var(--font-heading)',
      body: 'var(--font-body)',
      mono: 'var(--font-mono)',
    },
    scale: {
      displayXl: '64px/72px',
      displayLg: '52px/60px',
      displayMd: '40px/48px',
      headingXl: '32px/40px',
      headingLg: '28px/36px',
      headingMd: '24px/32px',
      headingSm: '20px/28px',
      bodyLg: '18px/28px',
      bodyMd: '16px/24px',
      bodySm: '14px/22px',
      labelMd: '14px/20px',
      labelSm: '12px/18px',
      codeSm: '13px/20px',
    },
  },
  radius: {
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '24px',
  },
  spacing: ['4px', '8px', '12px', '16px', '24px', '32px', '40px', '48px', '64px'],
  shadows: {
    soft: '0 8px 24px rgba(8, 14, 28, 0.12)',
    panel: '0 18px 40px rgba(8, 14, 28, 0.18)',
    modal: '0 28px 80px rgba(8, 14, 28, 0.28)',
  },
  focus: {
    dark: 'rgba(178, 171, 140, 0.38)',
    light: 'rgba(41, 59, 95, 0.22)',
  },
};

export const motionTokens: MotionTokenSet = {
  durations: {
    instant: '80ms',
    fast: '140ms',
    base: '180ms',
    moderate: '220ms',
    slow: '280ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    emphasis: 'cubic-bezier(0.18, 0.9, 0.24, 1)',
  },
};

export const themeConfig: ThemeConfig = {
  defaultTheme: 'dark',
  themes: ['dark', 'light'],
  attribute: 'class',
};

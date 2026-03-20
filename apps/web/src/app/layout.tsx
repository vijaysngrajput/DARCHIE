import type { Metadata } from 'next';
import { JetBrains_Mono, Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';

const heading = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'], weight: ['500', '600', '700'] });
const body = Manrope({ variable: '--font-manrope', subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const mono = JetBrains_Mono({ variable: '--font-jetbrains-mono', subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: 'DARCHIE',
  description: 'Interview-first practice for modern data engineers.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable} ${mono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

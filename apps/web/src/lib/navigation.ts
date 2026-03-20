import type { LucideIcon } from 'lucide-react';
import { BookOpen, LayoutDashboard, Layers3, LogIn, Settings2, Sparkles, WalletCards } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  segment: 'marketing' | 'auth' | 'app';
  requiresAuth: boolean;
};

export type AppShellState = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  currentSection: string;
};

export const marketingNavItems: NavItem[] = [
  { label: 'Modules', href: '/modules', icon: Layers3, segment: 'marketing', requiresAuth: false },
  { label: 'Pricing', href: '/pricing', icon: WalletCards, segment: 'marketing', requiresAuth: false },
  { label: 'About', href: '/about', icon: Sparkles, segment: 'marketing', requiresAuth: false },
];

export const appNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard, segment: 'app', requiresAuth: true },
  { label: 'Practice', href: '/app/practice', icon: BookOpen, segment: 'app', requiresAuth: true },
  { label: 'Progress', href: '/app/progress', icon: Layers3, segment: 'app', requiresAuth: true },
  { label: 'Settings', href: '/app/settings', icon: Settings2, segment: 'app', requiresAuth: true },
];

export const authNavItems: NavItem[] = [
  { label: 'Sign in', href: '/signin', icon: LogIn, segment: 'auth', requiresAuth: false },
  { label: 'Sign up', href: '/signup', icon: Sparkles, segment: 'auth', requiresAuth: false },
];

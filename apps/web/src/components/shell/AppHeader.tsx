"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { logout as logoutRequest } from "@/lib/api/auth";
import { clearAuthSession, readAuthSession } from "@/lib/auth/storage";
import { routes } from "@/lib/routing/routes";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface AppHeaderProps {
  roleLabel: string;
  compact?: boolean;
}

function getShellStatus(pathname: string | null) {
  if (!pathname) {
    return "Focused workflow mode";
  }
  if (pathname === routes.candidateHome) {
    return "Candidate dashboard";
  }
  if (pathname.endsWith("/task")) {
    return "Live assessment in progress";
  }
  if (pathname.endsWith("/complete")) {
    return "Assessment completed";
  }
  if (pathname.endsWith("/expired")) {
    return "Assessment expired";
  }
  if (pathname.includes("/access/lost")) {
    return "Access session lost";
  }
  if (pathname.includes("/access/unauthorized")) {
    return "Unauthorized session";
  }
  if (pathname.includes("/candidate/sessions/")) {
    return "Session ready to resume";
  }
  return "Focused workflow mode";
}

function isActiveAssessmentPath(pathname: string | null) {
  if (!pathname) {
    return false;
  }
  if (!pathname.includes("/candidate/sessions/")) {
    return false;
  }
  return !pathname.endsWith("/complete") && !pathname.endsWith("/expired");
}

export function AppHeader({ roleLabel, compact = false }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [busy, setBusy] = useState(false);
  const shellStatus = getShellStatus(pathname);

  function confirmAssessmentExit() {
    if (!isActiveAssessmentPath(pathname)) {
      return true;
    }
    return window.confirm("Leave the live assessment and return to the dashboard? Your session will remain resumable if it is still valid.");
  }

  async function handleLogout() {
    if (isActiveAssessmentPath(pathname)) {
      const shouldLogout = window.confirm("Log out and leave the active assessment flow? You will need to sign in again to resume if the session is still valid.");
      if (!shouldLogout) {
        return;
      }
    }

    setBusy(true);
    try {
      const storedUser = readAuthSession();
      if (storedUser?.accessSessionId) {
        await logoutRequest();
      }
    } catch {
      // best-effort logout keeps UI deterministic even if backend session already expired
    } finally {
      clearAuthSession();
      router.replace(routes.login);
      setBusy(false);
    }
  }

  function handleDashboardNavigation() {
    if (!confirmAssessmentExit()) {
      return;
    }
    router.push(roleLabel === "Candidate" ? routes.candidateHome : "/login");
  }

  return (
    <header className={compact ? "app-header app-header-compact" : "app-header"}>
      <div className="app-header-brand">
        <Link className="brand-mark" href={roleLabel === "Candidate" ? routes.candidateHome : "/login"}>
          <span className="brand-glyph">D</span>
          <span className="brand-copy">
            <span className="brand-name">D-ARCHIE</span>
            <span className="brand-tag">Assessment platform</span>
          </span>
        </Link>
      </div>

      <div className="app-header-center">
        <div className="header-role-chip">{roleLabel}</div>
        {!compact ? <div className="header-search-shell">{shellStatus}</div> : null}
      </div>

      <div className="app-header-actions">
        <button className="ghost-button header-action" type="button" onClick={handleDashboardNavigation}>
          Dashboard
        </button>
        <button className="ghost-button header-action" type="button" disabled={busy} onClick={() => void handleLogout()}>
          Logout
        </button>
        <div className="user-pill">
          <span className="user-avatar">{(user?.displayName ?? "Workspace").slice(0, 2).toUpperCase()}</span>
          <span className="user-label">{user?.displayName ?? "Workspace"}</span>
        </div>
      </div>
    </header>
  );
}

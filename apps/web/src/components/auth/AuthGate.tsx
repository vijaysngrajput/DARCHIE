"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { routes } from "@/lib/routing/routes";
import { LoadingState } from "@/components/shared/LoadingState";
import { ApiErrorState } from "@/components/shared/ApiErrorState";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, error } = useCurrentUser();

  if (loading && !user) {
    return <LoadingState label="Checking your candidate access..." />;
  }

  if (error && !user) {
    return <ApiErrorState message={error} />;
  }

  if (!user || !user.roles.includes("candidate")) {
    return (
      <div className="card hero-card stack">
        <span className="eyebrow">Access required</span>
        <h1 className="title">Sign in as a candidate to continue.</h1>
        <p className="subtitle">This area is only available to authenticated candidates.</p>
        <div>
          <Link className="button" href={routes.login}>
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { startTransition, type ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { routes } from "@/lib/routing/routes";
import { LoadingState } from "@/components/shared/LoadingState";
import { ApiErrorState } from "@/components/shared/ApiErrorState";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, error } = useCurrentUser();
  const isRecoveryRoute = pathname?.startsWith("/candidate/access/") ?? false;

  useEffect(() => {
    if (!isRecoveryRoute && error && !user) {
      startTransition(() => {
        router.replace(routes.candidateAccessLost);
      });
    }
  }, [error, isRecoveryRoute, router, user]);

  if (isRecoveryRoute) {
    return <>{children}</>;
  }

  if (loading && !user) {
    return <LoadingState label="Checking your candidate access..." />;
  }

  if (error && !user) {
    return <LoadingState label="Restoring your session..." />;
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

"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api/auth";
import { writeAuthSession } from "@/lib/auth/storage";
import { routes } from "@/lib/routing/routes";
import { TransitionOverlay } from "@/components/shared/TransitionOverlay";
import { useDelayedFlag } from "@/hooks/useDelayedFlag";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("candidate@example.com");
  const [password, setPassword] = useState("secret123");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const showTransitionOverlay = useDelayedFlag(submitting && Boolean(statusMessage));

  useEffect(() => {
    router.prefetch(routes.candidateHome);
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      setStatusMessage("Signing you in...");
      const user = await login({ email, password });
      writeAuthSession(user);
      setStatusMessage("Opening your dashboard...");
      startTransition(() => {
        router.push(routes.candidateHome);
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
      setStatusMessage(null);
    }
  }

  return (
    <main className="page-shell login-shell">
      {showTransitionOverlay && statusMessage ? <TransitionOverlay label={statusMessage} /> : null}
      <div className="entry-layout">
        <section className="card surface-card entry-panel">
          <div className="entry-masthead">
            <span className="eyebrow">Candidate assessment</span>
            <h1 className="page-title">Sign in to your dashboard, review your invitations, and start only when the assignment is truly yours to begin.</h1>
            <p className="subtitle">
              D-ARCHIE now follows a real invitation-driven assessment model. First-time candidates see Start, active candidates see Resume, and completed candidates see history instead of a forced retake.
            </p>
          </div>

          <div className="login-panel-copy">
            <div className="hero-support-grid">
              <div className="info-chip">
                <div className="info-chip-title">Runtime user</div>
                <div className="info-chip-value">candidate@example.com</div>
              </div>
              <div className="info-chip">
                <div className="info-chip-title">Default password</div>
                <div className="info-chip-value">secret123</div>
              </div>
            </div>
            <div className="runtime-note">
              <p className="hero-support-note">
                The dashboard is now assignment-centric: invitations, active work, completed attempts, and recovery states each surface as distinct product states.
              </p>
            </div>
          </div>
        </section>

        <section className="card surface-card entry-form-panel login-form-shell">
          <div className="login-form-header">
            <span className="eyebrow">Secure sign in</span>
            <h2 className="section-title">Enter the candidate workspace.</h2>
            <p className="login-form-copy">
              Signing in takes you to the dashboard first. From there, the product decides whether you should start, resume, review completion, or wait for a fresh invitation.
            </p>
          </div>

          <form className="stack" onSubmit={handleSubmit}>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className="form-feedback-slot" aria-live="polite">
              {statusMessage ? <div className="status-inline">{statusMessage}</div> : null}
              {error ? <div className="error-banner">{error}</div> : null}
            </div>
            <div className="button-row">
              <button className="button" type="submit" disabled={submitting}>
                Sign in to dashboard
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

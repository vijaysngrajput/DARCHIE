"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api/auth";
import { createSession } from "@/lib/api/sessions";
import { writeAuthSession } from "@/lib/auth/storage";
import { routes } from "@/lib/routing/routes";
import { TransitionOverlay } from "@/components/shared/TransitionOverlay";
import { useDelayedFlag } from "@/hooks/useDelayedFlag";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("candidate@example.com");
  const [password, setPassword] = useState("secret123");
  const [assignmentId, setAssignmentId] = useState("assignment-ui-1");
  const [assessmentVersionId, setAssessmentVersionId] = useState("assessment-ui-v1");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingSessionRetry, setPendingSessionRetry] = useState<{ assignmentId: string; assessmentVersionId: string } | null>(null);
  const showTransitionOverlay = useDelayedFlag(submitting && Boolean(statusMessage));

  useEffect(() => {
    router.prefetch("/candidate/sessions/[sessionId]");
  }, [router]);

  async function createAndNavigateSession(nextAssignmentId: string, nextAssessmentVersionId: string) {
    setStatusMessage("Creating your session...");
    const session = await createSession({ assignmentId: nextAssignmentId, assessmentVersionId: nextAssessmentVersionId });
    startTransition(() => {
      router.push(routes.candidateSession(session.session_id));
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setPendingSessionRetry(null);
    try {
      setStatusMessage("Signing you in...");
      const user = await login({ email, password });
      writeAuthSession(user);
      await createAndNavigateSession(assignmentId, assessmentVersionId);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to start your assessment.";
      setError(message);
      if (!message.toLowerCase().includes("invalid") && !message.toLowerCase().includes("authentication")) {
        setPendingSessionRetry({ assignmentId, assessmentVersionId });
      }
    } finally {
      setSubmitting(false);
      setStatusMessage(null);
    }
  }

  async function handleRetrySessionCreation() {
    if (!pendingSessionRetry) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createAndNavigateSession(pendingSessionRetry.assignmentId, pendingSessionRetry.assessmentVersionId);
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : "Unable to create your session.");
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
            <h1 className="page-title">A calm entry into one live assessment flow.</h1>
            <p className="subtitle">
              Sign in, create a session, move into the current task, autosave drafts, and finalize without leaving the guided path.
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
                This is the candidate-first route into the platform. It keeps the UI focused on the next decision while using the real backend session flow underneath.
              </p>
            </div>
          </div>
        </section>

        <section className="card surface-card entry-form-panel login-form-shell">
          <div className="login-form-header">
            <span className="eyebrow">Assessment entry</span>
            <h2 className="section-title">Sign in and create your session.</h2>
            <p className="login-form-copy">
              Use the seeded credentials below, or change the assignment and version identifiers if you want to generate a different local runtime session.
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
            <div>
              <label className="label" htmlFor="assignmentId">Assignment id</label>
              <input id="assignmentId" className="input" value={assignmentId} onChange={(event) => setAssignmentId(event.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="assessmentVersionId">Assessment version id</label>
              <input id="assessmentVersionId" className="input" value={assessmentVersionId} onChange={(event) => setAssessmentVersionId(event.target.value)} />
            </div>
            <div className="form-feedback-slot" aria-live="polite">
              {statusMessage ? <div className="status-inline">{statusMessage}</div> : null}
              {error ? <div className="error-banner">{error}</div> : null}
            </div>
            <div className="button-row">
              <button className="button" type="submit" disabled={submitting}>
                Login and create session
              </button>
              {pendingSessionRetry ? (
                <button className="secondary-button" type="button" onClick={() => void handleRetrySessionCreation()} disabled={submitting}>
                  Retry session creation
                </button>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

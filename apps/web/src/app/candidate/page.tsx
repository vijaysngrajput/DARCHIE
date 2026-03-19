"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CandidateErrorBanner } from "@/components/candidate/CandidateErrorBanner";
import { useCandidateHome } from "@/hooks/useCandidateHome";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { startAssignmentSession } from "@/lib/api/sessions";
import { routes } from "@/lib/routing/routes";
import type { CandidateAssignmentSummary } from "@/lib/types";

function AssignmentCard({ assignment, onStart, busy }: { assignment: CandidateAssignmentSummary; onStart: (assignmentId: string) => Promise<void>; busy: boolean }) {
  const timer = useSessionTimer(assignment.current_session_expires_at);
  const progress = assignment.latest_progress_summary;
  const timerLabel = assignment.assignment_state === "in_progress" || assignment.assignment_state === "reopened" ? timer.label : null;

  return (
    <section className="card surface-card dashboard-card dashboard-assignment-card">
      <div className="dashboard-card-header">
        <div>
          <span className="eyebrow">{assignment.assignment_state.replace("_", " ")}</span>
          <h2 className="section-title">{assignment.assessment_version_id}</h2>
          <p className="muted-inline">Assignment {assignment.assignment_id}</p>
        </div>
        {timerLabel ? <div className={timer.warning ? "status-inline status-inline-warning" : "status-inline"}>{timerLabel}</div> : null}
      </div>

      <div className="dashboard-summary-grid">
        <div className="summary-tile">
          <span className="progress-label">State</span>
          <span className="progress-value">{assignment.assignment_state}</span>
        </div>
        <div className="summary-tile">
          <span className="progress-label">Current task</span>
          <span className="progress-value">{assignment.current_task_id ?? "Not started"}</span>
        </div>
        <div className="summary-tile">
          <span className="progress-label">Progress</span>
          <span className="progress-value">{progress ? `${progress.completed_tasks}/${progress.total_tasks}` : "Awaiting start"}</span>
        </div>
        <div className="summary-tile">
          <span className="progress-label">Completion</span>
          <span className="progress-value">{progress ? `${progress.percent_complete}%` : assignment.assignment_state === "completed" ? "100%" : "0%"}</span>
        </div>
      </div>

      <div className="dashboard-action-row">
        <p className="muted-inline">
          {assignment.assignment_state === "invited" && "This invitation is ready, but no assessment attempt exists yet."}
          {assignment.assignment_state === "in_progress" && "A live attempt already exists, so resuming preserves timing, autosave, and recovery behavior."}
          {assignment.assignment_state === "completed" && "This assignment is complete. Review the final state instead of reopening work."}
          {assignment.assignment_state === "expired" && "This invitation or its linked session expired and can no longer be resumed by the candidate."}
          {assignment.assignment_state === "reopened" && "This assignment was reopened and should continue from its saved state."}
          {assignment.assignment_state === "cancelled" && "This assignment is no longer available."}
        </p>
        <div className="button-row">
          {assignment.assignment_state === "invited" ? (
            <button className="button" type="button" disabled={busy} onClick={() => void onStart(assignment.assignment_id)}>
              {assignment.primary_action ?? "Start assessment"}
            </button>
          ) : assignment.primary_action && assignment.primary_route ? (
            <Link className="button" href={assignment.primary_route}>
              {assignment.primary_action}
            </Link>
          ) : null}
          {assignment.secondary_action && assignment.secondary_route ? (
            <Link className="secondary-button" href={assignment.secondary_route}>
              {assignment.secondary_action}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function CandidateHomePage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { view, loading, error, errorStatus, refresh } = useCandidateHome();
  const [startingAssignmentId, setStartingAssignmentId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (errorStatus === 401) {
      router.replace(routes.candidateAccessLost);
      return;
    }
    if (errorStatus === 403) {
      router.replace(routes.candidateUnauthorized);
    }
  }, [errorStatus, router]);

  async function handleStartAssignment(assignmentId: string) {
    setStartingAssignmentId(assignmentId);
    setActionError(null);
    try {
      const session = await startAssignmentSession(assignmentId);
      router.push(routes.candidateSession(session.session_id));
    } catch (startError) {
      setActionError(startError instanceof Error ? startError.message : "Unable to start this assessment.");
      await refresh();
    } finally {
      setStartingAssignmentId(null);
    }
  }

  if (loading && !view) {
    return (
      <main className="page-shell candidate-dashboard-shell">
        <section className="card surface-card dashboard-card loading-card">Loading candidate dashboard...</section>
      </main>
    );
  }

  if (error || !view) {
    return (
      <main className="page-shell candidate-dashboard-shell">
        <CandidateErrorBanner message={error ?? "Unable to load the candidate dashboard."} />
      </main>
    );
  }

  return (
    <main className="page-shell candidate-dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Candidate home</span>
          <h1 className="page-title">Welcome back, {view.candidate_profile.display_name ?? user?.displayName ?? "candidate"}. Start only what is invited, resume only what is live, and review only what is complete.</h1>
          <p className="subtitle">This dashboard now reflects real product states instead of forcing a session into existence. Invitations, active work, completions, and expired access each stay visible as distinct assignment states.</p>
        </div>
        <div className="dashboard-hero-actions">
          <button className="secondary-button" type="button" onClick={() => void refresh()}>Refresh dashboard</button>
          <Link className="ghost-link" href={routes.login}>Use another account</Link>
        </div>
      </section>

      {actionError ? <CandidateErrorBanner message={actionError} /> : null}

      {view.assignments.length === 0 ? (
        <section className="card surface-card dashboard-card">
          <span className="eyebrow">Awaiting invitation</span>
          <h2 className="section-title">There is no candidate assignment available right now.</h2>
          <p className="muted-inline">When a recruiter or administrator issues an invitation, it will appear here with the right next action.</p>
        </section>
      ) : (
        <div className="dashboard-grid">
          {view.assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.assignment_id}
              assignment={assignment}
              busy={startingAssignmentId === assignment.assignment_id}
              onStart={handleStartAssignment}
            />
          ))}
        </div>
      )}
    </main>
  );
}

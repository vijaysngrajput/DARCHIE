"use client";

import { use } from "react";
import Link from "next/link";

import { routes } from "@/lib/routing/routes";

export default function CandidateCompletePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);

  return (
    <main className="page-shell completion-shell">
      <div className="card surface-card completion-card">
        <div className="section-heading">
          <span className="eyebrow">Complete</span>
          <h1 className="page-title">The candidate flow completed cleanly.</h1>
          <p className="subtitle">
            This session moved from login through final submission without dropping out of the guided product flow.
          </p>
        </div>

        <div className="completion-grid">
          <div className="summary-tile">
            <span className="progress-label">Session id</span>
            <span className="progress-value">{sessionId}</span>
          </div>
          <div className="summary-tile">
            <span className="progress-label">Outcome</span>
            <span className="progress-value">Submission complete</span>
          </div>
        </div>

        <p className="completion-note">
          Use this screen as the confirmed end of the candidate-first slice while the broader platform surfaces for recruiting, review, and administration continue to evolve.
        </p>

        <div className="button-row">
          <Link className="button" href={routes.login}>
            Start another session
          </Link>
        </div>
      </div>
    </main>
  );
}

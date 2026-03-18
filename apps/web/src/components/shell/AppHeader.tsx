import Link from "next/link";

interface AppHeaderProps {
  roleLabel: string;
  compact?: boolean;
}

export function AppHeader({ roleLabel, compact = false }: AppHeaderProps) {
  return (
    <header className={compact ? "app-header app-header-compact" : "app-header"}>
      <div className="app-header-brand">
        <Link className="brand-mark" href="/login">
          <span className="brand-glyph">D</span>
          <span className="brand-copy">
            <span className="brand-name">D-ARCHIE</span>
            <span className="brand-tag">Assessment platform</span>
          </span>
        </Link>
      </div>

      <div className="app-header-center">
        <div className="header-role-chip">{roleLabel}</div>
        {!compact ? <div className="header-search-shell">Search coming soon</div> : null}
      </div>

      <div className="app-header-actions">
        <button className="ghost-button header-action" type="button">Help</button>
        <button className="ghost-button header-action" type="button">Support</button>
        <div className="user-pill">
          <span className="user-avatar">DA</span>
          <span className="user-label">Workspace</span>
        </div>
      </div>
    </header>
  );
}

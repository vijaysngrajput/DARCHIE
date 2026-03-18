import Link from "next/link";

export interface NavItem {
  label: string;
  href?: string;
  description?: string;
  active?: boolean;
}

export function SideNav({ title, items, compact = false }: { title: string; items: NavItem[]; compact?: boolean }) {
  return (
    <aside className={compact ? "side-nav side-nav-compact" : "side-nav"}>
      <div className="side-nav-header">
        <span className="eyebrow">Navigation</span>
        <h2 className="side-nav-title">{title}</h2>
      </div>
      <nav className="side-nav-links" aria-label={`${title} navigation`}>
        {items.map((item, index) => {
          const className = item.active ? "side-nav-link is-active" : "side-nav-link";
          const content = (
            <>
              <span className="side-nav-link-label">{item.label}</span>
              {compact || !item.description ? null : <span className="side-nav-link-description">{item.description}</span>}
            </>
          );

          if (!item.href) {
            return (
              <div key={`${item.label}-${index}`} className={`${className} is-static`}>
                {content}
              </div>
            );
          }

          return (
            <Link key={item.href} className={className} href={item.href}>
              {content}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

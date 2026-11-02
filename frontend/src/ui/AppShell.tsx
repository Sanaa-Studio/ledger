import { NavLink, Outlet } from "react-router-dom";
import { NAV_ITEMS } from "./config";

const NavIcon = ({ name }: { name: string }) => {
  const paths: Record<string, string> = {
    grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
    wallet:
      "M3 6.5A2.5 2.5 0 0 1 5.5 4H20v15H5.5A2.5 2.5 0 0 1 3 16.5z M3 8h17 M16 12h1",
    activity: "M3 12h4l3-7 4 14 3-7h4",
    chart: "M4 19V5 M10 19v-9 M16 19V8 M22 19V3",
    settings:
      "M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.2-.1a1.7 1.7 0 0 0-1.8.3l-.1.1h-3.4l-.1-.2a1.7 1.7 0 0 0-1.5-1h-.2l-2.9 1.6-.1-.2a1.7 1.7 0 0 0-1.6-1.1H6l-1.7-2.9.2-.1a1.7 1.7 0 0 0 .5-1.8v-.2l-1.7-2.9.2-.1a1.7 1.7 0 0 0 1-1.5v-.2L2.8 6.7 3 6.6a1.7 1.7 0 0 0 1.1-1.6v-.2L7 3.1l.1.2a1.7 1.7 0 0 0 1.8.5h.2l2.9-1.7.1.2a1.7 1.7 0 0 0 1.5 1h.2l2.9-1.7.1.2a1.7 1.7 0 0 0 1.6 1.1h.2l1.7 2.9-.2.1a1.7 1.7 0 0 0-.5 1.8v.2l1.7 2.9-.2.1a1.7 1.7 0 0 0-1 1.5v.2z",
  };
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={paths[name] ?? paths.grid}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const AppShell = () => (
  <div className="app-shell">
    <aside className="sidebar">
      <NavLink className="brand" to="/dashboard" aria-label="Ledger dashboard">
        <span className="brand__mark" aria-hidden="true">
          L
        </span>
        <span>Ledger</span>
      </NavLink>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link--active" : ""}`.trim()
            }
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="status-dot" />
        <span>Local workspace</span>
      </div>
    </aside>
    <main className="main-content">
      <div className="mobile-brand">
        <span className="brand__mark">L</span> Ledger
      </div>
      <Outlet />
    </main>
  </div>
);

export default AppShell;

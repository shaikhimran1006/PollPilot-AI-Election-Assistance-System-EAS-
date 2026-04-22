import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/journey", label: "Journey" },
  { path: "/timeline", label: "Timeline" },
  { path: "/documents", label: "Documents" },
  { path: "/locator", label: "Locator" },
  { path: "/chatbot", label: "Chatbot" }
];

export default function Layout() {
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <div>
      <a href="#main" className="badge" style={{ position: "absolute", left: 16, top: 12 }}>
        Skip to content
      </a>
      <header style={{ padding: "24px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="badge">ELECTION NAVIGATOR</div>
            <h1 style={{ margin: "12px 0 0", fontFamily: "Fraunces, serif" }}>PollPilot</h1>
          </div>
          <nav aria-label="Primary" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={location.pathname === item.path ? "page" : undefined}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: location.pathname === item.path ? "rgba(34,211,238,0.2)" : "transparent"
                }}
              >
                {item.label}
              </Link>
            ))}
            <button className="secondary-btn" onClick={logout}>Logout</button>
          </nav>
        </div>
      </header>
      <main id="main" className="container">
        <Outlet />
      </main>
    </div>
  );
}

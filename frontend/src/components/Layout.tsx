import { Link, Outlet, useLocation } from "react-router-dom";
import { DemoScenario, getDemoScenario, isDemoMode, setDemoScenario } from "../services/api";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { path: "/pitch", label: "Pitch" },
  { path: "/", label: "Dashboard" },
  { path: "/journey", label: "Journey" },
  { path: "/timeline", label: "Timeline" },
  { path: "/documents", label: "Documents" },
  { path: "/locator", label: "Locator" },
  { path: "/chatbot", label: "Chatbot" }
];

export default function Layout() {
  const location = useLocation();
  const currentScenario = getDemoScenario();
  const showChatFab = location.pathname !== "/chatbot";

  const applyScenario = (scenario: DemoScenario) => {
    setDemoScenario(scenario);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <div>
      <a href="#main" className="badge" style={{ position: "absolute", left: 16, top: 12 }}>
        Skip to content
      </a>
      <header className="site-header">
        <div className="container">
          <div className="site-brand">
            <div className="logo">PP</div>
            <div>
              <h1>PollPilot</h1>
              <div className="muted" style={{ fontSize: 12 }}>ELECTION NAVIGATOR</div>
              {isDemoMode && (
                <div className="badge" style={{ marginTop: 8 }}>
                  <span className="pulse-dot" /> SIMULATION MODE
                </div>
              )}
            </div>
          </div>

          <div className="site-nav" aria-label="Primary">
            <ul>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={`nav-link ${location.pathname === item.path ? "active" : ""}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-actions">
            <ThemeToggle compact />
            {isDemoMode && (
              <Link className="primary-btn" to="/pitch">Pitch</Link>
            )}
            <button className="secondary-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>
      {isDemoMode && (
        <div className="container" style={{ marginBottom: 12 }}>
          <div className="demo-banner">
            <div>
              <div className="badge">LIVE DEMO</div>
              <p style={{ margin: "10px 0 0", color: "var(--text)" }}>The app is running on a simulated civic data stream so every screen feels active during the pitch.</p>
            </div>
            <div className="demo-banner-stats">
              <span>Real-time updates</span>
              <span>Mocked services</span>
              <span>Judge-ready walkthrough</span>
            </div>
            <div className="scenario-switcher" aria-label="Demo scenario switcher">
              <button className={`scenario-pill ${currentScenario === "balanced" ? "scenario-pill-active" : ""}`} onClick={() => applyScenario("balanced")}>Balanced</button>
              <button className={`scenario-pill ${currentScenario === "deadline" ? "scenario-pill-active" : ""}`} onClick={() => applyScenario("deadline")}>Deadline rush</button>
              <button className={`scenario-pill ${currentScenario === "community" ? "scenario-pill-active" : ""}`} onClick={() => applyScenario("community")}>Community</button>
            </div>
            <Link className="secondary-btn" to="/pitch" style={{ textAlign: "center" }}>Open pitch deck</Link>
          </div>
        </div>
      )}
      <main id="main" className="container">
        <Outlet />
      </main>
      {showChatFab && (
        <Link className="chat-fab" to="/chatbot" aria-label="Open election assistant chat">
          <span className="chat-fab-icon" aria-hidden="true">
            <i className="bi bi-chat-dots-fill" />
          </span>
          <span className="chat-fab-label">Chat</span>
        </Link>
      )}
    </div>
  );
}

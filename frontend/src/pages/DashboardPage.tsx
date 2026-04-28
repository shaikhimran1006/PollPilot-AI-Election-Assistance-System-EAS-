import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProgressBar from "../components/ProgressBar";
import { getDemoScenario, isDemoMode } from "../services/api";

const liveSignals = [
  "Polling booth estimates refreshed 14 seconds ago.",
  "Document verification stayed green in the simulation.",
  "A reminder pulse was sent to keep the workflow active.",
  "Journey progress advanced after the latest civic review."
];

const activityTemplates = [
  "A new civic update was processed for the selected scenario.",
  "The assistant recalculated readiness using fresh simulated data.",
  "A polling reminder was queued and acknowledged by the live feed.",
  "The document checklist updated without touching real services."
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!isDemoMode) {
      return;
    }

    const interval = window.setInterval(() => {
      setPulse((current) => current + 1);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  const readinessScore = 74 + (pulse % 9);
  const supportedVoters = 1280 + pulse * 17;
  const openTasks = Math.max(2, 6 - (pulse % 4));
  const activeBooths = 3 + (pulse % 2);
  const latestSignal = liveSignals[pulse % liveSignals.length];
  const scenario = getDemoScenario();
  const activityFeed = [
    { label: "Scenario", value: scenario === "deadline" ? "Deadline rush" : scenario === "community" ? "Community" : "Balanced" },
    { label: "Last refresh", value: `${12 + (pulse % 7)} seconds ago` },
    { label: "Queue status", value: pulse % 2 === 0 ? "Healthy" : "Surging" },
    { label: "Live note", value: activityTemplates[pulse % activityTemplates.length] }
  ];

  return (
    <section className="page">
      <div className="hero-grid fade-in" style={{ marginBottom: 24 }}>
        <div className="hero-panel">
          <div className="badge">PERSONALIZED ASSISTANCE</div>
          <h2 className="section-title" style={{ marginTop: 16 }}>{t("dashboard.title")}</h2>
          <p style={{ color: "var(--muted)", maxWidth: 680 }}>
            Track your progress, get tailored steps, and receive reminders powered by Google services.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setPulse((current) => current + 1)}>
              Refresh live simulation
            </button>
            <div className="badge" style={{ background: "rgba(34, 211, 238, 0.12)" }}>
              <span className="pulse-dot" /> {isDemoMode ? "DEMO STREAM ACTIVE" : "LIVE SERVICES ACTIVE"}
            </div>
          </div>
          {isDemoMode && <p className="signal-text">{latestSignal}</p>}
        </div>

        <div className="hero-preview">
          <div className="preview-ring">
            <div className="preview-ring-core">
              <strong>{readinessScore}%</strong>
              <span>voter readiness</span>
            </div>
          </div>
          <div className="preview-metadata">
            <div>
              <span>Active booths</span>
              <strong>{activeBooths}</strong>
            </div>
            <div>
              <span>Supported voters</span>
              <strong>{supportedVoters.toLocaleString()}</strong>
            </div>
            <div>
              <span>Open tasks</span>
              <strong>{openTasks}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="metric-grid">
        <div className="card metric-card">
          <h3>Completion</h3>
          <ProgressBar value={readinessScore} />
          <p style={{ color: "var(--muted)" }}>You are {readinessScore}% ready to vote.</p>
        </div>
        <div className="card metric-card">
          <h3>Next Deadline</h3>
          <p style={{ color: "var(--muted)" }}>Voter registration ends in 12 days.</p>
          <div className="badge" style={{ marginTop: 12 }}>Critical reminder queued</div>
        </div>
        <div className="card metric-card">
          <h3>Badges</h3>
          <p style={{ color: "var(--muted)" }}>Verified ID, Polling Station Saved</p>
          <div className="badge" style={{ marginTop: 12 }}>Readiness momentum rising</div>
        </div>
        <div className="card metric-card">
          <h3>Live Signals</h3>
          <div className="signal-list">
            {liveSignals.map((signal) => (
              <div key={signal} className={`signal-item ${signal === latestSignal ? "signal-item-active" : ""}`}>
                <span className="pulse-dot" />
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card metric-card activity-card">
          <h3>Live Activity Feed</h3>
          <div className="activity-feed">
            {activityFeed.map((item) => (
              <div key={item.label} className="activity-row">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

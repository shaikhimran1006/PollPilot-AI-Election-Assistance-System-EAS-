import { useTranslation } from "react-i18next";
import ProgressBar from "../components/ProgressBar";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <section className="page">
      <div className="card fade-in" style={{ marginBottom: 24 }}>
        <div className="badge">PERSONALIZED ASSISTANCE</div>
        <h2 className="section-title">{t("dashboard.title")}</h2>
        <p style={{ color: "var(--muted)", maxWidth: 680 }}>
          Track your progress, get tailored steps, and receive reminders powered by Google services.
        </p>
      </div>
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div className="card">
          <h3>Completion</h3>
          <ProgressBar value={68} />
          <p style={{ color: "var(--muted)" }}>You are 68% ready to vote.</p>
        </div>
        <div className="card">
          <h3>Next Deadline</h3>
          <p style={{ color: "var(--muted)" }}>Voter registration ends in 12 days.</p>
        </div>
        <div className="card">
          <h3>Badges</h3>
          <p style={{ color: "var(--muted)" }}>Verified ID, Polling Station Saved</p>
        </div>
      </div>
    </section>
  );
}

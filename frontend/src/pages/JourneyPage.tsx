import { useEffect, useState } from "react";
import api from "../services/api";
import { isDemoMode } from "../services/api";

type JourneyStep = {
  id: string;
  title: string;
  description: string;
  status: string;
  stepOrder: number;
};

export default function JourneyPage() {
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<JourneyStep[]>("/journey")
      .then((response) => setSteps(response.data))
      .catch((err: any) => setError(err?.response?.data?.message || "Failed to load journey"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <h2 className="section-title">Personalized Journey</h2>
      {isDemoMode && <div className="badge" style={{ marginBottom: 16 }}>Journey path is being simulated for the pitch</div>}
      {loading && <p>Loading journey from backend...</p>}
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {!loading && !error && steps.length === 0 && <p>No steps found yet for this account.</p>}
      <div style={{ display: "grid", gap: 16 }}>
        {steps.map((step) => (
          <div key={step.id} className="card" style={{ borderColor: step.status === "done" ? "rgba(52, 211, 153, 0.35)" : "rgba(34, 211, 238, 0.28)" }}>
            <div className="badge">Step {step.stepOrder}</div>
            <h3>{step.title}</h3>
            <p style={{ color: "var(--muted)" }}>{step.description}</p>
            <div className="badge" style={{ marginTop: 10, background: step.status === "done" ? "rgba(52, 211, 153, 0.14)" : "rgba(34, 211, 238, 0.12)" }}>
              Status: {step.status}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

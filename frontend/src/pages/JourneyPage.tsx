import { useEffect, useState } from "react";
import api from "../services/api";

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
      {loading && <p>Loading journey from backend...</p>}
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {!loading && !error && steps.length === 0 && <p>No steps found yet for this account.</p>}
      <div style={{ display: "grid", gap: 16 }}>
        {steps.map((step) => (
          <div key={step.id} className="card">
            <div className="badge">Step {step.stepOrder}</div>
            <h3>{step.title}</h3>
            <p style={{ color: "var(--muted)" }}>{step.description}</p>
            <p>Status: {step.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

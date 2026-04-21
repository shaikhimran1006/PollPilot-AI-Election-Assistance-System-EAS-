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

  useEffect(() => {
    api.get<JourneyStep[]>("/journey").then((response) => setSteps(response.data));
  }, []);

  return (
    <section className="page">
      <h2 className="section-title">Personalized Journey</h2>
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

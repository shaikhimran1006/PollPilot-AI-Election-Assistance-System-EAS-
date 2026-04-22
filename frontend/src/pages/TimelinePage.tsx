import { useEffect, useState } from "react";
import api from "../services/api";
import TimelineView from "../components/TimelineView";

type TimelineItem = {
  title: string;
  description: string;
  eventTime: string;
};

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<TimelineItem[]>("/timeline")
      .then((response) => setItems(response.data))
      .catch((err: any) => setError(err?.response?.data?.message || "Failed to load timeline"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <h2 className="section-title">Timeline & Reminders</h2>
      {loading && <p>Loading timeline from backend...</p>}
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {!loading && !error && items.length === 0 && <p>No timeline events yet.</p>}
      <TimelineView items={items} />
    </section>
  );
}

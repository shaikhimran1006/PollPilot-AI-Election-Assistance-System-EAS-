import { useEffect, useState } from "react";
import api from "../services/api";
import TimelineView from "../components/TimelineView";
import { isDemoMode } from "../services/api";

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
    let cancelled = false;

    const loadTimeline = () => {
      api.get<TimelineItem[]>("/timeline")
        .then((response) => {
          if (!cancelled) {
            setItems(response.data);
            setError(null);
          }
        })
        .catch((err: any) => {
          if (!cancelled) {
            setError(err?.response?.data?.message || "Failed to load timeline");
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });
    };

    loadTimeline();

    if (!isDemoMode) {
      return () => {
        cancelled = true;
      };
    }

    const interval = window.setInterval(loadTimeline, 8000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
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

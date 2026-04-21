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

  useEffect(() => {
    api.get<TimelineItem[]>("/timeline").then((response) => setItems(response.data));
  }, []);

  return (
    <section className="page">
      <h2 className="section-title">Timeline & Reminders</h2>
      <TimelineView items={items} />
    </section>
  );
}

type TimelineItem = {
  title: string;
  description: string;
  eventTime: string;
};

type TimelineViewProps = {
  items: TimelineItem[];
};

export default function TimelineView({ items }: TimelineViewProps) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {items.map((item, index) => (
        <div key={index} className="card fade-in">
          <div className="badge">{new Date(item.eventTime).toLocaleDateString()}</div>
          <h3 style={{ margin: "12px 0 6px" }}>{item.title}</h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

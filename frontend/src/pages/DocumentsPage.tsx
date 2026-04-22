import { useEffect, useState } from "react";
import api from "../services/api";

type DocumentItem = {
  id: string;
  documentName: string;
  status: string;
};

export default function DocumentsPage() {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<DocumentItem[]>("/documents")
      .then((response) => setItems(response.data))
      .catch((err: any) => setError(err?.response?.data?.message || "Failed to load documents"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <h2 className="section-title">Document Checklist</h2>
      {loading && <p>Loading documents from backend...</p>}
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {!loading && !error && items.length === 0 && <p>No checklist documents found yet.</p>}
      <div style={{ display: "grid", gap: 16 }}>
        {items.map((item) => (
          <div key={item.id} className="card">
            <h3>{item.documentName}</h3>
            <p>Status: {item.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

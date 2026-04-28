import { useEffect, useState } from "react";
import api from "../services/api";
import { isDemoMode } from "../services/api";

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
      {isDemoMode && <div className="badge" style={{ marginBottom: 16 }}>Document verification is mocked with realistic status updates</div>}
      {loading && <p>Loading documents from backend...</p>}
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {!loading && !error && items.length === 0 && <p>No checklist documents found yet.</p>}
      <div style={{ display: "grid", gap: 16 }}>
        {items.map((item) => (
          <div key={item.id} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <h3>{item.documentName}</h3>
            <div className="badge" style={{ background: item.status.toLowerCase().includes("verified") ? "rgba(52, 211, 153, 0.14)" : "rgba(251, 191, 36, 0.14)", color: item.status.toLowerCase().includes("verified") ? "var(--success)" : "var(--accent)" }}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import api from "../services/api";

type DocumentItem = {
  id: string;
  documentName: string;
  status: string;
};

export default function DocumentsPage() {
  const [items, setItems] = useState<DocumentItem[]>([]);

  useEffect(() => {
    api.get<DocumentItem[]>("/documents").then((response) => setItems(response.data));
  }, []);

  return (
    <section className="page">
      <h2 className="section-title">Document Checklist</h2>
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

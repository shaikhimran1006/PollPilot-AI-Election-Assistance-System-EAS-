import { useState } from "react";
import api from "../services/api";

export default function ChatWidget() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }
    setLoading(true);
    setError(null);
    const userMessage = input;
    setMessages((prev) => [...prev, `You: ${userMessage}`]);
    setInput("");
    try {
      const response = await api.post<string>("/chat", { message: userMessage });
      setMessages((prev) => [...prev, `Assistant: ${response.data}`]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Chat service unavailable right now");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Election Navigator Chat</h3>
      <div aria-live="polite" style={{ minHeight: 180, marginBottom: 16 }}>
        {messages.map((message, index) => (
          <p key={index} style={{ margin: "6px 0" }}>{message}</p>
        ))}
      </div>
      {error && <p style={{ color: "var(--danger)", marginTop: 0 }}>{error}</p>}
      <div style={{ display: "flex", gap: 12 }}>
        <label className="sr-only" htmlFor="chatInput">Message</label>
        <input
          id="chatInput"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about voter ID, timelines, or steps"
          style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid rgba(148,163,184,0.3)" }}
        />
        <button className="primary-btn" onClick={sendMessage} disabled={loading}>
          {loading ? "Sending" : "Send"}
        </button>
      </div>
    </div>
  );
}

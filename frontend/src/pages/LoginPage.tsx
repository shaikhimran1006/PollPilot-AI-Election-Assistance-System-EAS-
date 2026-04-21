import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import api from "../services/api";
import { auth } from "../services/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", response.data.accessToken);
      window.location.href = "/";
    } catch {
      setError("Login failed");
    }
  };

  const firebaseLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await api.post("/auth/firebase", { idToken });
      localStorage.setItem("accessToken", response.data.accessToken);
      window.location.href = "/";
    } catch {
      setError("Firebase login failed");
    }
  };

  return (
    <div className="container page" style={{ display: "grid", placeItems: "center" }}>
      <div className="card" style={{ maxWidth: 420, width: "100%" }}>
        <h2 style={{ fontFamily: "Fraunces, serif" }}>Welcome to PollPilot</h2>
        <p style={{ color: "var(--muted)" }}>Secure sign-in with Firebase Authentication.</p>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ width: "100%", padding: 12, margin: "8px 0 16px", borderRadius: 10 }}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{ width: "100%", padding: 12, margin: "8px 0 16px", borderRadius: 10 }}
        />
        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        <button className="primary-btn" onClick={login} style={{ width: "100%", marginBottom: 12 }}>
          Sign In
        </button>
        <button className="secondary-btn" onClick={firebaseLogin} style={{ width: "100%" }}>
          Sign In with Google
        </button>
      </div>
    </div>
  );
}

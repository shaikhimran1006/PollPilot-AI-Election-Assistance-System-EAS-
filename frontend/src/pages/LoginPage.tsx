import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import api from "../services/api";
import { auth } from "../services/firebase";
import { isDemoMode } from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSuccess = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    window.location.href = "/";
  };

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      handleSuccess(response.data.accessToken);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/signup", { email, password });
      handleSuccess(response.data.accessToken);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const firebaseLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const idToken = isDemoMode
        ? "demo-id-token"
        : await signInWithPopup(auth, new GoogleAuthProvider()).then((result) => result.user.getIdToken());
      const response = await api.post("/auth/firebase", { idToken });
      handleSuccess(response.data.accessToken);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Firebase login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page login-shell">
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <ThemeToggle />
      </div>
      <div className="login-preview card fade-in">
        <div className="badge">HACKATHON SHOWCASE</div>
        <h2 className="section-title" style={{ marginTop: 16 }}>Election help that feels live</h2>
        <p style={{ color: "var(--muted)", maxWidth: 520 }}>
          PollPilot combines guidance, reminders, document checks, polling locator support, and a civic assistant into one polished flow.
        </p>
        <div className="login-features">
          <div className="feature-pill">Real-time simulation</div>
          <div className="feature-pill">Multilingual support</div>
          <div className="feature-pill">Polling locator</div>
          <div className="feature-pill">AI guidance</div>
        </div>
        <div className="login-story card" style={{ marginTop: 24 }}>
          <div className="badge">DEMO MODE</div>
          <p style={{ marginBottom: 0, color: "var(--text)" }}>
            In demo mode, the app fakes service responses so the full journey looks active even without real backend data.
          </p>
        </div>
      </div>

      <div className="card login-form-panel fade-in">
        <h2 style={{ fontFamily: "Fraunces, serif", marginTop: 0 }}>Welcome to PollPilot</h2>
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
        <button className="primary-btn" onClick={login} disabled={loading} style={{ width: "100%", marginBottom: 12 }}>
          {loading ? "Please wait..." : "Sign In"}
        </button>
        <button className="secondary-btn" onClick={signup} disabled={loading} style={{ width: "100%", marginBottom: 12 }}>
          Create Account
        </button>
        <button className="secondary-btn" onClick={firebaseLogin} disabled={loading} style={{ width: "100%" }}>
          Sign In with Google
        </button>
      </div>
    </div>
  );
}

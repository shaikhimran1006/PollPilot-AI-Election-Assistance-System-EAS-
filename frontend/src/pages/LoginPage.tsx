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

  const getErrorMessage = (caught: unknown, fallback: string) => {
    if (caught && typeof caught === "object" && "response" in caught) {
      const response = (caught as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) {
        return response.data.message;
      }
    }
    return fallback;
  };

  const runAuthAction = async (action: () => Promise<string>, fallback: string) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await action();
      handleSuccess(accessToken);
    } catch (caught: unknown) {
      setError(getErrorMessage(caught, fallback));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    window.location.href = "/";
  };

  const login = () => runAuthAction(async () => {
    const response = await api.post("/auth/login", { email, password });
    return response.data.accessToken;
  }, "Login failed");

  const signup = () => runAuthAction(async () => {
    const response = await api.post("/auth/signup", { email, password });
    return response.data.accessToken;
  }, "Sign up failed");

  const firebaseLogin = () => runAuthAction(async () => {
    const idToken = isDemoMode
      ? "demo-id-token"
      : await signInWithPopup(auth, new GoogleAuthProvider()).then((result) => result.user.getIdToken());
    const response = await api.post("/auth/firebase", { idToken });
    return response.data.accessToken;
  }, "Firebase login failed");

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
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ width: "100%", padding: 12, margin: "8px 0 16px", borderRadius: 10 }}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{ width: "100%", padding: 12, margin: "8px 0 16px", borderRadius: 10 }}
        />
        {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
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

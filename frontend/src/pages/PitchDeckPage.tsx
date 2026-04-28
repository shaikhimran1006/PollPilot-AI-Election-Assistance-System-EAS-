import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DemoScenario, getDemoScenario, isDemoMode, setDemoScenario } from "../services/api";

type PitchFrame = {
  title: string;
  eyebrow: string;
  copy: string;
  statLabel: string;
  statValue: string;
  accent: string;
};

const framesByScenario: Record<DemoScenario, PitchFrame[]> = {
  balanced: [
    {
      title: "One platform for the full voting journey",
      eyebrow: "Problem",
      copy: "Most election help is split across portals and messages. PollPilot brings guidance, reminders, polling location discovery, and AI help into one calm flow.",
      statLabel: "coverage",
      statValue: "5 core voter tasks",
      accent: "Reliable and easy to explain"
    },
    {
      title: "A live simulation that feels real in front of judges",
      eyebrow: "Solution",
      copy: "The dashboard refreshes with simulated civic activity, so the demo looks alive even without depending on a production backend.",
      statLabel: "demo mode",
      statValue: "Scenario switcher + live feed",
      accent: "Pitch-ready presentation layer"
    },
    {
      title: "Fast to understand, fast to trust",
      eyebrow: "Impact",
      copy: "The app presents readiness scores, document verification, and polling support in a way judges can grasp in seconds.",
      statLabel: "first impression",
      statValue: "Clear, polished, memorable",
      accent: "Built for hackathon storytelling"
    }
  ],
  deadline: [
    {
      title: "High-pressure deadlines become manageable",
      eyebrow: "Problem",
      copy: "When registration closes soon, users need clarity immediately. PollPilot surfaces the next action without overwhelming them.",
      statLabel: "urgency",
      statValue: "Deadline-focused flow",
      accent: "Judges see tangible value fast"
    },
    {
      title: "The interface shifts into crisis-response mode",
      eyebrow: "Solution",
      copy: "The scenario switcher makes the whole product feel different: tighter timelines, urgent reminders, and stronger booth calls-to-action.",
      statLabel: "demo emphasis",
      statValue: "Urgent, decisive, clear",
      accent: "Feels like a real operational tool"
    },
    {
      title: "More voters complete the process on time",
      eyebrow: "Impact",
      copy: "The story is simple: when the app surfaces the right step at the right time, voters move faster and confidently.",
      statLabel: "outcome",
      statValue: "Less confusion, more completion",
      accent: "Easy to demo under time pressure"
    }
  ],
  community: [
    {
      title: "Election support should feel welcoming",
      eyebrow: "Problem",
      copy: "Many voter tools feel technical. PollPilot makes the process friendly, accessible, and easier to explain to first-time voters.",
      statLabel: "accessibility",
      statValue: "Friendly, plain-language UI",
      accent: "Community-first positioning"
    },
    {
      title: "Every screen tells a reassuring story",
      eyebrow: "Solution",
      copy: "The app combines visual progress, multilingual readiness, and a civic assistant to reduce friction for diverse voters.",
      statLabel: "tone",
      statValue: "Supportive and inclusive",
      accent: "Great for live narration"
    },
    {
      title: "Stronger trust leads to stronger participation",
      eyebrow: "Impact",
      copy: "Judges see a product that not only works, but also helps people feel confident about the voting process.",
      statLabel: "mission",
      statValue: "Civic trust at the center",
      accent: "Memorable and mission-driven"
    }
  ]
};

const highlightBars = [92, 84, 96, 88, 93];

export default function PitchDeckPage() {
  const scenario = getDemoScenario();
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!isDemoMode) {
      return;
    }

    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % framesByScenario[scenario].length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [scenario]);

  const frames = useMemo(() => framesByScenario[scenario], [scenario]);
  const activeFrame = frames[frameIndex];
  const headline = scenario === "deadline"
    ? "Deadline Rush Demo"
    : scenario === "community"
      ? "Community Support Demo"
      : "Balanced Product Demo";

  const relaunchScenario = (nextScenario: DemoScenario) => {
    setDemoScenario(nextScenario);
    window.location.reload();
  };

  return (
    <section className="page pitch-page">
      <div className="pitch-hero card fade-in">
        <div className="pitch-topline">
          <div>
            <div className="badge">WIN-READY PRESENTATION MODE</div>
            <h2 className="pitch-title">{headline}</h2>
          </div>
          <div className="pitch-controls">
            <Link to="/" className="secondary-btn">Back to app</Link>
            <button className="primary-btn" onClick={() => setFrameIndex((current) => (current + 1) % frames.length)}>
              Next slide
            </button>
          </div>
        </div>

        <div className="pitch-hero-grid">
          <div className="pitch-copy card">
            <div className="badge">{activeFrame.eyebrow}</div>
            <h3>{activeFrame.title}</h3>
            <p style={{ color: "var(--muted)", maxWidth: 650 }}>{activeFrame.copy}</p>
            <div className="pitch-stat-block">
              <span>{activeFrame.statLabel}</span>
              <strong>{activeFrame.statValue}</strong>
            </div>
            <div className="badge" style={{ marginTop: 16, background: "rgba(34, 211, 238, 0.12)" }}>{activeFrame.accent}</div>
          </div>

          <div className="pitch-visual card">
            <div className="pitch-ring">
              <div className="pitch-ring-core">
                <span>PollPilot</span>
                <strong>Pitch Deck</strong>
                <small>{scenario.toUpperCase()}</small>
              </div>
            </div>
            <div className="pitch-bars">
              {highlightBars.map((bar, index) => (
                <div key={index} className="pitch-bar-row">
                  <span>Signal {index + 1}</span>
                  <div className="pitch-bar-track">
                    <div className="pitch-bar-fill" style={{ width: `${bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pitch-grid">
        <div className="card pitch-card">
          <h3>Story arc</h3>
          <p>Problem, solution, and impact are all visible in one glance.</p>
        </div>
        <div className="card pitch-card">
          <h3>Demo control</h3>
          <p>Switch scenarios live to match the story you want to tell judges.</p>
        </div>
        <div className="card pitch-card">
          <h3>Confidence boost</h3>
          <p>The app looks active, intentional, and easy to narrate under pressure.</p>
        </div>
      </div>

      <div className="card pitch-scenario-panel">
        <div>
          <div className="badge">SCENARIO SWITCHER</div>
          <h3 style={{ marginBottom: 8 }}>Choose the pitch angle you want to sell</h3>
          <p style={{ color: "var(--muted)" }}>Use the same app, but tell a different story depending on the judge audience.</p>
        </div>
        <div className="scenario-switcher">
          <button className={`scenario-pill ${scenario === "balanced" ? "scenario-pill-active" : ""}`} onClick={() => relaunchScenario("balanced")}>Balanced</button>
          <button className={`scenario-pill ${scenario === "deadline" ? "scenario-pill-active" : ""}`} onClick={() => relaunchScenario("deadline")}>Deadline rush</button>
          <button className={`scenario-pill ${scenario === "community" ? "scenario-pill-active" : ""}`} onClick={() => relaunchScenario("community")}>Community</button>
        </div>
      </div>
    </section>
  );
}
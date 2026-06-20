import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ─── Helpers ────────────────────────────────────────────────────────────────

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function fetchGitHubSummary(username) {
  if (!username) return null;
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=10&sort=updated`);
    if (!res.ok) return null;
    const repos = await res.json();
    const names = repos.map((r) => r.name).join(", ");
    const langs = [...new Set(repos.flatMap((r) => r.language).filter(Boolean))].join(", ");
    return `GitHub repos (most recent): ${names}. Languages detected: ${langs || "N/A"}.`;
  } catch {
    return null;
  }
}

// ─── Claude API ─────────────────────────────────────────────────────────────

async function analyzeWithGemini({ pdfBase64, jobDescription, githubSummary }) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pdfBase64, jobDescription, githubSummary }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `API error ${res.status}`);
  }

  return res.json();
}
// ─── Sub-components ──────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={70} cy={70} r={r} fill="none" stroke="#1e293b" strokeWidth={12} />
        <circle
          cx={70} cy={70} r={r} fill="none"
          stroke={color} strokeWidth={12}
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray 1.2s ease" }}
        />
        <text x={70} y={74} textAnchor="middle" fill={color}
          fontSize={28} fontWeight={700} fontFamily="'Inter', sans-serif">
          {score}
        </text>
        <text x={70} y={92} textAnchor="middle" fill="#94a3b8"
          fontSize={11} fontFamily="'Inter', sans-serif">
          / 100
        </text>
      </svg>
      <span style={{ fontSize: 13, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        Match Score
      </span>
    </div>
  );
}

function Pill({ text, variant }) {
  const colors = {
    green:  { bg: "#052e16", border: "#166534", text: "#4ade80" },
    red:    { bg: "#2d0a0a", border: "#7f1d1d", text: "#f87171" },
    blue:   { bg: "#0c1a2e", border: "#1e3a5f", text: "#60a5fa" },
    amber:  { bg: "#1c1000", border: "#78350f", text: "#fbbf24" },
  };
  const c = colors[variant] || colors.blue;
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 999,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: 12, fontWeight: 500, margin: "3px 4px 3px 0",
    }}>
      {text}
    </span>
  );
}

function Card({ title, icon, children, accentColor = "#6366f1" }) {
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16,
      padding: "24px 28px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, width: 4,
        height: "100%", background: accentColor, borderRadius: "4px 0 0 4px",
      }} />
      <h3 style={{
        margin: "0 0 16px", fontSize: 14, fontWeight: 600,
        color: "#e2e8f0", textTransform: "uppercase", letterSpacing: "0.08em",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>{icon}</span>{title}
      </h3>
      {children}
    </div>
  );
}

function BulletList({ items, variant }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ marginTop: 3, flexShrink: 0, fontSize: 14 }}>
            {variant === "green" ? "✅" : variant === "red" ? "⚠️" : "→"}
          </span>
          <span style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Loading screen ──────────────────────────────────────────────────────────

function LoadingScreen() {
  const steps = [
    "Reading your resume…",
    "Parsing job requirements…",
    "Mapping skills to role…",
    "Running gap analysis…",
    "Generating recommendations…",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 1800);
    return () => clearInterval(id);
 }, [steps.length]);

  return (
    <div style={{
      minHeight: "100vh", background: "#020817",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
    }}>
      {/* Spinner */}
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          border: "3px solid #1e293b",
          borderTop: "3px solid #6366f1",
          animation: "spin 0.9s linear infinite",
        }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>
          Analyzing your profile
        </p>
        <p style={{ color: "#6366f1", fontSize: 14, margin: 0, minWidth: 240, transition: "all 0.3s" }}>
          {steps[step]}
        </p>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i <= step ? 20 : 6, height: 6, borderRadius: 3,
            background: i <= step ? "#6366f1" : "#1e293b",
            transition: "all 0.4s ease",
          }} />
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
 useEffect(() => {
    console.log("ResultsPage state:", state);
    if (!state?.pdfFile) {
      navigate("/upload");
      return;
    }
    (async () => {
      try {
        const [pdfBase64, githubSummary] = await Promise.all([
          readFileAsBase64(state.pdfFile),
          fetchGitHubSummary(state.githubUsername),
        ]);
        const analysis = await analyzeWithGemini({
          pdfBase64,
          jobDescription: state.jobDescription,
          githubSummary,
        });
        setResult(analysis);
      } catch (e) {
        setError(e.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [state, navigate]);
 

  if (loading) return <LoadingScreen />;

  if (error) return (
    <div style={{
      minHeight: "100vh", background: "#020817",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24,
    }}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <h2 style={{ color: "#f87171", margin: 0 }}>Analysis failed</h2>
      <p style={{ color: "#94a3b8", maxWidth: 420, textAlign: "center", lineHeight: 1.6 }}>{error}</p>
      <button onClick={() => navigate("/upload")} style={{
        padding: "12px 28px", background: "#6366f1", color: "#fff",
        border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer",
      }}>
        Try again
      </button>
    </div>
  );

  const { matchScore, verdict, strengths, skillGaps, recommendations, keywordsMatched, keywordsMissing } = result;

  return (
    <div style={{ minHeight: "100vh", background: "#020817", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      {/* Header bar */}
      <div style={{
        borderBottom: "1px solid #1e293b", padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "#020817", zIndex: 10,
      }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#e2e8f0", letterSpacing: "-0.01em" }}>
          ✦ ResumeAI
        </span>
        <button onClick={() => navigate("/upload")} style={{
          padding: "8px 20px", background: "transparent", color: "#94a3b8",
          border: "1px solid #1e293b", borderRadius: 8, fontSize: 14, cursor: "pointer",
        }}>
          ← Analyze another
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Hero row — score + verdict */}
        <div style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 32,
          alignItems: "center", marginBottom: 40,
          background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20, padding: 32,
        }}>
          <ScoreRing score={matchScore} />
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6366f1", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Analysis Complete
            </p>
            <p style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700, lineHeight: 1.4, color: "#f1f5f9" }}>
              {verdict}
            </p>
            {state.githubUsername && (
              <span style={{ fontSize: 13, color: "#475569" }}>
                GitHub: <span style={{ color: "#6366f1" }}>@{state.githubUsername}</span> included in analysis
              </span>
            )}
          </div>
        </div>

        {/* Keywords row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <Card title="Keywords Matched" icon="✅" accentColor="#22c55e">
            <div>{keywordsMatched?.map((k) => <Pill key={k} text={k} variant="green" />)}</div>
          </Card>
          <Card title="Keywords Missing" icon="🔍" accentColor="#ef4444">
            <div>{keywordsMissing?.map((k) => <Pill key={k} text={k} variant="red" />)}</div>
          </Card>
        </div>

        {/* Main 3-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          <Card title="Strengths" icon="💪" accentColor="#22c55e">
            <BulletList items={strengths || []} variant="green" />
          </Card>
          <Card title="Skill Gaps" icon="⚡" accentColor="#f59e0b">
            <BulletList items={skillGaps || []} variant="red" />
          </Card>
          <Card title="Recommendations" icon="🎯" accentColor="#6366f1">
            <BulletList items={recommendations || []} variant="default" />
          </Card>
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button onClick={() => navigate("/upload")} style={{
            padding: "14px 36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em",
            boxShadow: "0 0 32px rgba(99,102,241,0.3)",
          }}>
            Analyze Another Resume →
          </button>
        </div>
      </div>
    </div>
  );
}

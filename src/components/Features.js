import React from 'react';
import './Features.css';

const features = [
  { icon: '📄', title: 'Resume Analyzer', desc: 'Deep AI analysis of your resume with recruiter-style feedback and improvement tips.' },
  { icon: '🐙', title: 'GitHub Portfolio Analysis', desc: 'Scans your repositories to evaluate code quality, tech stack, and project impact.' },
  { icon: '🎯', title: 'Skill Gap Detection', desc: 'Compares your profile against job descriptions to highlight exactly what you need to learn.' },
  { icon: '🗺️', title: 'Career Roadmap', desc: 'Generates a personalized step-by-step learning path to land your dream role.' },
  { icon: '🤖', title: 'AI Feedback', desc: 'Get honest, recruiter-style feedback powered by Claude AI on your entire profile.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Track your skill development over time and see how your profile improves.' },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <h2 className="features-title">Everything You Need to <span className="features-highlight">Level Up</span></h2>
        <p className="features-subtitle">One platform to analyze, improve, and track your tech career journey.</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" data-aos="fade-up" data-aos-delay={i * 100} key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
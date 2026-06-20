import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-badge">🚀 AI-Powered Career Intelligence</div>
        <h1 className="hero-title">
          Turn Your Resume Into a <span className="hero-highlight">Career Roadmap</span>
        </h1>
        <p className="hero-subtitle">
          SkillForge AI analyzes your resume, GitHub portfolio, and target job descriptions
          to generate personalized skill-gap reports and career roadmaps.
        </p>
        <div className="hero-buttons">
          <button className="hero-btn-primary" onClick={() => navigate('/upload')}>
            Analyze My Resume
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
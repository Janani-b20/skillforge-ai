import React from 'react';
import './HowItWorks.css';

const steps = [
  { number: '01', title: 'Upload Your Resume', desc: 'Upload your PDF resume and paste your target job description.' },
  { number: '02', title: 'Connect GitHub', desc: 'Link your GitHub profile so we can analyze your real project experience.' },
  { number: '03', title: 'AI Analyzes Everything', desc: 'Claude AI scans your resume, GitHub, and job description in seconds.' },
  { number: '04', title: 'Get Your Roadmap', desc: 'Receive a personalized skill-gap report and step-by-step career roadmap.' },
];

const HowItWorks = () => {
  return (
    <section className="hiw" id="how-it-works">
      <div className="hiw-container">
        <h2 className="hiw-title">How It <span className="hiw-highlight">Works</span></h2>
        <p className="hiw-subtitle">From resume to roadmap in under 60 seconds.</p>
        <div className="hiw-steps">
          {steps.map((s, i) => (
            <div className="hiw-step" key={i} data-aos="fade-up" data-aos-delay={i * 150}>
              <div className="hiw-number">{s.number}</div>
              <h3 className="hiw-step-title">{s.title}</h3>
              <p className="hiw-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
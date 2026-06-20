import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">SkillForge <span className="logo-ai">AI</span></span>
        </div>
        <ul className="navbar-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="navbar-cta" onClick={() => navigate('/upload')}>
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

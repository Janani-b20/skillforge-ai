import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import Contact from './components/Contact';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';   // ← add this
import './App.css';

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div>
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Contact />
            <Footer />
          </div>
        } />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/results" element={<ResultsPage />} />   {/* ← add this */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <section id="contact" className="contact">
      <h2 data-aos="fade-up" data-aos-delay="0">Ready to <span>Get Started?</span></h2>
      <p data-aos="fade-up" data-aos-delay="150">Join thousands of professionals accelerating their careers with AI.</p>
      <div className="contact-form" data-aos="fade-up" data-aos-delay="300">
        <input type="email" placeholder="Enter your email" />
        <button>Get Early Access</button>
      </div>
    </section>
  );
}

export default Contact;
import React from 'react';
import '../styles/ui-enhanced.css';

const TestPage = () => {
  return (
    <div className="test-page">
      <section className="category-hero">
        <div className="container">
          <div className="category-hero-content">
            <h1 className="category-title">Test Page - Working!</h1>
            <p className="category-subtitle">All components are loading correctly</p>
          </div>
        </div>
      </section>
      
      <section className="form-content">
        <div className="container">
          <div className="form-step">
            <h2>✅ All Systems Operational</h2>
            <p>The website is working properly. All components are loading and functioning correctly.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestPage;

import React, { useState } from 'react';

const RegionalAlumni = () => {
  const [showConnectForm, setShowConnectForm] = useState(false);

  const regions = [
    { id: 'north', name: 'North Region', states: 'Jammu & Kashmir, Himachal Pradesh, Punjab, Haryana, Delhi, Rajasthan, Uttar Pradesh, Uttarakhand', alumni: 2847, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'south', name: 'South Region', states: 'Kerala, Tamil Nadu, Karnataka, Andhra Pradesh, Telangana', alumni: 2156, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 'east', name: 'East Region', states: 'West Bengal, Odisha, Jharkhand, Bihar, Sikkim, Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura', alumni: 1923, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'west', name: 'West Region', states: 'Maharashtra, Gujarat, Goa, Madhya Pradesh, Chhattisgarh', alumni: 2341, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];

  const featuredAlumni = [
    { id: 1, name: 'Dr. Rajesh Kumar', batch: '2005', region: 'North', profession: 'Software Engineer', company: 'Google', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', achievements: 'Led AI research team' },
    { id: 2, name: 'Priya Sharma', batch: '2008', region: 'South', profession: 'Doctor', company: 'Apollo Hospitals', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', achievements: 'Award-winning cardiologist' },
    { id: 3, name: 'Amit Patel', batch: '2010', region: 'West', profession: 'Entrepreneur', company: 'TechStart Solutions', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', achievements: 'Founded 3 startups' }
  ];

  const handleSubmitConnection = (e) => {
    e.preventDefault();
    alert('Connection request submitted successfully!');
    setShowConnectForm(false);
  };

  return (
    <div className="product-page-container">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Regional Alumni</h1>
          <p className="page-subtitle">Connect with Navodayans across India</p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <h2 className="about-heading" style={{ marginBottom: '40px' }}>Regional Networks</h2>
          <div className="regions-grid">
            {regions.map((region) => (
              <div key={region.id} className="region-card">
                <div className="region-image" style={{ background: region.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <i className="fas fa-map-marker-alt" style={{ fontSize: '64px', marginBottom: '8px' }}></i>
                    <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{region.name}</h3>
                  </div>
                </div>
                <div className="region-content">
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>{region.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '12px' }}>{region.states}</p>
                  <p style={{ fontSize: '14px', color: '#2563eb', fontWeight: '600' }}><i className="fas fa-user-graduate"></i> {region.alumni.toLocaleString()} Alumni</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#f8fafc', padding: '60px 0' }}>
        <div className="container">
          <h2 className="about-heading" style={{ marginBottom: '40px' }}>Featured Alumni</h2>
          <div className="alumni-grid">
            {featuredAlumni.map((alumni) => (
              <div key={alumni.id} className="alumni-card">
                <div className="alumni-image" style={{ background: alumni.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <i className="fas fa-user-tie" style={{ fontSize: '80px' }}></i>
                  </div>
                </div>
                <div className="alumni-content">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-dark)' }}>{alumni.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '4px' }}>Batch {alumni.batch}</p>
                  <p style={{ fontSize: '14px', color: '#2563eb', fontWeight: '600', marginBottom: '4px' }}>{alumni.profession}</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-gray)' }}>{alumni.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegionalAlumni;

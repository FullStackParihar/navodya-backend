import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Events.css';



const galleryImages = [
  '/g1.jpeg',
  '/g2.jpeg',
  '/g3.jpeg',
  '/g4.jpeg',
  '/g5.jpeg',
  '/g6.jpeg',
  '/g7.jpeg',
  '/g8.jpeg',
  '/g9.jpeg',
  '/g10.jpeg',
  '/g11.jpeg',
  '/g12.jpeg',
  '/g13.jpeg',
  '/g14.jpeg',
  '/g15.jpeg',
  '/g16.jpeg'
];

const Events = () => {
  const [giveaways, setGiveaways] = useState([]);
  const [alumniMeetsList, setAlumniMeetsList] = useState([]);
  const [liveEventsList, setLiveEventsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contestsRes, meetsRes, eventsRes] = await Promise.all([
          api.get('/contests'),
          api.get('/alumni-meets'),
          api.get('/events')
        ]);

        if (contestsRes.success) {
          setGiveaways(contestsRes.data);
        }
        if (meetsRes.success) {
          setAlumniMeetsList(meetsRes.data);
        }
        if (eventsRes.success) {
          setLiveEventsList(eventsRes.data);
        }
      } catch (err) {
        console.error('Error fetching events data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="contests-loader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '15px', color: '#666' }}>Loading Events & Meets...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      {/* Giveaways */}
      <section className="events-giveaways" id="giveaways">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Win</span>
            <h2 className="section-title">Giveaways & <span className="highlight">Contests</span></h2>
          </div>
          {giveaways.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <i className="fas fa-gift" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
              <p>No active giveaways or contests at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="events-giveaways-grid">
              {giveaways.map((item, index) => (
                <div key={item._id || index} className="event-giveaway-card" style={{ '--delay': `${index * 0.12}s` }}>
                  <div className="giveaway-image-container">
                    <img src={item.bannerImage || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop'} alt={item.title} />
                    <div className="giveaway-icon-badge">
                      <i className="fas fa-gift"></i>
                    </div>
                  </div>
                  <div className="giveaway-details">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="giveaway-meta">
                      <span><i className="fas fa-calendar-alt"></i> Ends: {new Date(item.endDate).toLocaleDateString()}</span>
                    </div>
                    <a 
                      href={item.googleFormLink || "https://docs.google.com/forms/d/e/1FAIpQLSev2_RPJq8HJYznckGKKEWbzj1K0rNzNN8SIFk2dYZ8WFK3KQ/viewform?usp=publish-editor"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary btn-small"
                    >
                      Join Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Alumni Meets */}
      <section className="events-alumni-meets" id="alumni-meets">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Reunite</span>
            <h2 className="section-title">Upcoming Alumni <span className="highlight">Meets</span></h2>
          </div>
          {alumniMeetsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <i className="fas fa-graduation-cap" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
              <p>No upcoming Alumni Meets scheduled. Stay tuned!</p>
            </div>
          ) : (
            <div className="events-meets-grid">
              {alumniMeetsList.map((meet, index) => (
                <div key={meet._id || index} className="event-meet-card" style={{ '--delay': `${index * 0.12}s` }}>
                  <div className="meet-image-container">
                    <img src={meet.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop'} alt={meet.name} />
                    <div className="meet-icon-badge">
                      <i className="fas fa-handshake"></i>
                    </div>
                  </div>
                  <div className="meet-details">
                    <h3>{meet.name}</h3>
                    <div className="meet-meta">
                      <span><i className="fas fa-school"></i> {meet.jnv}</span>
                      <span><i className="fas fa-graduation-cap"></i> {meet.batch}</span>
                      <span><i className="fas fa-map-marker-alt"></i> {meet.location}</span>
                      <span><i className="fas fa-users"></i> {meet.attendees} Attendees</span>
                    </div>
                    <a 
                      href={meet.registrationLink || "https://docs.google.com/forms/d/e/1FAIpQLSev2_RPJq8HJYznckGKKEWbzj1K0rNzNN8SIFk2dYZ8WFK3KQ/viewform?usp=publish-editor"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary btn-small"
                    >
                      Register Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Live Events */}
      <section className="events-live">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Live</span>
            <h2 className="section-title">Live Online <span className="highlight">Events</span></h2>
          </div>
          {liveEventsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <i className="fas fa-video" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
              <p>No live online events scheduled at the moment.</p>
            </div>
          ) : (
            <div className="events-live-grid">
              {liveEventsList.map((event, index) => (
                <div key={event._id || index} className="event-live-card" style={{ '--delay': `${index * 0.12}s` }}>
                  <div className="live-image-container">
                    <img src={event.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop'} alt={event.name} />
                    <div className="live-icon-badge">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                  </div>
                  <div className="live-details">
                    <h3>{event.name}</h3>
                    <div className="live-meta">
                      <span><i className="fas fa-tag"></i> {event.type}</span>
                      <span><i className="fas fa-calendar"></i> {new Date(event.date).toLocaleDateString()}</span>
                      <span><i className="fas fa-clock"></i> {event.time}</span>
                      <span><i className="fas fa-video"></i> {event.platform}</span>
                    </div>
                    <a 
                      href={event.registrationLink || "https://docs.google.com/forms/d/e/1FAIpQLSev2_RPJq8HJYznckGKKEWbzj1K0rNzNN8SIFk2dYZ8WFK3KQ/viewform?usp=publish-editor"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary btn-small"
                    >
                      Join
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Registration Form */}
      <section className="events-registration">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Register</span>
            <h2 className="section-title">Event <span className="highlight">Registration</span></h2>
          </div>
          <div className="registration-box">
            <i className="fas fa-clipboard-list check-icon"></i>
            <h3>Ready to join us?</h3>
            <p>Click the button below to register for upcoming events</p>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSev2_RPJq8HJYznckGKKEWbzj1K0rNzNN8SIFk2dYZ8WFK3KQ/viewform?usp=publish-editor" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary btn-large"
            >
              <i className="fas fa-external-link-alt"></i> Register via Google Form
            </a>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="events-past">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Memories</span>
            <h2 className="section-title">Past Event <span className="highlight">Gallery</span></h2>
          </div>
          <div className="gallery-float-wrapper">
            <div className="gallery-float-track">
              {/* Duplicate for seamless loop */}
              {[...galleryImages, ...galleryImages].map((image, index) => (
                <div key={index} className="gallery-float-item">
                  <img src={image} alt={`Gallery ${(index % galleryImages.length) + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;

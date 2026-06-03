import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Events.css';

const categories = [
  {
    name: 'T-Shirts',
    description: 'Premium Cotton',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=700&fit=crop',
    link: '/tshirts',
    icon: 'fa-shirt-long-sleeve'
  },
  {
    name: 'Hoodies',
    description: 'Cozy & Warm',
    image: 'https://assets.ajio.com/medias/sys_master/root1/20260121/pQRe/6970620d7ef0c7385c7f28a5/-473Wx593H-700751556-teal-MODEL.jpg',
    link: '/hoodies',
    icon: 'fa-shirt'
  },
  {
    name: 'Accessories',
    description: 'Complete Style',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop',
    link: '/accessories',
    icon: 'fa-hat-cowboy'
  },
  {
    name: "Today's Deals",
    description: 'Limited Offers',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=700&fit=crop',
    link: '/today-deals',
    icon: 'fa-percent'
  }
];

const giveaways = [
  {
    name: 'Proud to be Navodayan',
    description: 'Upload your favorite JNV memories',
    prize: 'Free Alumni Kit',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
    icon: 'fa-camera'
  },
  {
    name: 'Best Batch Logo Contest',
    description: 'Show off your batch\'s creativity',
    prize: 'Custom T-shirts for entire batch',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    icon: 'fa-palette'
  },
  {
    name: 'Hostel Story Challenge',
    description: 'Share your most memorable hostel moment',
    prize: 'Exclusive Merchandise Bundle',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop',
    icon: 'fa-book-open'
  }
];

const alumniMeets = [
  {
    name: 'JNV Delhi 2015 Batch Reunion',
    jnv: 'JNV Delhi',
    batch: '2015',
    date: '2025-06-15',
    location: 'New Delhi',
    attendees: 150,
    image: 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=600&h=400&fit=crop',
    icon: 'fa-graduation-cap'
  },
  {
    name: 'JNV Mumbai 2012 Batch Meet',
    jnv: 'JNV Mumbai',
    batch: '2012',
    date: '2025-06-22',
    location: 'Mumbai',
    attendees: 200,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    icon: 'fa-users'
  },
  {
    name: 'JNV Bangalore 2010 Batch Reunion',
    jnv: 'JNV Bangalore',
    batch: '2010',
    date: '2025-07-01',
    location: 'Bangalore',
    attendees: 120,
    image: 'https://images.unsplash.com/photo-1528605248640-18d5526e4802?w=600&h=400&fit=crop',
    icon: 'fa-school'
  }
];

const liveEvents = [
  {
    name: 'Career Guidance Session',
    type: 'Career Counseling',
    date: '2025-06-10',
    time: '6:00 PM IST',
    platform: 'Zoom',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
    icon: 'fa-chalkboard-teacher'
  },
  {
    name: 'UPSC Preparation Workshop',
    type: 'Exam Guidance',
    date: '2025-06-18',
    time: '5:00 PM IST',
    platform: 'Google Meet',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
    icon: 'fa-graduation-cap'
  },
  {
    name: 'Alumni Success Stories',
    type: 'Inspiration Talk',
    date: '2025-06-25',
    time: '7:00 PM IST',
    platform: 'YouTube Live',
    image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=400&fit=crop',
    icon: 'fa-star'
  }
];



const pastEvents = [
  {
    name: 'Grand Alumni Meet 2024',
    image: 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=600&h=400&fit=crop',
    icon: 'fa-glass-cheers'
  },
  {
    name: 'JNV Foundation Day',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    icon: 'fa-flag'
  },
  {
    name: 'Summer Sports Fest',
    image: 'https://images.unsplash.com/photo-1528605248640-18d5526e4802?w=600&h=400&fit=crop',
    icon: 'fa-futbol'
  },
  {
    name: 'Cultural Night 2024',
    image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=400&fit=crop',
    icon: 'fa-music'
  }
];

const galleryImages = [
  '/g1.jpeg',
  '/g2.jpeg',
  '/g3.jpeg',
  '/g4.jpeg',
  '/g5.jpeg',
  '/g6.jpeg',
  '/g7.jpeg',
  '/g8.jpeg'
];

const Events = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jnv: '',
    batch: '',
    city: '',
    tshirtSize: '',
    event: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const galleryRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      jnv: '',
      batch: '',
      city: '',
      tshirtSize: '',
      event: ''
    });
  };

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = 300;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section className="events-hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-tag">Welcome to</span>
            <h1 className="hero-title">Navodaya Trendz Events</h1>
            <p className="hero-subtitle">Connect, Celebrate, and Reunite with your fellow Navodayans</p>
            <div className="hero-buttons">
              <Link to="#alumni-meets" className="btn btn-primary">Explore Meets</Link>
              <Link to="#giveaways" className="btn btn-secondary">Join Contests</Link>
            </div>
          </div>
        </div>
      </section>



      {/* Giveaways */}
      <section className="events-giveaways" id="giveaways">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Win</span>
            <h2 className="section-title">Giveaways & <span className="highlight">Contests</span></h2>
          </div>
          <div className="events-giveaways-grid">
            {giveaways.map((item, index) => (
              <div key={index} className="event-giveaway-card" style={{ '--delay': `${index * 0.12}s` }}>
                <div className="giveaway-image-container">
                  <img src={item.image} alt={item.name} />
                  <div className="giveaway-icon-badge">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                </div>
                <div className="giveaway-details">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="giveaway-meta">
                    <span><i className="fas fa-gift"></i> {item.prize}</span>
                  </div>
                  <button className="btn btn-primary btn-small">Join Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Meets */}
      <section className="events-alumni-meets" id="alumni-meets">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Reunite</span>
            <h2 className="section-title">Upcoming Alumni <span className="highlight">Meets</span></h2>
          </div>
          <div className="events-meets-grid">
            {alumniMeets.map((meet, index) => (
              <div key={index} className="event-meet-card" style={{ '--delay': `${index * 0.12}s` }}>
                <div className="meet-image-container">
                  <img src={meet.image} alt={meet.name} />
                  <div className="meet-icon-badge">
                    <i className={`fas ${meet.icon}`}></i>
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
                  <button className="btn btn-primary btn-small">Register</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Events */}
      <section className="events-live">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Live</span>
            <h2 className="section-title">Live Online <span className="highlight">Events</span></h2>
          </div>
          <div className="events-live-grid">
            {liveEvents.map((event, index) => (
              <div key={index} className="event-live-card" style={{ '--delay': `${index * 0.12}s` }}>
                <div className="live-image-container">
                  <img src={event.image} alt={event.name} />
                  <div className="live-icon-badge">
                    <i className={`fas ${event.icon}`}></i>
                  </div>
                </div>
                <div className="live-details">
                  <h3>{event.name}</h3>
                  <div className="live-meta">
                    <span><i className="fas fa-tag"></i> {event.type}</span>
                    <span><i className="fas fa-calendar"></i> {event.date}</span>
                    <span><i className="fas fa-clock"></i> {event.time}</span>
                    <span><i className="fas fa-video"></i> {event.platform}</span>
                  </div>
                  <button className="btn btn-primary btn-small">Join</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="events-registration">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Register</span>
            <h2 className="section-title">Event <span className="highlight">Registration</span></h2>
          </div>
          {!showSuccess ? (
            <form className="registration-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label>JNV Name</label>
                  <input
                    type="text"
                    required
                    value={formData.jnv}
                    onChange={(e) => setFormData({...formData, jnv: e.target.value})}
                    placeholder="Your JNV"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Batch Year</label>
                  <input
                    type="number"
                    required
                    value={formData.batch}
                    onChange={(e) => setFormData({...formData, batch: e.target.value})}
                    placeholder="Your batch year"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Your city"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>T-Shirt Size</label>
                  <select
                    required
                    value={formData.tshirtSize}
                    onChange={(e) => setFormData({...formData, tshirtSize: e.target.value})}
                  >
                    <option value="">Select size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Event</label>
                  <select
                    required
                    value={formData.event}
                    onChange={(e) => setFormData({...formData, event: e.target.value})}
                  >
                    <option value="">Select event</option>
                    {alumniMeets.map((meet, idx) => (
                      <option key={idx} value={meet.name}>{meet.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-large">Register Now</button>
            </form>
          ) : (
            <div className="registration-success">
              <i className="fas fa-check-circle"></i>
              <h3>Registration Successful!</h3>
              <p>Check your email for confirmation</p>
              <button className="btn btn-primary" onClick={() => setShowSuccess(false)}>Register Another</button>
            </div>
          )}
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

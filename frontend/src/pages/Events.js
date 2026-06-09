import React, { useRef } from 'react';
import './Events.css';

const categories = [
  {
    name: 'T-Shirts',
    description: 'Premium Cotton',
    image: '/t.png',
    link: '/tshirts',
    icon: 'fa-shirt-long-sleeve'
  },
  {
    name: 'Hoodies',
    description: 'Cozy & Warm',
    image: '/ho.png',
    link: '/hoodies',
    icon: 'fa-shirt'
  },
  {
    name: 'Accessories',
    description: 'Complete Style',
    image: '/a.png',
    link: '/accessories',
    icon: 'fa-hat-cowboy'
  },
  {
    name: "Today's Deals",
    description: 'Limited Offers',
    image: 'https://img.magnific.com/free-vector/comic-style-deals-background-purple-yellow-color_1017-63309.jpg?semt=ais_hybrid&w=740&q=80',
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
    name: 'Annual Alumni Meet 2024',
    jnv: 'JNV Main Campus',
    batch: '2000-2024',
    location: 'JNV Campus',
    attendees: 450,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
    icon: 'fa-graduation-cap'
  },
  {
    name: 'Silver Jubilee Reunion',
    jnv: 'JNV Delhi',
    batch: '2000 Batch',
    location: 'Hotel Grand Palace',
    attendees: 320,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    icon: 'fa-users'
  },
  {
    name: 'JNV Bangalore Reunion',
    jnv: 'JNV Bangalore',
    batch: '2010-2014',
    location: 'IT Park Bangalore',
    attendees: 280,
    image: 'https://images.unsplash.com/photo-1528605248640-18d5526e4802?w=600&h=400&fit=crop',
    icon: 'fa-building'
  },
  {
    name: 'Mumbai Alumni Meet',
    jnv: 'JNV Mumbai',
    batch: '2005-2009',
    location: 'Marine Drive',
    attendees: 350,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    icon: 'fa-anchor'
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
  const galleryRef = useRef(null);

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
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSev2_RPJq8HJYznckGKKEWbzj1K0rNzNN8SIFk2dYZ8WFK3KQ/viewform?usp=publish-editor" 
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
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSev2_RPJq8HJYznckGKKEWbzj1K0rNzNN8SIFk2dYZ8WFK3KQ/viewform?usp=publish-editor" 
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
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSev2_RPJq8HJYznckGKKEWbzj1K0rNzNN8SIFk2dYZ8WFK3KQ/viewform?usp=publish-editor" 
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

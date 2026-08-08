import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HomepageBanner from '../components/HomepageBanner';
import api from '../utils/api';
import './HomeEpic.css';

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

const categories = [
  {
    name: 'T-Shirts',
    description: 'Premium Cotton',
    image: 'https://ih1.redbubble.net/image.2005741463.0268/ssrco,classic_tee,mens_02,fafafa:ca443f4786,front,square_close_portrait,x1000.jpg',
    link: '/tshirts',
    icon: 'fa-shirt-long-sleeve'
  },
  {
    name: 'Hoodies',
    description: 'Cozy & Warm',
    image: 'https://ih1.redbubble.net/image.2021696386.4856/ssrco,oversized_hoodie,mens_01,111112:1f01311efe,front,square_close_portrait,x1000.jpg',
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
    name: 'Alumni Kits',
    description: 'Complete Packages',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
    link: '/alumni-kits',
    icon: 'fa-graduation-cap'
  },
  {
    name: "Today's Deals",
    description: 'Limited Offers',
    image: 'https://cdn.vectorstock.com/i/500p/76/69/best-offer-special-price-sale-sign-vector-35567669.jpg',
    link: '/today-deals',
    icon: 'fa-percent'
  },
  {
    name: 'Events',
    description: 'Meet & Celebrate',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT8dGnGbGHa076LrdgGh91HBTV4pg1ERNvNg&s',
    link: '/events',
    icon: 'fa-calendar-days'
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

const pastEvents = [
  {
    title: '2023 Annual Meet',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop'
  },
  {
    title: 'Cultural Night 2023',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop'
  },
  {
    title: 'Sports Day 2024',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba821?w=400&h=300&fit=crop'
  },
  {
    title: 'Batch Reunion 2024',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop'
  }
];

const regionsData = [
  {
    name: 'Navodaya Region Bhopal',
    image: 'https://i.ytimg.com/vi/IEt-J7q7I_4/sddefault.jpg',
    caption: 'Navodaya Region Bhopal oversees the functioning of Jawahar Navodaya Vidyalayas across Madhya Pradesh, Chhattisgarh, and Odisha. It is committed to providing quality education, nurturing talent, and promoting holistic student development. Through academics, sports, and cultural activities, it helps shape future leaders of the nation.'
  },
  {
    name: 'Chandigarh Region',
    image: 'https://www.studyiq.com/articles/wp-content/uploads/2025/02/04133805/Chandigarh-City-blog.png',
    caption: 'Chandigarh – The City Beautiful, known for its modern architecture, clean surroundings, and vibrant culture. A symbol of planned urban development, Chandigarh blends natural beauty, rich heritage, and contemporary lifestyle, making it one of India\'s most admired cities.'
  },
  {
    name: 'Navodaya Region Hyderabad',
    image: 'https://img.freepik.com/premium-vector/outline-hyderabad-india-city-skyline-with-orange-buildings-business-travel-concept-with-modern-architecture-hyderabad-cityscape-with-landmarks_119523-14916.jpg',
    caption: 'Hyderabad – The City of Pearls, renowned for its rich history, iconic landmarks, world-famous cuisine, and thriving technology sector. From the grandeur of historic monuments to modern innovation hubs, Hyderabad offers a unique blend of tradition, culture, and progress.'
  },
  {
    name: 'Navodaya Region Jaipur',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEpl4dSglW4zv9fcHl0_JLRkNmqGhp5wsaBQ&s',
    caption: 'Navodaya Region Jaipur oversees the functioning of Jawahar Navodaya Vidyalayas across Rajasthan, Haryana, and Delhi. It is dedicated to providing quality education, fostering academic excellence, and nurturing talented students from diverse backgrounds. Through academics, sports, cultural activities, and leadership programs, it contributes to the holistic development of future citizens.'
  },
  {
    name: 'Navodaya Region Lucknow',
    image: 'https://i.ytimg.com/vi/VvPvfd6NQOg/maxresdefault.jpg',
    caption: 'Navodaya Region Lucknow oversees the functioning of Jawahar Navodaya Vidyalayas across Uttar Pradesh and Uttarakhand. It is committed to providing quality residential education, promoting academic excellence, and nurturing talented students, especially from rural areas. Through academics, sports, cultural activities, and leadership development programs, it helps shape responsible and future-ready citizens.'
  },
  {
    name: 'Navodaya Region Patna',
    image: 'https://i.ytimg.com/vi/yGp_o04GYF8/maxresdefault.jpg',
    caption: 'Navodaya Region Patna oversees the functioning of Jawahar Navodaya Vidyalayas across Bihar, Jharkhand, and West Bengal. It is dedicated to providing quality residential education, fostering academic excellence, and nurturing young talent from rural communities. Through academics, sports, cultural activities, and leadership programs, it supports the holistic development of future leaders.'
  },
  {
    name: 'Navodaya Region Pune',
    image: 'https://i.ytimg.com/vi/SCeSlwJxRKU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBd9ZqhYaJ_VKoOdJ-kSWR30k4lKg',
    caption: 'Navodaya Region Pune oversees the functioning of Jawahar Navodaya Vidyalayas across Maharashtra, Goa, Gujarat, and the Union Territories of Dadra & Nagar Haveli and Daman & Diu. It is committed to providing quality residential education, promoting academic excellence, and nurturing talented students from diverse backgrounds. Through academics, sports, cultural activities, and leadership development, it helps shape future-ready citizens.'
  },
  {
    name: 'Navodaya Region Shillong',
    image: 'https://5.imimg.com/data5/SELLER/Default/2022/1/BS/LI/BO/43641836/shilong-tour-package-500x500.jpg',
    caption: 'Navodaya Region Shillong oversees the functioning of Jawahar Navodaya Vidyalayas across the Northeastern states of India. It is dedicated to providing quality residential education, nurturing talent, and promoting academic excellence among students from diverse cultural backgrounds. Through academics, sports, cultural exchange, and leadership programs, it supports the holistic development of future leaders.'
  }
];

const HomeEpic = () => {
  const galleryRef = useRef(null);
  const regionsRef = useRef(null);
  const [giveaways, setGiveaways] = useState([]);
  const [giveawaysLoading, setGiveawaysLoading] = useState(true);
  const [giveawaysError, setGiveawaysError] = useState(false);

  useEffect(() => {
    const fetchGiveaways = async () => {
      try {
        const result = await api.get('/contests');
        if (result.success && Array.isArray(result.data)) {
          setGiveaways(result.data);
          setGiveawaysError(false);
        } else {
          setGiveaways([]);
          setGiveawaysError(true);
        }
      } catch (err) {
        console.error('Error fetching giveaways:', err);
        setGiveaways([]);
        setGiveawaysError(true);
      } finally {
        setGiveawaysLoading(false);
      }
    };

    fetchGiveaways();
  }, []);

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = 300;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRegions = (direction) => {
    if (regionsRef.current) {
      const scrollAmount = 300;
      regionsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="home-epic">
      {/* Hero Section */}
      <HomepageBanner />

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore</span>
            <h2 className="section-title">Shop by <span className="highlight">Category</span></h2>
          </div>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to={category.link} className="category-card" style={{ '--delay': `${index * 0.12}s` }}>
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                  <div className="category-overlay"></div>
                  <div className="category-icon">
                    <i className={`fas ${category.icon}`}></i>
                  </div>
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="category-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Running Strip */}
      <section className="running-strip">
        <div className="strip-track">
          <div className="strip-item">T-SHIRTS</div>
          <div className="strip-divider">•</div>
          <div className="strip-item">HOODIES</div>
          <div className="strip-divider">•</div>
          <div className="strip-item">ACCESSORIES</div>
          <div className="strip-divider">•</div>
          <div className="strip-item">ALUMNI KITS</div>
          <div className="strip-divider">•</div>
          <div className="strip-item">T-SHIRTS</div>
          <div className="strip-divider">•</div>
          <div className="strip-item">HOODIES</div>
          <div className="strip-divider">•</div>
          <div className="strip-item">ACCESSORIES</div>
          <div className="strip-divider">•</div>
          <div className="strip-item">ALUMNI KITS</div>
        </div>
      </section>

      {/* Giveaways & Contests Section */}
      <section className="giveaways-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Win</span>
            <h2 className="section-title">Giveaways & <span className="highlight">Contests</span></h2>
          </div>
          
          {giveawaysLoading ? (
            <div className="giveaways-state" aria-live="polite">
              <div className="spinner"></div>
              <h3>Loading Giveaways...</h3>
              <p>Fresh contests are being prepared for you.</p>
            </div>
          ) : giveaways.length === 0 ? (
            <div className="giveaways-state" aria-live="polite">
              <i className="fas fa-gift"></i>
              <h3>Coming Soon</h3>
              <p>{giveawaysError ? 'We could not load active contests right now. Please check back soon.' : 'New giveaways and contests will appear here soon.'}</p>
            </div>
          ) : (
            <div className="giveaways-grid">
              {giveaways.map((giveaway, index) => (
                <div key={giveaway._id} className="giveaway-card" style={{ '--delay': `${index * 0.12}s` }}>
                  <div className="giveaway-image-container">
                    {giveaway.bannerImage ? (
                      <img src={giveaway.bannerImage} alt={giveaway.title} />
                    ) : (
                      <div className="giveaway-image-placeholder">
                        <i className="fas fa-gift"></i>
                      </div>
                    )}
                    <div className="giveaway-icon-badge">
                      <i className="fas fa-trophy"></i>
                    </div>
                  </div>
                  <div className="giveaway-details">
                    <h3>{giveaway.title}</h3>
                    <p>{giveaway.description}</p>
                    <div className="giveaway-meta">
                      <span>
                        <i className="fas fa-calendar-alt"></i>
                        Ends: {new Date(giveaway.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <Link to={`/contests/${giveaway._id}`} className="btn btn-primary btn-small">
                      Join Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Alumni Meets Section */}
      <section className="events-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Reunite</span>
            <h2 className="section-title">Upcoming Alumni <span className="highlight">Meets</span></h2>
          </div>
          
          <div className="events-grid">
            {alumniMeets.map((event, index) => (
              <div key={index} className="event-card" style={{ '--delay': `${index * 0.12}s` }}>
                <div className="event-image-container">
                  <img src={event.image} alt={event.name} />
                  <div className="event-icon-badge">
                    <i className={`fas ${event.icon}`}></i>
                  </div>
                </div>
                <div className="event-details">
                  <h3>{event.name}</h3>
                  <div className="event-meta">
                    <span><i className="fas fa-school"></i> {event.jnv}</span>
                    <span><i className="fas fa-graduation-cap"></i> {event.batch}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                    <span><i className="fas fa-users"></i> {event.attendees} Attendees</span>
                  </div>
                  <Link to="/events" className="btn btn-primary btn-small">
                    Register
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="view-all-wrapper">
            <Link to="/events" className="btn btn-primary">
              View All Meets
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Navodaya Regions Section */}
      <section className="region-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Community</span>
            <h2 className="section-title">Navodaya <span className="highlight">Regions</span></h2>
          </div>
          
          <div className="regions-wrapper">
            <button className="scroll-btn scroll-btn-left" onClick={() => scrollRegions('left')}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="regions-grid" ref={regionsRef}>
              {regionsData.map((region, index) => (
                <div 
                  key={index} 
                  className="region-card" 
                  style={{ '--delay': `${index * 0.12}s` }}
                >
                  <div className="region-card-inner">
                    <div className="region-card-front">
                      <img src={region.image} alt={region.name} className="region-image" />
                      <div className="region-overlay">
                        <h3>{region.name}</h3>
                      </div>
                    </div>
                    <div className="region-card-back">
                      <h3>{region.name}</h3>
                      <p className="region-caption">{region.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="scroll-btn scroll-btn-right" onClick={() => scrollRegions('right')}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Past Event Gallery Section */}
      <section className="past-events-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Memories</span>
            <h2 className="section-title">Past Event <span className="highlight">Gallery</span></h2>
          </div>
          
          <div className="gallery-nav-wrapper">
            <button className="scroll-btn gallery-scroll-btn gallery-scroll-left" onClick={() => scrollGallery('left')} aria-label="Previous gallery images">
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="gallery-float-wrapper" ref={galleryRef}>
              <div className="gallery-float-track">
                {/* Duplicate for seamless loop */}
                {[...galleryImages, ...galleryImages].map((image, index) => (
                  <div key={index} className="gallery-float-item">
                    <img src={image} alt={`Gallery ${(index % galleryImages.length) + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            <button className="scroll-btn gallery-scroll-btn gallery-scroll-right" onClick={() => scrollGallery('right')} aria-label="Next gallery images">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeEpic;

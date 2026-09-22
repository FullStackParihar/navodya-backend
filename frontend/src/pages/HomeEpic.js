import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HomepageBanner from '../components/HomepageBanner';
import ProductCard from '../components/ProductCard';
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
    image: 'https://i.ytimg.com/vi/vvPvfd6NQOg/maxresdefault.jpg',
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

const industries = [
  { name: 'Schools & Colleges', icon: 'fa-school' },
  { name: 'Hospitals & Clinics', icon: 'fa-hospital' },
  { name: 'Corporate Offices', icon: 'fa-building' },
  { name: 'Startups', icon: 'fa-rocket' },
  { name: 'Manufacturing', icon: 'fa-industry' },
  { name: 'Retail', icon: 'fa-store' },
  { name: 'Hotels & Restaurants', icon: 'fa-hotel' },
  { name: 'Events & Exhibitions', icon: 'fa-calendar-check' },
  { name: 'Real Estate', icon: 'fa-city' },
  { name: 'Government & NGOs', icon: 'fa-landmark' },
  { name: 'NGOs', icon: 'fa-hands-helping' },
  { name: 'More Solutions', icon: 'fa-ellipsis-h' }
];

const HomeEpic = () => {
  const galleryRef = useRef(null);
  const regionsRef = useRef(null);
  const [giveaways, setGiveaways] = useState([]);
  const [giveawaysLoading, setGiveawaysLoading] = useState(true);
  const [giveawaysError, setGiveawaysError] = useState(false);
  const [alumniMeetsList, setAlumniMeetsList] = useState([]);
  const [alumniMeetsLoading, setAlumniMeetsLoading] = useState(true);
  const [liveEventsList, setLiveEventsList] = useState([]);
  const [liveEventsLoading, setLiveEventsLoading] = useState(true);
  const [productsList, setProductsList] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

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

    const fetchAlumniMeets = async () => {
      try {
        setAlumniMeetsLoading(true);
        const result = await api.get('/alumni-meets');
        if (result.success && Array.isArray(result.data)) {
          setAlumniMeetsList(result.data);
        }
      } catch (err) {
        console.error('Error fetching alumni meets:', err);
      } finally {
        setAlumniMeetsLoading(false);
      }
    };

    const fetchLiveEvents = async () => {
      try {
        setLiveEventsLoading(true);
        const result = await api.get('/events');
        if (result.success && Array.isArray(result.data)) {
          setLiveEventsList(result.data);
        }
      } catch (err) {
        console.error('Error fetching live events:', err);
      } finally {
        setLiveEventsLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const result = await api.get('/products');
        if (result.success && result.data) {
          const productsData = result.data.products || (Array.isArray(result.data) ? result.data : []);
          const mappedProducts = productsData.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price || p.price,
            originalPrice: p.sale_price ? p.price : null,
            image: p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300x400?text=No+Image',
            badge: p.sale_price ? 'Sale' : (p.rating > 4.5 ? 'Bestseller' : ''),
            reviews: p.review_count,
            rating: p.rating,
            sizes: p.sizes,
            colors: p.colors
          }));
          setProductsList(mappedProducts.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchGiveaways();
    fetchAlumniMeets();
    fetchLiveEvents();
    fetchProducts();
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
    <div className="home-epic brand-era">
      {/* Brand Era Hero Section - Premium Split Layout */}
      <section className="be-hero-section">
        <div className="be-hero-split">
          <div className="be-hero-dark">
            <div className="be-hero-content">
              <span className="be-hero-tag">
                <i className="fas fa-star"></i> BRAND ERA
              </span>
              <h1 className="be-hero-headline">
                Everything Your Brand Needs.<br />
                <span className="be-hero-accent">One Partner.</span>
              </h1>
              <p className="be-hero-subheadline">
                Design. Print. Merchandise. Gifting. Branding.
              </p>
              <div className="be-hero-ctas">
                <Link to="/tshirts" className="be-btn be-btn-primary">
                  Shop Products
                  <i className="fas fa-arrow-right"></i>
                </Link>
                <Link to="/events" className="be-btn be-btn-outline">
                  Get a Quote
                  <i className="fas fa-paper-plane"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="be-hero-red">
            <div className="be-hero-visual">
              <div className="be-hero-floating be-float-1">
                <i className="fas fa-palette"></i>
              </div>
              <div className="be-hero-floating be-float-2">
                <i className="fas fa-tshirt"></i>
              </div>
              <div className="be-hero-floating be-float-3">
                <i className="fas fa-gift"></i>
              </div>
              <div className="be-hero-badge">
                <span>PREMIUM</span>
                <span>BRANDING</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="be-stats-row">
          <div className="be-stat-card">
            <div className="be-stat-number">1000<span>+</span></div>
            <div className="be-stat-label">Happy Clients</div>
          </div>
          <div className="be-stat-divider"></div>
          <div className="be-stat-card">
            <div className="be-stat-number">5000<span>+</span></div>
            <div className="be-stat-label">Products Delivered</div>
          </div>
          <div className="be-stat-divider"></div>
          <div className="be-stat-card">
            <div className="be-stat-number">50L<span>+</span></div>
            <div className="be-stat-label">Prints Delivered</div>
          </div>
          <div className="be-stat-divider"></div>
          <div className="be-stat-card">
            <div className="be-stat-number">10<span>+</span></div>
            <div className="be-stat-label">Years of Trust</div>
          </div>
        </div>
      </section>

      {/* Running Strip */}
      <section className="running-strip be-running-strip">
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

      {/* Brand Era Categories Section */}
      <section className="be-categories-section">
        <div className="container">
          <div className="be-section-header">
            <h2 className="be-section-title">
              Shop by Category
            </h2>
            <div className="be-title-underline"></div>
            <p className="be-section-subtitle">Discover our curated collection of premium branded merchandise</p>
          </div>
          
          <div className="be-categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to={category.link} className="be-category-card" style={{ '--delay': `${index * 0.12}s` }}>
                <div className="be-category-icon-wrap">
                  <i className={`fas ${category.icon}`}></i>
                </div>
                <div className="be-category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <div className="be-category-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Era Featured Products Section */}
      <section className="be-products-section">
        <div className="container">
          <div className="be-section-header">
            <h2 className="be-section-title">
              Popular Products
            </h2>
            <div className="be-title-underline"></div>
            <p className="be-section-subtitle">Handpicked favorites loved by our customers</p>
          </div>

          <div className="be-product-grid">
            {productsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', gridColumn: '1 / -1' }}>
                <div className="be-loading-spinner"></div>
                <p style={{ marginTop: '16px' }}>Loading Products...</p>
              </div>
            ) : productsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', gridColumn: '1 / -1' }}>
                <i className="fas fa-shopping-bag" style={{ fontSize: '48px', marginBottom: '16px', color: '#E31B23' }}></i>
                <p>No products available at the moment.</p>
              </div>
            ) : (
              productsList.map((product, index) => (
                <div key={product.dbId || index} className="be-product-card-wrapper" style={{ '--delay': `${index * 0.12}s` }}>
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>

          <div className="be-view-all-wrapper">
            <Link to="/tshirts" className="be-btn be-btn-primary be-btn-lg">
              Visit Alumni Store
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Era Solutions/Industries Section - NEW */}
      <section className="be-solutions-section">
        <div className="container">
          <div className="be-section-header">
            <h2 className="be-section-title">
              Solutions for Every Business
            </h2>
            <div className="be-title-underline"></div>
            <p className="be-section-subtitle">Tailored branding solutions across diverse industries</p>
          </div>

          <div className="be-industries-grid">
            {industries.map((industry, index) => (
              <div key={index} className="be-industry-card" style={{ '--delay': `${index * 0.08}s` }}>
                <div className="be-industry-icon">
                  <i className={`fas ${industry.icon}`}></i>
                </div>
                <h4 className="be-industry-name">{industry.name}</h4>
                <div className="be-industry-hover-line"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Era Giveaways & Contests Section */}
      <section className="be-giveaways-section">
        <div className="container">
          <div className="be-section-header">
            <h2 className="be-section-title">
              Giveaways & Contests
            </h2>
            <div className="be-title-underline"></div>
            <p className="be-section-subtitle">Win exclusive merchandise and exciting prizes</p>
          </div>
          
          {giveawaysLoading ? (
            <div className="be-state-wrapper" aria-live="polite">
              <div className="be-loading-spinner"></div>
              <h3>Loading Giveaways...</h3>
              <p>Fresh contests are being prepared for you.</p>
            </div>
          ) : giveaways.length === 0 ? (
            <div className="be-state-wrapper" aria-live="polite">
              <i className="fas fa-gift be-state-icon"></i>
              <h3>Coming Soon</h3>
              <p>{giveawaysError ? 'We could not load active contests right now. Please check back soon.' : 'New giveaways and contests will appear here soon.'}</p>
            </div>
          ) : (
            <div className="be-giveaways-grid">
              {giveaways.map((giveaway, index) => (
                <div key={giveaway._id} className="be-giveaway-card" style={{ '--delay': `${index * 0.12}s` }}>
                  <div className="be-giveaway-image-container">
                    {giveaway.bannerImage ? (
                      <img src={giveaway.bannerImage} alt={giveaway.title} />
                    ) : (
                      <div className="be-giveaway-image-placeholder">
                        <i className="fas fa-gift"></i>
                      </div>
                    )}
                    <div className="be-giveaway-icon-badge">
                      <i className="fas fa-trophy"></i>
                    </div>
                  </div>
                  <div className="be-giveaway-details">
                    <h3>{giveaway.title}</h3>
                    <p>{giveaway.description}</p>
                    <div className="be-giveaway-meta">
                      <span>
                        <i className="fas fa-calendar-alt"></i>
                        Ends: {new Date(giveaway.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <Link to={`/contests/${giveaway._id}`} className="be-btn be-btn-primary be-btn-sm">
                      Join Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Era Alumni Meets Section */}
      <section className="be-events-section">
        <div className="container">
          <div className="be-section-header">
            <h2 className="be-section-title">
              Upcoming Alumni Meets
            </h2>
            <div className="be-title-underline"></div>
            <p className="be-section-subtitle">Reconnect, reminisce, and celebrate your journey together</p>
          </div>
          
          <div className="be-events-grid">
            {alumniMeetsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', gridColumn: '1 / -1' }}>
                <div className="be-loading-spinner"></div>
                <p style={{ marginTop: '16px' }}>Loading Alumni Meets...</p>
              </div>
            ) : alumniMeetsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', gridColumn: '1 / -1' }}>
                <i className="fas fa-handshake" style={{ fontSize: '48px', marginBottom: '16px', color: '#E31B23' }}></i>
                <p>No upcoming Alumni Meets scheduled at the moment.</p>
              </div>
            ) : (
              alumniMeetsList.map((event, index) => (
                <div key={event._id || index} className="be-event-card" style={{ '--delay': `${index * 0.12}s` }}>
                  <div className="be-event-image-container">
                    <img src={event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop'} alt={event.name} />
                    <div className="be-event-icon-badge">
                      <i className="fas fa-handshake"></i>
                    </div>
                  </div>
                  <div className="be-event-details">
                    <h3>{event.name}</h3>
                    <div className="be-event-meta">
                      <span><i className="fas fa-school"></i> {event.jnv}</span>
                      <span><i className="fas fa-graduation-cap"></i> {event.batch}</span>
                      <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                      <span><i className="fas fa-users"></i> {event.attendees} Attendees</span>
                    </div>
                    <Link to="/events" className="be-btn be-btn-primary be-btn-sm">
                      Register
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="be-view-all-wrapper">
            <Link to="/events" className="be-btn be-btn-outline be-btn-lg">
              View All Meets
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Era Live Online Events Section */}
      <section className="be-live-events-section">
        <div className="container">
          <div className="be-section-header">
            <h2 className="be-section-title">
              Live Online Events
            </h2>
            <div className="be-title-underline"></div>
            <p className="be-section-subtitle">Join interactive sessions and virtual gatherings from anywhere</p>
          </div>
          
          <div className="be-live-events-grid">
            {liveEventsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', gridColumn: '1 / -1' }}>
                <div className="be-loading-spinner"></div>
                <p style={{ marginTop: '16px' }}>Loading Live Events...</p>
              </div>
            ) : liveEventsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', gridColumn: '1 / -1' }}>
                <i className="fas fa-video" style={{ fontSize: '48px', marginBottom: '16px', color: '#E31B23' }}></i>
                <p>No live online events scheduled at the moment.</p>
              </div>
            ) : (
              liveEventsList.map((event, index) => (
                <div key={event._id || index} className="be-live-event-card" style={{ '--delay': `${index * 0.12}s` }}>
                  <div className="be-live-event-image">
                    <img src={event.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop'} alt={event.name} />
                    <span className="be-live-badge">
                      <i className="fas fa-circle"></i> Live
                    </span>
                  </div>
                  <div className="be-live-event-content">
                    <span className="be-live-event-type">{event.type}</span>
                    <h3>{event.name}</h3>
                    <div className="be-live-event-meta">
                      <span><i className="fas fa-calendar"></i> {new Date(event.date).toLocaleDateString()}</span>
                      <span><i className="fas fa-clock"></i> {event.time}</span>
                      <span><i className="fas fa-video"></i> {event.platform}</span>
                    </div>
                    <a 
                      href={event.registrationLink || "https://docs.google.com/forms/d/e/1FAIpQLSev2_RPJq8HJYznckGKKEWbzj1K0rNzNN8SIFk2dYZ8WFK3KQ/viewform?usp=publish-editor"}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="be-btn be-btn-primary be-btn-sm"
                    >
                      Join Event
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="be-view-all-wrapper">
            <Link to="/events" className="be-btn be-btn-primary be-btn-lg">
              View All Events
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Era Regions Section */}
      <section className="be-region-section">
        <div className="container">
          <div className="be-section-header">
            <h2 className="be-section-title">
              Nodal Offices & Regions
            </h2>
            <div className="be-title-underline"></div>
            <p className="be-section-subtitle">Our network spanning across the nation</p>
          </div>
          
          <div className="be-regions-wrapper">
            <button className="be-scroll-btn be-scroll-btn-left" onClick={() => scrollRegions('left')}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="be-regions-grid" ref={regionsRef}>
              {regionsData.map((region, index) => (
                <div 
                  key={index} 
                  className="be-region-card" 
                  style={{ '--delay': `${index * 0.12}s` }}
                >
                  <div className="be-region-card-inner">
                    <div className="be-region-card-front">
                      <img src={region.image} alt={region.name} className="be-region-image" />
                      <div className="be-region-overlay">
                        <h3>{region.name}</h3>
                      </div>
                    </div>
                    <div className="be-region-card-back">
                      <h3>{region.name}</h3>
                      <p className="be-region-caption">{region.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="be-scroll-btn be-scroll-btn-right" onClick={() => scrollRegions('right')}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Brand Era Our Work Gallery Section */}
      <section className="be-gallery-section">
        <div className="container">
          <div className="be-section-header">
            <h2 className="be-section-title">
              Our Work Gallery
            </h2>
            <div className="be-title-underline"></div>
            <p className="be-section-subtitle">A glimpse of our craftsmanship and memorable moments</p>
          </div>
          
          <div className="be-gallery-nav-wrapper">
            <button className="be-scroll-btn be-gallery-scroll-btn be-gallery-scroll-left" onClick={() => scrollGallery('left')} aria-label="Previous gallery images">
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="be-gallery-float-wrapper" ref={galleryRef}>
              <div className="be-gallery-float-track">
                {[...galleryImages, ...galleryImages].map((image, index) => (
                  <div key={index} className="be-gallery-float-item">
                    <img src={image} alt={`Gallery ${(index % galleryImages.length) + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            <button className="be-scroll-btn be-gallery-scroll-btn be-gallery-scroll-right" onClick={() => scrollGallery('right')} aria-label="Next gallery images">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeEpic;

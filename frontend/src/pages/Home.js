import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';

const categories = [
  {
    name: 'T-Shirts',
    description: 'Premium cotton tees',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tshirt%20navodaya&image_size=square_hd',
    link: '/tshirts',
    icon: '👕',
    count: 45,
    color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
  },
  {
    name: 'Hoodies',
    description: 'Comfortable hoodies',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=hoodie%20navodaya&image_size=square_hd',
    link: '/hoodies',
    icon: '🧥',
    count: 32,
    color: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
  },
  {
    name: 'Mementos',
    description: 'Cherished memories',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mementos%20navodaya&image_size=square_hd',
    link: '/momentum',
    icon: '🏆',
    count: 28,
    color: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
  },
  {
    name: 'Accessories',
    description: 'Daily essentials',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=accessories%20navodaya&image_size=square_hd',
    link: '/accessories',
    icon: '⌚',
    count: 56,
    color: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
  },
  {
    name: 'Event Merchandise',
    description: 'Special editions',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=event%20merchandise%20navodaya&image_size=square_hd',
    link: '/event-merchandise',
    icon: '🎉',
    count: 18,
    color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  },
  {
    name: 'Custom Orders',
    description: 'Personalized items',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=custom%20orders%20navodaya&image_size=square_hd',
    link: '/customize',
    icon: '✨',
    count: 'Unlimited',
    color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
  }
];

const states = [
  { name: 'Delhi', region: 'National Capital Region', schools: 45, alumni: '12.5K', events: 12, color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
  { name: 'Maharashtra', region: 'Maharashtra Navodaya Network', schools: 52, alumni: '15.6K', events: 18, color: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' },
  { name: 'Karnataka', region: 'Karnataka Chapter', schools: 38, alumni: '11.2K', events: 8, color: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },
  { name: 'Tamil Nadu', region: 'Tamil Nadu Association', schools: 41, alumni: '13.4K', events: 15, color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
  { name: 'Uttar Pradesh', region: 'UP Navodaya Network', schools: 75, alumni: '22.3K', events: 22, color: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' },
  { name: 'West Bengal', region: 'Bengal Chapter', schools: 48, alumni: '14.2K', events: 10, color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }
];

const events = [
  { 
    name: 'Grand Alumni Meet 2024', 
    date: 'December 15, 2024', 
    location: 'India Habitat Centre, Delhi', 
    attendees: 500, 
    price: 1299, 
    discount: '20%',
    badge: '500 Attending'
  },
  { 
    name: 'JNV Bangalore Reunion', 
    date: 'December 20, 2024', 
    location: 'JNV Bangalore Campus', 
    attendees: 300, 
    price: 899, 
    discount: '20%',
    badge: '300 Attending'
  },
  { 
    name: 'Navodaya Tech Summit', 
    date: 'January 10, 2025', 
    location: 'Online + Mumbai', 
    attendees: 1000, 
    price: 599, 
    discount: '20%',
    badge: '1000 Attending'
  }
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const result = await api.get('/products');
        
        if (result.success) {
          const mappedProducts = result.data.products.map(p => ({
            id: p.slug,
            dbId: p._id,
            name: p.name,
            description: p.description,
            price: p.sale_price || p.price,
            originalPrice: p.sale_price ? p.price : null,
            image: p.images[0] || 'https://via.placeholder.com/300x400?text=No+Image',
            badge: p.sale_price ? 'Sale' : (p.rating > 4.5 ? 'Bestseller' : ''),
            reviews: p.review_count,
            rating: p.rating,
            sizes: p.sizes,
            colors: p.colors
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-left">
            <div className="celebrating-badge">
              <i className="fas fa-star"></i> Celebrating 660+ JNV Schools
            </div>
            <h1 className="hero-title">
              Connecting Your<br />
              <span className="highlight">Memories...</span>
            </h1>
            <p className="hero-subtitle">
              An exclusive merchandise store for Navodayans, 
              designed to celebrate your journey and connect 
              alumni across India.
            </p>
            <div className="hero-buttons">
              <Link to="/tshirts" className="btn-shop-now">
                Shop Now <i className="fas fa-arrow-right"></i>
              </Link>
              <button className="btn-for-alumni">For Alumni</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">660+</div>
                <div className="stat-label">JNV Schools</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Alumni Connected</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Products</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">28</div>
                <div className="stat-label">States</div>
              </div>
            </div>
            <div className="hero-image-container">
              <img 
                src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=navodaya%20trendz%20merchandise%20collage%20tshirts%20hoodies%20mementos&image_size=landscape_16_9" 
                alt="Navodaya Merchandise" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="categories-section-new">
        <div className="container">
          <h2 className="section-title-new">Shop by Category</h2>
          <p className="section-subtitle-new">Find your perfect Navodaya merchandise</p>
          <div className="categories-grid-new">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link} 
                className="category-card-new"
              >
                <div className="category-bg" style={{ background: category.color }}>
                  <div className="category-orbs">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                  </div>
                  <div className="category-icon-new">{category.icon}</div>
                </div>
                <div className="category-content-new">
                  <h3 className="category-name-new">{category.name}</h3>
                  <p className="category-desc-new">{category.description}</p>
                  <div className="category-count-new">
                    {category.count} Items <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="container">
          <h2 className="section-title-new">Featured Products</h2>
          <p className="section-subtitle-new">Popular items from our collection</p>
          <div className="products-grid-new">
            {isLoading ? (
              <SkeletonLoader type="product" count={4} />
            ) : (
              featuredProducts.map((product, index) => {
                const badges = ['Bestseller', 'New', 'Sale', 'Popular'];
                return (
                  <Link to={`/product/${product.id}`} key={product.id} className="product-card-new">
                    <div className="product-badge-new">{badges[index % badges.length]}</div>
                    <div className="product-image-new">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-info-new">
                      <h3 className="product-name-new">{product.name}</h3>
                      <p className="product-desc-new">{product.description}</p>
                      <div className="product-rating-new">
                        <div className="stars-new">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="far fa-star"></i>
                        </div>
                        <span className="review-count-new">({product.reviews || 100})</span>
                      </div>
                      <div className="product-price-new">
                        <span className="current-price-new">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="original-price-new">₹{product.originalPrice}</span>
                        )}
                        <span className="discount-new">31% OFF</span>
                      </div>
                      <button className="add-to-cart-new">
                        <i className="fas fa-cart-plus"></i> Add to Cart
                      </button>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Connect with Your State Section */}
      <section className="states-section">
        <div className="container">
          <h2 className="section-title-new">Connect with Your State</h2>
          <p className="section-subtitle-new">Find alumni from your region</p>
          <div className="states-grid">
            {states.map((state, index) => (
              <div key={index} className="state-card">
                <div className="state-bg" style={{ background: state.color }}>
                  <div className="state-orbs">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                  </div>
                  <div className="state-events-badge">{state.events} Events</div>
                  <i className="fas fa-map-marker-alt state-icon"></i>
                </div>
                <div className="state-content">
                  <h3 className="state-name">{state.name}</h3>
                  <p className="state-region">{state.region}</p>
                  <div className="state-stats">
                    <div className="state-stat">
                      <span className="stat-value">{state.schools}</span>
                      <span className="stat-label">Schools</span>
                    </div>
                    <div className="state-stat">
                      <span className="stat-value">{state.alumni}</span>
                      <span className="stat-label">Alumni</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="events-section">
        <div className="container">
          <h2 className="section-title-new">Upcoming Events</h2>
          <p className="section-subtitle-new">Join us for exciting alumni gatherings</p>
          <div className="events-grid">
            {events.map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-badge">{event.badge}</div>
                <div className="event-image">
                  <div className="event-placeholder">
                    <i className="far fa-calendar-alt"></i>
                  </div>
                </div>
                <div className="event-info">
                  <h3 className="event-name">{event.name}</h3>
                  <div className="event-details">
                    <div className="event-detail">
                      <i className="far fa-calendar"></i>
                      <span>{event.date}</span>
                    </div>
                    <div className="event-detail">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="event-merch">
                    <div className="merch-info">
                      <span className="merch-title">Event Merchandise</span>
                      <span className="merch-desc">Exclusive Hoodie + T-Shirt</span>
                    </div>
                    <i className="far fa-lightbulb merch-icon"></i>
                  </div>
                  <div className="event-price-row">
                    <div className="event-price-info">
                      <span className="event-price">₹{event.price}</span>
                      <span className="event-save">Save {event.discount}</span>
                    </div>
                    <div className="event-buttons">
                      <button className="btn-register">Register Now</button>
                      <button className="btn-view-details">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

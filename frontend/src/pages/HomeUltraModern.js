import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './HomeUltraModern.css';

// Ultra-modern categories with futuristic design
const categories = [
  {
    name: 'T-Shirts',
    description: 'Next-Gen Apparel',
    price: 'Starting at ₹299',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    link: '/tshirts',
    icon: 'fas fa-tshirt',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    features: ['Smart Fabric', '3D Print', 'Nano Tech'],
    trending: true,
    discount: '30% OFF'
  },
  {
    name: 'Hoodies',
    description: 'Future Comfort',
    price: 'Starting at ₹599',
    image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=500&h=500&fit=crop',
    link: '/hoodies',
    icon: 'fas fa-hoodie-cloak',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    features: ['Heat Tech', 'Wireless', 'Eco-Friendly'],
    trending: false,
    discount: '25% OFF'
  },
  {
    name: 'Accessories',
    description: 'Smart Gear',
    price: 'Starting at ₹199',
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=500&h=500&fit=crop',
    link: '/accessories',
    icon: 'fas fa-hat-cowboy',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    features: ['LED Lights', 'Smart Sync', 'Waterproof'],
    trending: true,
    discount: '40% OFF'
  },
  {
    name: 'Alumni Kits',
    description: 'Elite Collection',
    price: 'Complete Packages',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=500&fit=crop',
    link: '/alumni-kits',
    icon: 'fas fa-graduation-cap',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    features: ['Limited Edition', 'Premium', 'Free Shipping'],
    trending: false,
    discount: '50% OFF'
  }
];

// Futuristic hero carousel data
const heroSlides = [
  {
    id: 1,
    title: 'Navodaya 2024',
    subtitle: 'FUTURE IS HERE',
    description: 'Experience the next generation of alumni merchandise with cutting-edge design and technology',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=700&fit=crop',
    cta: 'Explore Future',
    link: '/products',
    badge: 'NEW COLLECTION',
    particles: true
  },
  {
    id: 2,
    title: 'Smart Merchandise',
    subtitle: 'INNOVATION MEETS STYLE',
    description: 'Revolutionary apparel with integrated technology and sustainable materials',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1400&h=700&fit=crop',
    cta: 'Discover Tech',
    link: '/new-arrivals',
    badge: 'TECH WEAR',
    particles: false
  },
  {
    id: 3,
    title: 'Alumni Elite',
    subtitle: 'EXCLUSIVE ACCESS',
    description: 'Premium collection designed exclusively for Navodaya alumni with special benefits',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1400&h=700&fit=crop',
    cta: 'Join Elite',
    link: '/alumni-kits',
    badge: 'LIMITED EDITION',
    particles: true
  }
];

// Enhanced stats with animations
const stats = [
  { number: '50K+', label: 'Global Alumni', icon: 'fas fa-globe', color: '#667eea' },
  { number: '200+', label: 'Smart Products', icon: 'fas fa-microchip', color: '#f093fb' },
  { number: '99.9%', label: 'Satisfaction', icon: 'fas fa-heart', color: '#4facfe' },
  { number: '24/7', label: 'AI Support', icon: 'fas fa-robot', color: '#43e97b' }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Rahul Kumar',
    role: 'JNV Alumni 2020',
    content: 'The quality and design exceeded my expectations. The smart features are incredible!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'JNV Alumni 2019',
    content: 'Best alumni merchandise I\'ve ever purchased. The tech integration is mind-blowing!',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
    rating: 5
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'JNV Alumni 2021',
    content: 'The futuristic design and quality make me proud to be a Navodaya alumni!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rating: 5
  }
];

const HomeUltraModern = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
            colors: p.colors,
            isNew: Math.random() > 0.7,
            isTrending: Math.random() > 0.8
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

  const filteredProducts = products.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'trending') return product.isTrending || product.rating > 4;
    if (activeTab === 'new') return product.isNew;
    if (activeTab === 'bestseller') return product.reviews > 100 || product.badge === 'Bestseller';
    return true;
  });

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="home-ultra-modern">
      {/* Floating Navigation Dots */}
      <div className="floating-nav">
        {['hero', 'stats', 'categories', 'products', 'testimonials'].map((section, index) => (
          <a 
            key={section}
            href={`#${section}`}
            className="nav-dot"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>

      {/* Ultra-Modern Hero Carousel */}
      <section id="hero" className="hero-ultra-modern">
        <div className="hero-background">
          <div className="animated-gradient"></div>
          <div className="floating-particles">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="carousel-container">
          {heroSlides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ 
                backgroundImage: `url(${slide.image})`,
                transform: `translateX(${(index - currentSlide) * 100}%) scale(${index === currentSlide ? 1 : 0.8})`
              }}
            >
              <div className="slide-overlay">
                <div className="slide-content">
                  {slide.badge && (
                    <span className="slide-badge">{slide.badge}</span>
                  )}
                  <span className="slide-subtitle">{slide.subtitle}</span>
                  <h1 className="slide-title">{slide.title}</h1>
                  <p className="slide-description">{slide.description}</p>
                  <Link to={slide.link} className="slide-cta ultra-modern">
                    {slide.cta}
                    <div className="cta-glow"></div>
                    <i className="fas fa-rocket"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Futuristic Controls */}
          <button className="carousel-control ultra-modern prev" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
            <div className="control-glow"></div>
          </button>
          <button className="carousel-control ultra-modern next" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
            <div className="control-glow"></div>
          </button>
          
          {/* Advanced Indicators */}
          <div className="carousel-indicators ultra-modern">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              >
                <div className="indicator-progress"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Futuristic Stats Section */}
      <section id="stats" className="stats-ultra-modern" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card ultra-modern" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-icon-wrapper">
                  <div className="stat-icon" style={{ background: stat.color }}>
                    <i className={stat.icon}></i>
                  </div>
                  <div className="icon-ripple"></div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{stat.number}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
                <div className="stat-particles">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="stat-particle"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Modern Categories Section */}
      <section id="categories" className="categories-ultra-modern">
        <div className="container">
          <div className="section-header ultra-modern">
            <h2 className="section-title">
              <span className="title-gradient">EXPLORE</span>
              <br />
              FUTURE COLLECTIONS
            </h2>
            <p className="section-subtitle">Next-generation merchandise with cutting-edge technology</p>
            <div className="header-decoration">
              <div className="decoration-line"></div>
              <div className="decoration-dot"></div>
              <div className="decoration-line"></div>
            </div>
          </div>
          
          <div className="categories-grid ultra-modern">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link} 
                className="category-card ultra-modern"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="category-background">
                  <div className="category-gradient" style={{ background: category.gradient }}></div>
                  <div className="category-particles">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="category-particle"></div>
                    ))}
                  </div>
                </div>
                
                <div className="category-header">
                  <div className="category-image">
                    <img src={category.image} alt={category.name} />
                    <div className="image-overlay"></div>
                  </div>
                  {category.trending && (
                    <div className="trending-badge">
                      <i className="fas fa-fire"></i>
                      HOT
                    </div>
                  )}
                  {category.discount && (
                    <div className="discount-badge">{category.discount}</div>
                  )}
                  <div className="category-icon">
                    <i className={category.icon}></i>
                    <div className="icon-glow"></div>
                  </div>
                </div>
                
                <div className="category-content">
                  <h3 className="category-title">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <p className="category-price">{category.price}</p>
                  <div className="category-features">
                    {category.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag ultra-modern">{feature}</span>
                    ))}
                  </div>
                  <div className="category-footer">
                    <span className="shop-now">Explore Collection</span>
                    <div className="arrow-container">
                      <i className="fas fa-arrow-right"></i>
                      <div className="arrow-trail"></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section id="products" className="featured-products ultra-modern">
        <div className="container">
          <div className="section-header ultra-modern">
            <h2 className="section-title">
              <span className="title-gradient">FEATURED</span>
              <br />
              SMART PRODUCTS
            </h2>
            <p className="section-subtitle">Handpicked from our innovative collection</p>
          </div>
          
          <div className="product-tabs ultra-modern">
            {['all', 'trending', 'new', 'bestseller'].map((tab, index) => (
              <button 
                key={tab}
                className={`tab-btn ultra-modern ${activeTab === tab ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveTab(tab)}
              >
                <div className="tab-icon">
                  <i className={`fas fa-${tab === 'all' ? 'th' : tab === 'trending' ? 'fire' : tab === 'new' ? 'sparkles' : 'star'}`}></i>
                  <div className="icon-ripple"></div>
                </div>
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                <div className="tab-indicator"></div>
              </button>
            ))}
          </div>
          
          <div className="product-grid ultra-modern">
            {isLoading ? (
              <SkeletonLoader type="product" count={8} />
            ) : (
              filteredProducts.slice(0, 8).map((product, index) => (
                <div key={product.id} className="product-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard 
                    product={product} 
                    ultraModern={true}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                  {product.isNew && (
                    <div className="new-badge">
                      <i className="fas fa-sparkles"></i>
                      NEW
                    </div>
                  )}
                  {product.isTrending && (
                    <div className="trending-product-badge">
                      <i className="fas fa-fire"></i>
                      TRENDING
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {!isLoading && filteredProducts.length > 8 && (
            <div className="load-more-container ultra-modern">
              <button className="btn-primary ultra-modern">
                <span>Load More Products</span>
                <div className="btn-glow"></div>
                <i className="fas fa-infinity"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-ultra-modern">
        <div className="container">
          <div className="section-header ultra-modern">
            <h2 className="section-title">
              <span className="title-gradient">ALUMNI</span>
              <br />
              SUCCESS STORIES
            </h2>
            <p className="section-subtitle">Hear from our satisfied customers</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="testimonial-card ultra-modern" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="testimonial-header">
                  <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-decoration">
                  <i className="fas fa-quote-left"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Futuristic Newsletter Section */}
      <section className="newsletter-ultra-modern">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2 className="newsletter-title">
                <span className="title-gradient">JOIN THE</span>
                <br />
                FUTURE TODAY
              </h2>
              <p className="newsletter-subtitle">Get exclusive access to new collections and special offers</p>
              <div className="newsletter-stats">
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Subscribers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Satisfaction</span>
                </div>
              </div>
            </div>
            <div className="newsletter-form-wrapper">
              <form className="newsletter-form ultra-modern">
                <div className="input-group">
                  <input type="email" placeholder="Enter your email address" className="newsletter-input" />
                  <div className="input-glow"></div>
                </div>
                <button type="submit" className="newsletter-btn ultra-modern">
                  <span>Subscribe Now</span>
                  <div className="btn-glow"></div>
                  <i className="fas fa-rocket"></i>
                </button>
              </form>
              <p className="newsletter-note">Join 10,000+ alumni. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeUltraModern;

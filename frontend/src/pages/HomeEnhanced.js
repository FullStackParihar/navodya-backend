import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './HomeEnhanced.css';

// Enhanced categories with better icons and descriptions
const categories = [
  {
    name: 'T-Shirts',
    description: 'Premium Cotton Tees',
    price: 'Starting at ₹299',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    link: '/tshirts',
    icon: 'fas fa-tshirt',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    features: ['100% Cotton', 'Premium Print', 'All Sizes']
  },
  {
    name: 'Hoodies',
    description: 'Cozy Comfort Wear',
    price: 'Starting at ₹599',
    image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=400&h=400&fit=crop',
    link: '/hoodies',
    icon: 'fas fa-hoodie-cloak',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    features: ['Fleece Lined', 'Pocket Design', 'Unisex']
  },
  {
    name: 'Accessories',
    description: 'Complete Your Look',
    price: 'Starting at ₹199',
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=400&h=400&fit=crop',
    link: '/accessories',
    icon: 'fas fa-hat-cowboy',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    features: ['Caps', 'Bags', 'Badges']
  },
  {
    name: 'Alumni Kits',
    description: 'Exclusive Collections',
    price: 'Complete Packages',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop',
    link: '/alumni-kits',
    icon: 'fas fa-graduation-cap',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    features: ['Bundle Deal', 'Limited Edition', 'Free Shipping']
  }
];

// Hero carousel data
const heroSlides = [
  {
    id: 1,
    title: 'Navodaya Alumni Collection 2024',
    subtitle: 'Premium Quality Merchandise',
    description: 'Exclusive designs for JNV students and alumni',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
    cta: 'Shop Now',
    link: '/products'
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Fresh Designs',
    description: 'Check out our latest collection of premium merchandise',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1200&h=600&fit=crop',
    cta: 'Explore',
    link: '/new-arrivals'
  },
  {
    id: 3,
    title: 'Alumni Special',
    subtitle: 'Exclusive Discounts',
    description: 'Special offers for Navodaya alumni members',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop',
    cta: 'Learn More',
    link: '/alumni-kits'
  }
];

// Stats data
const stats = [
  { number: '10K+', label: 'Happy Customers', icon: 'fas fa-users' },
  { number: '50+', label: 'Products', icon: 'fas fa-box' },
  { number: '100%', label: 'Quality', icon: 'fas fa-star' },
  { number: '24/7', label: 'Support', icon: 'fas fa-headset' }
];

const HomeEnhanced = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
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

  const filteredProducts = products.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'trending') return product.badge === 'Hot' || product.rating > 4;
    if (activeTab === 'new') return product.badge === 'New';
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
    <div className="home-enhanced">
      {/* Enhanced Hero Carousel */}
      <section className="hero-carousel">
        <div className="carousel-container">
          {heroSlides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-overlay">
                <div className="slide-content">
                  <span className="slide-subtitle">{slide.subtitle}</span>
                  <h1 className="slide-title">{slide.title}</h1>
                  <p className="slide-description">{slide.description}</p>
                  <Link to={slide.link} className="slide-cta">
                    {slide.cta}
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          <button className="carousel-control prev" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="carousel-control next" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>
          
          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <i className={stat.icon}></i>
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{stat.number}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Premium quality merchandise for every need</p>
          </div>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link} 
                className="category-card enhanced"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="category-header" style={{ background: category.gradient }}>
                  <div className="category-image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <div className="category-icon">
                    <i className={category.icon}></i>
                  </div>
                </div>
                <div className="category-content">
                  <h3 className="category-title">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <p className="category-price">{category.price}</p>
                  <div className="category-features">
                    {category.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  <div className="category-footer">
                    <span className="shop-now">Shop Now</span>
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked items from our collection</p>
          </div>
          
          <div className="product-tabs">
            {['all', 'trending', 'new', 'bestseller'].map((tab, index) => (
              <button 
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setActiveTab(tab)}
              >
                <i className={`fas fa-${tab === 'all' ? 'th' : tab === 'trending' ? 'fire' : tab === 'new' ? 'sparkles' : 'star'}`}></i>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="product-grid enhanced">
            {isLoading ? (
              <SkeletonLoader type="product" count={8} />
            ) : (
              filteredProducts.slice(0, 8).map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  enhanced={true}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))
            )}
          </div>
          
          {!isLoading && filteredProducts.length > 8 && (
            <div className="load-more-container">
              <button className="btn-primary enhanced">
                <span>Load More Products</span>
                <i className="fas fa-spinner"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Stay Updated</h2>
              <p>Get exclusive offers and be the first to know about new products</p>
            </div>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button className="newsletter-btn">
                Subscribe
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeEnhanced;

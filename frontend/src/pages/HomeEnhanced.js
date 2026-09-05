import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './HomeEnhanced.css';

const categories = [
  {
    name: 'T-Shirts',
    description: 'Starting at ₹299',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    link: '/tshirts',
    icon: 'fas fa-tshirt',
    color: '#fbbf24'
  },
  {
    name: 'Hoodies',
    description: 'Starting at ₹599',
    image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=400&h=400&fit=crop',
    link: '/hoodies',
    icon: 'fas fa-hoodie-cloak',
    color: '#f59e0b'
  },
  {
    name: 'Accessories',
    description: 'Starting at ₹199',
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=400&h=400&fit=crop',
    link: '/accessories',
    icon: 'fas fa-hat-cowboy',
    color: '#d97706'
  },
  {
    name: 'Alumni Kits',
    description: 'Complete Packages',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop',
    link: '/alumni-kits',
    icon: 'fas fa-graduation-cap',
    color: '#b45309'
  }
];

const features = [
  {
    icon: 'fas fa-award',
    title: 'Premium Quality',
    description: 'High-quality materials for lasting comfort and style',
    color: '#fbbf24'
  },
  {
    icon: 'fas fa-truck',
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping across India',
    color: '#f59e0b'
  },
  {
    icon: 'fas fa-palette',
    title: 'Exclusive Designs',
    description: 'Unique JNV-themed designs you won\'t find anywhere else',
    color: '#d97706'
  },
  {
    icon: 'fas fa-headset',
    title: '24/7 Support',
    description: 'We\'re here to help you whenever you need us',
    color: '#b45309'
  }
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
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

  const filteredProducts = products.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'trending') return product.badge === 'Hot' || product.rating > 4;
    if (activeTab === 'new') return product.badge === 'New';
    if (activeTab === 'bestseller') return product.reviews > 100 || product.badge === 'Bestseller';
    return true;
  });

  return (
    <div className="home-enhanced">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-gradient"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge animate-fadeIn">
                <i className="fas fa-star"></i>
                Premium JNV Merchandise
              </span>
              <h1 className="hero-title animate-slideUp">
                Navodaya <span className="brand-accent">Trendz</span>
              </h1>
              <p className="hero-subtitle animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Premium Quality Merchandise for JNV Students & Alumni
              </p>
              <p className="hero-description animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Discover our exclusive collection of high-quality t-shirts, hoodies, and accessories designed specifically for the Navodaya community.
              </p>
              <div className="hero-actions animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <Link to="/tshirts" className="btn btn-primary">
                  <i className="fas fa-shopping-bag"></i>
                  Shop Now
                </Link>
                <Link to="/new-arrivals" className="btn btn-secondary">
                  <i className="fas fa-sparkles"></i>
                  New Arrivals
                </Link>
              </div>
              <div className="hero-stats animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">4.9</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
            </div>
            <div className="hero-visual animate-scaleIn">
              <div className="hero-image-wrapper">
                <div className="floating-card card-1">
                  <i className="fas fa-tshirt"></i>
                  <span>T-Shirts</span>
                </div>
                <div className="floating-card card-2">
                  <i className="fas fa-hoodie-cloak"></i>
                  <span>Hoodies</span>
                </div>
                <div className="floating-card card-3">
                  <i className="fas fa-graduation-cap"></i>
                  <span>Alumni</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">
              Experience the <span className="text-accent">Difference</span>
            </h2>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card animate-fadeInUp" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon" style={{ background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)` }}>
                  <i className={feature.icon}></i>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Browse Categories</span>
            <h2 className="section-title">
              Shop by <span className="text-accent">Category</span>
            </h2>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link} 
                className="category-card animate-fadeInUp" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="category-image-container">
                  <img src={category.image} alt={category.name} className="category-image" />
                  <div className="category-overlay">
                    <div className="category-icon-wrapper" style={{ background: category.color }}>
                      <i className={category.icon}></i>
                    </div>
                  </div>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-price">{category.description}</p>
                </div>
                <div className="category-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Featured Collection</span>
            <h2 className="section-title">
              Our <span className="text-accent">Products</span>
            </h2>
          </div>
          
          <div className="product-tabs">
            {['all', 'trending', 'new', 'bestseller'].map((tab, index) => (
              <button 
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''} animate-fadeIn`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="products-grid">
            {isLoading ? (
              <SkeletonLoader type="product" count={6} />
            ) : (
              filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))
            )}
          </div>
          
          {filteredProducts.length > 0 && (
            <div className="load-more-wrapper">
              <button className="btn btn-outline">
                <i className="fas fa-plus"></i>
                Load More Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2 className="cta-title">
                Ready to <span className="text-accent">Upgrade</span> Your Style?
              </h2>
              <p className="cta-description">
                Join thousands of happy JNV students and alumni who trust Navodaya Trendz for their merchandise needs.
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/tshirts" className="btn btn-primary btn-large">
                <i className="fas fa-shopping-cart"></i>
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import './HomeClean.css';

// Categories similar to the design
const categories = [
  {
    name: 'T-Shirts',
    description: 'Premium Cotton Collection',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    link: '/tshirts',
    bgClass: 'bg-purple'
  },
  {
    name: 'Hoodies',
    description: 'Comfort & Style',
    image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=400&h=400&fit=crop',
    link: '/hoodies',
    bgClass: 'bg-blue'
  },
  {
    name: 'Accessories',
    description: 'Complete Your Look',
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=400&h=400&fit=crop',
    link: '/accessories',
    bgClass: 'bg-orange'
  },
  {
    name: 'Alumni Kits',
    description: 'Exclusive Packages',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop',
    link: '/alumni-kits',
    bgClass: 'bg-green'
  }
];

// Stats data like in the design
const stats = [
  { number: '200+', label: 'International Brands', icon: '🌍' },
  { number: '2,000+', label: 'High-Quality Products', icon: '📦' },
  { number: '30,000+', label: 'Happy Customers', icon: '😊' }
];

const HomeClean = () => {
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
            badge: p.rating > 4.5 ? 'Bestseller' : '',
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

  return (
    <div className="home-clean">
      {/* Hero Section - Similar to the design */}
      <section className="hero-clean">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
              <p>Browse through our diverse collection of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
              <button className="shop-now-btn">Shop Now</button>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span>200+</span>
                  <p>International Brands</p>
                </div>
                <div className="hero-stat">
                  <span>2,000+</span>
                  <p>High-Quality Products</p>
                </div>
                <div className="hero-stat">
                  <span>30,000+</span>
                  <p>Happy Customers</p>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=700&fit=crop" alt="Fashion Model" />
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands-section">
        <div className="container">
          <div className="brands-logos">
            <div className="brand-logo">VERSACE</div>
            <div className="brand-logo">ZARA</div>
            <div className="brand-logo">GUCCI</div>
            <div className="brand-logo">PRADA</div>
            <div className="brand-logo">CALVIN KLEIN</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-clean">
        <div className="container">
          <div className="section-header">
            <h2>CATEGORIES</h2>
            <div className="header-line"></div>
          </div>
          
          <div className="categories-row">
            {categories.map((category, index) => (
              <Link key={index} to={category.link} className="category-card-clean">
                <div className={`category-image ${category.bgClass}`}>
                  <img src={category.image} alt={category.name} />
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-clean">
        <div className="container">
          <div className="section-header">
            <h2>OUR TOP PRODUCTS</h2>
            <div className="header-line"></div>
          </div>
          
          <div className="product-grid-clean">
            {isLoading ? (
              <SkeletonLoader type="product" count={8} />
            ) : (
              products.slice(0, 8).map((product, index) => (
                <div key={product.id} className="product-card-clean">
                  <ProductCard 
                    product={product} 
                    clean={true}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-clean">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>FREE AND FAST DELIVERY</h3>
              <p>Free delivery for all orders over $140</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>SECURE PAYMENT</h3>
              <p>100% secure payment</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-undo"></i>
              </div>
              <h3>RETURN WITHIN 30 DAYS</h3>
              <p>Return money within 30 days</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>24/7 SUPPORT</h3>
              <p>Dedicated support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeClean;

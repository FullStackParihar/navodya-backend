import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';

// Sample product data
const featuredProducts = [
  {
    id: 1,
    name: 'JNV Classic T-Shirt',
    description: 'Premium Cotton | Custom Design',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    badge: 'Bestseller',
    reviews: 245
  },
  {
    id: 2,
    name: 'JNV Alumni Hoodie',
    description: 'Fleece Fabric | Batch 2020',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=300&h=400&fit=crop',
    badge: 'New',
    reviews: 189
  },
  {
    id: 3,
    name: 'JNV Baseball Cap',
    description: 'Adjustable | Embroidered Logo',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=300&h=400&fit=crop',
    badge: 'Hot',
    reviews: 156
  },
  {
    id: 4,
    name: 'JNV Backpack',
    description: 'Waterproof | Laptop Compartment',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=400&fit=crop',
    reviews: 98
  },
  {
    id: 5,
    name: 'JNV Sports Jersey',
    description: 'Performance Fabric | Breathable',
    price: 549,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop',
    badge: 'Limited',
    reviews: 312
  },
  {
    id: 6,
    name: 'JNV Track Pants',
    description: 'Comfort Fit | Quick Dry',
    price: 449,
    originalPrice: 649,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=400&fit=crop',
    reviews: 178
  }
];

const categories = [
  {
    name: 'T-Shirts',
    description: 'Starting at ₹299',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    link: '/tshirts',
    icon: 'fas fa-tshirt'
  },
  {
    name: 'Hoodies',
    description: 'Starting at ₹599',
    image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=300&h=300&fit=crop',
    link: '/hoodies',
    icon: 'fas fa-hoodie-cloak'
  },
  {
    name: 'Accessories',
    description: 'Starting at ₹199',
    image: 'https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=300&h=300&fit=crop',
    link: '/accessories',
    icon: 'fas fa-hat-cowboy'
  },
  {
    name: 'Alumni Kits',
    description: 'Complete Packages',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop',
    link: '/alumni-kits',
    icon: 'fas fa-graduation-cap'
  }
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = featuredProducts.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'trending') return product.badge === 'Hot';
    if (activeTab === 'new') return product.badge === 'New';
    if (activeTab === 'bestseller') return product.reviews > 200;
    return true;
  });

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner animate-fadeIn">
        <div className="hero-content">
          <h1 className="animate-slideDown">Navodaya Alumni Store</h1>
          <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
            Premium Quality Merchandise for JNV Students & Alumni
          </p>
          <button className="btn-primary animate-bounce" style={{ animationDelay: '0.4s' }}>
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title animate-slideInLeft">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link} 
                className="category-card animate-fadeIn" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                  <div className="category-icon">
                    <i className={category.icon}></i>
                  </div>
                </div>
                <h3 className="category-title">{category.name}</h3>
                <p className="category-description">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title animate-slideInLeft">Featured Products</h2>
          
          <div className="product-tabs">
            {['all', 'trending', 'new', 'bestseller'].map((tab, index) => (
              <button 
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''} animate-fadeIn`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="product-grid">
            {isLoading ? (
              <SkeletonLoader type="product" count={6} />
            ) : (
              filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))
            )}
          </div>
          
          <div className="load-more-container">
            <button className="btn-secondary animate-fadeIn">
              Load More Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

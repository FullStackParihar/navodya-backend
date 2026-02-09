import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';

// Categories for navigation and filtering

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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        const result = await response.json();
        
        if (result.success) {
          // Map backend products to frontend format
          const mappedProducts = result.data.products.map(p => ({
            id: p.slug, // Use slug as ID for routing
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

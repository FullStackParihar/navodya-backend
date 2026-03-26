import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TShirtsPage.css';

const TShirtsPage = () => {
  const [imageErrors, setImageErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const getFallbackImage = () => {
    return 'https://via.placeholder.com/400x500/f3f4f6/6b7280?text=JNV+T-Shirt';
  };
  const products = [
    {
      id: 1,
      name: 'JNV Classic Tee',
      price: 599,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
      description: 'Premium cotton t-shirt with classic JNV logo',
      featured: true
    },
    {
      id: 2,
      name: 'Sports Performance Tee',
      price: 799,
      originalPrice: 999,
      image: 'https://images.unsplash.com/photo-1516726777716-f3d0f9cb299f?w=400&h=500&fit=crop',
      description: 'Moisture-wicking fabric perfect for sports activities',
      featured: false
    },
    {
      id: 3,
      name: 'Vintage Navodaya',
      price: 699,
      originalPrice: 899,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
      description: 'Retro-style t-shirt with vintage JNV design',
      featured: true
    },
    {
      id: 4,
      name: 'Graphic Design Tee',
      price: 899,
      originalPrice: 1099,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop',
      description: 'Artistic graphic print showcasing JNV spirit',
      featured: false
    },
    {
      id: 5,
      name: 'Alumni Special',
      price: 999,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&h=500&fit=crop',
      description: 'Exclusive design for JNV alumni',
      featured: true
    },
    {
      id: 6,
      name: 'Campus Life Tee',
      price: 549,
      originalPrice: 749,
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',
      description: 'Comfortable tee celebrating campus life',
      featured: false
    }
  ];

  return (
    <div className="tshirts-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>T-Shirts Collection</h1>
          <p>Premium quality t-shirts designed for JNV students and alumni</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
        <div className="container">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p>Loading amazing JNV products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  {product.featured && (
                    <div className="featured-badge">
                      <i className="fas fa-star"></i>
                      Featured
                    </div>
                  )}
                  <div className="product-image">
                    <img 
                      src={imageErrors[product.id] ? getFallbackImage() : product.image} 
                      alt={product.name}
                      onError={() => handleImageError(product.id)}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">
                      <span className="current-price">₹{product.price}</span>
                      <span className="original-price">₹{product.originalPrice}</span>
                    </div>
                    <div className="product-actions">
                      <Link to={`/product/${product.id}`} className="view-btn">
                        View Product
                      </Link>
                      <button className="cart-btn">
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TShirtsPage;

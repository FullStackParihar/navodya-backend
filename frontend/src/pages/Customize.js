import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';

const customizeProducts = [
  {
    id: 79,
    name: 'JNV Custom T-Shirt',
    description: 'Fully Customizable | Your Design | Premium Cotton',
    price: 599,
    originalPrice: 799,
    badge: 'Custom',
    reviews: 234,
    rating: 4.7
  },
  {
    id: 80,
    name: 'JNV Custom Hoodie',
    description: 'Personalized Hoodie | Your Art | Fleece Lined',
    price: 899,
    originalPrice: 1199,
    badge: 'Design',
    reviews: 189,
    rating: 4.8
  },
  {
    id: 81,
    name: 'JNV Custom Cap',
    description: 'Personalized Cap | Embroidered | Adjustable',
    price: 349,
    originalPrice: 449,
    badge: 'Embroidery',
    reviews: 167,
    rating: 4.5
  },
  {
    id: 82,
    name: 'JNV Custom Phone Case',
    description: 'Custom Design | Your Photos | Shockproof',
    price: 299,
    originalPrice: 399,
    badge: 'Photo',
    reviews: 145,
    rating: 4.4
  },
  {
    id: 83,
    name: 'JNV Custom Water Bottle',
    description: 'Personalized Bottle | Your Design | Insulated',
    price: 249,
    originalPrice: 349,
    badge: 'Print',
    reviews: 123,
    rating: 4.3
  },
  {
    id: 84,
    name: 'JNV Custom Backpack',
    description: 'Design Your Bag | Custom Print | Multiple Pockets',
    price: 999,
    originalPrice: 1399,
    badge: 'Print',
    reviews: 198,
    rating: 4.6
  }
];

const Customize = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const badges = ['Bestseller', 'New', 'Sale', 'Popular'];

  return (
    <div className="product-page-container">
      <section className="products-section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '32px', color: '#0f172a' }}>Custom Orders</h2>
          <div className="products-grid-new">
            {isLoading ? (
              <SkeletonLoader type="product" count={6} />
            ) : (
              customizeProducts.map((product, index) => (
                <div key={product.id} className="product-card-new">
                  <div className="product-badge-new">{badges[index % badges.length]}</div>
                  <div className="product-image-new">
                    <div className="product-placeholder">
                      <span className="product-emoji">✨</span>
                    </div>
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
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Customize;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './WishlistPage.css';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'JNV Classic Tee',
      price: 599,
      image: 'https://via.placeholder.com/300x400?text=T-Shirt1',
      inWishlist: true
    },
    {
      id: 2,
      name: 'Sports Performance Hoodie',
      price: 1299,
      image: 'https://via.placeholder.com/300x400?text=Hoodie1',
      inWishlist: true
    },
    {
      id: 3,
      name: 'JNV Backpack',
      price: 999,
      image: 'https://via.placeholder.com/300x400?text=Backpack1',
      inWishlist: false
    }
  ]);

  const toggleWishlist = (id) => {
    setWishlistItems(items => 
      items.map(item => 
        item.id === id ? { ...item, inWishlist: !item.inWishlist } : item
      )
    );
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="wishlist-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>My Wishlist</h1>
          <p>Save your favorite JNV items for later</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-icon">
            <i className="fas fa-heart"></i>
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding items you love to your wishlist</p>
          <Link to="/tshirts" className="btn-primary">
            <i className="fas fa-heart"></i>
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Wishlist Items */}
          <div className="wishlist-items-section">
            <div className="container">
              <div className="wishlist-grid">
                {wishlistItems.map(item => (
                  <div key={item.id} className="wishlist-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <button 
                        className={`wishlist-btn ${item.inWishlist ? 'active' : ''}`}
                        onClick={() => toggleWishlist(item.id)}
                        title={item.inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <i className={`fas fa-${item.inWishlist ? 'trash' : 'heart'}`}></i>
                      </button>
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <div className="item-meta">
                        <span className="item-price">₹{item.price}</span>
                        <span className="wishlist-status">
                          {item.inWishlist ? 'In Wishlist' : 'Not in Wishlist'}
                        </span>
                      </div>
                      <p className="item-description">Premium JNV apparel with high-quality materials</p>
                      <div className="item-actions">
                        <button 
                          onClick={() => toggleWishlist(item.id)}
                          className={`action-btn ${item.inWishlist ? 'remove' : 'add'}`}
                        >
                          <i className={`fas fa-${item.inWishlist ? 'trash' : 'heart'}`}></i>
                          {item.inWishlist ? 'Remove' : 'Add to Cart'}
                        </button>
                        <button className="action-btn primary">
                          <i className="fas fa-shopping-cart"></i>
                          {item.inWishlist ? 'Remove from Wishlist' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wishlist Summary */}
          <div className="wishlist-summary-section">
            <div className="container">
              <div className="summary-card">
                <h3>Wishlist Summary</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Total Items:</span>
                    <span className="summary-value">{wishlistItems.length}</span>
                  </div>
                  <div className="summary-row">
                    <span>Total Value:</span>
                    <span className="summary-value">
                      ₹{wishlistItems.reduce((total, item) => total + item.price, 0)}
                    </span>
                  </div>
                </div>
                <div className="summary-actions">
                  <button className="btn-secondary">
                    <i className="fas fa-arrow-left"></i>
                    Continue Shopping
                  </button>
                  <Link to="/cart" className="btn-primary">
                    <i className="fas fa-shopping-cart"></i>
                    Move All to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;

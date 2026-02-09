import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'JNV Classic Tee',
      price: 599,
      quantity: 2,
      size: 'L',
      color: 'Navy',
      image: 'https://via.placeholder.com/300x400?text=T-Shirt1'
    },
    {
      id: 2,
      name: 'Sports Performance Hoodie',
      price: 1299,
      quantity: 1,
      size: 'M',
      color: 'Black',
      image: 'https://via.placeholder.com/300x400?text=Hoodie1'
    },
    {
      id: 3,
      name: 'JNV Backpack',
      price: 999,
      quantity: 1,
      size: 'One Size',
      color: 'Black',
      image: 'https://via.placeholder.com/300x400?text=Backpack1'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 ? 50 : 0;
    return subtotal + shipping;
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
          <Link to="/tshirts" className="btn-primary">
            <i className="fas fa-tshirt"></i>
            Shop Now
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="container">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-meta">
                      <span className="item-price">₹{item.price}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                      <span className="item-size">Size: {item.size}</span>
                      <span className="item-color">Color: {item.color}</span>
                    </div>
                    <p className="item-description">Premium JNV apparel with high-quality materials</p>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="remove-btn"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-section">
            <div className="container">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span className="summary-value">₹{calculateSubtotal()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span className="summary-value">
                      {calculateSubtotal() > 0 ? '₹50' : 'FREE'}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Total:</span>
                    <span className="summary-value total">₹{calculateTotal()}</span>
                  </div>
                </div>
                <div className="summary-actions">
                  <button className="btn-secondary">
                    <i className="fas fa-arrow-left"></i>
                    Continue Shopping
                  </button>
                  <Link to="/checkout" className="btn-primary">
                    <i className="fas fa-credit-card"></i>
                    Proceed to Checkout
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

export default CartPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import './CartEnhanced.css';

const Cart = () => {
  const { items, totalAmount, updateQuantity, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { success, error } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const handleSaveForLater = (item) => {
    addToWishlist(item);
    removeFromCart(item.id);
    success(`${item.name} moved to wishlist`);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      error('Item removed from cart');
    } else if (newQuantity > 10) {
      error('Maximum quantity is 10');
    } else {
      updateQuantity(id, newQuantity);
      success('Cart updated successfully');
    }
  };

  const handleRemoveItem = (id, name) => {
    removeFromCart(id);
    error(`${name} removed from cart`);
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      error('Please enter a promo code');
      return;
    }
    
    if (promoCode.toUpperCase() === 'JNV2024') {
      setDiscount(200);
      setIsPromoApplied(true);
      success('Promo code applied! You saved ₹200');
    } else if (promoCode.toUpperCase() === 'ALUMNI20') {
      setDiscount(Math.floor(totalAmount * 0.2));
      setIsPromoApplied(true);
      success('20% discount applied!');
    } else {
      error('Invalid promo code');
      setDiscount(0);
      setIsPromoApplied(false);
    }
  };

  const calculateTotal = () => {
    return Math.max(0, totalAmount - discount);
  };

  if (items.length === 0) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: '#e0e7ff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px',
            fontSize: '48px'
          }}>
            <i className="fas fa-shopping-cart" style={{ color: '#2563eb' }}></i>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>Your Cart is Empty</h1>
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px' }}>
            Add some Navodaya merchandise to get started!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ 
              background: '#2563eb', 
              color: 'white', 
              padding: '14px 28px', 
              borderRadius: '10px', 
              textDecoration: 'none', 
              fontWeight: '700',
              fontSize: '16px',
              transition: 'all 0.2s'
            }} 
            onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}>
              <i className="fas fa-home" style={{ marginRight: '8px' }}></i> Continue Shopping
            </Link>
            <Link to="/tshirts" style={{ 
              background: 'white', 
              color: '#0f172a', 
              padding: '14px 28px', 
              borderRadius: '10px', 
              textDecoration: 'none', 
              fontWeight: '700',
              fontSize: '16px',
              border: '2px solid #e2e8f0',
              transition: 'all 0.2s'
            }} 
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}>
              <i className="fas fa-tshirt" style={{ marginRight: '8px' }}></i> Browse T-Shirts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Shopping Cart</h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Cart Items */}
          <div>
            {items.map((item, index) => (
              <div key={item.id} style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '20px', 
                marginBottom: '16px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto auto auto',
                gap: '20px',
                alignItems: 'center'
              }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div>
                  <Link to={`/product/${item.id}`} style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', textDecoration: 'none' }}>
                    {item.name}
                  </Link>
                  <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', marginBottom: '12px' }}>{item.description}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>₹{item.price}</span>
                    {item.originalPrice && (
                      <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>₹{item.originalPrice}</span>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Quantity</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      style={{ width: '36px', height: '36px', borderRadius: '6px', border: '2px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span style={{ fontSize: '16px', fontWeight: '700', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                    <button 
                      style={{ width: '36px', height: '36px', borderRadius: '6px', border: '2px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                    >+</button>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Total</span>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>₹{item.price * item.quantity}</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    style={{ width: '36px', height: '36px', borderRadius: '6px', border: 'none', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: '16px' }}
                    onClick={() => handleSaveForLater(item)}
                    title="Save for later"
                  >
                    <i className="far fa-heart"></i>
                  </button>
                  <button 
                    style={{ width: '36px', height: '36px', borderRadius: '6px', border: 'none', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '16px' }}
                    onClick={() => handleRemoveItem(item.id, item.name)}
                    title="Remove item"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ height: 'fit-content' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>Order Summary</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#64748b', fontSize: '15px' }}>
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>₹{totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#64748b', fontSize: '15px' }}>
                  <span>Shipping</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>Free</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#64748b', fontSize: '15px' }}>
                    <span>Discount</span>
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>-₹{discount}</span>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Total</span>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>₹{calculateTotal()}</span>
                </div>
              </div>

              {!isPromoApplied && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={promoCode} 
                      onChange={(e) => setPromoCode(e.target.value)} 
                      placeholder="Enter promo code (e.g., JNV2024)" 
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        borderRadius: '8px', 
                        border: '2px solid #e2e8f0', 
                        fontSize: '14px'
                      }}
                    />
                    <button 
                      style={{ 
                        padding: '12px 20px', 
                        background: '#0f172a', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontWeight: '700',
                        cursor: 'pointer'
                      }} 
                      onClick={handleApplyPromo}
                    >
                      Apply
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>Try JNV2024 or ALUMNI20</p>
                </div>
              )}

              <Link to="/checkout" style={{ 
                display: 'block',
                width: '100%',
                padding: '16px',
                textAlign: 'center',
                background: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}>
                <i className="fas fa-lock" style={{ marginRight: '8px' }}></i> Proceed to Checkout
              </Link>

              <p style={{ textAlign: 'center', marginTop: '16px', color: '#64748b', fontSize: '13px' }}>
                <i className="fas fa-shield-alt" style={{ marginRight: '6px', color: '#10b981' }}></i>
                Secure payment • 100% safe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

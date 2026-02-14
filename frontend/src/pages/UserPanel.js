import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const UserPanel = () => {
  const navigate = useNavigate();
  const { items: cartItems, totalItems, totalAmount } = useCart();
  const { items: wishlistItems, totalItems: wishlistCount, clearWishlist } = useWishlist();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('overview');

  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jnvSchool: '',
    batchYear: '',
    avatar: 'https://i.pravatar.cc/150?img=5'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await api.get('/auth/profile');
        if (result.success && result.data) {
          const u = result.data.user || result.data;
          if (u) {
            const nameParts = (u.name || '').split(' ');
            setAccountData({
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              email: u.email || '',
              phone: u.phone || '',
              jnvSchool: u.jnvSchool || 'Not Set',
              batchYear: u.batchYear || 'Not Set',
              avatar: u.avatar || 'https://i.pravatar.cc/150?img=5',
              address: u.address || '',
              city: u.city || '',
              state: u.state || '',
              pincode: u.pincode || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const user = accountData;

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await api.get('/orders');
        if (result.success) {
          const mappedOrders = result.data.map(order => ({
            id: order._id,
            date: new Date(order.created_at).toLocaleDateString(),
            status: order.status.toLowerCase(),
            total: order.pricing.total,
            items: order.items.length,
            etaDays: order.status === 'PROCESSING' ? 7 : 0
          }));
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const latestOrder = useMemo(() => (orders.length ? orders[0] : null), [orders]);

  const addresses = useMemo(() => {
    if (!accountData.firstName) return [];
    return [
      {
        id: 'default',
        type: 'Default',
        name: `${accountData.firstName} ${accountData.lastName}`,
        phone: accountData.phone,
        addressLine: accountData.address || 'No address set',
        city: accountData.city || '',
        state: accountData.state || '',
        pincode: accountData.pincode || '',
        isDefault: true
      }
    ];
  }, [accountData]);

  const statusBadgeClass = (status) => {
    if (status === 'delivered') return 'delivered';
    if (status === 'shipped') return 'shipped';
    if (status === 'out-for-delivery') return 'out';
    return 'processing';
  };

  const onClearWishlist = () => {
    clearWishlist();
    success('Wishlist cleared');
  };

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    // Show toast and redirect to login
    success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="user-panel">
      <section className="user-panel-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-user">
              <img className="avatar" src={user.avatar} alt="User" />
              <div>
                <h1>{user.firstName} {user.lastName}</h1>
                <p className="subtitle">{user.jnvSchool} • Batch {user.batchYear}</p>
                <p className="submeta">{user.email} • {user.phone}</p>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-secondary" onClick={() => navigate('/profile')}>
                <i className="fas fa-user"></i> Open Profile
              </button>
              <button className="btn-primary" onClick={() => navigate('/checkout')}>
                <i className="fas fa-bolt"></i> Checkout Center
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="user-panel-body">
        <div className="container">
          <div className="panel-layout">
            <aside className="panel-sidebar">
              <button className={`side-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                <i className="fas fa-border-all"></i>
                <span>Overview</span>
              </button>
              <button className={`side-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                <i className="fas fa-shopping-bag"></i>
                <span>My Orders</span>
              </button>
              <button className={`side-link ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
                <i className="fas fa-map-marker-alt"></i>
                <span>Addresses</span>
              </button>
              <button className={`side-link ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
                <i className="fas fa-heart"></i>
                <span>Wishlist</span>
              </button>
              <button className={`side-link ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
                <i className="fas fa-headset"></i>
                <span>Support</span>
              </button>

              <div className="sidebar-card">
                <div className="mini-stat">
                  <span className="mini-stat-label">Cart</span>
                  <span className="mini-stat-value">{totalItems} items</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-label">Wishlist</span>
                  <span className="mini-stat-value">{wishlistCount} items</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-label">Spent</span>
                  <span className="mini-stat-value">₹{totalAmount}</span>
                </div>
                <div className="mini-actions">
                  <Link className="mini-btn" to="/cart">
                    <i className="fas fa-shopping-cart"></i> Cart
                  </Link>
                  <Link className="mini-btn" to="/payment">
                    <i className="fas fa-lock"></i> Pay
                  </Link>
                </div>
              </div>
            </aside>

            <main className="panel-content">
              {activeTab === 'overview' && (
                <div className="tab-content">
                  <div className="grid">
                    <div className="card stats-card">
                      <div className="stats">
                        <div className="stat">
                          <div className="stat-icon">
                            <i className="fas fa-shopping-bag"></i>
                          </div>
                          <div>
                            <div className="stat-value">{orders.length}</div>
                            <div className="stat-label">Orders</div>
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-icon">
                            <i className="fas fa-shopping-cart"></i>
                          </div>
                          <div>
                            <div className="stat-value">{totalItems}</div>
                            <div className="stat-label">Cart Items</div>
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-icon">
                            <i className="fas fa-heart"></i>
                          </div>
                          <div>
                            <div className="stat-value">{wishlistCount}</div>
                            <div className="stat-label">Wishlist</div>
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-icon">
                            <i className="fas fa-rupee-sign"></i>
                          </div>
                          <div>
                            <div className="stat-value">₹{totalAmount}</div>
                            <div className="stat-label">Cart Total</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-head">
                        <h2>Quick Links</h2>
                      </div>
                      <div className="quick-links">
                        <Link className="quick-link" to="/checkout">
                          <i className="fas fa-tachometer-alt"></i>
                          <span>Checkout Center</span>
                        </Link>
                        <Link className="quick-link" to="/payment">
                          <i className="fas fa-credit-card"></i>
                          <span>Payment</span>
                        </Link>
                        <Link className="quick-link" to="/bulk-order">
                          <i className="fas fa-users"></i>
                          <span>Bulk Order</span>
                        </Link>
                        <Link className="quick-link" to="/wishlist">
                          <i className="fas fa-heart"></i>
                          <span>Wishlist</span>
                        </Link>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-head">
                        <h2>Latest Order</h2>
                        <button className="ghost" onClick={() => setActiveTab('orders')}>View All</button>
                      </div>

                      {!latestOrder ? (
                        <div className="empty">
                          <i className="fas fa-box"></i>
                          <p>No orders yet.</p>
                          <Link className="btn-primary" to="/tshirts">Start Shopping</Link>
                        </div>
                      ) : (
                        <div className="latest-order">
                          <div className="order-row">
                            <div>
                              <div className="order-id">Order #{latestOrder.id}</div>
                              <div className="order-meta">{latestOrder.date} • {latestOrder.items} items</div>
                            </div>
                            <span className={`badge ${statusBadgeClass(latestOrder.status)}`}>{latestOrder.status}</span>
                          </div>
                          <div className="order-row">
                            <span className="muted">Total</span>
                            <span className="strong">₹{latestOrder.total}</span>
                          </div>
                          <div className="order-row">
                            <span className="muted">ETA</span>
                            <span className="strong">{latestOrder.etaDays} days</span>
                          </div>
                          <div className="order-actions">
                            <button className="btn-primary" onClick={() => navigate(`/order/${latestOrder.id}`)}>
                              <i className="fas fa-map-marker-alt"></i> Track
                            </button>
                            <button className="btn-secondary" onClick={() => navigate('/payment')}>
                              <i className="fas fa-lock"></i> Pay
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <div className="card-head">
                        <h2>Cart Preview</h2>
                        <Link className="ghost" to="/cart">Open Cart</Link>
                      </div>
                      {cartItems.length === 0 ? (
                        <div className="empty">
                          <i className="fas fa-shopping-cart"></i>
                          <p>Your cart is empty.</p>
                          <Link className="btn-primary" to="/tshirts">Browse Products</Link>
                        </div>
                      ) : (
                        <div className="list">
                          {cartItems.slice(0, 3).map((p) => (
                            <div key={p.id} className="list-item">
                              <img src={p.image} alt={p.name} />
                              <div>
                                <div className="strong">{p.name}</div>
                                <div className="muted">Qty {p.quantity} • ₹{p.price}</div>
                              </div>
                            </div>
                          ))}
                          <div className="order-actions">
                            <Link className="btn-secondary" to="/cart">
                              <i className="fas fa-shopping-cart"></i> View Cart
                            </Link>
                            <Link className="btn-primary" to="/payment">
                              <i className="fas fa-lock"></i> Checkout
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <div className="card-head">
                        <h2>Wishlist</h2>
                        <Link className="ghost" to="/wishlist">Open</Link>
                      </div>
                      {wishlistItems.length === 0 ? (
                        <div className="empty">
                          <i className="fas fa-heart"></i>
                          <p>Your wishlist is empty.</p>
                          <Link className="btn-secondary" to="/tshirts">Browse Products</Link>
                        </div>
                      ) : (
                        <div className="list">
                          {wishlistItems.slice(0, 3).map((p) => (
                            <div key={p.id} className="list-item">
                              <img src={p.image} alt={p.name} />
                              <div>
                                <div className="strong">{p.name}</div>
                                <div className="muted">₹{p.price}</div>
                              </div>
                            </div>
                          ))}
                          <button className="btn-secondary" onClick={onClearWishlist}>Clear Wishlist</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="tab-content">
                  <div className="card">
                    <div className="card-head">
                      <h2>My Orders</h2>
                      <div className="head-actions">
                        <button className="btn-secondary" onClick={() => navigate('/checkout')}>
                          <i className="fas fa-bolt"></i> Checkout Center
                        </button>
                        <button className="btn-primary" onClick={() => navigate('/payment')}>
                          <i className="fas fa-credit-card"></i> Payment
                        </button>
                      </div>
                    </div>

                    <div className="orders">
                      {isLoadingOrders ? (
                        <div className="loading-state">Loading your orders...</div>
                      ) : orders.length === 0 ? (
                        <div className="empty-state">No orders yet.</div>
                      ) : (
                        orders.map((o) => (
                          <div key={o.id} className="order-card">
                            <div className="order-top">
                              <div>
                                <div className="order-id">Order #{o.id.slice(-8).toUpperCase()}</div>
                                <div className="order-meta">{o.date} • {o.items} items</div>
                              </div>
                              <span className={`badge ${statusBadgeClass(o.status)}`}>{o.status}</span>
                            </div>

                            <div className="order-bottom">
                              <div className="order-amount">
                                <span className="muted">Total</span>
                                <span className="strong">₹{o.total}</span>
                              </div>
                              <div className="order-amount">
                                <span className="muted">ETA</span>
                                <span className="strong">{o.etaDays} days</span>
                              </div>
                              <div className="order-cta">
                                <button className="btn-primary" onClick={() => navigate(`/order/${o.id}`)}>
                                  <i className="fas fa-map-marker-alt"></i> Track
                                </button>
                                <button className="btn-secondary" onClick={() => navigate('/profile')}>
                                  <i className="fas fa-eye"></i> Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="tab-content">
                  <div className="card">
                    <div className="card-head">
                      <h2>Addresses</h2>
                      <button className="btn-primary" onClick={() => navigate('/payment')}>
                        <i className="fas fa-plus"></i> Add Address (Checkout)
                      </button>
                    </div>

                    <div className="addresses">
                      {addresses.map((a) => (
                        <div key={a.id} className={`address ${a.isDefault ? 'default' : ''}`}>
                          <div className="address-top">
                            <div className="address-title">
                              <i className="fas fa-home"></i>
                              <span>{a.type}</span>
                              {a.isDefault && (
                                <span className="default-pill">
                                  <i className="fas fa-check"></i> Default
                                </span>
                              )}
                            </div>
                            <button className="ghost" onClick={() => navigate('/profile')}>Manage</button>
                          </div>
                          <div className="address-body">
                            <div className="strong">{a.name}</div>
                            <div className="muted">{a.phone}</div>
                            <div className="muted">{a.addressLine}</div>
                            <div className="muted">{a.city}, {a.state} - {a.pincode}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="tab-content">
                  <div className="card">
                    <div className="card-head">
                      <h2>Wishlist</h2>
                      <div className="head-actions">
                        <Link className="btn-secondary" to="/wishlist">
                          <i className="fas fa-heart"></i> Open Wishlist Page
                        </Link>
                        <button className="btn-primary" onClick={() => navigate('/tshirts')}>
                          <i className="fas fa-shopping-bag"></i> Shop
                        </button>
                      </div>
                    </div>

                    {wishlistItems.length === 0 ? (
                      <div className="empty">
                        <i className="fas fa-heart"></i>
                        <p>Your wishlist is empty.</p>
                        <Link className="btn-primary" to="/tshirts">Browse Products</Link>
                      </div>
                    ) : (
                      <div className="wishlist-grid">
                        {wishlistItems.map((p) => (
                          <div key={p.id} className="wishlist-item">
                            <img src={p.image} alt={p.name} />
                            <div className="wishlist-meta">
                              <div className="strong">{p.name}</div>
                              <div className="muted">₹{p.price}</div>
                            </div>
                            <div className="wishlist-actions">
                              <Link className="btn-secondary" to={`/product/${p.id}`}>
                                <i className="fas fa-eye"></i> View
                              </Link>
                              <Link className="btn-primary" to="/cart">
                                <i className="fas fa-shopping-cart"></i> Cart
                              </Link>
                            </div>
                          </div>
                        ))}
                        <button className="btn-secondary" onClick={onClearWishlist}>Clear Wishlist</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'support' && (
                <div className="tab-content">
                  <div className="card">
                    <div className="card-head">
                      <h2>Support</h2>
                      <button className="btn-secondary" onClick={() => navigate('/checkout')}>
                        <i className="fas fa-bolt"></i> Checkout Center
                      </button>
                    </div>

                    <div className="support-grid">
                      <button className="support-card" onClick={() => window.open('tel:+9118001234567')}>
                        <div className="support-icon">
                          <i className="fas fa-phone"></i>
                        </div>
                        <div className="support-title">Call Support</div>
                        <div className="muted">+91 1800-123-4567</div>
                      </button>

                      <button className="support-card" onClick={() => window.open('mailto:support@navodayatrendz.com?subject=Help%20Request')}>
                        <div className="support-icon">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div className="support-title">Email</div>
                        <div className="muted">support@navodayatrendz.com</div>
                      </button>

                      <button className="support-card" onClick={() => window.open('https://wa.me/919284490206?text=Hi%2C%20I%20need%20help%20with%20my%20order')}>
                        <div className="support-icon whatsapp">
                          <i className="fab fa-whatsapp"></i>
                        </div>
                        <div className="support-title">WhatsApp</div>
                        <div className="muted">Instant chat</div>
                      </button>

                      <button className="support-card" onClick={() => navigate('/bulk-order')}>
                        <div className="support-icon">
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="support-title">Bulk Order Help</div>
                        <div className="muted">Custom requests</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <style jsx>{`
        .user-panel {
          background: var(--bg-secondary, #f8fafc);
          min-height: 100vh;
          padding-bottom: 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .user-panel-hero {
          padding: 2rem 0;
          background:
            radial-gradient(1200px 400px at 20% 0%, rgba(47, 74, 103, 0.16), transparent 60%),
            radial-gradient(900px 350px at 80% 10%, rgba(86, 113, 141, 0.14), transparent 60%);
        }

        .hero-content {
          background: var(--bg-primary, #fff);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 2rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .hero-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        h1 {
          margin: 0;
          color: var(--text-primary, #1e293b);
        }

        .subtitle {
          margin: 0.25rem 0 0;
          color: var(--text-secondary, #64748b);
          font-weight: 500;
        }

        .submeta {
          margin: 0.35rem 0 0;
          color: var(--text-muted, #94a3b8);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .hero-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          border: none;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 700;
          cursor: pointer;
          padding: 0.75rem 1.25rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .btn-primary {
          background: var(--gradient-primary, linear-gradient(135deg, #2f4a67, #23394f));
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .btn-secondary {
          background: var(--gray-200, #e2e8f0);
          color: var(--text-primary, #1e293b);
        }

        .btn-secondary:hover {
          background: var(--gray-300, #cbd5e1);
        }

        .user-panel-body {
          padding: 1rem 0;
        }

        .panel-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .panel-sidebar {
          position: sticky;
          top: 110px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .side-link {
          width: 100%;
          background: var(--bg-primary, #fff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-xl, 1rem);
          padding: 0.9rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-primary, #1e293b);
          font-weight: 700;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .side-link:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
          border-color: rgba(47, 74, 103, 0.35);
        }

        .side-link.active {
          background: rgba(47, 74, 103, 0.08);
          border-color: rgba(47, 74, 103, 0.35);
        }

        .stats-card {
          padding: 1.25rem;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .stat {
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-xl, 1rem);
          padding: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 1rem;
          background: rgba(47, 74, 103, 0.12);
          color: var(--primary-color, #2f4a67);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-value {
          color: var(--text-primary, #1e293b);
          font-weight: 900;
          line-height: 1.1;
        }

        .stat-label {
          color: var(--text-secondary, #64748b);
          font-weight: 700;
          font-size: 0.8rem;
          margin-top: 0.1rem;
        }

        .sidebar-card {
          margin-top: 0.75rem;
          background: var(--bg-primary, #fff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 1rem;
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .mini-stat {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
          color: var(--text-secondary, #64748b);
          font-weight: 600;
        }

        .mini-stat-value {
          color: var(--text-primary, #1e293b);
          font-weight: 800;
        }

        .mini-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .mini-btn {
          background: var(--gray-100, #f1f5f9);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-lg, 0.75rem);
          padding: 0.6rem 0.75rem;
          font-weight: 700;
          color: var(--text-primary, #1e293b);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .mini-btn:hover {
          background: var(--gray-200, #e2e8f0);
        }

        .panel-content {
          min-width: 0;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1rem;
        }

        .card {
          grid-column: span 12;
          background: var(--bg-primary, #fff);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 1.5rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
        }

        .card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .card-head h2 {
          margin: 0;
          color: var(--text-primary, #1e293b);
          font-size: 1.25rem;
        }

        .ghost {
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 700;
          color: var(--primary-color, #2f4a67);
          text-decoration: none;
        }

        .head-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .quick-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .quick-link {
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-xl, 1rem);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text-primary, #1e293b);
          font-weight: 800;
          transition: all var(--transition-fast);
        }

        .quick-link:hover {
          transform: translateY(-2px);
          border-color: rgba(47, 74, 103, 0.35);
        }

        .latest-order {
          display: grid;
          gap: 0.75rem;
        }

        .order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .order-id {
          font-weight: 900;
          color: var(--text-primary, #1e293b);
        }

        .order-meta {
          color: var(--text-secondary, #64748b);
          font-weight: 600;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .muted {
          color: var(--text-secondary, #64748b);
          font-weight: 600;
        }

        .strong {
          color: var(--text-primary, #1e293b);
          font-weight: 900;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .badge.processing {
          background: var(--warning-color, #d97706);
          color: var(--gray-900, #0f172a);
        }

        .badge.shipped {
          background: var(--info-color, #2563eb);
          color: #fff;
        }

        .badge.out {
          background: var(--primary-color, #2f4a67);
          color: #fff;
        }

        .badge.delivered {
          background: var(--success-color, #16a34a);
          color: #fff;
        }

        .order-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .orders {
          display: grid;
          gap: 1rem;
        }

        .order-card {
          background: var(--gray-50, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 1.25rem;
        }

        .order-top {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 1rem;
        }

        .order-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          align-items: center;
          margin-top: 1rem;
        }

        .order-cta {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .addresses {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .address {
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 1.25rem;
        }

        .address.default {
          border-color: rgba(6, 255, 165, 0.6);
          box-shadow: 0 0 0 3px rgba(6, 255, 165, 0.15);
        }

        .address-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .address-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 900;
          color: var(--text-primary, #1e293b);
        }

        .btn-logout {
  background: #dc2626;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(220, 38, 38, 0.3);
}

.default-pill {
          margin-left: 0.5rem;
          background: rgba(6, 255, 165, 0.2);
          border: 1px solid rgba(6, 255, 165, 0.35);
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 900;
          color: var(--gray-900, #0f172a);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .address-body {
          display: grid;
          gap: 0.25rem;
        }

        .empty {
          padding: 1.25rem;
          border: 1px dashed var(--border-color, #e2e8f0);
          border-radius: var(--radius-2xl, 1.5rem);
          text-align: center;
          color: var(--text-secondary, #64748b);
        }

        .empty i {
          font-size: 1.5rem;
          color: var(--primary-color, #2f4a67);
          margin-bottom: 0.75rem;
        }

        .list {
          display: grid;
          gap: 0.75rem;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: var(--radius-xl, 1rem);
          background: var(--gray-50, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
        }

        .list-item img {
          width: 44px;
          height: 44px;
          border-radius: 0.75rem;
          object-fit: cover;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .wishlist-item {
          background: var(--gray-50, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-2xl, 1.5rem);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .wishlist-item img {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }

        .wishlist-meta {
          padding: 1rem;
          display: grid;
          gap: 0.25rem;
        }

        .wishlist-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          padding: 0 1rem 1rem;
        }

        .support-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .support-card {
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 1.25rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .support-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
          border-color: rgba(47, 74, 103, 0.35);
        }

        .support-icon {
          width: 44px;
          height: 44px;
          border-radius: 1rem;
          background: var(--primary-color, #2f4a67);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .support-icon.whatsapp {
          background: #25D366;
        }

        .support-title {
          font-weight: 900;
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.25rem;
        }

        @media (max-width: 1024px) {
          .panel-layout {
            grid-template-columns: 1fr;
          }

          .panel-sidebar {
            position: static;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .sidebar-card {
            grid-column: span 2;
          }

          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .addresses {
            grid-template-columns: 1fr;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .quick-links {
            grid-template-columns: 1fr;
          }

          .panel-sidebar {
            grid-template-columns: 1fr;
          }

          .sidebar-card {
            grid-column: span 1;
          }

          .order-bottom {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .order-cta {
            justify-content: flex-start;
          }

          .wishlist-grid {
            grid-template-columns: 1fr;
          }

          .support-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserPanel;

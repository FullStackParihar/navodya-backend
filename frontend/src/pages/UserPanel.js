import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { API_URL } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=5';
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const UserPanel = () => {
  const navigate = useNavigate();
  const { items: cartItems, totalItems, totalAmount } = useCart();
  const { items: wishlistItems, totalItems: wishlistCount, clearWishlist } = useWishlist();
  const { success, error: showError } = useToast();

  const [activeTab, setActiveTab] = useState('overview');

  const [accountData, setAccountData] = useState({
    firstName: localStorage.getItem('userFirstName') || 'Navodayan',
    lastName: localStorage.getItem('userLastName') || 'User',
    email: localStorage.getItem('userEmail') || '',
    phone: '',
    jnvSchool: localStorage.getItem('userJnvSchool') || 'JNV',
    batchYear: localStorage.getItem('userBatchYear') || '',
    avatar: DEFAULT_AVATAR
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    jnvSchool: '',
    batchYear: '',
    graduationYear: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [editErrors, setEditErrors] = useState({});
  const [editSubmitError, setEditSubmitError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const applyProfileToAccount = (u) => {
    const nameParts = (u.name || '').split(' ');
    const nextAccount = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: u.email || '',
      phone: u.phone || '',
      jnvSchool: u.jnvSchool || 'Not Set',
      batchYear: u.batchYear || 'Not Set',
      avatar: u.avatar || DEFAULT_AVATAR,
      address: u.address || '',
      city: u.city || '',
      state: u.state || '',
      pincode: u.pincode || '',
      bio: u.bio || ''
    };
    setAccountData(nextAccount);
    localStorage.setItem('userEmail', nextAccount.email);
    localStorage.setItem('userFirstName', nextAccount.firstName);
    localStorage.setItem('userLastName', nextAccount.lastName);
    localStorage.setItem('userJnvSchool', nextAccount.jnvSchool);
    localStorage.setItem('userBatchYear', nextAccount.batchYear);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await api.get('/auth/profile');
        if (result.success && result.data) {
          const u = result.data.user || result.data;
          if (u) {
            applyProfileToAccount(u);
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
            etaDays: order.status === 'PROCESSING' ? 7 : 0,
            paymentStatus: order.payment_info?.status?.toLowerCase() || 'pending',
            paymentMethod: order.payment_info?.method?.toLowerCase() || ''
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

  const openEditProfile = () => {
    const fullName = `${accountData.firstName || ''} ${accountData.lastName || ''}`.trim();
    setEditForm({
      name: fullName,
      email: accountData.email || '',
      phone: accountData.phone || '',
      jnvSchool: accountData.jnvSchool === 'Not Set' ? '' : accountData.jnvSchool || '',
      batchYear: accountData.batchYear === 'Not Set' ? '' : accountData.batchYear || '',
      graduationYear: accountData.bio || '',
      address: accountData.address || '',
      city: accountData.city || '',
      state: accountData.state || '',
      pincode: accountData.pincode || ''
    });
    setProfileImageFile(null);
    setProfileImagePreview(accountData.avatar || DEFAULT_AVATAR);
    setEditErrors({});
    setEditSubmitError('');
    setIsEditProfileOpen(true);
  };

  const closeEditProfile = (force = false) => {
    if (isSavingProfile && !force) return;
    if (profileImagePreview && profileImageFile) URL.revokeObjectURL(profileImagePreview);
    setIsEditProfileOpen(false);
    setProfileImageFile(null);
    setEditErrors({});
    setEditSubmitError('');
  };

  const handleEditFieldChange = (event) => {
    const { name, value } = event.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    setEditErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!PROFILE_IMAGE_TYPES.includes(file.type)) {
      setEditErrors(prev => ({ ...prev, avatar: 'Only JPG, PNG, and WEBP images are allowed.' }));
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setEditErrors(prev => ({ ...prev, avatar: 'Profile image must be 5MB or smaller.' }));
      return;
    }
    if (profileImagePreview && profileImageFile) URL.revokeObjectURL(profileImagePreview);
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
    setEditErrors(prev => ({ ...prev, avatar: '' }));
  };

  const validateEditProfile = () => {
    const nextErrors = {};
    if (!editForm.name.trim() || editForm.name.trim().length < 2) nextErrors.name = 'Full name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (editForm.phone.trim() && !/^[+]?\d[\d\s-]{7,14}$/.test(editForm.phone.trim())) nextErrors.phone = 'Enter a valid phone number.';
    if (editForm.pincode.trim() && !/^\d{6}$/.test(editForm.pincode.trim())) nextErrors.pincode = 'Enter a valid 6-digit pincode.';
    setEditErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!validateEditProfile()) return;

    setIsSavingProfile(true);
    setEditSubmitError('');
    try {
      const data = new FormData();
      data.append('name', editForm.name.trim());
      data.append('email', editForm.email.trim());
      data.append('phone', editForm.phone.trim());
      data.append('jnvSchool', editForm.jnvSchool.trim());
      data.append('batchYear', editForm.batchYear.trim());
      data.append('bio', editForm.graduationYear.trim());
      data.append('address', editForm.address.trim());
      data.append('city', editForm.city.trim());
      data.append('state', editForm.state.trim());
      data.append('pincode', editForm.pincode.trim());
      if (profileImageFile) data.append('avatar', profileImageFile);

      const result = await api.patch('/auth/profile', data);
      if (!result.success) {
        const message = result.message || 'Failed to update profile.';
        setEditSubmitError(message);
        showError(message);
        return;
      }

      const updatedUser = result.data?.user || result.data;
      applyProfileToAccount(updatedUser);
      success('Profile updated successfully');
      closeEditProfile(true);
    } catch (err) {
      setEditSubmitError('Network or server error. Please try again.');
      showError('Network or server error. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    // Show toast and redirect to login
    success('Logged out successfully');
    navigate('/login');
  };

  const handleRetryPayment = async (orderId) => {
    try {
      const returnUrl = `${window.location.origin}/checkout`;
      const result = await api.post('/payments/create-order', { orderId, returnUrl });
      if (result.success && result.data.paymentSessionId) {
        if (result.data.paymentSessionId.startsWith('mock_cf_session_')) {
          window.location.href = `${window.location.origin}/checkout?order_id=${result.data.orderId || result.data.cfOrderId}`;
          return;
        }

        const mode = process.env.REACT_APP_CASHFREE_MODE || 'sandbox';
        
        if (window.Cashfree) {
          const cashfree = window.Cashfree({
            mode: mode.toLowerCase() === 'production' ? 'production' : 'sandbox'
          });
          cashfree.checkout({
            paymentSessionId: result.data.paymentSessionId,
            redirectTarget: '_self'
          });
        } else {
          // Fallback to manual redirect if Cashfree SDK script is not loaded
          const baseUrl = mode.toLowerCase() === 'production'
            ? 'https://payments.cashfree.com/pg/view/checkout'
            : 'https://sandbox.cashfree.com/pg/view/checkout';
          window.location.href = `${baseUrl}?session_id=${result.data.paymentSessionId}`;
        }
      } else {
        showError(result.message || 'Failed to initiate retry payment');
      }
    } catch (err) {
      console.error('Retry payment error:', err);
      showError('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <div className="user-panel">
      <section className="user-panel-hero">
        <div className="container">
          <div className="hero-content profile-card">
            <div className="hero-user">
              <div className="avatar-frame">
                <img className="avatar" src={user.avatar} alt="User" />
              </div>
              <div className="hero-user-info">
                {/* <div className="profile-kicker">User Profile</div> */}
                <h1>{user.firstName || 'Navodayan'} {user.lastName || 'User'}</h1>
                <p className="subtitle">{user.jnvSchool || 'JNV'} {user.batchYear ? `• Batch ${user.batchYear}` : ''}</p>
                <p className="submeta">{user.email || ''} {user.phone ? `• ${user.phone}` : ''}</p>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/checkout')}>
                <i className="fas fa-bolt"></i> Checkout Center
              </button>
              <button className="btn-secondary" onClick={openEditProfile}>
                <i className="fas fa-user-edit"></i> Edit Profile
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
              <button className="side-link" onClick={() => navigate('/my-bulk-orders')}>
                <i className="fas fa-clipboard-list"></i>
                <span>My Bulk Orders</span>
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
                        <Link className="quick-link" to="/my-bulk-orders">
                          <i className="fas fa-clipboard-list"></i>
                          <span>My Bulk Orders</span>
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
                                {o.paymentStatus !== 'paid' && o.paymentMethod !== 'cod' && (
                                  <button 
                                    className="btn-primary" 
                                    onClick={() => handleRetryPayment(o.id)}
                                    style={{ marginLeft: '10px', backgroundColor: '#e28743', borderColor: '#e28743' }}
                                  >
                                    <i className="fas fa-credit-card"></i> Pay Now
                                  </button>
                                )}
                                <button 
                                  className="btn-secondary" 
                                  onClick={() => window.open(`${API_URL}/orders/${o.id}/invoice?token=${localStorage.getItem('token')}`, '_blank')}
                                  style={{ marginLeft: '10px' }}
                                >
                                  <i className="fas fa-file-invoice"></i> Invoice
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

      {isEditProfileOpen && (
        <div className="edit-profile-backdrop" role="presentation" onClick={() => closeEditProfile()}>
          <section className="edit-profile-modal" role="dialog" aria-modal="true" aria-label="Edit profile" onClick={(event) => event.stopPropagation()}>
            <div className="edit-profile-head">
              <div>
                <h2>Edit Profile</h2>
                <p>Update your account and alumni details.</p>
              </div>
              <button type="button" className="edit-profile-close" onClick={() => closeEditProfile()} disabled={isSavingProfile} aria-label="Close edit profile">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {editSubmitError && <div className="edit-profile-error">{editSubmitError}</div>}

            <form className="edit-profile-form" onSubmit={handleSaveProfile}>
              <div className="edit-avatar-row">
                <img src={profileImagePreview || DEFAULT_AVATAR} alt="Profile preview" />
                <label className="edit-avatar-control">
                  <span>Profile Image</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleProfileImageChange} disabled={isSavingProfile} />
                  <small>JPG, PNG, or WEBP. Max 5MB.</small>
                  {editErrors.avatar && <em>{editErrors.avatar}</em>}
                </label>
              </div>

              <div className="edit-profile-grid">
                <label className="edit-field">
                  <span>Full Name</span>
                  <input name="name" value={editForm.name} onChange={handleEditFieldChange} disabled={isSavingProfile} />
                  {editErrors.name && <em>{editErrors.name}</em>}
                </label>

                <label className="edit-field">
                  <span>Email</span>
                  <input name="email" type="email" value={editForm.email} onChange={handleEditFieldChange} disabled={isSavingProfile} />
                  {editErrors.email && <em>{editErrors.email}</em>}
                </label>

                <label className="edit-field">
                  <span>Phone Number</span>
                  <input name="phone" value={editForm.phone} onChange={handleEditFieldChange} disabled={isSavingProfile} />
                  {editErrors.phone && <em>{editErrors.phone}</em>}
                </label>

                <label className="edit-field">
                  <span>Batch</span>
                  <input name="batchYear" value={editForm.batchYear} onChange={handleEditFieldChange} disabled={isSavingProfile} placeholder="Batch year" />
                </label>

                <label className="edit-field">
                  <span>JNV / School</span>
                  <input name="jnvSchool" value={editForm.jnvSchool} onChange={handleEditFieldChange} disabled={isSavingProfile} />
                </label>

                <label className="edit-field">
                  <span>Graduation / Alumni Details</span>
                  <input name="graduationYear" value={editForm.graduationYear} onChange={handleEditFieldChange} disabled={isSavingProfile} placeholder="Graduation year or alumni details" />
                </label>

                <label className="edit-field edit-field-wide">
                  <span>Address</span>
                  <input name="address" value={editForm.address} onChange={handleEditFieldChange} disabled={isSavingProfile} />
                </label>

                <label className="edit-field">
                  <span>City</span>
                  <input name="city" value={editForm.city} onChange={handleEditFieldChange} disabled={isSavingProfile} />
                </label>

                <label className="edit-field">
                  <span>State</span>
                  <input name="state" value={editForm.state} onChange={handleEditFieldChange} disabled={isSavingProfile} />
                </label>

                <label className="edit-field">
                  <span>Pincode</span>
                  <input name="pincode" value={editForm.pincode} onChange={handleEditFieldChange} disabled={isSavingProfile} />
                  {editErrors.pincode && <em>{editErrors.pincode}</em>}
                </label>
              </div>

              <div className="edit-profile-actions">
                <button type="button" className="btn-secondary" onClick={() => closeEditProfile()} disabled={isSavingProfile}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSavingProfile}>
                  {isSavingProfile ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Saving
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <style>{`
        .user-panel {
          background: #f0f0f0;
          min-height: 100vh;
          padding-bottom: 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .user-panel-hero {
          padding: 1.25rem 0;
          background: #000000;
        }

        .hero-content.profile-card {
          background: #ffffff;
          color: #111827;
          border: 1px solid #e5e5e5;
          border-radius: 1rem;
          padding: 1rem 1.15rem;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 1.1rem;
        }

        .hero-user {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
          max-width: 100%;
        }

        .avatar-frame {
          flex: 0 0 auto;
          width: 108px;
          height: 108px;
          border-radius: 50%;
          padding: 5px;
          background: #ffffff;
          border: 2px solid #000000;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          border: 2px solid #f3f4f6;
        }

        .hero-user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
          min-width: 0;
          color: #111827;
          text-align: left;
          mix-blend-mode: normal;
          isolation: isolate;
        }

        .profile-card .hero-user-info,
        .profile-card .hero-user-info * {
          -webkit-text-fill-color: currentColor;
          background-clip: border-box;
          -webkit-background-clip: border-box;
          text-shadow: none;
          mix-blend-mode: normal;
        }

        .profile-kicker {
          color: #4b5563;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0;
          line-height: 1;
          margin: 0 0 0.35rem;
        }

        h1 {
          margin: 0;
          color: #000000;
        }

        .hero-user-info h1 {
          max-width: 100%;
          color: #0f172a;
          font-size: clamp(1.7rem, 2.5vw, 2.25rem);
          font-weight: 900;
          line-height: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 0;
          margin: 0 0 0.55rem;
        }

        .subtitle {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
          margin: 0;
          color: #374151;
          font-weight: 800;
          font-size: 0.95rem;
          line-height: 1.2;
          min-height: 0;
          margin-bottom: 0.45rem;
        }

        .subtitle i {
          color: #000000;
        }

        .profile-dot {
          display: inline-flex;
          align-items: center;
          padding: 0.18rem 0.55rem;
          border-radius: 999px;
          background: #f0f0f0;
          color: #000000;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .submeta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin: 0;
          color: #64748b;
          font-weight: 700;
          font-size: 0.9rem;
          line-height: 1.2;
          min-height: 0;
        }

        .submeta span {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          min-width: 0;
          max-width: 100%;
        }

        .submeta i {
          color: #333333;
        }

        .hero-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.55rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .btn-primary, .btn-secondary {
          border: none;
          border-radius: 0.65rem;
          font-weight: 800;
          cursor: pointer;
          padding: 0.68rem 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
          text-decoration: none;
          min-height: 42px;
        }

        .btn-primary {
          background: #000000;
          color: #ffffff;
        }

        .btn-primary:hover,
        .btn-primary:focus-visible {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
          background: #333333;
        }

        .btn-primary:active,
        .btn-secondary:active,
        .btn-logout:active {
          transform: translateY(0);
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #000000;
          border: 2px solid #000000;
        }

        .btn-secondary:hover,
        .btn-secondary:focus-visible {
          background: #000000;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.22);
        }

        .btn-primary:focus-visible,
        .btn-secondary:focus-visible,
        .btn-logout:focus-visible {
          outline: 3px solid rgba(0, 0, 0, 0.18);
          outline-offset: 2px;
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
          background: #ffffff;
          border: 2px solid #e0e0e0;
          border-radius: 1rem;
          padding: 0.9rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #000000;
          font-weight: 700;
          transition: all 0.2s ease;
          text-align: left;
        }

        .side-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
          border-color: #000000;
        }

        .side-link.active {
          background: #f0f0f0;
          border-color: #000000;
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
          border: 2px solid #e0e0e0;
          background: #f9f9f9;
          border-radius: 1rem;
          padding: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 1rem;
          background: #000000;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-value {
          color: #000000;
          font-weight: 900;
          line-height: 1.1;
        }

        .stat-label {
          color: #666666;
          font-weight: 700;
          font-size: 0.8rem;
          margin-top: 0.1rem;
        }

        .sidebar-card {
          margin-top: 0.75rem;
          background: #ffffff;
          border: 2px solid #e0e0e0;
          border-radius: 1.5rem;
          padding: 1rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
        }

        .mini-stat {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
          color: #666666;
          font-weight: 600;
        }

        .mini-stat-value {
          color: #000000;
          font-weight: 800;
        }

        .mini-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .mini-btn {
          background: #f0f0f0;
          border: 2px solid #e0e0e0;
          border-radius: 0.75rem;
          padding: 0.6rem 0.75rem;
          font-weight: 700;
          color: #000000;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .mini-btn:hover {
          background: #000000;
          color: #ffffff;
          border-color: #000000;
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
          background: #ffffff;
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2);
          border: 2px solid #e0e0e0;
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
          color: #000000;
          font-size: 1.25rem;
        }

        .ghost {
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 700;
          color: #000000;
          text-decoration: none;
        }

        .ghost:hover {
          text-decoration: underline;
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
          border: 2px solid #e0e0e0;
          background: #f9f9f9;
          border-radius: 1rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #000000;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .quick-link:hover {
          transform: translateY(-2px);
          border-color: #000000;
          background: #000000;
          color: #ffffff;
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
          color: #000000;
        }

        .order-meta {
          color: #666666;
          font-weight: 600;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .muted {
          color: #666666;
          font-weight: 600;
        }

        .strong {
          color: #000000;
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
          background: #666666;
          color: #ffffff;
        }

        .badge.shipped {
          background: #333333;
          color: #fff;
        }

        .badge.out {
          background: #000000;
          color: #fff;
        }

        .badge.delivered {
          background: #000000;
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
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
          border-radius: 1.5rem;
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
          border: 2px solid #e0e0e0;
          background: #f9f9f9;
          border-radius: 1.5rem;
          padding: 1.25rem;
        }

        .address.default {
          border-color: #000000;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
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
          color: #000000;
        }

        .btn-logout {
          background: #333333;
          color: white;
          border: 1px solid #333333;
          padding: 0.68rem 1rem;
          border-radius: 0.65rem;
          min-height: 42px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }

        .btn-logout:hover,
        .btn-logout:focus-visible {
          background: #000000;
          border-color: #000000;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .edit-profile-backdrop {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 32px 16px;
          background: rgba(0, 0, 0, 0.58);
          overflow-y: auto;
        }

        .edit-profile-modal {
          width: min(100%, 820px);
          background: #ffffff;
          border-radius: 1rem;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
          padding: 1.5rem;
        }

        .edit-profile-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .edit-profile-head h2 {
          margin: 0;
          color: #000000;
          font-size: 1.45rem;
        }

        .edit-profile-head p {
          margin: 0.35rem 0 0;
          color: #666666;
          font-weight: 600;
        }

        .edit-profile-close {
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 0.65rem;
          background: #f0f0f0;
          color: #000000;
          cursor: pointer;
        }

        .edit-profile-error {
          margin-bottom: 1rem;
          padding: 0.8rem 1rem;
          border-radius: 0.75rem;
          background: #fef2f2;
          color: #991b1b;
          font-weight: 700;
        }

        .edit-profile-form {
          display: grid;
          gap: 1rem;
        }

        .edit-avatar-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 1rem;
          background: #f9f9f9;
        }

        .edit-avatar-row img {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #000000;
          flex: 0 0 auto;
        }

        .edit-avatar-control {
          display: grid;
          gap: 0.35rem;
          color: #000000;
          font-weight: 800;
        }

        .edit-avatar-control input {
          max-width: 100%;
        }

        .edit-avatar-control small,
        .edit-field em,
        .edit-avatar-control em {
          color: #991b1b;
          font-size: 0.8rem;
          font-style: normal;
          font-weight: 700;
        }

        .edit-avatar-control small {
          color: #666666;
        }

        .edit-profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.9rem;
        }

        .edit-field {
          display: grid;
          gap: 0.4rem;
        }

        .edit-field-wide {
          grid-column: 1 / -1;
        }

        .edit-field span {
          color: #000000;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .edit-field input {
          width: 100%;
          min-height: 44px;
          border: 2px solid #e0e0e0;
          border-radius: 0.75rem;
          padding: 0.7rem 0.85rem;
          font: inherit;
        }

        .edit-field input:focus {
          outline: none;
          border-color: #000000;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
        }

        .edit-profile-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

.default-pill {
          margin-left: 0.5rem;
          background: #000000;
          border: none;
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 900;
          color: #ffffff;
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
          border: 2px dashed #e0e0e0;
          border-radius: 1.5rem;
          text-align: center;
          color: #666666;
        }

        .empty i {
          font-size: 1.5rem;
          color: #000000;
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
          border-radius: 1rem;
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
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
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
          border-radius: 1.5rem;
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
          border: 2px solid #e0e0e0;
          background: #f9f9f9;
          border-radius: 1.5rem;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .support-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
          border-color: #000000;
          background: #000000;
          color: #ffffff;
        }

        .support-icon {
          width: 44px;
          height: 44px;
          border-radius: 1rem;
          background: #000000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .support-icon.whatsapp {
          background: #000000;
        }

        .support-title {
          font-weight: 900;
          color: #000000;
          margin-bottom: 0.25rem;
        }

        @media (max-width: 1024px) {
          .hero-content.profile-card {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .hero-actions {
            justify-content: flex-start;
          }

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

        @media (prefers-color-scheme: dark) {
          .hero-content.profile-card {
            background: #ffffff;
            color: #111827;
          }

          .profile-card .profile-kicker {
            color: #4b5563;
          }

          .profile-card .hero-user-info h1 {
            color: #0f172a;
          }

          .profile-card .subtitle {
            color: #374151;
          }

          .profile-card .submeta {
            color: #64748b;
          }
        }

        @media (max-width: 640px) {
          .user-panel-hero {
            padding: 0.85rem 0;
          }

          .hero-content.profile-card {
            padding: 1rem;
            gap: 0.9rem;
            text-align: center;
          }

          .hero-user {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.8rem;
          }

          .avatar-frame {
            width: 104px;
            height: 104px;
          }

          .hero-user-info h1 {
            white-space: normal;
          }

          .hero-user-info {
            text-align: center;
          }

          .subtitle,
          .submeta {
            justify-content: center;
          }

          .submeta span {
            justify-content: center;
            overflow-wrap: anywhere;
          }

          .hero-actions,
          .edit-profile-actions {
            width: 100%;
            flex-direction: column;
          }

          .hero-actions .btn-primary,
          .hero-actions .btn-secondary,
          .hero-actions .btn-logout,
          .edit-profile-actions .btn-primary,
          .edit-profile-actions .btn-secondary {
            width: 100%;
            justify-content: center;
          }

          .edit-profile-backdrop {
            padding: 12px 10px;
          }

          .edit-profile-modal {
            padding: 1rem;
            border-radius: 0.85rem;
          }

          .edit-avatar-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .edit-profile-grid {
            grid-template-columns: 1fr;
          }

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

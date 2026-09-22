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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');

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

  const navItems = [
    { key: 'overview', label: 'Dashboard', icon: 'fa-gauge-high' },
    { key: 'orders', label: 'My Orders', icon: 'fa-box', badge: orders.length > 0 ? orders.length : null },
    { key: 'designs', label: 'My Designs', icon: 'fa-palette' },
    { key: 'brand-kits', label: 'My Brand Kits', icon: 'fa-briefcase' },
    { key: 'quotes', label: 'My Quotes / Bulk Orders', icon: 'fa-file-invoice-dollar' },
    { key: 'wishlist', label: 'Wishlist', icon: 'fa-heart' },
    { key: 'addresses', label: 'Addresses', icon: 'fa-location-dot' },
    { key: 'account', label: 'Account Settings', icon: 'fa-gear' },
    { key: 'support', label: 'Contact Support', icon: 'fa-headset' }
  ];

  return (
    <div className="era-dashboard">
      <aside className="era-sidebar">
        <div className="era-sidebar-inner">
          <div className="era-profile-card">
            <div className="era-avatar-ring">
              <img className="era-avatar" src={user.avatar} alt="User" />
            </div>
            <div className="era-profile-info">
              <h3 className="era-profile-name">{user.firstName || 'Navodayan'} {user.lastName || 'User'}</h3>
              <p className="era-profile-email">{user.email || 'no-email@example.com'}</p>
              <span className="era-user-badge">
                <i className="fas fa-user-check"></i> Verified Member
              </span>
            </div>
          </div>

          <nav className="era-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`era-nav-link ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => {
                  if (item.key === 'quotes') {
                    navigate('/my-bulk-orders');
                  } else {
                    setActiveTab(item.key);
                  }
                }}
              >
                <i className={`fas ${item.icon} era-nav-icon`}></i>
                <span className="era-nav-label">{item.label}</span>
                {item.badge !== null && <span className="era-nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="era-sidebar-footer">
          <button className="era-logout-btn" onClick={handleLogout}>
            <i className="fas fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="era-main">
        <div className="era-main-inner">

          {activeTab === 'overview' && (
            <div className="era-tab-content">
              <div className="era-welcome-header">
                <div>
                  <h1 className="era-welcome-title">Welcome back, {user.firstName || 'Navodayan'}! 👋</h1>
                  <p className="era-welcome-subtitle">Here's what's happening with your orders, designs, and brand kits today.</p>
                </div>
                <div className="era-welcome-actions">
                  <button className="era-btn era-btn-outline" onClick={openEditProfile}>
                    <i className="fas fa-user-edit"></i> Edit Profile
                  </button>
                  <button className="era-btn era-btn-primary" onClick={() => navigate('/tshirts')}>
                    <i className="fas fa-bag-shopping"></i> Shop Now
                  </button>
                </div>
              </div>

              <div className="era-stat-grid">
                <div className="era-stat-card">
                  <div className="era-stat-icon era-stat-icon-red">
                    <i className="fas fa-box"></i>
                  </div>
                  <div className="era-stat-content">
                    <div className="era-stat-value">{orders.length}</div>
                    <div className="era-stat-label">Total Orders</div>
                  </div>
                </div>
                <div className="era-stat-card">
                  <div className="era-stat-icon era-stat-icon-black">
                    <i className="fas fa-palette"></i>
                  </div>
                  <div className="era-stat-content">
                    <div className="era-stat-value">0</div>
                    <div className="era-stat-label">Saved Designs</div>
                  </div>
                </div>
                <div className="era-stat-card">
                  <div className="era-stat-icon era-stat-icon-red">
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <div className="era-stat-content">
                    <div className="era-stat-value">0</div>
                    <div className="era-stat-label">Brand Kits</div>
                  </div>
                </div>
                <div className="era-stat-card">
                  <div className="era-stat-icon era-stat-icon-black">
                    <i className="fas fa-heart"></i>
                  </div>
                  <div className="era-stat-content">
                    <div className="era-stat-value">{wishlistCount}</div>
                    <div className="era-stat-label">Wishlist Items</div>
                  </div>
                </div>
              </div>

              <div className="era-section">
                <div className="era-section-header">
                  <h2 className="era-section-title">Recent Orders</h2>
                  <button className="era-text-link" onClick={() => setActiveTab('orders')}>
                    View All <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
                <div className="era-recent-orders">
                  {!latestOrder ? (
                    <div className="era-empty">
                      <i className="fas fa-box-open"></i>
                      <p>No orders yet.</p>
                      <Link className="era-btn era-btn-primary" to="/tshirts">Start Shopping</Link>
                    </div>
                  ) : (
                    orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="era-order-row-card">
                        <div className="era-order-row-info">
                          <div className="era-order-id">#{o.id.slice(-8).toUpperCase()}</div>
                          <div className="era-order-meta">{o.date}</div>
                        </div>
                        <div className="era-order-row-items">{o.items} items</div>
                        <div className="era-order-row-amount">₹{o.total}</div>
                        <span className={`era-badge era-badge-${statusBadgeClass(o.status)}`}>{o.status}</span>
                        <button className="era-view-link" onClick={() => navigate(`/order/${o.id}`)}>
                          View <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="era-quick-section">
                <div className="era-section-header">
                  <h2 className="era-section-title">Quick Actions</h2>
                </div>
                <div className="era-quick-actions">
                  <button className="era-action-card" onClick={() => setActiveTab('orders')}>
                    <div className="era-action-icon era-action-red">
                      <i className="fas fa-rotate-right"></i>
                    </div>
                    <div className="era-action-title">Reorder</div>
                    <div className="era-action-sub">Buy previous items</div>
                  </button>
                  <button className="era-action-card" onClick={() => navigate('/customize')}>
                    <div className="era-action-icon era-action-black">
                      <i className="fas fa-floppy-disk"></i>
                    </div>
                    <div className="era-action-title">Save Design</div>
                    <div className="era-action-sub">Customize & save</div>
                  </button>
                  <button className="era-action-card" onClick={() => setActiveTab('brand-kits')}>
                    <div className="era-action-icon era-action-red">
                      <i className="fas fa-plus"></i>
                    </div>
                    <div className="era-action-title">Create Kit</div>
                    <div className="era-action-sub">Build a brand kit</div>
                  </button>
                  <button className="era-action-card" onClick={() => navigate('/bulk-order')}>
                    <div className="era-action-icon era-action-black">
                      <i className="fas fa-quote-right"></i>
                    </div>
                    <div className="era-action-title">Request Quote</div>
                    <div className="era-action-sub">Bulk order pricing</div>
                  </button>
                </div>
              </div>

              <div className="era-support-banner">
                <div className="era-support-banner-content">
                  <div className="era-support-icon-wrap">
                    <i className="fas fa-headset"></i>
                  </div>
                  <div>
                    <h3>Need Help with Your Order?</h3>
                    <p>Our support team is available 24/7 to assist you with any questions.</p>
                  </div>
                </div>
                <button className="era-btn era-btn-primary" onClick={() => setActiveTab('support')}>
                  Contact Support <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="era-tab-content">
              <div className="era-page-header">
                <div>
                  <h1 className="era-page-title">My Orders</h1>
                  <p className="era-page-subtitle">Track, manage, and reorder your purchases</p>
                </div>
                <div className="era-page-actions">
                  <button className="era-btn era-btn-outline" onClick={() => navigate('/tshirts')}>
                    <i className="fas fa-bag-shopping"></i> Continue Shopping
                  </button>
                </div>
              </div>

              <div className="era-orders-list">
                {isLoadingOrders ? (
                  <div className="era-loading">Loading your orders...</div>
                ) : orders.length === 0 ? (
                  <div className="era-empty-state">
                    <div className="era-empty-icon era-empty-icon-red">
                      <i className="fas fa-box"></i>
                    </div>
                    <h2>No orders yet</h2>
                    <p>Start exploring our collection and place your first order.</p>
                    <Link className="era-btn era-btn-primary" to="/tshirts">
                      <i className="fas fa-bag-shopping"></i> Start Shopping
                    </Link>
                  </div>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} className="era-order-card">
                      <div className="era-order-card-top">
                        <div>
                          <div className="era-order-card-id">Order #{o.id.slice(-8).toUpperCase()}</div>
                          <div className="era-order-card-date"><i className="fas fa-calendar"></i> {o.date}</div>
                        </div>
                        <span className={`era-badge era-badge-${statusBadgeClass(o.status)}`}>
                          {o.status === 'processing' && <i className="fas fa-hourglass-half"></i>}
                          {o.status === 'shipped' && <i className="fas fa-truck-fast"></i>}
                          {o.status === 'out-for-delivery' && <i className="fas fa-truck"></i>}
                          {o.status === 'delivered' && <i className="fas fa-circle-check"></i>}
                          {o.status}
                        </span>
                      </div>

                      <div className="era-order-card-mid">
                        <div className="era-product-thumbs">
                          {cartItems.length > 0 ? (
                            cartItems.slice(0, 4).map((p, i) => (
                              <img key={i} src={p.image} alt="" className="era-thumb" />
                            ))
                          ) : (
                            <div className="era-thumb-placeholder">
                              <i className="fas fa-shirt"></i>
                            </div>
                          )}
                          {o.items > 4 && <div className="era-thumb-more">+{o.items - 4}</div>}
                        </div>
                        <div className="era-order-card-total">
                          <span className="era-total-label">Total</span>
                          <span className="era-total-amount">₹{o.total}</span>
                        </div>
                      </div>

                      <div className="era-order-card-actions">
                        <button className="era-action-btn" onClick={() => navigate(`/order/${o.id}`)}>
                          <i className="fas fa-eye"></i> View Details
                        </button>
                        <button className="era-action-btn" onClick={() => navigate(`/order/${o.id}`)}>
                          <i className="fas fa-location-dot"></i> Track
                        </button>
                        {o.paymentStatus !== 'paid' && o.paymentMethod !== 'cod' && (
                          <button
                            className="era-action-btn era-action-btn-orange"
                            onClick={() => handleRetryPayment(o.id)}
                          >
                            <i className="fas fa-credit-card"></i> Pay Now
                          </button>
                        )}
                        <button
                          className="era-action-btn"
                          onClick={() => window.open(`${API_URL}/orders/${o.id}/invoice?token=${localStorage.getItem('token')}`, '_blank')}
                        >
                          <i className="fas fa-file-invoice"></i> Invoice
                        </button>
                        <button className="era-action-btn era-action-btn-red">
                          <i className="fas fa-rotate-right"></i> Reorder
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'designs' && (
            <div className="era-tab-content">
              <div className="era-page-header">
                <div>
                  <h1 className="era-page-title">My Designs</h1>
                  <p className="era-page-subtitle">Your saved custom designs</p>
                </div>
                <button className="era-btn era-btn-primary" onClick={() => navigate('/customize')}>
                  <i className="fas fa-plus"></i> New Design
                </button>
              </div>

              <div className="era-designs-grid">
                <div className="era-empty-state">
                  <div className="era-empty-icon era-empty-icon-black">
                    <i className="fas fa-palette"></i>
                  </div>
                  <h2>No saved designs yet</h2>
                  <p>Create and save custom designs for your apparel.</p>
                  <button className="era-btn era-btn-primary" onClick={() => navigate('/customize')}>
                    <i className="fas fa-paint-brush"></i> Start Designing
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand-kits' && (
            <div className="era-tab-content">
              <div className="era-page-header">
                <div>
                  <h1 className="era-page-title">My Brand Kits</h1>
                  <p className="era-page-subtitle">Curated collections for your brand</p>
                </div>
                <button className="era-btn era-btn-primary">
                  <i className="fas fa-plus"></i> New Kit
                </button>
              </div>

              <div className="era-kits-grid">
                <div className="era-empty-state">
                  <div className="era-empty-icon era-empty-icon-red">
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <h2>No brand kits yet</h2>
                  <p>Build custom brand kits with your logo, colors, and designs.</p>
                  <button className="era-btn era-btn-primary">
                    <i className="fas fa-plus"></i> Create Brand Kit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="era-tab-content">
              <div className="era-page-header">
                <div>
                  <h1 className="era-page-title">My Quotes & Bulk Orders</h1>
                  <p className="era-page-subtitle">Track your bulk order quote requests</p>
                </div>
                <button className="era-btn era-btn-primary" onClick={() => navigate('/bulk-order')}>
                  <i className="fas fa-plus"></i> New Quote
                </button>
              </div>

              <div className="era-quotes-list">
                <button className="era-text-link" onClick={() => navigate('/my-bulk-orders')}>
                  <i className="fas fa-arrow-up-right-from-square"></i> View All Bulk Orders on Dedicated Page
                </button>
                <div className="era-empty-state" style={{ marginTop: '24px' }}>
                  <div className="era-empty-icon era-empty-icon-black">
                    <i className="fas fa-file-invoice-dollar"></i>
                  </div>
                  <h2>No quote requests yet</h2>
                  <p>Request a custom quote for bulk orders and special pricing.</p>
                  <button className="era-btn era-btn-primary" onClick={() => navigate('/bulk-order')}>
                    <i className="fas fa-quote-right"></i> Request a Quote
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="era-tab-content">
              <div className="era-page-header">
                <div>
                  <h1 className="era-page-title">Wishlist</h1>
                  <p className="era-page-subtitle">Items you've saved for later</p>
                </div>
                <div className="era-page-actions">
                  {wishlistItems.length > 0 && (
                    <button className="era-btn era-btn-outline" onClick={onClearWishlist}>
                      <i className="fas fa-trash"></i> Clear All
                    </button>
                  )}
                  <button className="era-btn era-btn-primary" onClick={() => navigate('/tshirts')}>
                    <i className="fas fa-bag-shopping"></i> Shop
                  </button>
                </div>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="era-empty-state">
                  <div className="era-empty-icon era-empty-icon-red">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h2>Your wishlist is empty</h2>
                  <p>Save your favorite products for quick access later.</p>
                  <Link className="era-btn era-btn-primary" to="/tshirts">
                    <i className="fas fa-bag-shopping"></i> Browse Products
                  </Link>
                </div>
              ) : (
                <div className="era-wishlist-grid">
                  {wishlistItems.map((p) => (
                    <div key={p.id} className="era-wishlist-card">
                      <div className="era-wishlist-img-wrap">
                        <img src={p.image} alt={p.name} />
                        <span className="era-wishlist-heart">
                          <i className="fas fa-heart"></i>
                        </span>
                      </div>
                      <div className="era-wishlist-info">
                        <h3 className="era-wishlist-name">{p.name}</h3>
                        <div className="era-wishlist-price">₹{p.price}</div>
                      </div>
                      <div className="era-wishlist-actions">
                        <Link className="era-btn era-btn-outline era-btn-sm" to={`/product/${p.id}`}>
                          <i className="fas fa-eye"></i> View
                        </Link>
                        <Link className="era-btn era-btn-primary era-btn-sm" to="/cart">
                          <i className="fas fa-cart-shopping"></i> Cart
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="era-tab-content">
              <div className="era-page-header">
                <div>
                  <h1 className="era-page-title">Addresses</h1>
                  <p className="era-page-subtitle">Manage your shipping and billing addresses</p>
                </div>
                <button className="era-btn era-btn-primary" onClick={() => navigate('/payment')}>
                  <i className="fas fa-plus"></i> Add New Address
                </button>
              </div>

              <div className="era-addresses-grid">
                {addresses.map((a) => (
                  <div key={a.id} className={`era-address-card ${a.isDefault ? 'era-address-default' : ''}`}>
                    <div className="era-address-top">
                      <div className="era-address-type">
                        <i className="fas fa-home"></i>
                        <span>{a.type}</span>
                        {a.isDefault && (
                          <span className="era-default-tag">
                            <i className="fas fa-check"></i> Default
                          </span>
                        )}
                      </div>
                      <div className="era-address-edit">
                        <button className="era-icon-btn" title="Edit">
                          <i className="fas fa-pen"></i>
                        </button>
                        <button className="era-icon-btn era-icon-btn-danger" title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="era-address-body">
                      <div className="era-address-name">{a.name}</div>
                      <div className="era-address-phone"><i className="fas fa-phone"></i> {a.phone || 'Not set'}</div>
                      <div className="era-address-line">{a.addressLine}</div>
                      <div className="era-address-city">{a.city}, {a.state} - {a.pincode}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="era-tab-content">
              <div className="era-page-header">
                <div>
                  <h1 className="era-page-title">Account Settings</h1>
                  <p className="era-page-subtitle">Update your profile and account preferences</p>
                </div>
              </div>

              <div className="era-account-card">
                <div className="era-account-section">
                  <h2 className="era-account-section-title">
                    <i className="fas fa-user"></i> Profile Information
                  </h2>
                  <div className="era-account-profile">
                    <div className="era-account-avatar-wrap">
                      <div className="era-avatar-ring era-avatar-ring-lg">
                        <img className="era-avatar" src={user.avatar} alt="Profile" />
                      </div>
                    </div>
                    <div className="era-account-fields">
                      <div className="era-field-grid">
                        <div className="era-field">
                          <label>First Name</label>
                          <div className="era-field-value">{user.firstName || '—'}</div>
                        </div>
                        <div className="era-field">
                          <label>Last Name</label>
                          <div className="era-field-value">{user.lastName || '—'}</div>
                        </div>
                        <div className="era-field">
                          <label>Email</label>
                          <div className="era-field-value">{user.email || '—'}</div>
                        </div>
                        <div className="era-field">
                          <label>Phone</label>
                          <div className="era-field-value">{user.phone || 'Not set'}</div>
                        </div>
                        <div className="era-field">
                          <label>JNV / School</label>
                          <div className="era-field-value">{user.jnvSchool || 'Not set'}</div>
                        </div>
                        <div className="era-field">
                          <label>Batch Year</label>
                          <div className="era-field-value">{user.batchYear || 'Not set'}</div>
                        </div>
                      </div>
                      <button className="era-btn era-btn-primary" onClick={openEditProfile}>
                        <i className="fas fa-user-edit"></i> Edit Profile
                      </button>
                    </div>
                  </div>
                </div>

                <div className="era-account-divider"></div>

                <div className="era-account-section">
                  <h2 className="era-account-section-title">
                    <i className="fas fa-lock"></i> Change Password
                  </h2>
                  <div className="era-field-grid">
                    <div className="era-field">
                      <label>Current Password</label>
                      <input type="password" className="era-input" placeholder="••••••••" />
                    </div>
                    <div className="era-field"></div>
                    <div className="era-field">
                      <label>New Password</label>
                      <input type="password" className="era-input" placeholder="••••••••" />
                    </div>
                    <div className="era-field">
                      <label>Confirm New Password</label>
                      <input type="password" className="era-input" placeholder="••••••••" />
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <button className="era-btn era-btn-primary">
                      <i className="fas fa-key"></i> Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="era-tab-content">
              <div className="era-page-header">
                <div>
                  <h1 className="era-page-title">Contact Support</h1>
                  <p className="era-page-subtitle">We're here to help with anything you need</p>
                </div>
              </div>

              <div className="era-support-grid">
                <button className="era-support-card" onClick={() => window.open('tel:+9118001234567')}>
                  <div className="era-support-card-icon era-support-red">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="era-support-card-title">Call Support</div>
                  <div className="era-support-card-desc">+91 1800-123-4567</div>
                </button>

                <button className="era-support-card" onClick={() => window.open('mailto:support@navodayatrendz.com?subject=Help%20Request')}>
                  <div className="era-support-card-icon era-support-black">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="era-support-card-title">Email Us</div>
                  <div className="era-support-card-desc">support@navodayatrendz.com</div>
                </button>

                <button className="era-support-card" onClick={() => window.open('https://wa.me/919284490206?text=Hi%2C%20I%20need%20help%20with%20my%20order')}>
                  <div className="era-support-card-icon era-support-red">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div className="era-support-card-title">WhatsApp</div>
                  <div className="era-support-card-desc">Instant chat support</div>
                </button>

                <button className="era-support-card" onClick={() => navigate('/bulk-order')}>
                  <div className="era-support-card-icon era-support-black">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="era-support-card-title">Bulk Order Help</div>
                  <div className="era-support-card-desc">Custom requests & quotes</div>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

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
        * { box-sizing: border-box; }

        .era-dashboard {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: 100vh;
          background: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ============ SIDEBAR ============ */
        .era-sidebar {
          background: #0A0A0A;
          color: #fff;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          border-right: 3px solid #DC2626;
        }

        .era-sidebar-inner {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
        }

        .era-profile-card {
          background: linear-gradient(180deg, rgba(220,38,38,0.1) 0%, rgba(10,10,10,1) 100%);
          border: 1px solid rgba(220,38,38,0.3);
          border-radius: 16px;
          padding: 20px 16px;
          margin-bottom: 28px;
          text-align: center;
        }

        .era-avatar-ring {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #DC2626 0%, #F87171 100%);
          margin: 0 auto 12px;
          box-shadow: 0 0 20px rgba(220,38,38,0.3);
        }

        .era-avatar-ring-lg {
          width: 100px;
          height: 100px;
        }

        .era-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #0A0A0A;
          display: block;
        }

        .era-profile-info {
          min-width: 0;
        }

        .era-profile-name {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
        }

        .era-profile-email {
          margin: 0 0 10px;
          font-size: 12px;
          color: #9CA3AF;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .era-user-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: rgba(220,38,38,0.15);
          border: 1px solid rgba(220,38,38,0.4);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          color: #F87171;
        }

        .era-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .era-nav-link {
          width: 100%;
          background: transparent;
          border: none;
          border-left: 3px solid transparent;
          padding: 12px 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #9CA3AF;
          font-weight: 600;
          font-size: 14px;
          text-align: left;
          border-radius: 8px;
          transition: all 0.18s ease;
        }

        .era-nav-link:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        .era-nav-link.active {
          background: rgba(220,38,38,0.12);
          border-left-color: #DC2626;
          color: #fff;
        }

        .era-nav-link.active .era-nav-icon {
          color: #DC2626;
        }

        .era-nav-icon {
          width: 18px;
          flex-shrink: 0;
          font-size: 15px;
          transition: color 0.18s ease;
        }

        .era-nav-label {
          flex: 1;
          min-width: 0;
        }

        .era-nav-badge {
          background: #DC2626;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          min-width: 20px;
          text-align: center;
        }

        .era-sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .era-logout-btn {
          width: 100%;
          background: transparent;
          border: 1.5px solid rgba(220,38,38,0.5);
          color: #F87171;
          padding: 12px 14px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.18s ease;
        }

        .era-logout-btn:hover {
          background: rgba(220,38,38,0.15);
          border-color: #DC2626;
          color: #fff;
        }

        /* ============ MAIN CONTENT ============ */
        .era-main {
          background: #ffffff;
          min-width: 0;
        }

        .era-main-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px;
        }

        .era-tab-content {
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ============ WELCOME HEADER ============ */
        .era-welcome-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid #E5E7EB;
        }

        .era-welcome-title {
          margin: 0 0 8px;
          font-size: 28px;
          font-weight: 900;
          color: #0A0A0A;
          letter-spacing: -0.5px;
        }

        .era-welcome-subtitle {
          margin: 0;
          font-size: 14px;
          color: #6B7280;
          font-weight: 500;
        }

        .era-welcome-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        /* ============ BUTTONS ============ */
        .era-btn {
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          padding: 11px 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.18s ease;
          text-decoration: none;
          font-size: 14px;
          white-space: nowrap;
        }

        .era-btn-sm {
          padding: 8px 12px;
          font-size: 13px;
          border-radius: 8px;
        }

        .era-btn-primary {
          background: #DC2626;
          color: #fff;
        }

        .era-btn-primary:hover {
          background: #B91C1C;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220,38,38,0.3);
        }

        .era-btn-outline {
          background: #fff;
          color: #0A0A0A;
          border: 1.5px solid #E5E7EB;
        }

        .era-btn-outline:hover {
          border-color: #0A0A0A;
          background: #fafafa;
        }

        /* ============ PAGE HEADER ============ */
        .era-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #E5E7EB;
        }

        .era-page-title {
          margin: 0 0 6px;
          font-size: 26px;
          font-weight: 900;
          color: #0A0A0A;
          letter-spacing: -0.5px;
        }

        .era-page-subtitle {
          margin: 0;
          font-size: 14px;
          color: #6B7280;
          font-weight: 500;
        }

        .era-page-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        /* ============ STAT CARDS ============ */
        .era-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .era-stat-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
        }

        .era-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .era-stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #fff;
          font-size: 22px;
        }

        .era-stat-icon-red {
          background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
          box-shadow: 0 4px 12px rgba(220,38,38,0.3);
        }

        .era-stat-icon-black {
          background: linear-gradient(135deg, #0A0A0A 0%, #374151 100%);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }

        .era-stat-content { min-width: 0; }

        .era-stat-value {
          font-size: 26px;
          font-weight: 900;
          color: #0A0A0A;
          line-height: 1.1;
          margin-bottom: 4px;
        }

        .era-stat-label {
          font-size: 13px;
          color: #6B7280;
          font-weight: 600;
        }

        /* ============ SECTIONS ============ */
        .era-section { margin-bottom: 32px; }
        .era-quick-section { margin-bottom: 32px; }

        .era-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .era-section-title {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #0A0A0A;
        }

        .era-text-link {
          background: none;
          border: none;
          cursor: pointer;
          color: #DC2626;
          font-weight: 700;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: color 0.18s ease;
          padding: 0;
        }

        .era-text-link:hover {
          color: #B91C1C;
        }

        /* ============ RECENT ORDERS ============ */
        .era-recent-orders {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          overflow: hidden;
        }

        .era-order-row-card {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #F3F4F6;
          transition: background 0.15s ease;
        }

        .era-order-row-card:last-child { border-bottom: none; }
        .era-order-row-card:hover { background: #FAFAFA; }

        .era-order-row-info { min-width: 0; }

        .era-order-id {
          font-weight: 800;
          font-size: 14px;
          color: #0A0A0A;
          letter-spacing: 0.3px;
        }

        .era-order-meta {
          font-size: 12px;
          color: #6B7280;
          margin-top: 3px;
          font-weight: 500;
        }

        .era-order-row-items {
          font-size: 14px;
          color: #374151;
          font-weight: 600;
        }

        .era-order-row-amount {
          font-size: 16px;
          font-weight: 900;
          color: #0A0A0A;
        }

        .era-view-link {
          background: none;
          border: none;
          cursor: pointer;
          color: #DC2626;
          font-weight: 800;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border-radius: 6px;
          transition: background 0.15s ease;
        }

        .era-view-link:hover {
          background: rgba(220,38,38,0.08);
        }

        /* ============ BADGES ============ */
        .era-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          text-transform: capitalize;
          letter-spacing: 0.3px;
        }

        .era-badge-processing {
          background: #FEF3C7;
          color: #92400E;
        }

        .era-badge-shipped {
          background: #0A0A0A;
          color: #fff;
        }

        .era-badge-out {
          background: #DC2626;
          color: #fff;
        }

        .era-badge-delivered {
          background: #059669;
          color: #fff;
        }

        .era-badge-cancelled {
          background: #E5E7EB;
          color: #4B5563;
        }

        /* ============ QUICK ACTIONS ============ */
        .era-quick-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .era-action-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 24px 18px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .era-action-card:hover {
          transform: translateY(-2px);
          border-color: #DC2626;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .era-action-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          margin-bottom: 14px;
        }

        .era-action-red {
          background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
        }

        .era-action-black {
          background: linear-gradient(135deg, #0A0A0A 0%, #374151 100%);
        }

        .era-action-title {
          font-size: 15px;
          font-weight: 800;
          color: #0A0A0A;
          margin-bottom: 4px;
        }

        .era-action-sub {
          font-size: 12px;
          color: #6B7280;
          font-weight: 500;
        }

        /* ============ SUPPORT BANNER ============ */
        .era-support-banner {
          background: linear-gradient(135deg, #0A0A0A 0%, #1F2937 100%);
          border-radius: 20px;
          padding: 28px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 16px;
        }

        .era-support-banner-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .era-support-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 24px;
          flex-shrink: 0;
        }

        .era-support-banner h3 {
          margin: 0 0 6px;
          color: #fff;
          font-size: 18px;
          font-weight: 800;
        }

        .era-support-banner p {
          margin: 0;
          color: #9CA3AF;
          font-size: 14px;
        }

        /* ============ EMPTY STATE ============ */
        .era-empty {
          padding: 48px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          border-top: none;
        }

        .era-empty i {
          font-size: 36px;
          color: #9CA3AF;
        }

        .era-empty p {
          margin: 0;
          color: #6B7280;
          font-weight: 600;
        }

        .era-empty-state {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 56px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .era-empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin-bottom: 12px;
          color: #fff;
        }

        .era-empty-icon-red {
          background: linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(220,38,38,0.25) 100%);
          color: #DC2626;
        }

        .era-empty-icon-black {
          background: linear-gradient(135deg, rgba(10,10,10,0.08) 0%, rgba(10,10,10,0.15) 100%);
          color: #0A0A0A;
        }

        .era-empty-state h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: #0A0A0A;
        }

        .era-empty-state p {
          margin: 0;
          color: #6B7280;
          font-size: 14px;
          max-width: 360px;
        }

        .era-empty-state > *:last-child {
          margin-top: 12px;
        }

        .era-loading {
          padding: 48px;
          text-align: center;
          color: #6B7280;
          font-weight: 600;
        }

        /* ============ ORDER CARD ============ */
        .era-orders-list {
          display: grid;
          gap: 20px;
        }

        .era-order-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .era-order-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .era-order-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          border-bottom: 1px solid #F3F4F6;
          background: #FAFAFA;
        }

        .era-order-card-id {
          font-size: 16px;
          font-weight: 900;
          color: #0A0A0A;
          letter-spacing: 0.5px;
        }

        .era-order-card-date {
          margin-top: 5px;
          font-size: 13px;
          color: #6B7280;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .era-order-card-mid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 20px 24px;
          border-bottom: 1px solid #F3F4F6;
        }

        .era-product-thumbs {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .era-thumb {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          object-fit: cover;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .era-thumb-placeholder {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9CA3AF;
          font-size: 22px;
        }

        .era-thumb-more {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          background: #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #374151;
          font-size: 14px;
        }

        .era-order-card-total {
          text-align: right;
        }

        .era-total-label {
          display: block;
          font-size: 12px;
          color: #6B7280;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .era-total-amount {
          font-size: 24px;
          font-weight: 900;
          color: #DC2626;
          letter-spacing: -0.5px;
        }

        .era-order-card-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 16px 24px;
        }

        .era-action-btn {
          background: #fff;
          border: 1.5px solid #E5E7EB;
          border-radius: 8px;
          padding: 9px 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-weight: 700;
          font-size: 13px;
          color: #374151;
          transition: all 0.18s ease;
        }

        .era-action-btn:hover {
          border-color: #0A0A0A;
          color: #0A0A0A;
        }

        .era-action-btn-red {
          background: #DC2626;
          border-color: #DC2626;
          color: #fff;
        }

        .era-action-btn-red:hover {
          background: #B91C1C;
          border-color: #B91C1C;
          color: #fff;
        }

        .era-action-btn-orange {
          background: #D97706;
          border-color: #D97706;
          color: #fff;
        }

        .era-action-btn-orange:hover {
          background: #B45309;
          border-color: #B45309;
          color: #fff;
        }

        /* ============ GRIDS ============ */
        .era-designs-grid,
        .era-kits-grid {
          display: grid;
          gap: 20px;
        }

        .era-wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .era-wishlist-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .era-wishlist-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .era-wishlist-img-wrap {
          position: relative;
          background: #F3F4F6;
          aspect-ratio: 1;
        }

        .era-wishlist-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .era-wishlist-heart {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(220,38,38,0.12);
          color: #DC2626;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          backdrop-filter: blur(4px);
        }

        .era-wishlist-info {
          padding: 14px 16px 0;
          flex: 1;
        }

        .era-wishlist-name {
          margin: 0 0 6px;
          font-size: 14px;
          font-weight: 800;
          color: #0A0A0A;
          line-height: 1.3;
        }

        .era-wishlist-price {
          font-size: 16px;
          font-weight: 900;
          color: #DC2626;
        }

        .era-wishlist-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 12px 16px 16px;
        }

        /* ============ ADDRESSES ============ */
        .era-addresses-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .era-address-card {
          background: #fff;
          border: 1.5px solid #E5E7EB;
          border-radius: 16px;
          padding: 22px;
          transition: all 0.2s ease;
          position: relative;
        }

        .era-address-card:hover {
          border-color: #9CA3AF;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .era-address-default {
          border-color: #DC2626;
          background: linear-gradient(180deg, rgba(220,38,38,0.03) 0%, #fff 30%);
        }

        .era-address-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .era-address-type {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          color: #0A0A0A;
          font-size: 15px;
        }

        .era-default-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          background: #DC2626;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          border-radius: 999px;
          margin-left: 4px;
        }

        .era-address-edit {
          display: flex;
          gap: 6px;
        }

        .era-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          background: #fff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #6B7280;
          transition: all 0.18s ease;
        }

        .era-icon-btn:hover {
          border-color: #0A0A0A;
          color: #0A0A0A;
        }

        .era-icon-btn-danger:hover {
          border-color: #DC2626;
          color: #DC2626;
        }

        .era-address-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .era-address-name {
          font-weight: 800;
          font-size: 15px;
          color: #0A0A0A;
        }

        .era-address-phone {
          font-size: 13px;
          color: #374151;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .era-address-line,
        .era-address-city {
          font-size: 13px;
          color: #6B7280;
          font-weight: 500;
        }

        /* ============ ACCOUNT SETTINGS ============ */
        .era-account-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 32px;
        }

        .era-account-section + .era-account-section {
          padding-top: 0;
        }

        .era-account-section-title {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 20px;
          font-size: 17px;
          font-weight: 800;
          color: #0A0A0A;
        }

        .era-account-section-title i {
          color: #DC2626;
        }

        .era-account-profile {
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }

        .era-account-avatar-wrap {
          flex-shrink: 0;
        }

        .era-account-fields {
          flex: 1;
          min-width: 0;
        }

        .era-field-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-bottom: 20px;
        }

        .era-field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .era-field-value {
          font-size: 15px;
          font-weight: 700;
          color: #0A0A0A;
          padding: 10px 12px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
        }

        .era-input {
          width: 100%;
          min-height: 42px;
          padding: 10px 12px;
          border: 1.5px solid #E5E7EB;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .era-input:focus {
          outline: none;
          border-color: #DC2626;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
        }

        .era-account-divider {
          height: 1px;
          background: #E5E7EB;
          margin: 28px 0;
        }

        /* ============ SUPPORT GRID ============ */
        .era-support-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .era-support-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 18px;
          padding: 28px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .era-support-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .era-support-card:hover.era-support-card .era-support-card-icon {
          transform: scale(1.08);
        }

        .era-support-card-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 24px;
          margin-bottom: 18px;
          transition: transform 0.2s ease;
        }

        .era-support-red {
          background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
          box-shadow: 0 4px 14px rgba(220,38,38,0.3);
        }

        .era-support-black {
          background: linear-gradient(135deg, #0A0A0A 0%, #374151 100%);
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }

        .era-support-card-title {
          font-size: 17px;
          font-weight: 800;
          color: #0A0A0A;
          margin-bottom: 6px;
        }

        .era-support-card-desc {
          font-size: 14px;
          color: #6B7280;
          font-weight: 500;
        }

        /* ============ EDIT PROFILE MODAL (ORIGINAL STYLES PRESERVED) ============ */
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
          border-color: #DC2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .edit-profile-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
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
          background: #DC2626;
          color: #ffffff;
        }

        .btn-primary:hover,
        .btn-primary:focus-visible {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3);
          background: #B91C1C;
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

        /* ============ QUOTES LIST ============ */
        .era-quotes-list {
          display: flex;
          flex-direction: column;
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 1100px) {
          .era-dashboard {
            grid-template-columns: 1fr;
          }

          .era-sidebar {
            position: static;
            height: auto;
            border-right: none;
            border-bottom: 3px solid #DC2626;
          }

          .era-sidebar-inner {
            padding: 20px;
          }

          .era-sidebar-footer {
            padding: 16px 20px;
          }

          .era-profile-card {
            max-width: 340px;
            margin: 0 auto 24px;
          }

          .era-nav {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }

          .era-stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .era-quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }

          .era-wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .era-order-row-card {
            grid-template-columns: repeat(3, 1fr) auto;
          }

          .era-order-row-items {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .era-main-inner {
            padding: 20px 16px;
          }

          .era-welcome-header {
            flex-direction: column;
            align-items: stretch;
          }

          .era-welcome-actions {
            width: 100%;
          }

          .era-welcome-actions .era-btn {
            flex: 1;
            justify-content: center;
          }

          .era-page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .era-page-actions {
            width: 100%;
          }

          .era-page-actions .era-btn {
            flex: 1;
            justify-content: center;
          }

          .era-stat-grid {
            grid-template-columns: 1fr;
          }

          .era-quick-actions {
            grid-template-columns: 1fr;
          }

          .era-order-row-card {
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            gap: 10px;
          }

          .era-order-row-amount {
            grid-column: 1;
          }

          .era-support-banner {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            padding: 24px 20px;
          }

          .era-support-banner-content {
            flex-direction: column;
          }

          .era-addresses-grid {
            grid-template-columns: 1fr;
          }

          .era-account-profile {
            flex-direction: column;
            align-items: center;
          }

          .era-field-grid {
            grid-template-columns: 1fr;
          }

          .era-wishlist-grid {
            grid-template-columns: 1fr;
          }

          .era-support-grid {
            grid-template-columns: 1fr;
          }

          .era-order-card-top {
            flex-direction: column;
            align-items: stretch;
          }

          .era-order-card-mid {
            flex-direction: column;
            align-items: stretch;
          }

          .era-order-card-total {
            text-align: left;
          }

          .era-nav {
            grid-template-columns: 1fr;
          }

          .edit-profile-grid {
            grid-template-columns: 1fr;
          }

          .edit-avatar-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .edit-profile-actions {
            flex-direction: column;
          }

          .edit-profile-actions .btn-primary,
          .edit-profile-actions .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default UserPanel;

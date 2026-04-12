import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=5';
const VALID_TABS = ['overview', 'profile', 'orders', 'addresses', 'wishlist', 'support'];

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const mapProfileToForm = (profile) => ({
  firstName: profile.firstName || '',
  lastName: profile.lastName || '',
  email: profile.email || '',
  phone: profile.phone || '',
  jnvSchool: profile.jnvSchool || '',
  batchYear: profile.batchYear || '',
  bio: profile.bio || '',
  avatar: profile.avatar || DEFAULT_AVATAR,
  address: profile.address || '',
  city: profile.city || '',
  state: profile.state || '',
  pincode: profile.pincode || '',
});

const UserPanel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalItems } = useCart();
  const { items: wishlistItems, totalItems: wishlistCount, clearWishlist } = useWishlist();
  const { success, error } = useToast();
  const { logout, setUser } = useAuth();

  const queryTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(VALID_TABS.includes(queryTab || '') ? queryTab : 'overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jnvSchool: '',
    batchYear: '',
    bio: '',
    avatar: DEFAULT_AVATAR,
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [profileForm, setProfileForm] = useState(mapProfileToForm(accountData));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const normalizedTab = VALID_TABS.includes(queryTab || '') ? queryTab : 'overview';
    setActiveTab(normalizedTab);
  }, [queryTab]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await api.get('/auth/profile');
        if (result.success && result.data) {
          const user = result.data.user || result.data;
          const nameParts = (user.name || '').trim().split(' ').filter(Boolean);
          const profile = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            jnvSchool: user.jnvSchool || '',
            batchYear: user.batchYear || '',
            bio: user.bio || '',
            avatar: user.avatar || DEFAULT_AVATAR,
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            pincode: user.pincode || '',
          };

          setAccountData(profile);
          setProfileForm(mapProfileToForm(profile));
        }
      } catch (fetchError) {
        console.error('Error fetching profile:', fetchError);
        error('Failed to load your profile');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [error]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await api.get('/orders');
        if (result.success) {
          const mappedOrders = result.data.map((order) => ({
            id: order._id,
            date: new Date(order.created_at).toLocaleDateString('en-IN'),
            fullDate: new Date(order.created_at).toLocaleString('en-IN'),
            status: order.status.toLowerCase(),
            total: order.pricing?.total || 0,
            subtotal: order.pricing?.subtotal || 0,
            discount: order.pricing?.discount || 0,
            shippingFee: order.pricing?.shipping_fee || 0,
            itemsCount: order.items?.length || 0,
            quantity: (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
            paymentMethod: order.payment_info?.method || 'card',
            paymentStatus: order.payment_info?.status || 'PENDING',
            address: order.shipping_address,
            items: order.items || [],
          }));
          setOrders(mappedOrders);
        }
      } catch (fetchError) {
        console.error('Error fetching orders:', fetchError);
        error('Failed to load your orders');
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [error]);

  const latestOrder = useMemo(() => (orders.length ? orders[0] : null), [orders]);

  const addresses = useMemo(() => {
    if (!accountData.firstName && !accountData.address) return [];
    return [{
      id: 'default',
      type: 'Primary Address',
      name: `${accountData.firstName} ${accountData.lastName}`.trim() || 'Primary Contact',
      phone: accountData.phone || 'No phone added',
      addressLine: accountData.address || 'No address set yet',
      city: accountData.city || 'City not set',
      state: accountData.state || 'State not set',
      pincode: accountData.pincode || 'Pincode not set',
      isDefault: true,
    }];
  }, [accountData]);

  const setTab = (tab) => {
    setSearchParams({ tab });
    setActiveTab(tab);
  };

  const statusBadgeClass = (status) => {
    if (status === 'delivered') return 'delivered';
    if (status === 'shipped') return 'shipped';
    if (status === 'cancelled') return 'cancelled';
    if (status === 'pending') return 'pending';
    return 'processing';
  };

  const onClearWishlist = () => {
    clearWishlist();
    success('Wishlist cleared');
  };

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/login');
  };

  const handleProfileInputChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = async () => {
    setIsSavingProfile(true);

    try {
      const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim();
      const result = await api.patch('/auth/profile', {
        name: fullName,
        phone: profileForm.phone,
        avatar: profileForm.avatar,
        bio: profileForm.bio,
        address: profileForm.address,
        city: profileForm.city,
        state: profileForm.state,
        pincode: profileForm.pincode,
        jnvSchool: profileForm.jnvSchool,
        batchYear: profileForm.batchYear,
      });

      if (result.success) {
        const nextProfile = mapProfileToForm(profileForm);
        setAccountData(nextProfile);
        setProfileForm(nextProfile);

        const profileUser = result.data?.user || result.data;
        if (profileUser) {
          setUser(profileUser);
        }

        setIsEditingProfile(false);
        success('Profile updated successfully');
      } else {
        error(result.message || 'Failed to update profile');
      }
    } catch (saveError) {
      console.error('Profile update error:', saveError);
      error(saveError.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const cancelProfileEdit = () => {
    setProfileForm(mapProfileToForm(accountData));
    setIsEditingProfile(false);
  };

  const openOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const renderProfileTab = () => (
    <div className="tab-content">
      <div className="grid account-grid">
        <div className="card profile-main-card">
          <div className="card-head">
            <h2>My Profile</h2>
            <div className="head-actions">
              {!isEditingProfile ? (
                <button className="btn-primary" onClick={() => setIsEditingProfile(true)}>
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
              ) : (
                <>
                  <button className="btn-secondary" onClick={cancelProfileEdit}>
                    <i className="fas fa-times"></i> Cancel
                  </button>
                  <button className="btn-primary" onClick={handleProfileSave} disabled={isSavingProfile}>
                    <i className="fas fa-save"></i> {isSavingProfile ? 'Saving...' : 'Save'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="profile-hero-card">
            <img className="profile-hero-avatar" src={profileForm.avatar || DEFAULT_AVATAR} alt="Profile" />
            <div>
              <h3>{profileForm.firstName || 'Your'} {profileForm.lastName || 'Profile'}</h3>
              <p>{profileForm.email || 'No email available'}</p>
              <span className="profile-chip">{profileForm.jnvSchool || 'Add your JNV school'}</span>
            </div>
          </div>

          <div className="profile-form-grid">
            <div className="form-group-panel">
              <label>First Name</label>
              <input name="firstName" value={profileForm.firstName} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
            <div className="form-group-panel">
              <label>Last Name</label>
              <input name="lastName" value={profileForm.lastName} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
            <div className="form-group-panel">
              <label>Email</label>
              <input name="email" value={profileForm.email} disabled />
            </div>
            <div className="form-group-panel">
              <label>Phone</label>
              <input name="phone" value={profileForm.phone} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
            <div className="form-group-panel">
              <label>JNV School</label>
              <input name="jnvSchool" value={profileForm.jnvSchool} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
            <div className="form-group-panel">
              <label>Batch Year</label>
              <input name="batchYear" value={profileForm.batchYear} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
            <div className="form-group-panel full">
              <label>Bio</label>
              <textarea name="bio" rows="4" value={profileForm.bio} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
            <div className="form-group-panel full">
              <label>Avatar URL</label>
              <input name="avatar" value={profileForm.avatar} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Address & Contact</h2>
          </div>
          <div className="profile-form-grid">
            <div className="form-group-panel full">
              <label>Address</label>
              <input name="address" value={profileForm.address} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
            <div className="form-group-panel">
              <label>City</label>
              <input name="city" value={profileForm.city} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
            <div className="form-group-panel">
              <label>State</label>
              <input name="state" value={profileForm.state} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
            <div className="form-group-panel">
              <label>Pincode</label>
              <input name="pincode" value={profileForm.pincode} onChange={handleProfileInputChange} disabled={!isEditingProfile} />
            </div>
          </div>

          <div className="account-side-stats">
            <div className="mini-stat-panel">
              <span>Orders</span>
              <strong>{orders.length}</strong>
            </div>
            <div className="mini-stat-panel">
              <span>Wishlist</span>
              <strong>{wishlistCount}</strong>
            </div>
            <div className="mini-stat-panel">
              <span>Cart</span>
              <strong>{totalItems}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoadingProfile) {
    return (
      <div className="user-panel">
        <div className="container" style={{ paddingTop: '3rem' }}>
          <div className="card"><div className="loading-state">Loading your account...</div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-panel">
      <section className="user-panel-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-user">
              <img className="avatar" src={accountData.avatar || DEFAULT_AVATAR} alt="User" />
              <div>
                <h1>{accountData.firstName} {accountData.lastName}</h1>
                <p className="subtitle">
                  {accountData.jnvSchool || 'Your JNV School'} {accountData.batchYear ? `• Batch ${accountData.batchYear}` : ''}
                </p>
                <p className="submeta">{accountData.email} {accountData.phone ? `• ${accountData.phone}` : ''}</p>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-secondary" onClick={() => setTab('profile')}>
                <i className="fas fa-user"></i> Edit Profile
              </button>
              <button className="btn-primary" onClick={() => navigate('/payment')}>
                <i className="fas fa-lock"></i> Checkout
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
              <button className={`side-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
                <i className="fas fa-border-all"></i>
                <span>Overview</span>
              </button>
              <button className={`side-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
                <i className="fas fa-user-circle"></i>
                <span>My Profile</span>
              </button>
              <button className={`side-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
                <i className="fas fa-shopping-bag"></i>
                <span>My Orders</span>
              </button>
              <button className={`side-link ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setTab('addresses')}>
                <i className="fas fa-map-marker-alt"></i>
                <span>Addresses</span>
              </button>
              <button className={`side-link ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setTab('wishlist')}>
                <i className="fas fa-heart"></i>
                <span>Wishlist</span>
              </button>
              <button className={`side-link ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setTab('support')}>
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
                  <span className="mini-stat-value">{formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}</span>
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
                  <div className="overview-layout">
                    <div className="overview-main">
                      <div className="card stats-card">
                        <div className="card-head compact">
                          <h2>Overview</h2>
                        </div>
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
                              <div className="stat-value">{formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}</div>
                              <div className="stat-label">Total Spent</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-head">
                          <h2>Latest Order</h2>
                          <button className="ghost" onClick={() => setTab('orders')}>View All</button>
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
                                <div className="order-id">Order #{latestOrder.id.slice(-8).toUpperCase()}</div>
                                <div className="order-meta">{latestOrder.date} • {latestOrder.itemsCount} items</div>
                              </div>
                              <span className={`badge ${statusBadgeClass(latestOrder.status)}`}>{latestOrder.status}</span>
                            </div>
                            <div className="order-row">
                              <span className="muted">Total</span>
                              <span className="strong">{formatCurrency(latestOrder.total)}</span>
                            </div>
                            <div className="order-row">
                              <span className="muted">Payment</span>
                              <span className="strong">{latestOrder.paymentMethod.toUpperCase()} • {latestOrder.paymentStatus}</span>
                            </div>
                            <div className="order-actions">
                              <button className="btn-primary" onClick={() => openOrder(latestOrder.id)}>
                                <i className="fas fa-map-marker-alt"></i> Track
                              </button>
                              <button className="btn-secondary" onClick={() => setTab('orders')}>
                                <i className="fas fa-receipt"></i> Details
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="card">
                        <div className="card-head">
                          <h2>Quick Links</h2>
                        </div>
                        <div className="quick-links">
                          <button className="quick-link" onClick={() => setTab('profile')}>
                            <i className="fas fa-user-edit"></i>
                            <span>Edit Profile</span>
                          </button>
                          <button className="quick-link" onClick={() => setTab('orders')}>
                            <i className="fas fa-box-open"></i>
                            <span>Order History</span>
                          </button>
                          <button className="quick-link" onClick={() => setTab('addresses')}>
                            <i className="fas fa-map-marked-alt"></i>
                            <span>Addresses</span>
                          </button>
                          <Link className="quick-link" to="/wishlist">
                            <i className="fas fa-heart"></i>
                            <span>Wishlist</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="overview-side">
                      <div className="card">
                      <div className="card-head">
                        <h2>Account Snapshot</h2>
                        <button className="ghost" onClick={() => setTab('profile')}>Manage</button>
                      </div>
                      <div className="snapshot-grid">
                        <div className="snapshot-item">
                          <span className="muted">Full Name</span>
                          <strong>{accountData.firstName} {accountData.lastName}</strong>
                        </div>
                        <div className="snapshot-item">
                          <span className="muted">Email</span>
                          <strong>{accountData.email || 'Not added'}</strong>
                        </div>
                        <div className="snapshot-item">
                          <span className="muted">Phone</span>
                          <strong>{accountData.phone || 'Not added'}</strong>
                        </div>
                        <div className="snapshot-item">
                          <span className="muted">Primary Address</span>
                          <strong>{accountData.city || 'Not added'} {accountData.pincode ? `• ${accountData.pincode}` : ''}</strong>
                        </div>
                      </div>
                      </div>

                      <div className="card">
                        <div className="card-head">
                          <h2>Address Summary</h2>
                          <button className="ghost" onClick={() => setTab('addresses')}>Edit</button>
                        </div>
                        {addresses.length === 0 ? (
                          <div className="empty-state">No address added yet.</div>
                        ) : (
                          <div className="snapshot-grid">
                            <div className="snapshot-item">
                              <span className="muted">Recipient</span>
                              <strong>{addresses[0].name}</strong>
                            </div>
                            <div className="snapshot-item">
                              <span className="muted">Phone</span>
                              <strong>{addresses[0].phone}</strong>
                            </div>
                            <div className="snapshot-item">
                              <span className="muted">Address</span>
                              <strong>{addresses[0].addressLine}</strong>
                            </div>
                            <div className="snapshot-item">
                              <span className="muted">Location</span>
                              <strong>{addresses[0].city}, {addresses[0].state} - {addresses[0].pincode}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && renderProfileTab()}

              {activeTab === 'orders' && (
                <div className="tab-content">
                  <div className="card">
                    <div className="card-head">
                      <h2>My Orders</h2>
                      <div className="head-actions">
                        <button className="btn-secondary" onClick={() => navigate('/payment')}>
                          <i className="fas fa-credit-card"></i> Checkout
                        </button>
                      </div>
                    </div>

                    <div className="orders">
                      {isLoadingOrders ? (
                        <div className="loading-state">Loading your orders...</div>
                      ) : orders.length === 0 ? (
                        <div className="empty-state">No orders yet.</div>
                      ) : (
                        orders.map((order) => (
                          <div key={order.id} className="order-card">
                            <div className="order-top">
                              <div>
                                <div className="order-id">Order #{order.id.slice(-8).toUpperCase()}</div>
                                <div className="order-meta">{order.fullDate}</div>
                              </div>
                              <span className={`badge ${statusBadgeClass(order.status)}`}>{order.status}</span>
                            </div>

                            <div className="order-details-grid">
                              <div className="order-detail-box">
                                <span className="muted">Total</span>
                                <strong>{formatCurrency(order.total)}</strong>
                              </div>
                              <div className="order-detail-box">
                                <span className="muted">Items</span>
                                <strong>{order.itemsCount} products • {order.quantity} qty</strong>
                              </div>
                              <div className="order-detail-box">
                                <span className="muted">Payment</span>
                                <strong>{order.paymentMethod.toUpperCase()} • {order.paymentStatus}</strong>
                              </div>
                              <div className="order-detail-box">
                                <span className="muted">Ship To</span>
                                <strong>{order.address?.city || 'Unknown city'} {order.address?.zip_code ? `• ${order.address.zip_code}` : ''}</strong>
                              </div>
                            </div>

                            <div className="order-preview-items">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div key={`${order.id}-${index}`} className="order-preview-chip">
                                  {item.name} x{item.quantity}
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="order-preview-chip muted-chip">+{order.items.length - 2} more</div>
                              )}
                            </div>

                            <div className="order-bottom">
                              <div className="order-amount">
                                <span className="muted">Subtotal</span>
                                <span className="strong">{formatCurrency(order.subtotal)}</span>
                              </div>
                              <div className="order-amount">
                                <span className="muted">Discount</span>
                                <span className="strong">{formatCurrency(order.discount)}</span>
                              </div>
                              <div className="order-cta">
                                <button className="btn-primary" onClick={() => openOrder(order.id)}>
                                  <i className="fas fa-map-marker-alt"></i> Track
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
                      <button className="btn-primary" onClick={() => setTab('profile')}>
                        <i className="fas fa-edit"></i> Edit Address
                      </button>
                    </div>

                    <div className="addresses">
                      {addresses.length === 0 ? (
                        <div className="empty-state">Add your shipping details from the profile tab.</div>
                      ) : (
                        addresses.map((address) => (
                          <div key={address.id} className={`address ${address.isDefault ? 'default' : ''}`}>
                            <div className="address-top">
                              <div className="address-title">
                                <i className="fas fa-home"></i>
                                <span>{address.type}</span>
                                {address.isDefault && (
                                  <span className="default-pill">
                                    <i className="fas fa-check"></i> Default
                                  </span>
                                )}
                              </div>
                              <button className="ghost" onClick={() => setTab('profile')}>Manage</button>
                            </div>
                            <div className="address-body">
                              <div className="strong">{address.name}</div>
                              <div className="muted">{address.phone}</div>
                              <div className="muted">{address.addressLine}</div>
                              <div className="muted">{address.city}, {address.state} - {address.pincode}</div>
                            </div>
                          </div>
                        ))
                      )}
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
                        {wishlistItems.map((product) => (
                          <div key={product.id} className="wishlist-item">
                            <img src={product.image} alt={product.name} />
                            <div className="wishlist-meta">
                              <div className="strong">{product.name}</div>
                              <div className="muted">{formatCurrency(product.price)}</div>
                            </div>
                            <div className="wishlist-actions">
                              <Link className="btn-secondary" to={`/product/${product.id}`}>
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
          transition: all 0.2s ease;
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

        .btn-logout {
          border: none;
          border-radius: var(--radius-lg, 0.75rem);
          background: #ef4444;
          color: white;
          font-weight: 700;
          cursor: pointer;
          padding: 0.75rem 1.25rem;
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
          top: 155px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .panel-content {
          min-width: 0;
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
          transition: all 0.2s ease;
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

        .sidebar-card, .card {
          background: white;
          border-radius: 1.25rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
        }

        .sidebar-card {
          padding: 1rem;
          margin-top: 0.75rem;
        }

        .mini-stat {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .mini-stat-label {
          color: #64748b;
          font-weight: 600;
        }

        .mini-stat-value {
          color: #0f172a;
          font-weight: 700;
        }

        .mini-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .mini-btn {
          flex: 1;
          text-align: center;
          padding: 0.7rem 0.85rem;
          border-radius: 0.85rem;
          background: #eff6ff;
          color: #1d4ed8;
          text-decoration: none;
          font-weight: 700;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          align-items: start;
        }

        .account-grid {
          grid-template-columns: 1.4fr 1fr;
        }

        .overview-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.95fr);
          gap: 1rem;
          align-items: start;
        }

        .overview-main,
        .overview-side {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 0;
        }

        .stats-card {
          padding: 1.25rem;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
        }

        .card {
          padding: 1.25rem;
          height: fit-content;
          align-self: start;
        }

        .card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .card-head h2 {
          margin: 0;
          color: #0f172a;
        }

        .head-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .ghost {
          border: none;
          background: transparent;
          color: #475569;
          cursor: pointer;
          font-weight: 700;
        }

        .quick-links {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.85rem;
        }

        .quick-link {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #0f172a;
          text-decoration: none;
          font-weight: 700;
          cursor: pointer;
        }

        .latest-order, .empty, .empty-state, .loading-state {
          padding: 1rem 0.25rem 0.25rem;
        }

        .empty, .empty-state, .loading-state {
          color: #64748b;
        }

        .order-row, .order-top, .order-bottom {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .order-row + .order-row, .order-bottom {
          margin-top: 1rem;
        }

        .order-id, .strong {
          color: #0f172a;
          font-weight: 800;
        }

        .order-meta, .muted {
          color: #64748b;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.45rem 0.8rem;
          text-transform: capitalize;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .badge.processing {
          background: #e0f2fe;
          color: #075985;
        }

        .badge.pending {
          background: #ffedd5;
          color: #c2410c;
        }

        .badge.shipped {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .badge.delivered {
          background: #dcfce7;
          color: #166534;
        }

        .badge.cancelled {
          background: #fee2e2;
          color: #b91c1c;
        }

        .order-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .list-item, .wishlist-item {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 0.85rem;
        }

        .list-item img, .wishlist-item img {
          width: 56px;
          height: 56px;
          border-radius: 0.85rem;
          object-fit: cover;
        }

        .orders {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-card {
          border: 1px solid #e2e8f0;
          border-radius: 1.15rem;
          padding: 1rem;
          background: linear-gradient(180deg, #ffffff, #f8fafc);
        }

        .order-details-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
          margin: 1rem 0;
        }

        .order-detail-box {
          border: 1px solid #e2e8f0;
          border-radius: 0.9rem;
          background: white;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .order-preview-items {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          margin-bottom: 1rem;
        }

        .order-preview-chip {
          padding: 0.55rem 0.8rem;
          border-radius: 999px;
          background: #eff6ff;
          color: #1e3a8a;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .muted-chip {
          background: #e2e8f0;
          color: #475569;
        }

        .addresses, .support-grid, .wishlist-grid {
          display: grid;
          gap: 1rem;
        }

        .wishlist-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .wishlist-item {
          align-items: stretch;
          flex-direction: column;
        }

        .wishlist-actions {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-top: auto;
        }

        .address {
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 1rem;
          background: #fff;
        }

        .address.default {
          border-color: rgba(47, 74, 103, 0.35);
          background: rgba(47, 74, 103, 0.04);
        }

        .address-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .address-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 700;
          color: #0f172a;
        }

        .default-pill, .profile-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .support-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .support-card {
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          background: #fff;
          padding: 1.15rem;
          cursor: pointer;
          text-align: left;
        }

        .support-icon {
          width: 44px;
          height: 44px;
          border-radius: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #1d4ed8;
          margin-bottom: 0.8rem;
        }

        .support-icon.whatsapp {
          background: #dcfce7;
          color: #15803d;
        }

        .support-title {
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .snapshot-grid, .account-side-stats {
          display: grid;
          gap: 0.8rem;
        }

        .snapshot-item, .mini-stat-panel {
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 0.95rem;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .profile-hero-card {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          border-radius: 1.1rem;
          background: linear-gradient(135deg, #eff6ff, #ffffff);
          margin-bottom: 1rem;
        }

        .profile-hero-avatar {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
        }

        .profile-hero-card h3 {
          margin: 0 0 0.3rem;
          color: #0f172a;
        }

        .profile-hero-card p {
          margin: 0 0 0.5rem;
          color: #64748b;
        }

        .profile-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.95rem;
        }

        .form-group-panel {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .form-group-panel.full {
          grid-column: 1 / -1;
        }

        .form-group-panel label {
          color: #475569;
          font-size: 0.88rem;
          font-weight: 700;
        }

        .form-group-panel input,
        .form-group-panel textarea {
          border: 1px solid #cbd5e1;
          border-radius: 0.9rem;
          padding: 0.85rem 1rem;
          font: inherit;
          background: white;
          color: #0f172a;
        }

        .form-group-panel input:disabled,
        .form-group-panel textarea:disabled {
          background: #f8fafc;
          color: #475569;
        }

        @media (max-width: 1180px) {
          .overview-layout {
            grid-template-columns: 1fr;
          }

          .overview-side {
            order: -1;
          }
        }

        @media (max-width: 1024px) {
          .panel-layout,
          .grid,
          .account-grid,
          .support-grid,
          .wishlist-grid,
          .order-details-grid,
          .profile-form-grid {
            grid-template-columns: 1fr;
          }

          .panel-sidebar {
            position: static;
          }

          .stats {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }

        @media (max-width: 640px) {
          .hero-content,
          .card,
          .sidebar-card {
            padding: 1rem;
          }

          .hero-user,
          .profile-hero-card {
            align-items: flex-start;
          }

          .hero-actions,
          .head-actions,
          .quick-links,
          .order-actions,
          .wishlist-actions {
            width: 100%;
          }

          .btn-primary,
          .btn-secondary,
          .btn-logout {
            width: 100%;
            justify-content: center;
          }

          .overview-layout,
          .overview-main,
          .overview-side {
            gap: 0.85rem;
          }

          .stats,
          .quick-links,
          .snapshot-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserPanel;

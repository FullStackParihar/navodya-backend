import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { success } = useToast();
  const [activeSection, setActiveSection] = useState('personal-info');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Rahul',
    lastName: 'Kumar',
    email: 'rahul.kumar@example.com',
    phone: '+91 98765 43210',
    jnvSchool: 'jnv-delhi',
    batchYear: '2018',
    bio: 'Proud Navodayan working in tech. Love connecting with fellow alumni!',
    avatar: 'https://i.pravatar.cc/150?img=5'
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    success('Profile updated successfully!');
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const renderPersonalInfo = () => (
    <div className="profile-form animate-fadeIn">
      <div className="profile-header-section">
        <div className="avatar-container">
          <div className="avatar-wrapper">
            <img src={profileData.avatar} alt="Profile" className="profile-avatar-large" />
            <div className="avatar-overlay">
              <i className="fas fa-camera"></i>
              <span>Change Photo</span>
            </div>
          </div>
          <div className="avatar-info">
            <h2>{profileData.firstName} {profileData.lastName}</h2>
            <p className="batch-info">JNV Delhi, Batch {profileData.batchYear}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">3</span>
                <span className="stat-label">Addresses</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">₹8,450</span>
                <span className="stat-label">Total Spent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3>Personal Information</h3>
          <button 
            className={`edit-btn ${isEditing ? 'save-mode' : ''}`}
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <i className="fas fa-save"></i> Save Changes
              </>
            ) : (
              <>
                <i className="fas fa-edit"></i> Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="form-grid">
          <div className="form-group animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <label htmlFor="first-name">First Name</label>
            <input 
              type="text" 
              id="first-name" 
              value={profileData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? 'editable' : 'readonly'}
            />
          </div>
          <div className="form-group animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <label htmlFor="last-name">Last Name</label>
            <input 
              type="text" 
              id="last-name" 
              value={profileData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? 'editable' : 'readonly'}
            />
          </div>
          <div className="form-group animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? 'editable' : 'readonly'}
            />
          </div>
          <div className="form-group animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? 'editable' : 'readonly'}
            />
          </div>
          <div className="form-group animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <label htmlFor="jnv-school">JNV School</label>
            <select 
              id="jnv-school" 
              value={profileData.jnvSchool}
              onChange={(e) => handleInputChange('jnvSchool', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? 'editable' : 'readonly'}
            >
              <option value="jnv-delhi">JNV Delhi</option>
              <option value="jnv-mumbai">JNV Mumbai</option>
              <option value="jnv-patna">JNV Patna</option>
              <option value="jnv-kolkata">JNV Kolkata</option>
            </select>
          </div>
          <div className="form-group animate-slideUp" style={{ animationDelay: '0.6s' }}>
            <label htmlFor="batch-year">Batch Year</label>
            <input 
              type="number" 
              id="batch-year" 
              value={profileData.batchYear}
              onChange={(e) => handleInputChange('batchYear', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? 'editable' : 'readonly'}
              min="1986" 
              max="2024" 
            />
          </div>
        </div>

        <div className="form-group bio-section animate-slideUp" style={{ animationDelay: '0.7s' }}>
          <label htmlFor="bio">Bio</label>
          <textarea 
            id="bio" 
            rows="4" 
            value={profileData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            className={isEditing ? 'editable' : 'readonly'}
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => {
    const orders = [
      {
        id: 'NTZ2024001',
        date: 'Jan 15, 2024',
        status: 'delivered',
        total: 1597,
        items: [
          {
            name: 'JNV Classic T-Shirt',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop',
            size: 'M',
            qty: 1,
            price: 399
          },
          {
            name: 'JNV Alumni Hoodie',
            image: 'https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=60&h=60&fit=crop',
            size: 'L',
            qty: 1,
            price: 799
          }
        ]
      },
      {
        id: 'NTZ2024002',
        date: 'Jan 20, 2024',
        status: 'processing',
        total: 549,
        items: [
          {
            name: 'JNV Sports Jersey',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=60&h=60&fit=crop',
            size: 'M',
            qty: 1,
            price: 549
          }
        ]
      }
    ];

    return (
      <div className="orders-container">
        <div className="orders-header">
          <h3>Order History</h3>
          <div className="order-filters">
            <button className="filter-btn active">All Orders</button>
            <button className="filter-btn">Processing</button>
            <button className="filter-btn">Shipped</button>
            <button className="filter-btn">Delivered</button>
          </div>
        </div>
        
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order.id} className="order-card animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="order-header">
                <div className="order-info">
                  <div className="order-id-section">
                    <span className="order-id">Order #{order.id}</span>
                    <span className={`order-status ${order.status}`}>
                      {order.status === 'delivered' ? (
                        <>
                          <i className="fas fa-check-circle"></i> Delivered
                        </>
                      ) : (
                        <>
                          <i className="fas fa-clock"></i> Processing
                        </>
                      )}
                    </span>
                  </div>
                  <span className="order-date">
                    <i className="far fa-calendar"></i> {order.date}
                  </span>
                </div>
                <div className="order-total">
                  <span className="total-label">Total</span>
                  <span className="total-amount">₹{order.total}</span>
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size} | Qty: {item.qty}</p>
                    </div>
                    <div className="item-price">
                      <span>₹{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-actions">
                <button className="action-btn primary">
                  <i className="fas fa-eye"></i> View Details
                </button>
                {order.status === 'processing' && (
                  <button className="action-btn secondary">
                    <i className="fas fa-truck"></i> Track Order
                  </button>
                )}
                {order.status === 'delivered' && (
                  <button className="action-btn secondary">
                    <i className="fas fa-redo"></i> Reorder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAddresses = () => {
    const addresses = [
      {
        id: 1,
        type: 'Home',
        name: 'Rahul Kumar',
        address: '123, Block A, Navodaya Colony',
        city: 'South Delhi, New Delhi',
        state: 'Delhi - 110065',
        phone: '+91 98765 43210',
        isDefault: true
      },
      {
        id: 2,
        type: 'Office',
        name: 'Rahul Kumar',
        address: 'Tech Park, Building 5, 3rd Floor',
        city: 'Whitefield, Bangalore',
        state: 'Karnataka - 560066',
        phone: '+91 98765 43210',
        isDefault: false
      }
    ];

    return (
      <div className="addresses-container">
        <div className="addresses-header">
          <h3>Shipping Addresses</h3>
          <button className="add-address-btn btn-primary">
            <i className="fas fa-plus"></i> Add New Address
          </button>
        </div>
        
        <div className="addresses-grid">
          {addresses.map((address, index) => (
            <div key={address.id} className="address-card animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="address-header">
                <div className="address-type">
                  <i className="fas fa-home"></i>
                  <h4>{address.type}</h4>
                </div>
                {address.isDefault && (
                  <span className="default-badge">
                    <i className="fas fa-check"></i> Default
                  </span>
                )}
              </div>
              
              <div className="address-details">
                <p className="address-name"><strong>{address.name}</strong></p>
                <p className="address-line">{address.address}</p>
                <p className="address-city">{address.city}</p>
                <p className="address-state">{address.state}</p>
                <p className="address-phone">
                  <i className="fas fa-phone"></i> {address.phone}
                </p>
              </div>
              
              <div className="address-actions">
                <button className="action-btn">
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="action-btn">
                  <i className="fas fa-trash"></i> Remove
                </button>
                {!address.isDefault && (
                  <button className="action-btn primary">
                    <i className="fas fa-star"></i> Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="notifications-container">
      <div className="notifications-header">
        <h3>Notification Preferences</h3>
        <p>Choose how you want to receive updates from Navodaya Trendz</p>
      </div>
      
      <div className="notifications-grid">
        <div className="notification-card animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="notification-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="notification-content">
            <h4>Email Notifications</h4>
            <p>Receive updates directly in your inbox</p>
          </div>
          <div className="notification-toggle">
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="notification-card animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="notification-icon">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div className="notification-content">
            <h4>Order Updates</h4>
            <p>Track your orders and delivery status</p>
          </div>
          <div className="notification-toggle">
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="notification-card animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="notification-icon">
            <i className="fas fa-tag"></i>
          </div>
          <div className="notification-content">
            <h4>Special Offers</h4>
            <p>Exclusive discounts and promotional deals</p>
          </div>
          <div className="notification-toggle">
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="notification-card animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <div className="notification-icon">
            <i className="fas fa-tshirt"></i>
          </div>
          <div className="notification-content">
            <h4>New Arrivals</h4>
            <p>Be the first to know about new products</p>
          </div>
          <div className="notification-toggle">
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="notification-card animate-slideUp" style={{ animationDelay: '0.5s' }}>
          <div className="notification-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="notification-content">
            <h4>Alumni Meet Updates</h4>
            <p>Information about alumni gatherings and events</p>
          </div>
          <div className="notification-toggle">
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="notification-card animate-slideUp" style={{ animationDelay: '0.6s' }}>
          <div className="notification-icon">
            <i className="fas fa-bell"></i>
          </div>
          <div className="notification-content">
            <h4>Push Notifications</h4>
            <p>Browser notifications for important updates</p>
          </div>
          <div className="notification-toggle">
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Profile Hero Section */}
      <section className="profile-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="animate-slideDown">My Profile</h1>
            <p className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Manage your account, track orders, and customize your preferences
            </p>
          </div>
        </div>
      </section>

      {/* Profile Main Content */}
      <section className="profile-main-section">
        <div className="container">
          <div className="profile-layout">
            {/* Sidebar Navigation */}
            <aside className="profile-sidebar animate-slideInLeft">
              <nav className="profile-nav">
                <ul>
                  <li>
                    <button 
                      className={`nav-link ${activeSection === 'personal-info' ? 'active' : ''}`}
                      onClick={() => setActiveSection('personal-info')}
                    >
                      <i className="fas fa-user"></i> 
                      <span>Personal Info</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`nav-link ${activeSection === 'orders' ? 'active' : ''}`}
                      onClick={() => setActiveSection('orders')}
                    >
                      <i className="fas fa-shopping-bag"></i> 
                      <span>My Orders</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`nav-link ${activeSection === 'addresses' ? 'active' : ''}`}
                      onClick={() => setActiveSection('addresses')}
                    >
                      <i className="fas fa-map-marker-alt"></i> 
                      <span>Addresses</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`nav-link ${activeSection === 'notifications' ? 'active' : ''}`}
                      onClick={() => setActiveSection('notifications')}
                    >
                      <i className="fas fa-bell"></i> 
                      <span>Notifications</span>
                    </button>
                  </li>
                </ul>
              </nav>

              <div className="sidebar-footer">
                <div className="quick-stats">
                  <div className="stat">
                    <span className="stat-icon">
                      <i className="fas fa-crown"></i>
                    </span>
                    <div className="stat-info">
                      <span className="stat-label">Member Since</span>
                      <span className="stat-value">Jan 2024</span>
                    </div>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">
                      <i className="fas fa-award"></i>
                    </span>
                    <div className="stat-info">
                      <span className="stat-label">Loyalty Points</span>
                      <span className="stat-value">450</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="profile-content">
              <div className={`content-section ${activeSection === 'personal-info' ? 'active' : ''}`}>
                {renderPersonalInfo()}
              </div>

              <div className={`content-section ${activeSection === 'orders' ? 'active' : ''}`}>
                {renderOrders()}
              </div>

              <div className={`content-section ${activeSection === 'addresses' ? 'active' : ''}`}>
                {renderAddresses()}
              </div>

              <div className={`content-section ${activeSection === 'notifications' ? 'active' : ''}`}>
                {renderNotifications()}
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;

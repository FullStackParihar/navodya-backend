import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PrivateRoute from '../components/PrivateRoute';
import { useToast } from '../context/ToastContext';
import './AdminProfile.css';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { success, error, info } = useToast();
  
  // Check if user is admin (you can customize this logic)
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated and is admin
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Check if user is admin (you can customize this logic)
    if (userEmail === 'admin@navodaya.com') {
      setIsAdmin(true);
    } else {
      // Redirect non-admin users away from admin profile
      navigate('/user-profile');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await api.get('/admin/stats');
        if (result.success) {
          setAdminData(prev => ({
            ...prev,
            stats: result.data
          }));
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      }
    };
    if (isAdmin) fetchStats();
  }, [isAdmin]);

  const [adminData, setAdminData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@navodaya.com',
    phone: '+91 98765 43210',
    role: 'Super Administrator',
    department: 'System Administration',
    adminLevel: 'Level 5',
    joinDate: '2024-01-01',
    lastLogin: new Date().toISOString(),
    permissions: [
      'User Management',
      'Order Management', 
      'Content Management',
      'System Settings',
      'Analytics Access',
      'Database Management'
    ],
    stats: {
      totalUsers: 1247,
      activeUsers: 892,
      totalOrders: 5432,
      pendingOrders: 23,
      revenue: 2847500,
      conversionRate: 3.2
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleEdit = () => {
    setEditForm(adminData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Save admin data (in production, save to API/database)
      Object.keys(editForm).forEach(key => {
        localStorage.setItem(`admin${key.charAt(0).toUpperCase() + key.slice(1)}`, editForm[key]);
      });
      
      setAdminData(editForm);
      setIsEditing(false);
      
      success('Admin profile updated successfully!');
    } catch (err) {
      error('Failed to update admin profile');
    }
  };

  const handleCancel = () => {
    setEditForm({});
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleUserManagement = () => {
    info('User Management module coming soon');
  };

  const handleOrderManagement = () => {
    info('Order Management module coming soon');
  };

  const handleSystemSettings = () => {
    info('System Settings module coming soon');
  };

  const handleAnalytics = () => {
    info('Advanced Analytics module coming soon');
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <PrivateRoute>
      <div className="admin-profile">
        <div className="admin-container">
          {/* Admin Header */}
          <div className="admin-header">
            <div className="admin-avatar">
              <div className="avatar-badge">
                <img 
                  src="https://i.pravatar.cc/150?img=5" 
                  alt="Admin" 
                  className="avatar-img"
                />
                <div className="admin-badge-icon">
                  <i className="fas fa-crown"></i>
                </div>
              </div>
              <div className="admin-info">
                <h1 className="admin-title">
                  {adminData.firstName} {adminData.lastName}
                  <span className="admin-role">{adminData.role}</span>
                </h1>
                <div className="admin-meta">
                  <span className="department">{adminData.department}</span>
                  <span className="level">Level {adminData.adminLevel}</span>
                </div>
              </div>
            </div>
            
            {!isEditing && (
              <button className="edit-admin-btn" onClick={handleEdit}>
                <i className="fas fa-edit"></i>
                Edit Admin Profile
              </button>
            )}
          </div>

          <div className="admin-content">
            <div className="admin-layout">
              {/* Admin Information Panel */}
              <aside className="admin-sidebar">
                <div className="admin-card">
                  <h3>Admin Information</h3>
                  {isEditing ? (
                    <div className="edit-form">
                      <div className="form-row">
                        <label>Display Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={editForm.firstName}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-row">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="form-input"
                          disabled
                        />
                      </div>
                      <div className="form-row">
                        <label>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-row">
                        <label>Department</label>
                        <input
                          type="text"
                          name="department"
                          value={editForm.department}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-row">
                        <label>Admin Level</label>
                        <select
                          name="adminLevel"
                          value={editForm.adminLevel}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="1">Level 1 - Basic</option>
                          <option value="2">Level 2 - Intermediate</option>
                          <option value="3">Level 3 - Advanced</option>
                          <option value="4">Level 4 - Expert</option>
                          <option value="5">Level 5 - Super Admin</option>
                        </select>
                      </div>
                      <div className="edit-actions">
                        <button className="save-btn" onClick={handleSave}>
                          <i className="fas fa-save"></i>
                          Save Changes
                        </button>
                        <button className="cancel-btn" onClick={handleCancel}>
                          <i className="fas fa-times"></i>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="view-mode">
                      <div className="info-item">
                        <label>Display Name:</label>
                        <span>{adminData.firstName} {adminData.lastName}</span>
                      </div>
                      <div className="info-item">
                        <label>Email:</label>
                        <span>{adminData.email}</span>
                      </div>
                      <div className="info-item">
                        <label>Phone:</label>
                        <span>{adminData.phone}</span>
                      </div>
                      <div className="info-item">
                        <label>Department:</label>
                        <span>{adminData.department}</span>
                      </div>
                      <div className="info-item">
                        <label>Admin Level:</label>
                        <span>Level {adminData.adminLevel}</span>
                      </div>
                      <div className="info-item">
                        <label>Join Date:</label>
                        <span>{new Date(adminData.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <label>Last Login:</label>
                        <span>{new Date(adminData.lastLogin).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="admin-card">
                  <h3>Quick Actions</h3>
                  <div className="action-grid">
                    <button className="action-btn" onClick={handleUserManagement}>
                      <i className="fas fa-users"></i>
                      User Management
                    </button>
                    <button className="action-btn" onClick={handleOrderManagement}>
                      <i className="fas fa-shopping-bag"></i>
                      Order Management
                    </button>
                    <button className="action-btn" onClick={handleSystemSettings}>
                      <i className="fas fa-cog"></i>
                      System Settings
                    </button>
                    <button className="action-btn" onClick={handleAnalytics}>
                      <i className="fas fa-chart-bar"></i>
                      Analytics
                    </button>
                  </div>
                </div>

                {/* Permissions */}
                <div className="admin-card">
                  <h3>Permissions</h3>
                  <div className="permissions-list">
                    {adminData.permissions.map((permission, index) => (
                      <div key={index} className="permission-item">
                        <i className="fas fa-check-circle"></i>
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content - Statistics Dashboard */}
              <main className="admin-main">
                <div className="stats-dashboard">
                  <h2>System Statistics</h2>
                  
                  <div className="stats-grid">
                    <div className="stat-card primary">
                      <div className="stat-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{adminData.stats.totalUsers}</div>
                        <div className="stat-label">Total Users</div>
                      </div>
                    </div>

                    <div className="stat-card success">
                      <div className="stat-icon">
                        <i className="fas fa-user-check"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{adminData.stats.activeUsers}</div>
                        <div className="stat-label">Active Users</div>
                      </div>
                    </div>

                    <div className="stat-card info">
                      <div className="stat-icon">
                        <i className="fas fa-shopping-bag"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{adminData.stats.totalOrders}</div>
                        <div className="stat-label">Total Orders</div>
                      </div>
                    </div>

                    <div className="stat-card warning">
                      <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{adminData.stats.pendingOrders}</div>
                        <div className="stat-label">Pending Orders</div>
                      </div>
                    </div>

                    <div className="stat-card revenue">
                      <div className="stat-icon">
                        <i className="fas fa-rupee-sign"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">₹{adminData.stats.revenue.toLocaleString()}</div>
                        <div className="stat-label">Total Revenue</div>
                      </div>
                    </div>

                    <div className="stat-card conversion">
                      <div className="stat-icon">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{adminData.stats.conversionRate}%</div>
                        <div className="stat-label">Conversion Rate</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                  <h3>System Status</h3>
                  <div className="status-grid">
                    <div className="status-item online">
                      <div className="status-indicator"></div>
                      <span>System Online</span>
                    </div>
                    <div className="status-item secure">
                      <div className="status-indicator"></div>
                      <span>Security Active</span>
                    </div>
                    <div className="status-item backup">
                      <div className="status-indicator"></div>
                      <span>Last Backup: 2 hours ago</span>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>

          {/* Admin Actions Footer */}
          <div className="admin-actions-footer">
            <button className="logout-admin-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout Admin Panel
            </button>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AdminProfile;

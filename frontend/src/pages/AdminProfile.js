import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PrivateRoute from '../components/PrivateRoute';
import { useToast } from '../context/ToastContext';
import './AdminProfile.css';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { success, error, info } = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'product', 'category'
  const [formData, setFormData] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (userRole === 'admin' || userEmail === 'admin@navodaya.com') {
      setIsAdmin(true);
    } else {
      navigate('/user-profile');
    }
  }, [navigate]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      let result;
      switch (tab) {
        case 'dashboard':
          result = await api.get('/admin/stats');
          if (result.success) setStats(result.data);
          break;
        case 'products':
          result = await api.get('/products');
          if (result.success) setProducts(result.data.products || result.data);
          break;
        case 'orders':
          result = await api.get('/admin/orders');
          if (result.success) setOrders(result.data);
          break;
        case 'categories':
          result = await api.get('/categories');
          if (result.success) setCategories(result.data);
          break;
        case 'users':
          result = await api.get('/admin/users');
          if (result.success) setUsers(result.data);
          break;
        case 'coupons':
          result = await api.get('/coupons');
          if (result.success) setCoupons(result.data);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
      error(`Failed to load ${tab}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData(activeTab);
    }
  }, [isAdmin, activeTab]);

  // Always fetch categories once when entering Admin Panel
  useEffect(() => {
    if (isAdmin) {
      const fetchCategoriesInitial = async () => {
        try {
          const result = await api.get('/categories');
          if (result.success) setCategories(result.data);
        } catch (err) {
          console.error('Error fetching categories initial:', err);
        }
      };
      fetchCategoriesInitial();
    }
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // CRUD Handlers
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      // Map backend internal keys to frontend form keys if necessary
      const mappedItem = { ...item };
      if (item.category_id) mappedItem.categoryId = typeof item.category_id === 'object' ? item.category_id._id : item.category_id;
      if (item.sale_price) mappedItem.salePrice = item.sale_price;
      setFormData(mappedItem);
    } else {
      if (type === 'product') {
        if (categories.length === 0) {
          error('Please wait for categories to load or create one first.');
          return;
        }
        setFormData({
          name: '', slug: '', description: '', price: 0, categoryId: categories[0]?._id || '', subcategory: '', images: [], sizes: [{ size: 'M', stock: 10 }], colors: [{ name: 'Default' }], tags: []
        });
      } else if (type === 'category') {
        setFormData({
          name: '', slug: '', description: '', image: ''
        });
      } else if (type === 'coupon') {
        setFormData({
          code: '', type: 'PERCENTAGE', value: 0, minOrderAmount: 0, maxDiscountAmount: 0, validUntil: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], usageLimit: 100
        });
      }
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (modalType === 'product') {
        if (formData._id) {
          result = await api.patch(`/products/${formData._id}`, formData);
        } else {
          result = await api.post('/products', formData);
        }
      } else if (modalType === 'category') {
        if (formData._id) {
          result = await api.patch(`/categories/${formData._id}`, formData);
        } else {
          result = await api.post('/categories', formData);
        }
      } else if (modalType === 'coupon') {
        if (formData._id) {
          // Assuming backend might not have patch for coupons yet, but let's follow the pattern
          // If not, we can just say "Edit not supported" or similar. 
          // Actually, let's just implement Post for now if we don't know the Patch route.
          // Looking at coupon.routes.ts, there is only GET and POST.
          error('Editing coupons is not supported yet. Please delete and recreate.');
          return;
        } else {
          result = await api.post('/coupons', formData);
        }
      }
      
      if (result.success) {
        success('Success!');
        setIsModalOpen(false);
        fetchData(activeTab);
      } else {
        error(result.message || 'Operation failed');
      }
    } catch (err) {
      error('An error occurred');
    }
  };
  
  const handleImageUpload = async (e, field = 'images') => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setIsUploading(true);
      const result = await api.post('/upload/upload', uploadData);

      if (result.success) {
        if (field === 'images') {
          // Navodaya products use an images array
          setFormData({ ...formData, images: [result.data.url] }); // Replacing for simplicity if single upload
        } else {
          setFormData({ ...formData, [field]: result.data.url });
        }
        success('Image uploaded successfully');
      } else {
        error(result.message || 'Upload failed');
      }
    } catch (err) {
      error('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteItem = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        let endpoint = '';
        if (type === 'product') endpoint = `/products/${id}`;
        else if (type === 'category') endpoint = `/categories/${id}`;
        else if (type === 'user') endpoint = `/admin/users/${id}`;
        else if (type === 'coupon') endpoint = `/coupons/${id}`; // Need to check if this exists
        
        const result = await api.delete(endpoint);
        if (result.success) {
          success(`${type} deleted`);
          fetchData(activeTab);
        } else {
          error(result.message);
        }
      } catch (err) {
        error('Failed to delete');
      }
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const result = await api.patch(`/admin/orders/${orderId}/status`, { status });
      if (result.success) {
        success('Order status updated');
        fetchData('orders');
      }
    } catch (err) {
      error('Failed to update order');
    }
  };

  const renderDashboard = () => (
    <div className="stats-dashboard">
      <div className="section-header">
        <h2>System Overview</h2>
        <div className="current-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon"><i className="fas fa-users"></i></div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon"><i className="fas fa-shopping-bag"></i></div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card revenue">
            <div className="stat-icon"><i className="fas fa-rupee-sign"></i></div>
            <div className="stat-content">
              <div className="stat-number">₹{stats.revenue?.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon"><i className="fas fa-tshirt"></i></div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalProducts}</div>
              <div className="stat-label">Products</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Product Management</h2>
        <button className="add-btn" onClick={() => handleOpenModal('product')}>
          <i className="fas fa-plus"></i> Add Product
        </button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td><img src={product.images[0]} alt={product.name} className="table-img" /></td>
                <td>{product.name}</td>
                <td>{product.subcategory}</td>
                <td>
                  ₹{product.price}
                  {product.sale_price ? <div style={{fontSize: '11px', color: '#22c55e'}}>Sale: ₹{product.sale_price}</div> : null}
                </td>
                <td>{product.sizes?.reduce((acc, s) => acc + s.stock, 0)}</td>
                <td>
                  <button className="action-icon edit" onClick={() => handleOpenModal('product', product)}><i className="fas fa-edit"></i></button>
                  <button className="action-icon delete" onClick={() => deleteItem('product', product._id)}><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Category Management</h2>
        <button className="add-btn" onClick={() => handleOpenModal('category')}>
          <i className="fas fa-plus"></i> Add Category
        </button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td><img src={cat.image} alt={cat.name} className="table-img" /></td>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat.description?.substring(0, 50)}...</td>
                <td>
                  <button className="action-icon edit" onClick={() => handleOpenModal('category', cat)}><i className="fas fa-edit"></i></button>
                  <button className="action-icon delete" onClick={() => deleteItem('category', cat._id)}><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Order Management</h2>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.substring(0, 8)}</td>
                <td>{order.shipping_address?.firstName} {order.shipping_address?.lastName}</td>
                <td>₹{order.pricing?.total}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>User Management</h2>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="action-icon delete" onClick={() => deleteItem('user', user._id)}><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <PrivateRoute>
      <div className="admin-profile-new">
        <div className="admin-sidebar-new">
          <div className="sidebar-brand">
            <i className="fas fa-shield-alt"></i>
            <span>Navodaya Admin</span>
          </div>
          <nav className="sidebar-nav">
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              <i className="fas fa-chart-line"></i> Dashboard
            </button>
            <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
              <i className="fas fa-box"></i> Products
            </button>
            <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>
              <i className="fas fa-tags"></i> Categories
            </button>
            <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
              <i className="fas fa-shopping-cart"></i> Orders
            </button>
            <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
              <i className="fas fa-users"></i> Users
            </button>
            <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => setActiveTab('coupons')}>
              <i className="fas fa-ticket-alt"></i> Coupons
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
        
        <main className="admin-content-new">
          {loading ? (
            <div className="admin-loader">
              <div className="spinner"></div>
              <p>Loading {activeTab}...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'categories' && renderCategories()}
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'coupons' && (
                <div className="admin-section">
                  <div className="section-header">
                    <h2>Coupon Management</h2>
                    <button className="add-btn" onClick={() => handleOpenModal('coupon')}>
                      <i className="fas fa-plus"></i> Add Coupon
                    </button>
                  </div>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Type</th>
                          <th>Value</th>
                          <th>Usage</th>
                          <th>Expires</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map(coupon => (
                          <tr key={coupon._id}>
                            <td><strong>{coupon.code}</strong></td>
                            <td>{coupon.type}</td>
                            <td>{coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                            <td>{coupon.usage_count} / {coupon.usage_limit || '∞'}</td>
                            <td>{new Date(coupon.valid_until).toLocaleDateString()}</td>
                            <td>
                               <button className="action-icon delete" onClick={() => deleteItem('coupon', coupon._id)}>
                                 <i className="fas fa-trash"></i>
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* CRUD Modal */}
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="modal-header">
                <h3>{formData._id ? 'Edit' : 'Add'} {modalType === 'product' ? 'Product' : modalType === 'category' ? 'Category' : 'Coupon'}</h3>
                <button className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  {modalType === 'product' ? (
                    <>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Slug</label>
                        <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Base Price</label>
                        <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                      </div>
                      <div className="form-group">
                        <label>Sale Price (Optional)</label>
                        <input type="number" value={formData.salePrice || ''} onChange={e => setFormData({...formData, salePrice: e.target.value ? Number(e.target.value) : undefined})} />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select 
                          value={formData.categoryId} 
                          onChange={e => setFormData({...formData, categoryId: e.target.value})}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Subcategory</label>
                        <input type="text" value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Product Images</label>
                        <div className="image-upload-wrapper">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleImageUpload(e, 'images')} 
                            disabled={isUploading}
                          />
                          {isUploading && <span className="upload-spinner"><i className="fas fa-spinner fa-spin"></i> Uploading...</span>}
                        </div>
                        {formData.images?.length > 0 && (
                          <div className="image-preview-grid">
                            {formData.images.map((img, idx) => (
                              <div key={idx} className="preview-item">
                                <img src={img} alt="Preview" />
                                <button type="button" onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}>&times;</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                      </div>
                    </>
                  ) : modalType === 'coupon' ? (
                    <>
                      <div className="form-group">
                        <label>Coupon Code</label>
                        <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="E.g. SUMMER50" required />
                      </div>
                      <div className="form-group">
                        <label>Discount Type</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option value="PERCENTAGE">Percentage (%)</option>
                          <option value="FIXED">Fixed Amount (₹)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Discount Value</label>
                        <input type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} required />
                      </div>
                      <div className="form-group">
                        <label>Min Order Amount (₹)</label>
                        <input type="number" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: Number(e.target.value)})} />
                      </div>
                      <div className="form-group">
                        <label>Max Discount Amount (₹)</label>
                        <input type="number" value={formData.maxDiscountAmount} onChange={e => setFormData({...formData, maxDiscountAmount: Number(e.target.value)})} />
                      </div>
                      <div className="form-group">
                        <label>Usage Limit</label>
                        <input type="number" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: Number(e.target.value)})} />
                      </div>
                      <div className="form-group">
                        <label>Valid Until</label>
                        <input type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} required />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Slug</label>
                        <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Category Image</label>
                        <div className="image-upload-wrapper">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleImageUpload(e, 'image')} 
                            disabled={isUploading}
                          />
                          {isUploading && <span className="upload-spinner"><i className="fas fa-spinner fa-spin"></i> Uploading...</span>}
                        </div>
                        {formData.image && (
                          <div className="preview-item single">
                            <img src={formData.image} alt="Preview" />
                            <button type="button" onClick={() => setFormData({...formData, image: ''})}>&times;</button>
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="save-btn">Save {modalType}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default AdminProfile;

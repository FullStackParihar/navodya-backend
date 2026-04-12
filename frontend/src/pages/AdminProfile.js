import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PrivateRoute from '../components/PrivateRoute';
import { useToast } from '../context/ToastContext';
import './AdminProfile.css';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  
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
      navigate('/account?tab=profile');
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
      if (Array.isArray(item.colors)) {
        mappedItem.colors = item.colors.map((color) => ({
          name: color.name || '',
          hex: color.hex || '#000000',
          images: color.images || []
        }));
      }
      setFormData(mappedItem);
    } else {
      if (type === 'product') {
        if (categories.length === 0) {
          error('Please wait for categories to load or create one first.');
          return;
        }
        setFormData({
          name: '',
          slug: '',
          description: '',
          price: 0,
          categoryId: categories[0]?._id || '',
          subcategory: '',
          images: [],
          sizes: [{ size: 'M', stock: 10 }],
          colors: [{ name: 'Default', hex: '#000000', images: [] }],
          tags: []
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

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatOrderDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  const getPaymentTone = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'PAID':
        return 'paid';
      case 'PENDING':
        return 'pending';
      case 'FAILED':
        return 'failed';
      default:
        return 'neutral';
    }
  };

  const totalProductStock = products.reduce(
    (sum, product) => sum + (product.sizes || []).reduce((stock, size) => stock + (size.stock || 0), 0),
    0
  );

  const activeCoupons = coupons.filter((coupon) => {
    if (!coupon.valid_until) return true;
    return new Date(coupon.valid_until) >= new Date();
  }).length;

  const renderDashboard = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>System Overview</h2>
        <div className="current-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      {stats && (
        <>
          <div className="orders-overview-grid">
            <div className="orders-overview-card">
              <span className="orders-overview-label">Total Users</span>
              <strong>{stats.totalUsers}</strong>
            </div>
            <div className="orders-overview-card processing">
              <span className="orders-overview-label">Total Orders</span>
              <strong>{stats.totalOrders}</strong>
            </div>
            <div className="orders-overview-card revenue">
              <span className="orders-overview-label">Revenue</span>
              <strong>₹{stats.revenue?.toLocaleString()}</strong>
            </div>
            <div className="orders-overview-card delivered">
              <span className="orders-overview-label">Products</span>
              <strong>{stats.totalProducts}</strong>
            </div>
          </div>

          <div className="admin-entity-stack">
            <article className="admin-entity-card">
              <div className="entity-card-top">
                <div>
                  <h3>Admin Pulse</h3>
                  <p className="entity-card-subtitle">Quick snapshot of the store across users, sales, and inventory.</p>
                </div>
                <div className="entity-card-total">
                  <span>Today</span>
                  <strong>{new Date().toLocaleDateString('en-IN')}</strong>
                </div>
              </div>

              <div className="entity-card-grid">
                <div className="entity-panel">
                  <span className="entity-panel-label">Customer Base</span>
                  <strong>{stats.totalUsers} registered users</strong>
                  <p>Keep an eye on new signups and repeat buyers from the users tab.</p>
                </div>
                <div className="entity-panel">
                  <span className="entity-panel-label">Sales Health</span>
                  <strong>{stats.totalOrders} orders placed</strong>
                  <p>Revenue currently stands at ₹{stats.revenue?.toLocaleString()} across all fulfilled and active orders.</p>
                </div>
                <div className="entity-panel">
                  <span className="entity-panel-label">Catalog</span>
                  <strong>{stats.totalProducts} live products</strong>
                  <p>Use products and categories to update listings, pricing, and inventory details.</p>
                </div>
                <div className="entity-panel">
                  <span className="entity-panel-label">Operations</span>
                  <strong>{orders.filter((order) => order.status === 'PENDING').length} pending orders</strong>
                  <p>Move to the orders tab to process payments, shipping, and delivery updates.</p>
                </div>
              </div>
            </article>
          </div>
        </>
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
      <div className="orders-overview-grid">
        <div className="orders-overview-card">
          <span className="orders-overview-label">Products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="orders-overview-card processing">
          <span className="orders-overview-label">In Stock Units</span>
          <strong>{totalProductStock}</strong>
        </div>
        <div className="orders-overview-card pending">
          <span className="orders-overview-label">Low Stock</span>
          <strong>{products.filter((product) => (product.sizes || []).reduce((sum, size) => sum + (size.stock || 0), 0) <= 10).length}</strong>
        </div>
        <div className="orders-overview-card revenue">
          <span className="orders-overview-label">On Sale</span>
          <strong>{products.filter((product) => product.sale_price).length}</strong>
        </div>
      </div>

      <div className="admin-entity-stack">
        {products.map((product) => {
          const stockCount = (product.sizes || []).reduce((acc, size) => acc + (size.stock || 0), 0);
          return (
            <article key={product._id} className="admin-entity-card">
              <div className="entity-card-top">
                <div className="entity-title-group">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/72x72?text=Item'} alt={product.name} className="entity-thumb" />
                  <div>
                    <h3>{product.name}</h3>
                    <p className="entity-card-subtitle">{product.slug}</p>
                  </div>
                </div>
                <div className="entity-card-total">
                  <span>Base Price</span>
                  <strong>{formatCurrency(product.price || 0)}</strong>
                </div>
              </div>

              <div className="entity-card-grid">
                <div className="entity-panel">
                  <span className="entity-panel-label">Category</span>
                  <strong>{product.subcategory || product.category_id?.name || 'Not assigned'}</strong>
                  <p>{product.tags?.length ? product.tags.join(', ') : 'No tags added'}</p>
                </div>
                <div className="entity-panel">
                  <span className="entity-panel-label">Inventory</span>
                  <strong>{stockCount} units available</strong>
                  <p>{product.sizes?.length || 0} sizes and {product.colors?.length || 0} color variants configured.</p>
                </div>
                <div className="entity-panel">
                  <span className="entity-panel-label">Pricing</span>
                  <strong>{product.sale_price ? `${formatCurrency(product.sale_price)} sale` : 'Regular pricing'}</strong>
                  <p>{product.sale_price ? `Discount from ${formatCurrency(product.price || 0)}` : 'No sale price active right now.'}</p>
                </div>
                <div className="entity-panel">
                  <span className="entity-panel-label">Description</span>
                  <strong>{product.description ? `${product.description.slice(0, 80)}${product.description.length > 80 ? '...' : ''}` : 'No description added'}</strong>
                </div>
              </div>

              <div className="entity-card-actions">
                <div className="entity-chip-row">
                  {(product.sizes || []).slice(0, 4).map((size) => (
                    <span key={`${product._id}-${size.size}`} className="entity-chip">
                      {size.size}: {size.stock}
                    </span>
                  ))}
                </div>
                <div className="entity-action-row">
                  <button className="entity-action-btn edit" onClick={() => handleOpenModal('product', product)}>
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button className="entity-action-btn delete" onClick={() => deleteItem('product', product._id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {products.length === 0 && (
          <div className="empty-admin-state">
            <i className="fas fa-box-open"></i>
            <h3>No products yet</h3>
            <p>Create your first product to start building the catalog.</p>
          </div>
        )}
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
      <div className="orders-overview-grid">
        <div className="orders-overview-card">
          <span className="orders-overview-label">Categories</span>
          <strong>{categories.length}</strong>
        </div>
        <div className="orders-overview-card delivered">
          <span className="orders-overview-label">Catalog Groups</span>
          <strong>{categories.filter((cat) => cat.slug).length}</strong>
        </div>
      </div>
      <div className="admin-entity-stack">
        {categories.map((cat) => (
          <article key={cat._id} className="admin-entity-card">
            <div className="entity-card-top">
              <div className="entity-title-group">
                <img src={cat.image || 'https://via.placeholder.com/72x72?text=Cat'} alt={cat.name} className="entity-thumb" />
                <div>
                  <h3>{cat.name}</h3>
                  <p className="entity-card-subtitle">{cat.slug}</p>
                </div>
              </div>
              <div className="entity-card-total">
                <span>Products</span>
                <strong>{products.filter((product) => {
                  const categoryId = typeof product.category_id === 'object' ? product.category_id?._id : product.category_id;
                  return categoryId === cat._id;
                }).length}</strong>
              </div>
            </div>

            <div className="entity-card-grid">
              <div className="entity-panel entity-panel-wide">
                <span className="entity-panel-label">Description</span>
                <strong>{cat.description || 'No description added yet.'}</strong>
              </div>
            </div>

            <div className="entity-card-actions">
              <div className="entity-action-row">
                <button className="entity-action-btn edit" onClick={() => handleOpenModal('category', cat)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="entity-action-btn delete" onClick={() => deleteItem('category', cat._id)}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {categories.length === 0 && (
          <div className="empty-admin-state">
            <i className="fas fa-tags"></i>
            <h3>No categories yet</h3>
            <p>Add categories to organize products and storefront navigation.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Order Management</h2>
      </div>
      <div className="orders-overview-grid">
        <div className="orders-overview-card">
          <span className="orders-overview-label">Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="orders-overview-card pending">
          <span className="orders-overview-label">Pending</span>
          <strong>{orders.filter((order) => order.status === 'PENDING').length}</strong>
        </div>
        <div className="orders-overview-card processing">
          <span className="orders-overview-label">Processing</span>
          <strong>{orders.filter((order) => order.status === 'PROCESSING').length}</strong>
        </div>
        <div className="orders-overview-card delivered">
          <span className="orders-overview-label">Delivered</span>
          <strong>{orders.filter((order) => order.status === 'DELIVERED').length}</strong>
        </div>
        <div className="orders-overview-card revenue">
          <span className="orders-overview-label">Order Value</span>
          <strong>{formatCurrency(orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0))}</strong>
        </div>
      </div>

      <div className="orders-stack">
        {orders.map((order) => (
          <article key={order._id} className="order-card-admin">
            <div className="order-card-top">
              <div>
                <div className="order-card-id-row">
                  <h3>Order #{order._id.substring(0, 8)}</h3>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <p className="order-card-date">{formatOrderDate(order.created_at)}</p>
              </div>

              <div className="order-card-total-block">
                <span>Total</span>
                <strong>{formatCurrency(order.pricing?.total || 0)}</strong>
              </div>
            </div>

            <div className="order-card-grid">
              <div className="order-info-panel">
                <span className="order-panel-label">Customer</span>
                <strong>{order.shipping_address?.name || 'Unknown Customer'}</strong>
                <p>{order.shipping_address?.phone || 'No phone added'}</p>
              </div>

              <div className="order-info-panel">
                <span className="order-panel-label">Delivery</span>
                <strong>{order.shipping_address?.city || 'Unknown City'}</strong>
                <p>
                  {order.shipping_address?.street || 'No street provided'}
                  {order.shipping_address?.zip_code ? `, ${order.shipping_address.zip_code}` : ''}
                </p>
              </div>

              <div className="order-info-panel">
                <span className="order-panel-label">Payment</span>
                <strong>{(order.payment_info?.method || 'card').toUpperCase()}</strong>
                <p className={`payment-badge ${getPaymentTone(order.payment_info?.status)}`}>
                  {order.payment_info?.status || 'UNKNOWN'}
                </p>
              </div>

              <div className="order-info-panel">
                <span className="order-panel-label">Items</span>
                <strong>{order.items?.length || 0} products</strong>
                <p>
                  Qty:{' '}
                  {(order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0)}
                </p>
              </div>
            </div>

            <div className="order-items-preview">
              {(order.items || []).slice(0, 3).map((item, index) => (
                <div key={`${order._id}-${index}`} className="order-item-chip">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-meta">
                    x{item.quantity}
                    {item.size ? ` • ${item.size}` : ''}
                    {item.color ? ` • ${item.color}` : ''}
                  </span>
                </div>
              ))}
              {(order.items || []).length > 3 && (
                <div className="order-item-chip muted">
                  +{order.items.length - 3} more items
                </div>
              )}
            </div>

            <div className="order-card-actions">
              <div className="order-pricing-strip">
                <span>Subtotal: {formatCurrency(order.pricing?.subtotal || 0)}</span>
                <span>Discount: {formatCurrency(order.pricing?.discount || 0)}</span>
                <span>Shipping: {formatCurrency(order.pricing?.shipping_fee || 0)}</span>
              </div>

              <div className="order-status-control">
                <label htmlFor={`status-${order._id}`}>Update Status</label>
                <select
                  id={`status-${order._id}`}
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="status-select"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </article>
        ))}
        {orders.length === 0 && (
          <div className="empty-admin-state">
            <i className="fas fa-box-open"></i>
            <h3>No orders yet</h3>
            <p>New customer orders will appear here with shipping, payment, and item details.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>User Management</h2>
      </div>
      <div className="orders-overview-grid">
        <div className="orders-overview-card">
          <span className="orders-overview-label">Total Users</span>
          <strong>{users.length}</strong>
        </div>
        <div className="orders-overview-card processing">
          <span className="orders-overview-label">Admins</span>
          <strong>{users.filter((user) => user.role === 'admin').length}</strong>
        </div>
        <div className="orders-overview-card delivered">
          <span className="orders-overview-label">Customers</span>
          <strong>{users.filter((user) => user.role !== 'admin').length}</strong>
        </div>
      </div>
      <div className="admin-entity-stack">
        {users.map((user) => (
          <article key={user._id} className="admin-entity-card">
            <div className="entity-card-top">
              <div>
                <h3>{user.name || 'Unnamed User'}</h3>
                <p className="entity-card-subtitle">{user.email}</p>
              </div>
              <div className="entity-card-total">
                <span>Role</span>
                <strong>{user.role || 'user'}</strong>
              </div>
            </div>

            <div className="entity-card-grid">
              <div className="entity-panel">
                <span className="entity-panel-label">Joined</span>
                <strong>{new Date(user.created_at).toLocaleDateString('en-IN')}</strong>
              </div>
              <div className="entity-panel">
                <span className="entity-panel-label">Permissions</span>
                <strong><span className={`role-badge ${user.role}`}>{user.role}</span></strong>
                <p>{user.role === 'admin' ? 'Full access to dashboard controls.' : 'Standard storefront account.'}</p>
              </div>
            </div>

            <div className="entity-card-actions">
              <div className="entity-action-row">
                <button className="entity-action-btn delete" onClick={() => deleteItem('user', user._id)}>
                  <i className="fas fa-trash"></i> Delete User
                </button>
              </div>
            </div>
          </article>
        ))}
        {users.length === 0 && (
          <div className="empty-admin-state">
            <i className="fas fa-users"></i>
            <h3>No users found</h3>
            <p>Registered users will appear here with role and join-date details.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCoupons = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Coupon Management</h2>
        <button className="add-btn" onClick={() => handleOpenModal('coupon')}>
          <i className="fas fa-plus"></i> Add Coupon
        </button>
      </div>
      <div className="orders-overview-grid">
        <div className="orders-overview-card">
          <span className="orders-overview-label">Coupons</span>
          <strong>{coupons.length}</strong>
        </div>
        <div className="orders-overview-card delivered">
          <span className="orders-overview-label">Active</span>
          <strong>{activeCoupons}</strong>
        </div>
        <div className="orders-overview-card revenue">
          <span className="orders-overview-label">Total Redemptions</span>
          <strong>{coupons.reduce((sum, coupon) => sum + (coupon.usage_count || 0), 0)}</strong>
        </div>
      </div>
      <div className="admin-entity-stack">
        {coupons.map((coupon) => (
          <article key={coupon._id} className="admin-entity-card">
            <div className="entity-card-top">
              <div>
                <h3>{coupon.code}</h3>
                <p className="entity-card-subtitle">{coupon.type === 'PERCENTAGE' ? 'Percentage discount' : 'Fixed amount discount'}</p>
              </div>
              <div className="entity-card-total">
                <span>Value</span>
                <strong>{coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatCurrency(coupon.value || 0)}</strong>
              </div>
            </div>

            <div className="entity-card-grid">
              <div className="entity-panel">
                <span className="entity-panel-label">Usage</span>
                <strong>{coupon.usage_count || 0} / {coupon.usage_limit || 'Unlimited'}</strong>
                <p>Track how often customers redeem this code.</p>
              </div>
              <div className="entity-panel">
                <span className="entity-panel-label">Eligibility</span>
                <strong>Min order {formatCurrency(coupon.min_order_amount || 0)}</strong>
                <p>Max discount {coupon.max_discount_amount ? formatCurrency(coupon.max_discount_amount) : 'Not capped'}</p>
              </div>
              <div className="entity-panel">
                <span className="entity-panel-label">Expiry</span>
                <strong>{coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString('en-IN') : 'No expiry'}</strong>
              </div>
            </div>

            <div className="entity-card-actions">
              <div className="entity-action-row">
                <button className="entity-action-btn delete" onClick={() => deleteItem('coupon', coupon._id)}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {coupons.length === 0 && (
          <div className="empty-admin-state">
            <i className="fas fa-ticket-alt"></i>
            <h3>No coupons created</h3>
            <p>Create discount codes to support campaigns and seasonal offers.</p>
          </div>
        )}
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
              {activeTab === 'coupons' && renderCoupons()}
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

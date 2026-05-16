import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [createProductForm, setCreateProductForm] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'products') fetchProducts();
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const result = await api.get('/categories');
      if (result.success) setCategories(result.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const result = await api.get('/admin/stats');
      if (result.success) setStats(result.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const result = await api.get('/admin/orders');
      if (result.success) setOrders(result.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const result = await api.get('/admin/users');
      if (result.success) setUsers(result.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const result = await api.get('/products');
      if (result.success) setProducts(result.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleCreateProductChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
      setCreateProductForm(prev => ({ ...prev, images: files }));
    } else {
      setCreateProductForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Form data:', createProductForm);

    try {
      let uploadedImageUrls = [];

      if (createProductForm.images && createProductForm.images.length > 0) {
        console.log('Uploading images to Cloudinary...');
        for (let i = 0; i < createProductForm.images.length; i++) {
          const imageFile = createProductForm.images[i];
          const formData = new FormData();
          formData.append('image', imageFile);

          const uploadResult = await api.post('/upload', formData);
          console.log('Upload result for image', i, ':', uploadResult);
          
          if (uploadResult.success && uploadResult.data && uploadResult.data.url) {
            uploadedImageUrls.push(uploadResult.data.url);
          }
        }
      }

      const slug = generateSlug(createProductForm.name);
      
      const productData = {
        name: createProductForm.name,
        slug: slug,
        description: createProductForm.description,
        price: Number(createProductForm.price),
        categoryId: createProductForm.categoryId,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : ['https://via.placeholder.com/300x400?text=Product+Image'],
        tags: []
      };

      if (createProductForm.salePrice) {
        productData.salePrice = Number(createProductForm.salePrice);
      }

      console.log('Sending product to backend:', productData);
      const result = await api.post('/products', productData);
      console.log('Backend response:', result);
      
      if (result.success) {
        alert('Product created successfully!');
        setShowCreateProduct(false);
        setCreateProductForm({
          name: '',
          description: '',
          price: '',
          salePrice: '',
          categoryId: '',
          images: []
        });
        setImagePreviews([]);
        fetchProducts();
      } else {
        alert('Failed to create product: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Error creating product: ' + (err.message || 'Unknown error'));
    }
  };

  const statsToShow = stats
    ? [
        { label: 'Total Products', value: stats.totalProducts?.toLocaleString() || '0', icon: 'fas fa-box' },
        { label: 'Total Orders', value: stats.totalOrders?.toLocaleString() || '0', icon: 'fas fa-shopping-bag' },
        { label: 'Total Users', value: stats.totalUsers?.toLocaleString() || '0', icon: 'fas fa-users' },
        { label: 'Revenue', value: '₹' + (stats.revenue?.toLocaleString() || '0'), icon: 'fas fa-rupee-sign' }
      ]
    : [
        { label: 'Total Products', value: '0', icon: 'fas fa-box' },
        { label: 'Total Orders', value: '0', icon: 'fas fa-shopping-bag' },
        { label: 'Total Users', value: '0', icon: 'fas fa-users' },
        { label: 'Revenue', value: '₹0', icon: 'fas fa-rupee-sign' }
      ];

  return (
    <div className="product-page-container">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Manage your Navodaya Trendz store</p>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {activeTab === 'stats' && (
            <>
              <div className="stats-grid-about" style={{ marginBottom: '40px' }}>
                {isLoading ? (
                  statsToShow.map((_, index) => (
                    <div key={index} className="stat-card-about">
                      <div style={{ 
                        width: '60px', height: '60px', background: '#f1f5f9', 
                        borderRadius: '12px', margin: '0 auto 12px' 
                      }}></div>
                      <div style={{ height: '30px', background: '#f1f5f9', borderRadius: '6px', marginBottom: '4px' }}></div>
                      <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '80px', margin: '0 auto' }}></div>
                    </div>
                  ))
                ) : (
                  statsToShow.map((stat, index) => (
                    <div key={index} className="stat-card-about">
                      <i className={stat.icon} style={{ fontSize: '32px', color: '#2563eb', marginBottom: '8px' }}></i>
                      <div className="stat-number-about">{stat.value}</div>
                      <div className="stat-label-about">{stat.label}</div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '40px' 
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  padding: '40px', borderRadius: '20px', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ 
                    position: 'absolute', top: '-20px', right: '-20px', 
                    fontSize: '120px', opacity: '0.2' 
                  }}>
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <h3 style={{ color: 'white', fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>
                    Navodaya Trendz
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                    Celebrating the journey of Navodayans through quality merchandise
                  </p>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                  padding: '40px', borderRadius: '20px', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ 
                    position: 'absolute', top: '-20px', right: '-20px', 
                    fontSize: '120px', opacity: '0.2' 
                  }}>
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <h3 style={{ color: 'white', fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>
                    Connecting Alumni
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                    From 660+ JNV schools across 28 states
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)' }}>
                  Products Management
                </h2>
                <button 
                  className="add-to-cart-new"
                  onClick={() => setShowCreateProduct(!showCreateProduct)}
                >
                  <i className="fas fa-plus"></i> Create Product
                </button>
              </div>

              {showCreateProduct && (
                <div style={{ 
                  background: '#f8fafc', padding: '40px', borderRadius: '20px', marginBottom: '24px' 
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-dark)' }}>
                    Create New Product
                  </h3>
                  <form onSubmit={handleCreateProductSubmit} style={{ 
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' 
                  }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={createProductForm.name}
                        onChange={handleCreateProductChange}
                        required
                        style={{ 
                          width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', 
                          borderRadius: '12px', fontSize: '16px', outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Description</label>
                      <textarea
                        name="description"
                        value={createProductForm.description}
                        onChange={handleCreateProductChange}
                        rows="3"
                        style={{ 
                          width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', 
                          borderRadius: '12px', fontSize: '16px', outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={createProductForm.price}
                        onChange={handleCreateProductChange}
                        required
                        min="0"
                        style={{ 
                          width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', 
                          borderRadius: '12px', fontSize: '16px', outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Sale Price (₹)</label>
                      <input
                        type="number"
                        name="salePrice"
                        value={createProductForm.salePrice}
                        onChange={handleCreateProductChange}
                        min="0"
                        style={{ 
                          width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', 
                          borderRadius: '12px', fontSize: '16px', outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Category *</label>
                      <select
                        name="categoryId"
                        value={createProductForm.categoryId}
                        onChange={handleCreateProductChange}
                        required
                        style={{ 
                          width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', 
                          borderRadius: '12px', fontSize: '16px', outline: 'none'
                        }}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Product Images</label>
                      <input
                        type="file"
                        name="images"
                        multiple
                        accept="image/*"
                        onChange={handleCreateProductChange}
                        style={{ 
                          width: '100%', padding: '12px 16px', border: '2px dashed #cbd5e1', 
                          borderRadius: '12px', fontSize: '16px', cursor: 'pointer', background: '#f8fafc'
                        }}
                      />
                    </div>
                    {imagePreviews.length > 0 && (
                      <div style={{ 
                        gridColumn: '1 / -1', 
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '16px', marginTop: '16px' 
                      }}>
                        {imagePreviews.map((preview, index) => (
                          <div key={index} style={{ 
                            position: 'relative', borderRadius: '12px', overflow: 'hidden', 
                            aspectRatio: '1', border: '1px solid #e2e8f0' 
                          }}>
                            <img src={preview} alt={`Preview ${index + 1}`} style={{ 
                              width: '100%', height: '100%', objectFit: 'cover' 
                            }} />
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '20px' }}>
                      <button 
                        type="submit"
                        className="add-to-cart-new"
                      >
                        <i className="fas fa-check"></i> Create Product
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowCreateProduct(false)}
                        style={{ 
                          padding: '14px 28px', borderRadius: '12px', fontSize: '16px', 
                          fontWeight: '600', cursor: 'pointer', border: '1px solid #e2e8f0', 
                          background: 'white', color: 'var(--text-dark)'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-content" style={{ 
                background: '#f8fafc', padding: '40px', borderRadius: '20px', minHeight: '300px'
              }}>
                {isLoading ? (
                  <p style={{ color: 'var(--text-gray)' }}>Loading products...</p>
                ) : products.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'white', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Name</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Category</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Price</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id} style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>{product.name}</td>
                            <td style={{ padding: '12px' }}>{product.category_id?.name || 'N/A'}</td>
                            <td style={{ padding: '12px' }}>
                              ₹{product.sale_price || product.price}
                              {product.sale_price && <span style={{ color: 'var(--text-gray)', marginLeft: '8px', textDecoration: 'line-through' }}>₹{product.price}</span>}
                            </td>
                            <td style={{ padding: '12px' }}>{new Date(product.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-gray)' }}>No products found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-content" style={{ 
              background: '#f8fafc', padding: '40px', borderRadius: '20px', minHeight: '300px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-dark)' }}>
                Orders Management
              </h2>
              {isLoading ? (
                <p style={{ color: 'var(--text-gray)' }}>Loading orders...</p>
              ) : orders.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'white', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Order ID</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Total</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px' }}>{order._id}</td>
                          <td style={{ padding: '12px' }}>{order.status}</td>
                          <td style={{ padding: '12px' }}>₹{order.pricing?.total || 0}</td>
                          <td style={{ padding: '12px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-gray)' }}>No orders found.</p>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-content" style={{ 
              background: '#f8fafc', padding: '40px', borderRadius: '20px', minHeight: '300px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-dark)' }}>
                Users Management
              </h2>
              {isLoading ? (
                <p style={{ color: 'var(--text-gray)' }}>Loading users...</p>
              ) : users.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'white', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Role</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px' }}>{user.first_name} {user.last_name}</td>
                          <td style={{ padding: '12px' }}>{user.email}</td>
                          <td style={{ padding: '12px' }}>{user.role}</td>
                          <td style={{ padding: '12px' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-gray)' }}>No users found.</p>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="admin-content" style={{ 
              background: '#f8fafc', padding: '40px', borderRadius: '20px', textAlign: 'center' 
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-dark)' }}>
                Settings
              </h2>
              <p style={{ color: 'var(--text-gray)' }}>Manage store settings here.</p>
            </div>
          )}

          <div className="admin-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', marginTop: '40px' }}>
            {['stats', 'products', 'orders', 'users', 'settings'].map((tab) => (
              <button
                key={tab}
                className={`add-to-cart-new ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  background: activeTab === tab ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' : 'white',
                  color: activeTab === tab ? 'white' : 'var(--text-dark)'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;

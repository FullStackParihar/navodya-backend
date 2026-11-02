import React, { useState, useEffect, useCallback } from 'react';
import api, { resolveImageUrl } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import './CategoryManagement.css';

const emptyCategoryForm = {
  name: '',
  slug: '',
  description: '',
  image: '',
  imagePublicId: '',
  displayOrder: 0,
  isActive: true
};

const emptySubcategoryForm = {
  categoryId: '',
  name: '',
  slug: '',
  description: '',
  image: '',
  imagePublicId: '',
  price: 999,
  salePrice: 799,
  stock: 50,
  displayOrder: 0,
  isActive: true
};

export default function CategoryManagement({ onCategoriesChanged }) {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'subcategories'
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catForm, setCatForm] = useState(emptyCategoryForm);

  // Subcategory Modal
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);
  const [subForm, setSubForm] = useState(emptySubcategoryForm);

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: '', name: '' });

  // 1. Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories?isAdmin=true');
      if (res.success) {
        const catList = res.data || [];
        setCategories(catList);
        if (catList.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(catList[0]._id);
        }
        if (onCategoriesChanged) {
          onCategoriesChanged(catList);
        }
      } else {
        error(res.message || 'Failed to fetch categories');
      }
    } catch (err) {
      error(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [error, selectedCategoryId, onCategoriesChanged]);

  // 2. Fetch Subcategories
  const fetchSubcategories = useCallback(async (catId) => {
    try {
      const targetId = catId || selectedCategoryId;
      const url = targetId
        ? `/categories/${targetId}/subcategories?isAdmin=true`
        : '/subcategories?isAdmin=true';
      const res = await api.get(url);
      if (res.success) {
        setSubcategories(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeTab === 'subcategories' && selectedCategoryId) {
      fetchSubcategories(selectedCategoryId);
    }
  }, [activeTab, selectedCategoryId, fetchSubcategories]);

  // Image Upload Handler
  const handleImageUpload = async (e, targetType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      return error('Only JPG, PNG, WebP, and SVG images are allowed');
    }
    if (file.size > 9 * 1024 * 1024) {
      return error('Image must be under 9MB');
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload/upload', formData);
      if (res.success && res.data?.url) {
        if (targetType === 'category') {
          setCatForm((prev) => ({
            ...prev,
            image: res.data.url,
            imagePublicId: res.data.public_id || ''
          }));
        } else {
          setSubForm((prev) => ({
            ...prev,
            image: res.data.url,
            imagePublicId: res.data.public_id || ''
          }));
        }
        success('Image uploaded successfully');
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Category Actions
  const handleOpenCatModal = (cat = null) => {
    if (cat) {
      setEditingCatId(cat._id);
      setCatForm({
        name: cat.name || '',
        slug: cat.slug || '',
        description: cat.description || '',
        image: cat.image || '',
        imagePublicId: cat.imagePublicId || '',
        displayOrder: cat.displayOrder ?? 0,
        isActive: cat.isActive !== false
      });
    } else {
      setEditingCatId(null);
      setCatForm({
        ...emptyCategoryForm,
        displayOrder: categories.length + 1
      });
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) {
      return error('Category name is required');
    }

    try {
      const payload = {
        ...catForm,
        displayOrder: Number(catForm.displayOrder) || 0
      };

      let res;
      if (editingCatId) {
        res = await api.patch(`/categories/${editingCatId}`, payload);
      } else {
        res = await api.post('/categories', payload);
      }

      if (res.success) {
        success(editingCatId ? 'Category updated successfully' : 'Category created successfully');
        setIsCatModalOpen(false);
        fetchCategories();
      } else {
        error(res.message || 'Failed to save category');
      }
    } catch (err) {
      error(err.message || 'Failed to save category');
    }
  };

  const handleToggleCategoryStatus = async (cat) => {
    try {
      const res = await api.patch(`/categories/${cat._id}/status`, {
        isActive: !cat.isActive
      });
      if (res.success) {
        success(`Category marked ${!cat.isActive ? 'Active' : 'Inactive'}`);
        fetchCategories();
      } else {
        error(res.message || 'Failed to update status');
      }
    } catch (err) {
      error(err.message || 'Failed to update status');
    }
  };

  // Subcategory Actions
  const handleOpenSubModal = (sub = null) => {
    if (sub) {
      setEditingSubId(sub._id);
      setSubForm({
        categoryId: sub.categoryId?._id || sub.categoryId || selectedCategoryId,
        name: sub.name || '',
        slug: sub.slug || '',
        description: sub.description || '',
        image: sub.image || '',
        imagePublicId: sub.imagePublicId || '',
        price: sub.price ?? 999,
        salePrice: sub.salePrice ?? 799,
        stock: sub.stock ?? 50,
        displayOrder: sub.displayOrder ?? 0,
        isActive: sub.isActive !== false
      });
    } else {
      setEditingSubId(null);
      setSubForm({
        ...emptySubcategoryForm,
        categoryId: selectedCategoryId || (categories[0]?._id ?? ''),
        displayOrder: subcategories.length + 1
      });
    }
    setIsSubModalOpen(true);
  };

  const handleSaveSubcategory = async (e) => {
    e.preventDefault();
    if (!subForm.name.trim()) {
      return error('Subcategory name is required');
    }
    if (!subForm.categoryId) {
      return error('Please select a parent category');
    }

    try {
      const payload = {
        ...subForm,
        displayOrder: Number(subForm.displayOrder) || 0
      };

      let res;
      if (editingSubId) {
        res = await api.patch(`/subcategories/${editingSubId}`, payload);
      } else {
        res = await api.post(`/categories/${subForm.categoryId}/subcategories`, payload);
      }

      if (res.success) {
        success(editingSubId ? 'Subcategory updated successfully' : 'Subcategory created successfully');
        setIsSubModalOpen(false);
        fetchSubcategories(subForm.categoryId);
        fetchCategories(); // update subcategory counts
      } else {
        error(res.message || 'Failed to save subcategory');
      }
    } catch (err) {
      error(err.message || 'Failed to save subcategory');
    }
  };

  const handleToggleSubcategoryStatus = async (sub) => {
    try {
      const res = await api.patch(`/subcategories/${sub._id}/status`, {
        isActive: !sub.isActive
      });
      if (res.success) {
        success(`Subcategory marked ${!sub.isActive ? 'Active' : 'Inactive'}`);
        fetchSubcategories(selectedCategoryId);
      } else {
        error(res.message || 'Failed to update status');
      }
    } catch (err) {
      error(err.message || 'Failed to update status');
    }
  };

  // Delete Action Execution
  const handleConfirmDelete = async () => {
    const { type, id } = deleteModal;
    setDeleteModal({ isOpen: false, type: '', id: '', name: '' });

    try {
      let res;
      if (type === 'category') {
        res = await api.delete(`/categories/${id}`);
        if (res.success) {
          success('Category deleted successfully');
          fetchCategories();
        } else {
          error(res.message || 'Failed to delete category');
        }
      } else {
        res = await api.delete(`/subcategories/${id}`);
        if (res.success) {
          success('Subcategory deleted successfully');
          fetchSubcategories(selectedCategoryId);
          fetchCategories();
        } else {
          error(res.message || 'Failed to delete subcategory');
        }
      }
    } catch (err) {
      error(err.message || 'Failed to delete item');
    }
  };

  const handleManageSubcategoriesForCat = (catId) => {
    setSelectedCategoryId(catId);
    setActiveTab('subcategories');
  };

  const selectedCategoryObj = categories.find((c) => c._id === selectedCategoryId);

  return (
    <div className="cat-mgmt">
      {/* Top Header */}
      <div className="cat-header">
        <div className="cat-header-titles">
          <h2>Categories & Subcategories</h2>
          <p>Manage dynamic catalog hierarchy, display orders, and active statuses</p>
        </div>
        <div className="cat-actions">
          {activeTab === 'categories' ? (
            <button className="cat-btn cat-btn-primary" onClick={() => handleOpenCatModal()}>
              <i className="fas fa-plus"></i> Add Category
            </button>
          ) : (
            <button className="cat-btn cat-btn-primary" onClick={() => handleOpenSubModal()}>
              <i className="fas fa-plus"></i> Add Subcategory
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="cat-nav-tabs">
        <button
          className={`cat-nav-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <i className="fas fa-tags" style={{ marginRight: '6px' }}></i> Categories ({categories.length})
        </button>
        <button
          className={`cat-nav-tab ${activeTab === 'subcategories' ? 'active' : ''}`}
          onClick={() => setActiveTab('subcategories')}
        >
          <i className="fas fa-sitemap" style={{ marginRight: '6px' }}></i> Subcategories
          {selectedCategoryObj ? ` (${selectedCategoryObj.name})` : ''}
        </button>
      </div>

      {/* TAB 1: CATEGORIES LIST */}
      {activeTab === 'categories' && (
        <div className="cat-table-card">
          {loading ? (
            <div className="cat-empty">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="cat-empty">
              <i className="fas fa-folder-open"></i>
              <p>No categories found. Click "Add Category" to create your first one.</p>
            </div>
          ) : (
            <table className="cat-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Subcategories</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <img
                        src={resolveImageUrl(cat.image) || 'https://via.placeholder.com/60?text=Cat'}
                        alt={cat.name}
                        className="cat-img-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/60?text=Cat';
                        }}
                      />
                    </td>
                    <td>
                      <strong>{cat.name}</strong>
                      {cat.description && (
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {cat.description.length > 50 ? `${cat.description.substring(0, 50)}...` : cat.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                        {cat.slug}
                      </code>
                    </td>
                    <td>
                      <button
                        className="cat-sub-count-btn"
                        onClick={() => handleManageSubcategoriesForCat(cat._id)}
                        title="Click to view & manage subcategories"
                      >
                        <i className="fas fa-sitemap"></i> {cat.subcategories?.length || 0} Subcategories
                      </button>
                    </td>
                    <td>
                      <span className="cat-order-pill">#{cat.displayOrder ?? 0}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`cat-status-badge ${cat.isActive !== false ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleCategoryStatus(cat)}
                        title="Click to toggle status"
                      >
                        <i className={`fas fa-${cat.isActive !== false ? 'check-circle' : 'times-circle'}`}></i>
                        {cat.isActive !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="cat-action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="cat-icon-btn edit"
                          onClick={() => handleOpenCatModal(cat)}
                          title="Edit Category"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="cat-icon-btn delete"
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              type: 'category',
                              id: cat._id,
                              name: cat.name
                            })
                          }
                          title="Delete Category"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: SUBCATEGORIES LIST */}
      {activeTab === 'subcategories' && (
        <div>
          {/* Category Selector Bar */}
          <div className="cat-category-selector">
            <label htmlFor="subcat-parent-select">
              <i className="fas fa-filter" style={{ marginRight: '6px', color: '#e63322' }}></i> Filter by Parent Category:
            </label>
            <select
              id="subcat-parent-select"
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                fetchSubcategories(e.target.value);
              }}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.subcategories?.length || 0} subcategories)
                </option>
              ))}
            </select>
            <div style={{ marginLeft: 'auto' }}>
              <button
                className="cat-btn cat-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setActiveTab('categories')}
              >
                &larr; Back to Categories
              </button>
            </div>
          </div>

          <div className="cat-table-card">
            {subcategories.length === 0 ? (
              <div className="cat-empty">
                <i className="fas fa-folder-open"></i>
                <p>No subcategories found for {selectedCategoryObj?.name || 'this category'}.</p>
                <button
                  className="cat-btn cat-btn-primary"
                  style={{ marginTop: '12px' }}
                  onClick={() => handleOpenSubModal()}
                >
                  <i className="fas fa-plus"></i> Add Subcategory to {selectedCategoryObj?.name || 'Category'}
                </button>
              </div>
            ) : (
              <table className="cat-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Image</th>
                    <th>Subcategory Name</th>
                    <th>Slug</th>
                    <th>Parent Category</th>
                    <th>Price</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((sub) => (
                    <tr key={sub._id}>
                      <td>
                        <img
                          src={resolveImageUrl(sub.image) || 'https://via.placeholder.com/60?text=Sub'}
                          alt={sub.name}
                          className="cat-img-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/60?text=Sub';
                          }}
                        />
                      </td>
                      <td>
                        <strong>{sub.name}</strong>
                        {sub.description && (
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            {sub.description.length > 50 ? `${sub.description.substring(0, 50)}...` : sub.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                          {sub.slug}
                        </code>
                      </td>
                      <td>
                        <span style={{ fontWeight: '600', color: '#0f172a' }}>
                          {sub.categoryId?.name || selectedCategoryObj?.name || '—'}
                        </span>
                      </td>
                      <td>
                        <div>
                          <strong style={{ color: '#0f172a' }}>₹{sub.price || 999}</strong>
                          {sub.salePrice && sub.salePrice < sub.price && (
                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '11px', marginLeft: '4px' }}>
                              ₹{sub.price}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="cat-order-pill">#{sub.displayOrder ?? 0}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`cat-status-badge ${sub.isActive !== false ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleSubcategoryStatus(sub)}
                          title="Click to toggle status"
                        >
                          <i className={`fas fa-${sub.isActive !== false ? 'check-circle' : 'times-circle'}`}></i>
                          {sub.isActive !== false ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="cat-action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="cat-icon-btn edit"
                            onClick={() => handleOpenSubModal(sub)}
                            title="Edit Subcategory"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="cat-icon-btn delete"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                type: 'subcategory',
                                id: sub._id,
                                name: sub.name
                              })
                            }
                            title="Delete Subcategory"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCatModalOpen && (
        <div className="cat-modal-backdrop" onClick={() => setIsCatModalOpen(false)}>
          <div className="cat-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cat-modal-header">
              <h3>{editingCatId ? 'Edit Category' : 'Add New Category'}</h3>
              <button className="cat-modal-close" onClick={() => setIsCatModalOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveCategory}>
              <div className="cat-modal-body">
                <div className="cat-form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    value={catForm.name}
                    placeholder="e.g. Diwali Gifts"
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoSlug = name
                        .toLowerCase()
                        .trim()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/[\s_-]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      setCatForm({
                        ...catForm,
                        name,
                        slug: editingCatId ? catForm.slug : autoSlug
                      });
                    }}
                    required
                  />
                </div>

                <div className="cat-form-group">
                  <label>Slug *</label>
                  <input
                    type="text"
                    value={catForm.slug}
                    placeholder="e.g. diwali-gifts"
                    onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                    required
                  />
                  <small>URL friendly identifier (e.g. /category/diwali-gifts)</small>
                </div>

                <div className="cat-form-group">
                  <label>Category Image / Icon</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'category')}
                    disabled={uploading}
                  />
                  {uploading && <small style={{ color: '#e63322' }}>Uploading image...</small>}
                  {catForm.image && (
                    <div className="cat-img-preview-box">
                      <img src={resolveImageUrl(catForm.image)} alt="Preview" />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <span style={{ fontSize: '12px', wordBreak: 'break-all' }}>{catForm.image}</span>
                      </div>
                      <button
                        type="button"
                        className="cat-icon-btn delete"
                        onClick={() => setCatForm({ ...catForm, image: '', imagePublicId: '' })}
                        title="Remove image"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div className="cat-form-group">
                  <label>Description</label>
                  <textarea
                    value={catForm.description}
                    placeholder="Special gifts for Diwali celebrations."
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  />
                </div>

                <div className="cat-form-group">
                  <label>Display Order (Priority on Homepage)</label>
                  <input
                    type="number"
                    min="0"
                    value={catForm.displayOrder}
                    onChange={(e) => setCatForm({ ...catForm, displayOrder: parseInt(e.target.value, 10) || 0 })}
                  />
                  <small>Lower numbers (1, 2, 3...) appear first.</small>
                </div>

                <div className="cat-form-group">
                  <label className="cat-checkbox-label">
                    <input
                      type="checkbox"
                      checked={catForm.isActive}
                      onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
                    />
                    Category Status: Active (Visible to customers on Storefront)
                  </label>
                </div>
              </div>

              <div className="cat-modal-footer">
                <button
                  type="button"
                  className="cat-btn cat-btn-secondary"
                  onClick={() => setIsCatModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cat-btn cat-btn-primary" disabled={uploading}>
                  {editingCatId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SUBCATEGORY */}
      {isSubModalOpen && (
        <div className="cat-modal-backdrop" onClick={() => setIsSubModalOpen(false)}>
          <div className="cat-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cat-modal-header">
              <h3>{editingSubId ? 'Edit Subcategory' : 'Add New Subcategory'}</h3>
              <button className="cat-modal-close" onClick={() => setIsSubModalOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveSubcategory}>
              <div className="cat-modal-body">
                <div className="cat-form-group">
                  <label>Parent Category *</label>
                  <select
                    value={subForm.categoryId}
                    onChange={(e) => setSubForm({ ...subForm, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Select Parent Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cat-form-group">
                  <label>Subcategory Name *</label>
                  <input
                    type="text"
                    value={subForm.name}
                    placeholder="e.g. Diwali Hamper"
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoSlug = name
                        .toLowerCase()
                        .trim()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/[\s_-]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      setSubForm({
                        ...subForm,
                        name,
                        slug: editingSubId ? subForm.slug : autoSlug
                      });
                    }}
                    required
                  />
                </div>

                <div className="cat-form-group">
                  <label>Slug *</label>
                  <input
                    type="text"
                    value={subForm.slug}
                    placeholder="e.g. diwali-hamper"
                    onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })}
                    required
                  />
                  <small>URL identifier (e.g. /category/diwali-gifts/diwali-hamper)</small>
                </div>

                <div className="cat-form-group">
                  <label>Subcategory Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'subcategory')}
                    disabled={uploading}
                  />
                  {uploading && <small style={{ color: '#e63322' }}>Uploading image...</small>}
                  {subForm.image && (
                    <div className="cat-img-preview-box">
                      <img src={resolveImageUrl(subForm.image)} alt="Preview" />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <span style={{ fontSize: '12px', wordBreak: 'break-all' }}>{subForm.image}</span>
                      </div>
                      <button
                        type="button"
                        className="cat-icon-btn delete"
                        onClick={() => setSubForm({ ...subForm, image: '', imagePublicId: '' })}
                        title="Remove image"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div className="cat-form-group">
                  <label>Description</label>
                  <textarea
                    value={subForm.description}
                    placeholder="Curated celebration kits and hampers."
                    onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="cat-form-group">
                    <label>Regular Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      value={subForm.price}
                      placeholder="e.g. 999"
                      onChange={(e) => setSubForm({ ...subForm, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="cat-form-group">
                    <label>Sale Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={subForm.salePrice}
                      placeholder="e.g. 799"
                      onChange={(e) => setSubForm({ ...subForm, salePrice: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="cat-form-group">
                    <label>Initial Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={subForm.stock}
                      placeholder="50"
                      onChange={(e) => setSubForm({ ...subForm, stock: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#166534', fontWeight: '500' }}>
                    <i className="fas fa-magic" style={{ marginRight: '6px' }}></i>
                    Creates an instant Add-to-Cart product on the storefront under this subcategory.
                  </span>
                </div>

                <div className="cat-form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={subForm.displayOrder}
                    onChange={(e) => setSubForm({ ...subForm, displayOrder: parseInt(e.target.value, 10) || 0 })}
                  />
                  <small>Lower numbers appear first within this category.</small>
                </div>

                <div className="cat-form-group">
                  <label className="cat-checkbox-label">
                    <input
                      type="checkbox"
                      checked={subForm.isActive}
                      onChange={(e) => setSubForm({ ...subForm, isActive: e.target.checked })}
                    />
                    Subcategory Status: Active (Visible to customers)
                  </label>
                </div>
              </div>

              <div className="cat-modal-footer">
                <button
                  type="button"
                  className="cat-btn cat-btn-secondary"
                  onClick={() => setIsSubModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cat-btn cat-btn-primary" disabled={uploading}>
                  {editingSubId ? 'Save Changes' : 'Create Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteModal.isOpen && (
        <div
          className="cat-modal-backdrop"
          onClick={() => setDeleteModal({ isOpen: false, type: '', id: '', name: '' })}
        >
          <div className="cat-modal-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="cat-modal-header">
              <h3>Delete Confirmation</h3>
              <button
                className="cat-modal-close"
                onClick={() => setDeleteModal({ isOpen: false, type: '', id: '', name: '' })}
              >
                &times;
              </button>
            </div>
            <div className="cat-modal-body">
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: '#334155' }}>
                Are you sure you want to delete the {deleteModal.type}{' '}
                <strong>"{deleteModal.name}"</strong>?
                {deleteModal.type === 'category' && (
                  <span style={{ display: 'block', color: '#dc2626', marginTop: '8px', fontSize: '13px' }}>
                    <i className="fas fa-exclamation-triangle"></i> This will also remove all associated subcategories.
                  </span>
                )}
              </p>
            </div>
            <div className="cat-modal-footer">
              <button
                type="button"
                className="cat-btn cat-btn-secondary"
                onClick={() => setDeleteModal({ isOpen: false, type: '', id: '', name: '' })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cat-btn"
                style={{ background: '#dc2626', color: '#fff' }}
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


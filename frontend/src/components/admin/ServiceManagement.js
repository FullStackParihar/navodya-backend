import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import './ServiceManagement.css';

const emptyServiceForm = {
  name: '',
  image: '',
  imagePublicId: '',
  description: '',
  badge: '',
  displayOrder: 0,
  isActive: true
};

const emptySubForm = {
  name: '',
  image: '',
  imagePublicId: '',
  description: '',
  price: 0,
  features: '',
  displayOrder: 0,
  isActive: true
};

export default function ServiceManagement() {
  const { success, error } = useToast();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Selected Service for managing its sub-services
  const [selectedService, setSelectedService] = useState(null);
  const [subServices, setSubServices] = useState([]);
  const [loadingSub, setLoadingSub] = useState(false);

  // Service Modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);

  // Sub-Service Modal
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);
  const [subForm, setSubForm] = useState(emptySubForm);

  // 1. Fetch Main Services
  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/services');
      if (res.success) {
        setServices(res.data || []);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      error(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Fetch Sub-Services when a main service is selected
  const loadSubServices = async (service) => {
    setLoadingSub(true);
    setSelectedService(service);
    try {
      const res = await api.get(`/admin/services/${service._id}/sub-services`);
      if (res.success) {
        setSubServices(res.data?.subServices || []);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      error(err.message || 'Failed to load sub-services');
    } finally {
      setLoadingSub(false);
    }
  };

  // 3. Upload Image to Cloudinary
  const handleImageUpload = async (e, targetType) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return error('Only JPG, PNG, and WebP images are allowed');
    }
    if (file.size > 9 * 1024 * 1024) {
      return error('Image must be 9MB or smaller');
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/admin/services/upload', formData);
      if (!res.success) throw new Error(res.message);

      if (targetType === 'service') {
        setServiceForm(prev => ({
          ...prev,
          image: res.data.url,
          imagePublicId: res.data.publicId
        }));
      } else {
        setSubForm(prev => ({
          ...prev,
          image: res.data.url,
          imagePublicId: res.data.publicId
        }));
      }
      success('Image uploaded to Cloudinary successfully');
    } catch (err) {
      error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  /* ── MAIN SERVICE ACTIONS ────────────────────────────────────────── */

  const openServiceForm = (service = null) => {
    setEditingServiceId(service?._id || null);
    setServiceForm(service ? {
      name: service.name || '',
      image: service.image || '',
      imagePublicId: service.imagePublicId || '',
      description: service.description || '',
      badge: service.badge || '',
      displayOrder: service.displayOrder || 0,
      isActive: service.isActive !== undefined ? service.isActive : true
    } : {
      ...emptyServiceForm,
      displayOrder: services.length + 1
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return error('Please enter a service name');
    if (!serviceForm.image.trim()) return error('Please upload an image for the service');

    setSaving(true);
    try {
      const payload = {
        ...serviceForm,
        badge: serviceForm.badge.trim() || null,
        displayOrder: Number(serviceForm.displayOrder)
      };

      const res = editingServiceId
        ? await api.put(`/admin/services/${editingServiceId}`, payload)
        : await api.post('/admin/services', payload);

      if (!res.success) throw new Error(res.message);

      success(editingServiceId ? 'Service updated successfully' : 'Service created successfully');
      setServiceModalOpen(false);
      await loadServices();
    } catch (err) {
      error(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleServiceStatus = async (service) => {
    try {
      const res = await api.patch(`/admin/services/${service._id}/status`, {
        isActive: !service.isActive
      });
      if (res.success) {
        setServices(prev => prev.map(s => s._id === service._id ? res.data : s));
        success(`Service marked as ${!service.isActive ? 'Active' : 'Inactive'}`);
      }
    } catch (err) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteService = async (service) => {
    if (!window.confirm(`Are you sure you want to delete "${service.name}" and all its sub-services? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await api.delete(`/admin/services/${service._id}`);
      if (res.success) {
        setServices(prev => prev.filter(s => s._id !== service._id));
        success('Service deleted successfully');
      }
    } catch (err) {
      error(err.message || 'Failed to delete service');
    }
  };

  /* ── SUB-SERVICE ACTIONS ─────────────────────────────────────────── */

  const openSubForm = (sub = null) => {
    setEditingSubId(sub?._id || null);
    setSubForm(sub ? {
      name: sub.name || '',
      image: sub.image || '',
      imagePublicId: sub.imagePublicId || '',
      description: sub.description || '',
      price: sub.price || 0,
      features: Array.isArray(sub.features) ? sub.features.join(', ') : '',
      displayOrder: sub.displayOrder || 0,
      isActive: sub.isActive !== undefined ? sub.isActive : true
    } : {
      ...emptySubForm,
      displayOrder: subServices.length + 1
    });
    setSubModalOpen(true);
  };

  const handleSaveSubService = async (e) => {
    e.preventDefault();
    if (!subForm.name.trim()) return error('Please enter sub-service name');
    if (!subForm.image.trim()) return error('Please upload an image for the sub-service');

    setSaving(true);
    try {
      const payload = {
        ...subForm,
        price: Number(subForm.price) || 0,
        displayOrder: Number(subForm.displayOrder) || 0,
        features: subForm.features ? subForm.features.split(',').map(f => f.trim()).filter(Boolean) : []
      };

      const res = editingSubId
        ? await api.put(`/admin/services/sub-services/${editingSubId}`, payload)
        : await api.post(`/admin/services/${selectedService._id}/sub-services`, payload);

      if (!res.success) throw new Error(res.message);

      success(editingSubId ? 'Sub-service updated successfully' : 'Sub-service created successfully');
      setSubModalOpen(false);
      await loadSubServices(selectedService);
      // Refresh count in main list
      loadServices();
    } catch (err) {
      error(err.message || 'Failed to save sub-service');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSubStatus = async (sub) => {
    try {
      const res = await api.patch(`/admin/services/sub-services/${sub._id}/status`, {
        isActive: !sub.isActive
      });
      if (res.success) {
        setSubServices(prev => prev.map(s => s._id === sub._id ? res.data : s));
        success(`Sub-service marked as ${!sub.isActive ? 'Active' : 'Inactive'}`);
      }
    } catch (err) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteSubService = async (sub) => {
    if (!window.confirm(`Delete sub-service "${sub.name}"?`)) return;
    try {
      const res = await api.delete(`/admin/services/sub-services/${sub._id}`);
      if (res.success) {
        setSubServices(prev => prev.filter(s => s._id !== sub._id));
        success('Sub-service deleted successfully');
        loadServices();
      }
    } catch (err) {
      error(err.message || 'Failed to delete sub-service');
    }
  };

  return (
    <div className="service-mgmt">
      {/* View 1: SUB-SERVICES VIEW (when a service is selected) */}
      {selectedService ? (
        <>
          <div className="service-breadcrumbs">
            <button onClick={() => setSelectedService(null)}>
              <i className="fas fa-arrow-left"></i> All Services
            </button>
            <span>/</span>
            <strong>{selectedService.name}</strong>
            <span>({subServices.length} sub-services)</span>
          </div>

          <div className="service-mgmt-header">
            <div className="service-mgmt-title">
              <h2>
                <i className="fas fa-layer-group text-purple-600"></i>
                Sub-Services for {selectedService.name}
              </h2>
              <p>Add and manage individual designs, variations, or packages under {selectedService.name}.</p>
            </div>
            <div className="service-mgmt-actions">
              <button className="btn-secondary-admin" onClick={() => setSelectedService(null)}>
                <i className="fas fa-arrow-left"></i> Back to Services
              </button>
              <button className="btn-primary-admin" onClick={() => openSubForm()}>
                <i className="fas fa-plus"></i> Add Sub-Service
              </button>
            </div>
          </div>

          {loadingSub ? (
            <div className="py-12 text-center text-slate-500">Loading sub-services...</div>
          ) : subServices.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
              <i className="fas fa-box-open text-4xl text-slate-300 mb-3"></i>
              <h3 className="text-lg font-bold text-slate-800">No Sub-Services Found</h3>
              <p className="text-sm text-slate-500 mb-4">Add your first design or variation under {selectedService.name}.</p>
              <button className="btn-primary-admin" onClick={() => openSubForm()}>
                <i className="fas fa-plus"></i> Add Sub-Service Now
              </button>
            </div>
          ) : (
            <div className="services-admin-grid">
              {subServices.map((sub) => (
                <div key={sub._id} className="service-admin-card">
                  <div className="service-admin-card-img">
                    <img src={sub.image} alt={sub.name} />
                    <span className={`service-status-pill ${sub.isActive ? 'active' : 'inactive'}`}>
                      {sub.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="service-admin-card-body">
                    <h4 className="service-admin-card-title">{sub.name}</h4>
                    <p className="service-admin-card-desc">{sub.description || 'No description provided.'}</p>
                    <div className="service-admin-meta">
                      <strong>&#8377;{(sub.price || 0).toLocaleString('en-IN')}</strong>
                      <span>Order: #{sub.displayOrder}</span>
                    </div>
                  </div>
                  <div className="service-admin-card-actions">
                    <button onClick={() => openSubForm(sub)} title="Edit">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button onClick={() => handleToggleSubStatus(sub)} title="Toggle Active">
                      <i className={`fas fa-${sub.isActive ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteSubService(sub)} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* View 2: MAIN SERVICES VIEW */
        <>
          <div className="service-mgmt-header">
            <div className="service-mgmt-title">
              <h2>
                <i className="fas fa-print text-purple-600"></i>
                Our Printing Services Management
              </h2>
              <p>Manage the main services displayed in the "Our Printing Services" grid section and sub-service hierarchies.</p>
            </div>
            <div className="service-mgmt-actions">
              <button className="btn-primary-admin" onClick={() => openServiceForm()}>
                <i className="fas fa-plus"></i> Add Main Service
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
              <i className="fas fa-folder-open text-4xl text-slate-300 mb-3"></i>
              <h3 className="text-lg font-bold text-slate-800">No Printing Services Found</h3>
              <p className="text-sm text-slate-500 mb-4">Click below to create your first printing service.</p>
              <button className="btn-primary-admin" onClick={() => openServiceForm()}>
                <i className="fas fa-plus"></i> Add Service
              </button>
            </div>
          ) : (
            <div className="services-admin-grid">
              {services.map((service) => (
                <div key={service._id} className="service-admin-card">
                  <div className="service-admin-card-img">
                    <img src={service.image} alt={service.name} />
                    {service.badge && (
                      <span className="service-admin-badge">{service.badge}</span>
                    )}
                    <span className={`service-status-pill ${service.isActive ? 'active' : 'inactive'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="service-admin-card-body">
                    <h4 className="service-admin-card-title">{service.name}</h4>
                    <p className="service-admin-card-desc">{service.description || 'No description provided.'}</p>
                    <div className="service-admin-meta">
                      <span className="subservice-count-badge">
                        <i className="fas fa-sitemap mr-1"></i> {service.subServicesCount || 0} Sub-Services
                      </span>
                      <span>Order: #{service.displayOrder}</span>
                    </div>
                  </div>
                  <div className="service-admin-card-actions">
                    <button
                      className="btn-manage-sub"
                      onClick={() => loadSubServices(service)}
                      title="Manage Sub-Services"
                    >
                      <i className="fas fa-sitemap"></i> Sub-Services
                    </button>
                    <button onClick={() => openServiceForm(service)} title="Edit Service">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => handleToggleServiceStatus(service)} title="Toggle Status">
                      <i className={`fas fa-${service.isActive ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteService(service)} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* MODAL: ADD / EDIT MAIN SERVICE */}
      {serviceModalOpen && (
        <div className="service-modal-overlay" onClick={() => setServiceModalOpen(false)}>
          <div className="service-modal" onClick={e => e.stopPropagation()}>
            <div className="service-modal-header">
              <h3>{editingServiceId ? 'Edit Main Service' : 'Add Main Service'}</h3>
              <button className="service-modal-close" onClick={() => setServiceModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveService}>
              <div className="service-modal-body">
                <div className="form-group-admin">
                  <label>Service Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VISITING CARDS, BANNERS"
                    value={serviceForm.name}
                    onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group-admin">
                  <label>Service Image (Cloudinary) *</label>
                  {serviceForm.image && (
                    <div className="image-preview-admin">
                      <img src={serviceForm.image} alt="Preview" />
                    </div>
                  )}
                  <div className="image-upload-box">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={e => handleImageUpload(e, 'service')}
                      disabled={uploading}
                    />
                    <i className="fas fa-cloud-upload-alt text-2xl text-purple-600 mb-1"></i>
                    <p className="text-xs font-semibold text-slate-700">
                      {uploading ? 'Uploading to Cloudinary...' : 'Click or Drag & Drop image here'}
                    </p>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WebP up to 9MB</span>
                  </div>
                </div>

                <div className="form-group-admin">
                  <label>Optional Ribbon Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. NEW, HOT, POPULAR (leave empty for none)"
                    value={serviceForm.badge || ''}
                    onChange={e => setServiceForm({ ...serviceForm, badge: e.target.value })}
                  />
                  <small className="text-[11px] text-slate-500">
                    If set to "NEW", will display the diagonal orange ribbon badge on the top-right corner.
                  </small>
                </div>

                <div className="form-group-admin">
                  <label>Description (Optional)</label>
                  <textarea
                    placeholder="Brief description of this printing service..."
                    value={serviceForm.description}
                    onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group-admin">
                    <label>Display Order</label>
                    <input
                      type="number"
                      value={serviceForm.displayOrder}
                      onChange={e => setServiceForm({ ...serviceForm, displayOrder: e.target.value })}
                    />
                  </div>
                  <div className="form-group-admin flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={serviceForm.isActive}
                        onChange={e => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                      />
                      <span>Active on Website</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="service-modal-footer">
                <button
                  type="button"
                  className="btn-secondary-admin"
                  onClick={() => setServiceModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-admin"
                  disabled={saving || uploading}
                >
                  {saving ? 'Saving...' : editingServiceId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SUB-SERVICE */}
      {subModalOpen && (
        <div className="service-modal-overlay" onClick={() => setSubModalOpen(false)}>
          <div className="service-modal" onClick={e => e.stopPropagation()}>
            <div className="service-modal-header">
              <h3>{editingSubId ? 'Edit Sub-Service' : `Add Sub-Service under ${selectedService?.name}`}</h3>
              <button className="service-modal-close" onClick={() => setSubModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveSubService}>
              <div className="service-modal-body">
                <div className="form-group-admin">
                  <label>Sub-Service / Design Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Visiting Card Design 1, Rollup Standee"
                    value={subForm.name}
                    onChange={e => setSubForm({ ...subForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group-admin">
                  <label>Sub-Service Image (Cloudinary) *</label>
                  {subForm.image && (
                    <div className="image-preview-admin">
                      <img src={subForm.image} alt="Preview" />
                    </div>
                  )}
                  <div className="image-upload-box">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={e => handleImageUpload(e, 'sub')}
                      disabled={uploading}
                    />
                    <i className="fas fa-cloud-upload-alt text-2xl text-purple-600 mb-1"></i>
                    <p className="text-xs font-semibold text-slate-700">
                      {uploading ? 'Uploading to Cloudinary...' : 'Click or Drag & Drop image here'}
                    </p>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WebP up to 9MB</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group-admin">
                    <label>Starting Price (&#8377;)</label>
                    <input
                      type="number"
                      placeholder="e.g. 299"
                      value={subForm.price}
                      onChange={e => setSubForm({ ...subForm, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group-admin">
                    <label>Display Order</label>
                    <input
                      type="number"
                      value={subForm.displayOrder}
                      onChange={e => setSubForm({ ...subForm, displayOrder: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-admin">
                  <label>Features / Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 350 GSM, Velvet Touch, Waterproof"
                    value={subForm.features}
                    onChange={e => setSubForm({ ...subForm, features: e.target.value })}
                  />
                </div>

                <div className="form-group-admin">
                  <label>Description</label>
                  <textarea
                    placeholder="Details about this design, material specifications, or use case..."
                    value={subForm.description}
                    onChange={e => setSubForm({ ...subForm, description: e.target.value })}
                  />
                </div>

                <div className="form-group-admin">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subForm.isActive}
                      onChange={e => setSubForm({ ...subForm, isActive: e.target.checked })}
                    />
                    <span>Active on Website</span>
                  </label>
                </div>
              </div>

              <div className="service-modal-footer">
                <button
                  type="button"
                  className="btn-secondary-admin"
                  onClick={() => setSubModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-admin"
                  disabled={saving || uploading}
                >
                  {saving ? 'Saving...' : editingSubId ? 'Update Sub-Service' : 'Add Sub-Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

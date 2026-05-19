import React, { useState } from 'react';
import '../styles/ui-enhanced.css';

const BulkOrder = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    alternatePhone: '',
    jnvDistrict: '',
    jnvState: '',
    batch: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    selectedProductTypes: [],
    products: [],
    deliveryDate: '',
    brandingRequired: '',
    logoUpload: null,
    designDetails: '',
    specialInstructions: '',
    referralSource: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const categories = [
    { value: 'tshirts', label: 'T-Shirts' },
    { value: 'hoodies', label: 'Hoodies' },
    { value: 'mementos', label: 'Momentum/Mementos' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'alumni-kits', label: 'Alumni Kits' },
    { value: 'event-merchandise', label: 'Event Merchandise' },
    { value: 'custom', label: 'Custom Products' }
  ];

  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const colors = ['White', 'Black', 'Navy Blue', 'Maroon', 'Grey', 'Red', 'Green', 'Blue'];
  const organizationTypes = [
    'School/College',
    'Corporate Company',
    'Alumni Association',
    'NGO/Non-Profit',
    'Government Organization',
    'Event Management Company',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox' && name === 'selectedProductTypes') {
      let updatedProducts;
      if (checked) {
        const newProduct = {
          type: value,
          selectedSizes: [],
          selectedColors: [],
          quantity: '',
          material: ''
        };
        updatedProducts = [...formData.products, newProduct];
      } else {
        updatedProducts = formData.products.filter(p => p.type !== value);
      }
      const updatedTypes = checked 
        ? [...formData.selectedProductTypes, value]
        : formData.selectedProductTypes.filter(t => t !== value);
      
      setFormData(prev => ({
        ...prev,
        selectedProductTypes: updatedTypes,
        products: updatedProducts
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProductChange = (productType, field, value, isCheckbox, isChecked) => {
    const updatedProducts = formData.products.map(product => {
      if (product.type === productType) {
        if (isCheckbox) {
          const current = [...product[field]];
          if (isChecked) {
            current.push(value);
          } else {
            const index = current.indexOf(value);
            if (index > -1) current.splice(index, 1);
          }
          return { ...product, [field]: current };
        }
        return { ...product, [field]: value };
      }
      return product;
    });
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Your bulk order request has been submitted successfully! We will contact you within 24 hours.');
      setTimeout(() => {
        setSubmitMessage('');
        setFormData({
          organizationName: '',
          organizationType: '',
          contactPerson: '',
          designation: '',
          email: '',
          phone: '',
          alternatePhone: '',
          jnvDistrict: '',
          jnvState: '',
          batch: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          selectedProductTypes: [],
          products: [],
          deliveryDate: '',
          brandingRequired: '',
          logoUpload: null,
          designDetails: '',
          specialInstructions: '',
          referralSource: ''
        });
      }, 8000);
    }, 2000);
  };

  return (
    <div style={{ 
      background: '#f8fafc', 
      minHeight: '100vh', 
      padding: '40px 20px' 
    }}>
      <div style={{ 
        maxWidth: '1600px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '32px' 
        }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '800', 
            color: '#0f172a', 
            marginBottom: '8px' 
          }}>
            Bulk Orders
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#64748b' 
          }}>
            Get custom merchandise for your organization
          </p>
        </div>

        {submitMessage && (
          <div style={{ 
            background: '#dcfce7', 
            color: '#166534', 
            padding: '16px 24px', 
            borderRadius: '12px', 
            marginBottom: '24px', 
            fontWeight: '600', 
            textAlign: 'center' 
          }}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px' 
        }}>
          {/* Organization Details */}
          <div className="bulk-form-section">
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-building" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Organization Details
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact">
                <label>Organization Name *</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                  placeholder="Enter organization name"
                />
              </div>
              <div className="form-group-contact">
                <label>Organization Type *</label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                >
                  <option value="">Select type</option>
                  {organizationTypes.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-contact">
                <label>Contact Person *</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                  placeholder="Full name"
                />
              </div>
              <div className="form-group-contact">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="form-input-contact"
                  placeholder="Your role"
                />
              </div>
              <div className="form-group-contact">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-group-contact">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="form-group-contact">
                <label>Alternate Phone</label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  className="form-input-contact"
                  placeholder="Secondary contact"
                />
              </div>
              <div className="form-group-contact">
                <label>JNV District</label>
                <input
                  type="text"
                  name="jnvDistrict"
                  value={formData.jnvDistrict}
                  onChange={handleInputChange}
                  className="form-input-contact"
                  placeholder="e.g., Pune"
                />
              </div>
              <div className="form-group-contact">
                <label>JNV State</label>
                <input
                  type="text"
                  name="jnvState"
                  value={formData.jnvState}
                  onChange={handleInputChange}
                  className="form-input-contact"
                  placeholder="e.g., Maharashtra"
                />
              </div>
              <div className="form-group-contact">
                <label>Batch</label>
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  className="form-input-contact"
                >
                  <option value="">Select batch</option>
                  {Array.from({ length: 2026 - 1985 + 1 }, (_, i) => 1985 + i).map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-contact">
                <label>Referral Source</label>
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleInputChange}
                  className="form-input-contact"
                >
                  <option value="">How did you hear about us?</option>
                  <option value="friend">Friend/Alumni</option>
                  <option value="social">Social Media</option>
                  <option value="google">Google Search</option>
                  <option value="event">Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bulk-form-section" style={{ marginTop: '40px' }}>
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Delivery Address
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact" style={{ gridColumn: '1 / -1' }}>
                <label>Full Address *</label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="form-textarea-contact"
                  placeholder="Street address, landmark"
                ></textarea>
              </div>
              <div className="form-group-contact">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                  placeholder="City"
                />
              </div>
              <div className="form-group-contact">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                  placeholder="State"
                />
              </div>
              <div className="form-group-contact">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                  placeholder="XXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Select Products */}
          <div className="bulk-form-section" style={{ marginTop: '40px' }}>
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-shopping-bag" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Select Products
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact" style={{ gridColumn: '1 / -1' }}>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '12px', 
                  padding: '12px', 
                  background: '#f8fafc', 
                  borderRadius: '12px' 
                }}>
                  {categories.map((cat, idx) => (
                    <label key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      padding: '8px 16px',
                      background: 'white',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid #e2e8f0'
                    }}>
                      <input
                        type="checkbox"
                        name="selectedProductTypes"
                        value={cat.value}
                        checked={formData.selectedProductTypes.includes(cat.value)}
                        onChange={handleInputChange}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {cat.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details (for each selected product) */}
          {formData.products.map((product, productIndex) => {
            const productLabel = categories.find(c => c.value === product.type)?.label;
            return (
              <div key={product.type} className="bulk-form-section" style={{ marginTop: '40px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                <h4 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  marginBottom: '20px', 
                  color: '#0f172a', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ 
                    width: '32px', 
                    height: '32px', 
                    background: '#2563eb', 
                    color: 'white', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>
                    {productIndex + 1}
                  </span>
                  {productLabel}
                </h4>
                
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div className="form-group-contact" style={{ gridColumn: 'span 1' }}>
                    <label>Select Sizes *</label>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px', 
                      padding: '12px', 
                      background: '#f8fafc', 
                      borderRadius: '12px' 
                    }}>
                      {sizes.map((size, idx) => (
                        <label key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: '6px 12px',
                          background: 'white',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <input
                            type="checkbox"
                            checked={product.selectedSizes.includes(size)}
                            onChange={(e) => handleProductChange(product.type, 'selectedSizes', size, true, e.target.checked)}
                            style={{ width: '14px', height: '14px' }}
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group-contact" style={{ gridColumn: 'span 1' }}>
                    <label>Select Colors</label>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px', 
                      padding: '12px', 
                      background: '#f8fafc', 
                      borderRadius: '12px' 
                    }}>
                      {colors.map((color, idx) => (
                        <label key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: '6px 12px',
                          background: 'white',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <input
                            type="checkbox"
                            checked={product.selectedColors.includes(color)}
                            onChange={(e) => handleProductChange(product.type, 'selectedColors', color, true, e.target.checked)}
                            style={{ width: '14px', height: '14px' }}
                          />
                          {color}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group-contact">
                    <label>Quantity *</label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(product.type, 'quantity', e.target.value)}
                      required
                      className="form-input-contact"
                      placeholder="Minimum 50 pieces"
                      min="50"
                    />
                  </div>
                  <div className="form-group-contact" style={{ gridColumn: '1 / -1' }}>
                    <label>Material Preference</label>
                    <input
                      type="text"
                      value={product.material}
                      onChange={(e) => handleProductChange(product.type, 'material', e.target.value)}
                      className="form-input-contact"
                      placeholder="e.g., Cotton 180 GSM"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Common Requirements */}
          <div className="bulk-form-section" style={{ marginTop: '40px' }}>
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-calendar" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Common Requirements
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact">
                <label>Expected Delivery Date *</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                />
              </div>
            </div>
          </div>

          {/* Branding & Design */}
          <div className="bulk-form-section" style={{ marginTop: '40px' }}>
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-paint-brush" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Branding & Design
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact">
                <label>Branding Required *</label>
                <select
                  name="brandingRequired"
                  value={formData.brandingRequired}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes, need printing/embroidery</option>
                  <option value="no">No, plain products</option>
                  <option value="help">Need help with design</option>
                </select>
              </div>
              <div className="form-group-contact">
                <label>Upload Logo/Design</label>
                <input
                  type="file"
                  name="logoUpload"
                  onChange={handleInputChange}
                  accept=".png,.jpg,.jpeg,.pdf,.ai,.eps"
                  className="form-input-contact"
                />
              </div>
              <div className="form-group-contact" style={{ gridColumn: 'span 2' }}>
                <label>Design Details</label>
                <textarea
                  name="designDetails"
                  rows="2"
                  value={formData.designDetails}
                  onChange={handleInputChange}
                  className="form-textarea-contact"
                  placeholder="Describe your design requirements: placement (front/back/sleeves), print type (screen print/DTF/embroidery), colors, etc."
                ></textarea>
              </div>
              <div className="form-group-contact" style={{ gridColumn: '1 / -1' }}>
                <label>Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  rows="2"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  className="form-textarea-contact"
                  placeholder="Any other specific requirements or instructions..."
                ></textarea>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn-contact" disabled={isSubmitting} style={{ 
            marginTop: '8px', 
            width: '100%', 
            padding: '20px', 
            fontSize: '20px', 
            fontWeight: '700' 
          }}>
            {isSubmitting ? (
              <><i className="fas fa-spinner fa-spin"></i> Submitting Your Request...</>
            ) : (
              <><i className="fas fa-paper-plane"></i> Submit Bulk Order Request</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BulkOrder;

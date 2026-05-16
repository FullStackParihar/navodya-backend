import React, { useState } from 'react';

const BulkOrderSimple = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    productName: '',
    category: 'tshirts',
    quantity: '',
    sizeRange: '',
    colorPreferences: '',
    material: '',
    budgetPerPiece: '',
    deliveryDate: '',
    brandingRequired: '',
    logoUpload: null,
    designDetails: '',
    specialInstructions: '',
    referralSource: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
          address: '',
          city: '',
          state: '',
          pincode: '',
          productName: '',
          category: 'tshirts',
          quantity: '',
          sizeRange: '',
          colorPreferences: '',
          material: '',
          budgetPerPiece: '',
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

  const features = [
    { icon: 'fas fa-percentage', title: 'Best Prices', desc: 'Get competitive pricing for bulk orders with special discounts' },
    { icon: 'fas fa-truck', title: 'Fast Delivery', desc: 'Quick turnaround time with reliable delivery across India' },
    { icon: 'fas fa-palette', title: 'Custom Design', desc: 'Professional design services to bring your vision to life' },
    { icon: 'fas fa-award', title: 'Quality Assured', desc: 'Premium quality materials and printing guaranteed' }
  ];

  const categories = [
    { value: 'tshirts', label: 'T-Shirts' },
    { value: 'hoodies', label: 'Hoodies' },
    { value: 'mementos', label: 'Momentum/Mementos' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'alumni-kits', label: 'Alumni Kits' },
    { value: 'event-merchandise', label: 'Event Merchandise' },
    { value: 'custom', label: 'Custom Products' }
  ];

  const organizationTypes = [
    'School/College',
    'Corporate Company',
    'Alumni Association',
    'NGO/Non-Profit',
    'Government Organization',
    'Event Management Company',
    'Other'
  ];

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
              Product Requirements
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                  placeholder="e.g., Alumni T-Shirt 2025"
                />
              </div>
              <div className="form-group-contact">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-contact">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  className="form-input-contact"
                  placeholder="Minimum 50 pieces"
                  min="50"
                />
              </div>
              <div className="form-group-contact">
                <label>Size Range</label>
                <input
                  type="text"
                  name="sizeRange"
                  value={formData.sizeRange}
                  onChange={handleInputChange}
                  className="form-input-contact"
                  placeholder="e.g., S, M, L, XL, XXL"
                />
              </div>
              <div className="form-group-contact">
                <label>Color Preferences</label>
                <input
                  type="text"
                  name="colorPreferences"
                  value={formData.colorPreferences}
                  onChange={handleInputChange}
                  className="form-input-contact"
                  placeholder="e.g., Navy Blue, White"
                />
              </div>
              <div className="form-group-contact">
                <label>Material Preference</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="form-input-contact"
                  placeholder="e.g., Cotton 180 GSM"
                />
              </div>
              <div className="form-group-contact">
                <label>Budget per Piece (₹)</label>
                <input
                  type="number"
                  name="budgetPerPiece"
                  value={formData.budgetPerPiece}
                  onChange={handleInputChange}
                  className="form-input-contact"
                  placeholder="Your budget"
                />
              </div>
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

        <div style={{ marginTop: '60px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '28px', 
            fontWeight: '800', 
            marginBottom: '40px', 
            color: '#0f172a' 
          }}>
            Why Choose Our Bulk Orders?
          </h2>
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderSimple;

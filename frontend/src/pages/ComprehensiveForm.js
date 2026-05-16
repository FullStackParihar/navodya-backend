import React, { useState } from 'react';

const ComprehensiveForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    // Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    // Education/Work
    schoolName: '',
    graduationYear: '',
    currentCompany: '',
    jobTitle: '',
    // Product Information
    productType: '',
    quantity: '',
    size: '',
    color: '',
    material: '',
    budget: '',
    // Customization
    customization: '',
    designDetails: '',
    logoUpload: null,
    // Delivery
    deliveryMethod: '',
    deliveryDate: '',
    specialInstructions: '',
    // Payment
    paymentMethod: '',
    // Additional
    referralSource: '',
    newsletter: false,
    terms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Form submitted successfully!');
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
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
            Comprehensive Form
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#64748b' 
          }}>
            Everything you need in one place
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
          {/* Section 1 */}
          <div className="bulk-form-section">
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-user" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Personal Information
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="form-input-contact" placeholder="First Name" />
              </div>
              <div className="form-group-contact">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="form-input-contact" placeholder="Last Name" />
              </div>
              <div className="form-group-contact">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="form-input-contact" placeholder="email@example.com" />
              </div>
              <div className="form-group-contact">
                <label>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="form-input-contact" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="form-group-contact">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="form-input-contact" />
              </div>
              <div className="form-group-contact">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="form-input-contact">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bulk-form-section">
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-home" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Address Details
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact" style={{ gridColumn: '1 / -1' }}>
                <label>Full Address *</label>
                <textarea name="address" rows="2" value={formData.address} onChange={handleInputChange} required className="form-textarea-contact" placeholder="Street, Landmark" />
              </div>
              <div className="form-group-contact">
                <label>City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="form-input-contact" placeholder="City" />
              </div>
              <div className="form-group-contact">
                <label>State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="form-input-contact" placeholder="State" />
              </div>
              <div className="form-group-contact">
                <label>Pincode *</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required className="form-input-contact" placeholder="XXXXXX" />
              </div>
              <div className="form-group-contact">
                <label>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="form-input-contact" />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bulk-form-section">
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-graduation-cap" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Education & Work
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact">
                <label>School/College Name</label>
                <input type="text" name="schoolName" value={formData.schoolName} onChange={handleInputChange} className="form-input-contact" placeholder="JNV Name" />
              </div>
              <div className="form-group-contact">
                <label>Graduation Year</label>
                <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleInputChange} className="form-input-contact" placeholder="2020" min="1990" max="2030" />
              </div>
              <div className="form-group-contact">
                <label>Current Company</label>
                <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} className="form-input-contact" placeholder="Company Name" />
              </div>
              <div className="form-group-contact">
                <label>Job Title</label>
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="form-input-contact" placeholder="Your Role" />
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bulk-form-section">
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-shopping-cart" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Product Requirements
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact">
                <label>Product Type</label>
                <select name="productType" value={formData.productType} onChange={handleInputChange} className="form-input-contact">
                  <option value="">Select</option>
                  <option value="tshirt">T-Shirt</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="memento">Memento</option>
                  <option value="accessory">Accessory</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="form-group-contact">
                <label>Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="form-input-contact" placeholder="50" min="1" />
              </div>
              <div className="form-group-contact">
                <label>Size</label>
                <select name="size" value={formData.size} onChange={handleInputChange} className="form-input-contact">
                  <option value="">Select</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div className="form-group-contact">
                <label>Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleInputChange} className="form-input-contact" placeholder="Navy Blue" />
              </div>
              <div className="form-group-contact">
                <label>Material</label>
                <input type="text" name="material" value={formData.material} onChange={handleInputChange} className="form-input-contact" placeholder="Cotton 180 GSM" />
              </div>
              <div className="form-group-contact">
                <label>Budget (₹)</label>
                <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="form-input-contact" placeholder="500" />
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bulk-form-section">
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-palette" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Customization & Delivery
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact">
                <label>Customization Needed?</label>
                <select name="customization" value={formData.customization} onChange={handleInputChange} className="form-input-contact">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group-contact">
                <label>Upload Logo/Design</label>
                <input type="file" name="logoUpload" accept=".png,.jpg,.jpeg,.pdf" onChange={handleInputChange} className="form-input-contact" />
              </div>
              <div className="form-group-contact">
                <label>Delivery Method</label>
                <select name="deliveryMethod" value={formData.deliveryMethod} onChange={handleInputChange} className="form-input-contact">
                  <option value="">Select</option>
                  <option value="standard">Standard (5-7 days)</option>
                  <option value="express">Express (2-3 days)</option>
                  <option value="pickup">Self Pickup</option>
                </select>
              </div>
              <div className="form-group-contact">
                <label>Expected Delivery Date</label>
                <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} className="form-input-contact" />
              </div>
              <div className="form-group-contact" style={{ gridColumn: 'span 2' }}>
                <label>Design Details</label>
                <textarea name="designDetails" rows="2" value={formData.designDetails} onChange={handleInputChange} className="form-textarea-contact" placeholder="Tell us about your design requirements..." />
              </div>
              <div className="form-group-contact" style={{ gridColumn: '1 / -1' }}>
                <label>Special Instructions</label>
                <textarea name="specialInstructions" rows="2" value={formData.specialInstructions} onChange={handleInputChange} className="form-textarea-contact" placeholder="Any other instructions..." />
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bulk-form-section">
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              marginBottom: '24px', 
              color: '#0f172a', 
              borderBottom: '2px solid #e2e8f0', 
              paddingBottom: '12px' 
            }}>
              <i className="fas fa-credit-card" style={{ marginRight: '10px', color: '#2563eb' }}></i>
              Payment & Additional
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-group-contact">
                <label>Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="form-input-contact">
                  <option value="">Select</option>
                  <option value="upi">UPI</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
              <div className="form-group-contact">
                <label>How did you hear about us?</label>
                <select name="referralSource" value={formData.referralSource} onChange={handleInputChange} className="form-input-contact">
                  <option value="">Select</option>
                  <option value="friend">Friend/Alumni</option>
                  <option value="social">Social Media</option>
                  <option value="google">Google</option>
                  <option value="event">Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group-contact" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="newsletter" checked={formData.newsletter} onChange={handleInputChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  Subscribe to our newsletter for updates and offers
                </label>
              </div>
              <div className="form-group-contact" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInputChange} required style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  I agree to the terms and conditions *
                </label>
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
              <><i className="fas fa-spinner fa-spin"></i> Submitting...</>
            ) : (
              <><i className="fas fa-paper-plane"></i> Submit Form</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComprehensiveForm;

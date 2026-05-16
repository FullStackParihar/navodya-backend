import React, { useState } from 'react';
import '../styles/ui-enhanced.css';

const BulkOrderNew = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    city: '',
    state: '',
    pincode: '',
    requiredDate: '',
    budget: '',
    additionalNotes: ''
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      productName: '',
      category: 'tshirts',
      sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, '3xl': 0, '4xl': 0 },
      description: '',
      specifications: '',
      designRequirements: ''
    }
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const categories = [
    { value: 'tshirts', label: 'T-Shirts', icon: 'fas fa-tshirt' },
    { value: 'hoodies', label: 'Hoodies', icon: 'fas fa-tshirt' },
    { value: 'polo', label: 'Polo Shirts', icon: 'fas fa-tshirt' },
    { value: 'caps', label: 'Caps', icon: 'fas fa-hat-cowboy' },
    { value: 'bags', label: 'Bags', icon: 'fas fa-shopping-bag' },
    { value: 'accessories', label: 'Accessories', icon: 'fas fa-star' },
    { value: 'custom', label: 'Custom Product', icon: 'fas fa-cog' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      updatedProducts[index][parentField][childField] = value;
    } else {
      updatedProducts[index][field] = value;
    }
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, {
      id: Date.now(),
      productName: '',
      category: 'tshirts',
      sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, '3xl': 0, '4xl': 0 },
      description: '',
      specifications: '',
      designRequirements: ''
    }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const calculateTotalQuantity = (product) => {
    return Object.values(product.sizes).reduce((sum, qty) => sum + parseInt(qty || 0), 0);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.organizationName && formData.contactPerson && formData.email && formData.phone;
      case 2:
        return products.some(p => p.productName && p.category && calculateTotalQuantity(p) > 0);
      case 3:
        return products.every(p => p.designRequirements);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please fill in all required fields for this step');
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Your bulk order request has been submitted successfully! We will contact you within 24 hours.');
      setTimeout(() => {
        setSubmitMessage('');
        setCurrentStep(1);
        setFormData({
          organizationName: '',
          contactPerson: '',
          email: '',
          phone: '',
          deliveryAddress: '',
          city: '',
          state: '',
          pincode: '',
          requiredDate: '',
          budget: '',
          additionalNotes: ''
        });
        setProducts([{
          id: 1,
          productName: '',
          category: 'tshirts',
          sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, '3xl': 0, '4xl': 0 },
          description: '',
          specifications: '',
          designRequirements: ''
        }]);
      }, 5000);
    }, 2000);
  };

  return (
    <div className="bulk-order-page">
      {/* Hero Section */}
      <section className="category-hero">
        <div className="container">
          <div className="category-hero-content">
            <h1 className="category-title animate-slideInLeft">Bulk Order Request</h1>
            <p className="category-subtitle animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
              Get custom merchandise for your organization, event, or team
            </p>
            <div className="category-stats animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <span className="stat-item">
                <i className="fas fa-users"></i> 500+ Organizations
              </span>
              <span className="stat-item">
                <i className="fas fa-box"></i> 10,000+ Orders
              </span>
              <span className="stat-item">
                <i className="fas fa-star"></i> 4.9 Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="progress-section">
        <div className="container">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} animate-fadeIn`}>
              <div className="step-number">
                <i className="fas fa-user"></i>
              </div>
              <div className="step-label">Contact Info</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} animate-fadeIn`} style={{ animationDelay: '0.1s' }}>
              <div className="step-number">
                <i className="fas fa-box"></i>
              </div>
              <div className="step-label">Product Details</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''} animate-fadeIn`} style={{ animationDelay: '0.2s' }}>
              <div className="step-number">
                <i className="fas fa-palette"></i>
              </div>
              <div className="step-label">Design & Upload</div>
            </div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''} animate-fadeIn`} style={{ animationDelay: '0.3s' }}>
              <div className="step-number">
                <i className="fas fa-check"></i>
              </div>
              <div className="step-label">Review & Submit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="form-content">
        <div className="container">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <div className="form-step animate-fadeIn">
                <div className="step-header">
                  <h2>
                    <i className="fas fa-building"></i> Organization Information
                  </h2>
                  <p>Please provide your organization details</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Organization Name *</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      placeholder="Your organization name"
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Contact Person *</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="Name of contact person"
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Delivery Address</label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      placeholder="Complete delivery address"
                      rows="3"
                      className="form-textarea"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City name"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State name"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Required Date</label>
                    <input
                      type="date"
                      name="requiredDate"
                      value={formData.requiredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Estimated Budget</label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="e.g., ₹50,000 - ₹1,00,000"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Product Details */}
            {currentStep === 2 && (
              <div className="form-step animate-fadeIn">
                <div className="step-header">
                  <h2>
                    <i className="fas fa-box"></i> Product Details
                  </h2>
                  <button type="button" className="btn-add-product" onClick={addProduct}>
                    <i className="fas fa-plus"></i> Add Another Product
                  </button>
                </div>
                
                {products.map((product, index) => (
                  <div key={product.id} className="product-card animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    {products.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-product"
                        onClick={() => removeProduct(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                    
                    <h3>Product {index + 1}</h3>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Product Name *</label>
                        <input
                          type="text"
                          value={product.productName}
                          onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                          placeholder="e.g., JNV Alumni T-Shirt"
                          required
                          className="form-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          value={product.category}
                          onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                          required
                          className="form-select"
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description</label>
                        <textarea
                          value={product.description}
                          onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                          placeholder="Describe your product requirements"
                          rows="3"
                          className="form-textarea"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Specifications</label>
                        <textarea
                          value={product.specifications}
                          onChange={(e) => handleProductChange(index, 'specifications', e.target.value)}
                          placeholder="Material, quality, printing method, etc."
                          rows="3"
                          className="form-textarea"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Sizes & Quantities</label>
                        <div className="size-grid">
                          {Object.entries(product.sizes).map(([size, quantity]) => (
                            <div key={size} className="size-input">
                              <label>{size.toUpperCase()}</label>
                              <input
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => handleProductChange(index, `sizes.${size}`, e.target.value)}
                                placeholder="0"
                                className="size-input-field"
                              />
                            </div>
                          ))}
                          <div className="total-quantity">
                            <label>Total</label>
                            <input
                              type="text"
                              value={calculateTotalQuantity(product)}
                              readOnly
                              className="total-input-field"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Design & Upload */}
            {currentStep === 3 && (
              <div className="form-step animate-fadeIn">
                <div className="step-header">
                  <h2>
                    <i className="fas fa-palette"></i> Design & Requirements
                  </h2>
                  <p>Please provide design requirements and upload files</p>
                </div>
                
                {products.map((product, index) => (
                  <div key={product.id} className="product-card animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    <h3>{product.productName || `Product ${index + 1}`}</h3>
                    
                    <div className="form-group">
                      <label>Design Requirements</label>
                      <textarea
                        value={product.designRequirements}
                        onChange={(e) => handleProductChange(index, 'designRequirements', e.target.value)}
                        placeholder="Describe your design requirements, colors, placement, etc."
                        rows="4"
                        className="form-textarea"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Upload Design Files</label>
                      <div className="upload-area">
                        <input
                          type="file"
                          id={`files-${product.id}`}
                          multiple
                          accept="image/*,.pdf,.ai,.eps,.svg"
                          style={{ display: 'none' }}
                        />
                        <label htmlFor={`files-${product.id}`} className="upload-label">
                          <i className="fas fa-cloud-upload-alt"></i>
                          <span>Click to upload or drag and drop</span>
                          <small>PNG, JPG, PDF, AI, EPS, SVG (Max 10MB per file)</small>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="form-step animate-fadeIn">
                <div className="step-header">
                  <h2>
                    <i className="fas fa-check"></i> Review Your Order
                  </h2>
                  <p>Please review your order details before submission</p>
                </div>
                
                <div className="review-section">
                  <div className="review-card">
                    <h3>Organization Information</h3>
                    <div className="review-grid">
                      <div className="review-item">
                        <label>Organization:</label>
                        <span>{formData.organizationName}</span>
                      </div>
                      <div className="review-item">
                        <label>Contact Person:</label>
                        <span>{formData.contactPerson}</span>
                      </div>
                      <div className="review-item">
                        <label>Email:</label>
                        <span>{formData.email}</span>
                      </div>
                      <div className="review-item">
                        <label>Phone:</label>
                        <span>{formData.phone}</span>
                      </div>
                      <div className="review-item">
                        <label>Delivery Address:</label>
                        <span>{formData.deliveryAddress}</span>
                      </div>
                      <div className="review-item">
                        <label>Required Date:</label>
                        <span>{formData.requiredDate}</span>
                      </div>
                      <div className="review-item">
                        <label>Budget:</label>
                        <span>{formData.budget}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="review-card">
                    <h3>Products Summary</h3>
                    {products.map((product, index) => (
                      <div key={product.id} className="product-review">
                        <h4>Product {index + 1}: {product.productName}</h4>
                        <div className="product-details">
                          <p><strong>Category:</strong> {categories.find(c => c.value === product.category)?.label}</p>
                          <p><strong>Quantity:</strong> {calculateTotalQuantity(product)} pieces</p>
                          <p><strong>Sizes:</strong> {Object.entries(product.sizes)
                            .filter(([_, qty]) => qty > 0)
                            .map(([size, qty]) => `${size.toUpperCase()}: ${qty}`)
                            .join(', ') || 'Not specified'}</p>
                          {product.description && (
                            <p><strong>Description:</strong> {product.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="Any additional requirements or special instructions"
                      rows="4"
                      className="form-textarea"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" className="btn-secondary" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
              )}
              
              {currentStep < 4 && (
                <button type="button" className="btn-primary" onClick={nextStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              )}
              
              {currentStep === 4 && (
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i> Submit Order Request
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Success Message */}
          {submitMessage && (
            <div className="success-message animate-fadeIn">
              <i className="fas fa-check-circle"></i>
              <p>{submitMessage}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BulkOrderNew;

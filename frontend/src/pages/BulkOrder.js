import React, { useState } from 'react';

const BulkOrder = () => {
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
      quantity: '',
      sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, '3xl': 0, '4xl': 0 },
      description: '',
      specifications: '',
      uploadedImages: [],
      designRequirements: ''
    }
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const categories = [
    { value: 'tshirts', label: 'T-Shirts' },
    { value: 'hoodies', label: 'Hoodies' },
    { value: 'polo', label: 'Polo Shirts' },
    { value: 'caps', label: 'Caps' },
    { value: 'bags', label: 'Bags' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'custom', label: 'Custom Product' }
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

  const handleImageUpload = (productIndex, e) => {
    const files = Array.from(e.target.files);
    const updatedProducts = [...products];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updatedProducts[productIndex].uploadedImages.push({
            name: file.name,
            url: event.target.result,
            size: file.size
          });
          setProducts([...updatedProducts]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (productIndex, imageIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].uploadedImages.splice(imageIndex, 1);
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, {
      id: Date.now(),
      productName: '',
      category: 'tshirts',
      quantity: '',
      sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, '3xl': 0, '4xl': 0 },
      description: '',
      specifications: '',
      uploadedImages: [],
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
        return products.every(p => p.uploadedImages.length > 0 || p.designRequirements);
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
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Your bulk order request has been submitted successfully! We will contact you within 24 hours.');
      // Reset form after successful submission
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
          quantity: '',
          sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, '3xl': 0, '4xl': 0 },
          description: '',
          specifications: '',
          uploadedImages: [],
          designRequirements: ''
        }]);
      }, 5000);
    }, 2000);
  };

  return (
    <div className="bulk-order-page">
      <div className="container">
        {/* Header */}
        <div className="bulk-order-header">
          <h1>Bulk Order Request</h1>
          <p>Get custom merchandise for your organization, event, or team</p>
          
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Contact Info</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Product Details</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Design & Upload</div>
            </div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Review & Submit</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="form-step animate-fadeIn">
              <h2>Organization Information</h2>
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
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Product Details */}
          {currentStep === 2 && (
            <div className="form-step animate-fadeIn">
              <div className="step-header">
                <h2>Product Details</h2>
                <button type="button" className="btn-add-product" onClick={addProduct}>
                  <i className="fas fa-plus"></i> Add Another Product
                </button>
              </div>
              
              {products.map((product, index) => (
                <div key={product.id} className="product-card">
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
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={product.category}
                        onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Specifications</label>
                      <textarea
                        value={product.specifications}
                        onChange={(e) => handleProductChange(index, 'specifications', e.target.value)}
                        placeholder="Material, quality, printing method, etc."
                        rows="3"
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
                            />
                          </div>
                        ))}
                        <div className="total-quantity">
                          <label>Total</label>
                          <input
                            type="text"
                            value={calculateTotalQuantity(product)}
                            readOnly
                            className="total-input"
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
              <h2>Design & File Upload</h2>
              
              {products.map((product, index) => (
                <div key={product.id} className="product-card">
                  <h3>{product.productName || `Product ${index + 1}`}</h3>
                  
                  <div className="form-group">
                    <label>Design Requirements</label>
                    <textarea
                      value={product.designRequirements}
                      onChange={(e) => handleProductChange(index, 'designRequirements', e.target.value)}
                      placeholder="Describe your design requirements, colors, placement, etc."
                      rows="4"
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
                        onChange={(e) => handleImageUpload(index, e)}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor={`files-${product.id}`} className="upload-label">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Click to upload or drag and drop</span>
                        <small>PNG, JPG, PDF, AI, EPS, SVG (Max 10MB per file)</small>
                      </label>
                    </div>
                    
                    {product.uploadedImages.length > 0 && (
                      <div className="uploaded-files">
                        <h4>Uploaded Files:</h4>
                        <div className="file-grid">
                          {product.uploadedImages.map((file, fileIndex) => (
                            <div key={fileIndex} className="file-item">
                              <div className="file-preview">
                                {file.url.includes('data:image') ? (
                                  <img src={file.url} alt={file.name} />
                                ) : (
                                  <div className="file-icon">
                                    <i className="fas fa-file-image"></i>
                                  </div>
                                )}
                              </div>
                              <div className="file-info">
                                <p className="file-name">{file.name}</p>
                                <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                              <button
                                type="button"
                                className="btn-remove-file"
                                onClick={() => removeImage(index, fileIndex)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="form-step animate-fadeIn">
              <h2>Review Your Order</h2>
              
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
                      <label>City:</label>
                      <span>{formData.city}</span>
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
                        {product.uploadedImages.length > 0 && (
                          <p><strong>Files Uploaded:</strong> {product.uploadedImages.length} files</p>
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

      <style jsx>{`
        .bulk-order-page {
          padding: 2rem 0;
          min-height: 100vh;
          background: var(--bg-secondary, #f8fafc);
        }

        .bulk-order-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .bulk-order-header h1 {
          font-size: 2.5rem;
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.5rem;
        }

        .bulk-order-header p {
          color: var(--text-secondary, #64748b);
          font-size: 1.125rem;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gray-200, #e2e8f0);
          color: var(--text-secondary, #64748b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all var(--transition-normal);
        }

        .step.active .step-number {
          background: var(--gradient-primary, linear-gradient(135deg, #2f4a67, #23394f));
          color: white;
        }

        .step-label {
          font-size: 0.875rem;
          color: var(--text-secondary, #64748b);
          font-weight: 500;
        }

        .step.active .step-label {
          color: var(--primary-color, #2f4a67);
        }

        .form-step {
          background: var(--bg-primary, white);
          border-radius: var(--radius-2xl, 1.5rem);
          padding: 2rem;
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
          margin-bottom: 2rem;
        }

        .form-step h2 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 2rem;
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .btn-add-product {
          background: var(--success-color, #16a34a);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-add-product:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .product-card {
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-xl, 1rem);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .btn-remove-product {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--danger-color, #dc2626);
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .btn-remove-product:hover {
          transform: scale(1.1);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          color: var(--text-primary, #1e293b);
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-lg, 0.75rem);
          font-size: 0.875rem;
          transition: all var(--transition-fast);
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary-color, #2f4a67);
          box-shadow: 0 0 0 3px rgba(47, 74, 103, 0.18);
        }

        .size-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 1rem;
        }

        .size-input {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .size-input label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary, #64748b);
          margin-bottom: 0.25rem;
        }

        .size-input input {
          width: 60px;
          text-align: center;
        }

        .total-quantity input {
          background: var(--primary-color, #2f4a67);
          color: white;
          font-weight: 600;
        }

        .upload-area {
          border: 2px dashed var(--border-color, #e2e8f0);
          border-radius: var(--radius-xl, 1rem);
          padding: 2rem;
          text-align: center;
          transition: all var(--transition-fast);
        }

        .upload-area:hover {
          border-color: var(--primary-color, #2f4a67);
          background: var(--gray-50, #f8fafc);
        }

        .upload-label {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-label i {
          font-size: 3rem;
          color: var(--primary-color, #2f4a67);
        }

        .upload-label span {
          font-weight: 600;
          color: var(--text-primary, #1e293b);
        }

        .upload-label small {
          color: var(--text-secondary, #64748b);
        }

        .uploaded-files {
          margin-top: 1.5rem;
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-lg, 0.75rem);
          position: relative;
        }

        .file-preview {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md, 0.5rem);
          overflow: hidden;
        }

        .file-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .file-icon {
          width: 50px;
          height: 50px;
          background: var(--gray-100, #f1f5f9);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md, 0.5rem);
          color: var(--text-secondary, #64748b);
        }

        .file-info {
          flex: 1;
        }

        .file-name {
          font-weight: 500;
          color: var(--text-primary, #1e293b);
          margin: 0;
        }

        .file-size {
          font-size: 0.75rem;
          color: var(--text-secondary, #64748b);
          margin: 0;
        }

        .btn-remove-file {
          background: var(--danger-color, #dc2626);
          color: white;
          border: none;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .btn-remove-file:hover {
          transform: scale(1.1);
        }

        .review-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .review-card {
          background: var(--gray-50, #f8fafc);
          border-radius: var(--radius-xl, 1rem);
          padding: 1.5rem;
        }

        .review-card h3 {
          color: var(--text-primary, #1e293b);
          margin-bottom: 1rem;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .review-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
        }

        .review-item label {
          font-weight: 500;
          color: var(--text-secondary, #64748b);
        }

        .review-item span {
          color: var(--text-primary, #1e293b);
          font-weight: 500;
        }

        .product-review {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: var(--radius-lg, 0.75rem);
        }

        .product-review h4 {
          color: var(--primary-color, #2f4a67);
          margin-bottom: 0.5rem;
        }

        .product-details p {
          margin-bottom: 0.5rem;
        }

        .form-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: var(--radius-lg, 0.75rem);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: var(--gradient-primary, linear-gradient(135deg, #2f4a67, #23394f));
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: var(--gray-200, #e2e8f0);
          color: var(--text-primary, #1e293b);
        }

        .btn-secondary:hover {
          background: var(--gray-300, #cbd5e1);
        }

        .success-message {
          background: var(--success-color, #16a34a);
          color: white;
          padding: 1.5rem;
          border-radius: var(--radius-xl, 1rem);
          text-align: center;
          margin-top: 2rem;
        }

        .success-message i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        @media (max-width: 768px) {
          .progress-steps {
            gap: 1rem;
          }
          
          .step-label {
            font-size: 0.75rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .size-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .file-grid {
            grid-template-columns: 1fr;
          }
          
          .form-navigation {
            flex-direction: column;
          }
          
          .form-navigation button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default BulkOrder;

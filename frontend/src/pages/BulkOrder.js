import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const SIZE_KEYS = ['xs', 's', 'm', 'l', 'xl', 'xxl', '3xl', '4xl'];
const MAX_FILES_PER_PRODUCT = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const createProductRow = () => ({
  productKey: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  categoryId: '',
  categoryName: '',
  categorySlug: '',
  productId: '',
  productName: '',
  sku: '',
  isCustomProduct: false,
  description: '',
  specifications: '',
  designRequirements: '',
  sizeQuantities: SIZE_KEYS.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}),
  generalQuantity: 0,
  files: [],
  fileErrors: [],
});

const initialForm = {
  organizationName: '',
  contactPerson: '',
  email: '',
  phone: '',
  deliveryAddress: '',
  city: '',
  state: '',
  pincode: '',
  requiredDate: '',
  estimatedBudget: '',
  additionalNotes: '',
};

const formatFileSize = (size) => `${(size / 1024 / 1024).toFixed(2)} MB`;

const BulkOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [products, setProducts] = useState([createProductRow()]);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const result = await api.get('/categories');
        if (mounted && result.success) {
          setCategories(result.data || []);
        }
      } catch (err) {
        if (mounted) setSubmitError('Unable to load categories. Please try again.');
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };
    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const grandTotalQuantity = useMemo(() => {
    return products.reduce((sum, product) => sum + getProductTotal(product), 0);
  }, [products]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const clearError = (key) => {
    setErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const loadProductsForCategory = async (category) => {
    if (!category?.slug || categoryProducts[category._id]) return;

    setLoadingProducts(prev => ({ ...prev, [category._id]: true }));
    try {
      const result = await api.get(`/products?category=${encodeURIComponent(category.slug)}&limit=100`);
      if (result.success) {
        setCategoryProducts(prev => ({
          ...prev,
          [category._id]: result.data?.products || [],
        }));
      }
    } finally {
      setLoadingProducts(prev => ({ ...prev, [category._id]: false }));
    }
  };

  const updateProduct = (index, updates) => {
    setProducts(prev => prev.map((product, i) => i === index ? { ...product, ...updates } : product));
  };

  const handleCategoryChange = async (index, categoryId) => {
    const category = categories.find(item => item._id === categoryId);
    updateProduct(index, {
      categoryId,
      categoryName: category?.name || '',
      categorySlug: category?.slug || '',
      productId: '',
      productName: '',
      sku: '',
      isCustomProduct: false,
      description: '',
      specifications: '',
      generalQuantity: 0,
      sizeQuantities: SIZE_KEYS.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}),
    });
    clearError(`products.${index}.categoryId`);
    clearError(`products.${index}.productId`);
    if (category) await loadProductsForCategory(category);
  };

  const handleProductSelection = (index, value) => {
    const row = products[index];
    if (value === 'custom') {
      updateProduct(index, {
        productId: 'custom',
        productName: '',
        sku: '',
        isCustomProduct: true,
        description: '',
        specifications: '',
      });
      clearError(`products.${index}.productId`);
      return;
    }

    const selectedProduct = (categoryProducts[row.categoryId] || []).find(item => item._id === value);
    updateProduct(index, {
      productId: value,
      productName: selectedProduct?.name || '',
      sku: selectedProduct?.slug || '',
      isCustomProduct: false,
      description: selectedProduct?.description || '',
      specifications: stringifySpecifications(selectedProduct?.specifications),
    });
    clearError(`products.${index}.productId`);
  };

  const stringifySpecifications = (specifications) => {
    if (!specifications) return '';
    if (typeof specifications === 'string') return specifications;
    return Object.entries(specifications).map(([key, value]) => `${key}: ${value}`).join('\n');
  };

  const handleSizeQuantity = (index, size, value) => {
    const safeValue = Math.max(0, Number(value || 0));
    const nextSizes = {
      ...products[index].sizeQuantities,
      [size]: safeValue,
    };
    updateProduct(index, { sizeQuantities: nextSizes });
    clearError(`products.${index}.quantity`);
  };

  const handleGeneralQuantity = (index, value) => {
    updateProduct(index, { generalQuantity: Math.max(0, Number(value || 0)) });
    clearError(`products.${index}.quantity`);
  };

  const isApparelProduct = (product) => {
    const text = `${product.categorySlug} ${product.categoryName} ${product.productName}`.toLowerCase();
    return ['tshirt', 't-shirt', 'hoodie', 'polo', 'apparel', 'shirt'].some(term => text.includes(term));
  };

  function getProductTotal(product) {
    const sizeTotal = Object.values(product.sizeQuantities || {}).reduce((sum, qty) => sum + Number(qty || 0), 0);
    return sizeTotal + Number(product.generalQuantity || 0);
  }

  const handleFiles = (index, fileList) => {
    const incomingFiles = Array.from(fileList || []);
    const product = products[index];
    const fileErrors = [];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'ai', 'eps', 'svg'];
    const existingKeys = new Set(product.files.map(item => `${item.file.name}-${item.file.size}`));
    const nextFiles = [...product.files];

    incomingFiles.forEach(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      const key = `${file.name}-${file.size}`;
      if (!allowedExtensions.includes(extension)) {
        fileErrors.push(`${file.name}: unsupported file type`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        fileErrors.push(`${file.name}: max file size is 10MB`);
        return;
      }
      if (existingKeys.has(key)) {
        fileErrors.push(`${file.name}: duplicate file`);
        return;
      }
      if (nextFiles.length >= MAX_FILES_PER_PRODUCT) {
        fileErrors.push(`Maximum ${MAX_FILES_PER_PRODUCT} files allowed per product`);
        return;
      }
      existingKeys.add(key);
      nextFiles.push({
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      });
    });

    updateProduct(index, { files: nextFiles, fileErrors });
    clearError(`products.${index}.files`);
  };

  const removeFile = (productIndex, fileIndex) => {
    const fileItem = products[productIndex].files[fileIndex];
    if (fileItem?.previewUrl) URL.revokeObjectURL(fileItem.previewUrl);
    const nextFiles = products[productIndex].files.filter((_, index) => index !== fileIndex);
    updateProduct(productIndex, { files: nextFiles, fileErrors: [] });
  };

  const addProduct = () => {
    setProducts(prev => [...prev, createProductRow()]);
  };

  const removeProduct = (index) => {
    if (products.length === 1) return;
    products[index].files.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  const validate = (step = currentStep) => {
    const nextErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (step >= 1) {
      if (!formData.organizationName.trim()) nextErrors.organizationName = 'Organization name is required';
      if (!formData.contactPerson.trim()) nextErrors.contactPerson = 'Contact person is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Enter a valid email address';
      if (!/^[+]?\d[\d\s-]{7,14}$/.test(formData.phone)) nextErrors.phone = 'Enter a valid phone number';
      if (!formData.deliveryAddress.trim()) nextErrors.deliveryAddress = 'Delivery address is required';
      if (!formData.city.trim()) nextErrors.city = 'City is required';
      if (!formData.state.trim()) nextErrors.state = 'State is required';
      if (!/^\d{6}$/.test(formData.pincode)) nextErrors.pincode = 'Enter a valid 6-digit pincode';
      if (!formData.requiredDate) {
        nextErrors.requiredDate = 'Required date is required';
      } else if (new Date(formData.requiredDate) < today) {
        nextErrors.requiredDate = 'Required date cannot be in the past';
      }
      if (formData.estimatedBudget === '' || Number(formData.estimatedBudget) < 0) {
        nextErrors.estimatedBudget = 'Estimated budget must be zero or more';
      }
    }

    if (step >= 2) {
      products.forEach((product, index) => {
        if (!product.categoryId) nextErrors[`products.${index}.categoryId`] = 'Category is required';
        if (!product.productId) nextErrors[`products.${index}.productId`] = 'Product is required';
        if (product.isCustomProduct && !product.productName.trim()) {
          nextErrors[`products.${index}.productName`] = 'Custom product name is required';
        }
        if (getProductTotal(product) <= 0) {
          nextErrors[`products.${index}.quantity`] = 'Enter quantity greater than zero';
        }
      });
    }

    if (step >= 3) {
      products.forEach((product, index) => {
        if (!product.designRequirements.trim()) {
          nextErrors[`products.${index}.designRequirements`] = 'Design requirements are required';
        }
        if (product.files.length === 0) {
          nextErrors[`products.${index}.files`] = 'Upload at least one design/reference file';
        }
      });
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (validate(currentStep)) {
      setCurrentStep(prev => Math.min(4, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPayload = () => ({
    ...formData,
    estimatedBudget: Number(formData.estimatedBudget),
    products: products.map(product => ({
      productKey: product.productKey,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      productId: product.isCustomProduct ? 'custom' : product.productId,
      productName: product.productName,
      sku: product.sku,
      isCustomProduct: product.isCustomProduct,
      description: product.description,
      specifications: product.specifications,
      designRequirements: product.designRequirements,
      sizeQuantities: product.sizeQuantities,
      generalQuantity: product.generalQuantity,
    })),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessResult(null);

    if (!validate(4)) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('payload', JSON.stringify(buildPayload()));
      products.forEach(product => {
        product.files.forEach(fileItem => {
          data.append(`attachments_${product.productKey}`, fileItem.file);
        });
      });

      const result = await api.post('/bulk-orders', data);
      if (!result.success) {
        try {
          const parsed = JSON.parse(result.message || '{}');
          if (parsed.errors) setErrors(parsed.errors);
          setSubmitError(parsed.message || 'Failed to submit bulk order request');
        } catch (parseError) {
          setSubmitError(result.message || 'Failed to submit bulk order request');
        }
        return;
      }

      setSuccessResult({
        requestNumber: result.data.requestNumber,
        grandTotalQuantity,
        products: products.length,
      });
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError('Network or server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceAnotherOrder = () => {
    products.forEach(product => product.files.forEach(item => item.previewUrl && URL.revokeObjectURL(item.previewUrl)));
    setFormData(initialForm);
    setProducts([createProductRow()]);
    setCurrentStep(1);
    setErrors({});
    setSubmitError('');
    setSuccessResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderError = (key) => errors[key] ? <div className="field-error">{errors[key]}</div> : null;

  return (
    <div className="bulk-order-page">
      <div className="bulk-container">
        {successResult ? (
          <section className="bulk-success-screen" aria-live="polite">
            <div className="bulk-success-icon">
              <i className="fas fa-check" />
            </div>
            <h1>Thank You!</h1>
            <p className="bulk-success-message">Your bulk order request has been submitted successfully.</p>
            {successResult.requestNumber && (
              <div className="bulk-request-id">Request ID: {successResult.requestNumber}</div>
            )}
            <p className="bulk-success-support">Our team will review your request and contact you soon.</p>
            <div className="bulk-success-actions">
              <button type="button" className="btn-primary bulk-success-action" onClick={() => navigate('/my-bulk-orders')}>
                View My Bulk Orders
              </button>
              <button type="button" className="btn-secondary bulk-success-action" onClick={handlePlaceAnotherOrder}>
                Place Another Bulk Order
              </button>
            </div>
          </section>
        ) : (
          <>
        <header className="bulk-order-header">
          <div>
            <p className="bulk-eyebrow">Organization merchandise</p>
            <h1>Bulk Order Request</h1>
            <p>Submit one request with multiple products, sizes, files, and design requirements.</p>
          </div>
          <div className="bulk-total-pill">
            <span>Grand Total</span>
            <strong>{grandTotalQuantity}</strong>
          </div>
        </header>

        <div className="progress-steps" aria-label="Bulk order progress">
          {['Contact Info', 'Products', 'Design Files', 'Review'].map((label, index) => (
            <div key={label} className={`step ${currentStep >= index + 1 ? 'active' : ''}`}>
              <span>{index + 1}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>

        {submitError && <div className="bulk-error-banner">{submitError}</div>}

        <form onSubmit={handleSubmit} className="bulk-form">
          {currentStep === 1 && (
            <section className="bulk-panel">
              <h2>Contact & Delivery Information</h2>
              <div className="bulk-grid">
                {[
                  ['organizationName', 'Organization Name *', 'Your organization name'],
                  ['contactPerson', 'Contact Person *', 'Name of contact person'],
                  ['email', 'Email Address *', 'your@email.com', 'email'],
                  ['phone', 'Phone Number *', '+91 98765 43210', 'tel'],
                  ['city', 'City *', 'City name'],
                  ['state', 'State *', 'State name'],
                  ['pincode', 'Pincode *', '6-digit pincode'],
                  ['requiredDate', 'Required Date *', '', 'date'],
                  ['estimatedBudget', 'Estimated Budget *', '50000', 'number'],
                ].map(([name, label, placeholder, type = 'text']) => (
                  <label className="bulk-field" key={name}>
                    <span>{label}</span>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      min={type === 'date' ? new Date().toISOString().split('T')[0] : type === 'number' ? '0' : undefined}
                    />
                    {renderError(name)}
                  </label>
                ))}
                <label className="bulk-field full">
                  <span>Delivery Address *</span>
                  <textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleInputChange} rows="3" placeholder="Complete delivery address" />
                  {renderError('deliveryAddress')}
                </label>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="bulk-panel">
              <div className="bulk-section-title">
                <div>
                  <h2>Product Details</h2>
                  <p>Add all required products under this single bulk request.</p>
                </div>
                <button type="button" className="btn-add-product" onClick={addProduct}>
                  <i className="fas fa-plus" /> Add Another Product
                </button>
              </div>

              {products.map((product, index) => {
                const productOptions = categoryProducts[product.categoryId] || [];
                const showSizeQuantities = isApparelProduct(product);
                return (
                  <article className="bulk-product-card" key={product.productKey}>
                    <div className="product-card-header">
                      <h3>Product {index + 1}</h3>
                      <div>
                        <span className="product-total">Total: {getProductTotal(product)}</span>
                        {products.length > 1 && (
                          <button type="button" className="btn-remove-product" onClick={() => removeProduct(index)}>
                            <i className="fas fa-trash" /> Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bulk-grid">
                      <label className="bulk-field">
                        <span>Category *</span>
                        <select value={product.categoryId} onChange={(event) => handleCategoryChange(index, event.target.value)} disabled={loadingCategories}>
                          <option value="">{loadingCategories ? 'Loading categories...' : 'Select category'}</option>
                          {categories.map(category => (
                            <option value={category._id} key={category._id}>{category.name}</option>
                          ))}
                        </select>
                        {renderError(`products.${index}.categoryId`)}
                      </label>

                      <label className="bulk-field">
                        <span>Product Name *</span>
                        <select value={product.productId} onChange={(event) => handleProductSelection(index, event.target.value)} disabled={!product.categoryId || loadingProducts[product.categoryId]}>
                          <option value="">
                            {!product.categoryId ? 'Select category first' : loadingProducts[product.categoryId] ? 'Loading products...' : productOptions.length ? 'Select product' : 'No catalogue products found'}
                          </option>
                          {productOptions.map(item => (
                            <option value={item._id} key={item._id}>{item.name}</option>
                          ))}
                          <option value="custom">Custom Product</option>
                        </select>
                        {renderError(`products.${index}.productId`)}
                      </label>

                      {product.isCustomProduct && (
                        <label className="bulk-field">
                          <span>Custom Product Name *</span>
                          <input value={product.productName} onChange={(event) => updateProduct(index, { productName: event.target.value })} placeholder="Custom product name" />
                          {renderError(`products.${index}.productName`)}
                        </label>
                      )}

                      <label className="bulk-field full">
                        <span>Description</span>
                        <textarea value={product.description} onChange={(event) => updateProduct(index, { description: event.target.value })} rows="3" placeholder="Product requirements, purpose, or notes" />
                      </label>

                      <label className="bulk-field full">
                        <span>Specifications / Size or Dimensions</span>
                        <textarea value={product.specifications} onChange={(event) => updateProduct(index, { specifications: event.target.value })} rows="3" placeholder="Material, print method, dimensions, finish, packaging, etc." />
                      </label>

                      <div className="bulk-field full">
                        <span>{showSizeQuantities ? 'Size-wise Quantity *' : 'Quantity *'}</span>
                        {showSizeQuantities ? (
                          <div className="size-grid">
                            {SIZE_KEYS.map(size => (
                              <label className="size-input" key={size}>
                                <span>{size.toUpperCase()}</span>
                                <input type="number" min="0" value={product.sizeQuantities[size]} onChange={(event) => handleSizeQuantity(index, size, event.target.value)} />
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input type="number" min="0" value={product.generalQuantity} onChange={(event) => handleGeneralQuantity(index, event.target.value)} placeholder="Total pieces" />
                        )}
                        {renderError(`products.${index}.quantity`)}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          {currentStep === 3 && (
            <section className="bulk-panel">
              <h2>Design Requirements & Attachments</h2>
              {products.map((product, index) => (
                <article className="bulk-product-card" key={product.productKey}>
                  <div className="product-card-header">
                    <h3>Product {index + 1}: {product.productName || 'Not selected'}</h3>
                    <span className="product-total">Total: {getProductTotal(product)}</span>
                  </div>

                  <label className="bulk-field">
                    <span>Design Requirements *</span>
                    <textarea value={product.designRequirements} onChange={(event) => updateProduct(index, { designRequirements: event.target.value })} rows="4" placeholder="Colors, logo placement, print area, references, text, etc." />
                    {renderError(`products.${index}.designRequirements`)}
                  </label>

                  <div className="bulk-field">
                    <span>Upload Design / Reference Files *</span>
                    <label className="bulk-upload">
                      <input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.ai,.eps,.svg" onChange={(event) => handleFiles(index, event.target.files)} />
                      <i className="fas fa-cloud-upload-alt" />
                      <strong>Choose files</strong>
                      <small>Images, PDF, AI, EPS, SVG | Max 10MB each | Max {MAX_FILES_PER_PRODUCT} files</small>
                    </label>
                    {renderError(`products.${index}.files`)}
                    {product.fileErrors.map(message => <div className="field-error" key={message}>{message}</div>)}
                  </div>

                  {product.files.length > 0 && (
                    <div className="file-grid">
                      {product.files.map((item, fileIndex) => (
                        <div className="file-card" key={`${item.file.name}-${fileIndex}`}>
                          <div className="file-thumb">
                            {item.previewUrl ? <img src={item.previewUrl} alt={item.file.name} /> : <i className="fas fa-file-alt" />}
                          </div>
                          <div>
                            <strong>{item.file.name}</strong>
                            <span>{formatFileSize(item.file.size)}</span>
                          </div>
                          <button type="button" onClick={() => removeFile(index, fileIndex)} aria-label="Remove file">
                            <i className="fas fa-times" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}

          {currentStep === 4 && (
            <section className="bulk-panel">
              <h2>Review & Submit</h2>
              <div className="review-layout">
                <div className="review-card">
                  <h3>Customer Information</h3>
                  <p><strong>Organization:</strong> {formData.organizationName}</p>
                  <p><strong>Contact:</strong> {formData.contactPerson}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Address:</strong> {formData.deliveryAddress}, {formData.city}, {formData.state} - {formData.pincode}</p>
                  <p><strong>Required Date:</strong> {formData.requiredDate}</p>
                  <p><strong>Budget:</strong> ₹{Number(formData.estimatedBudget || 0).toLocaleString('en-IN')}</p>
                </div>

                <div className="review-card">
                  <h3>Products Summary</h3>
                  {products.map((product, index) => (
                    <div className="review-product" key={product.productKey}>
                      <h4>Product {index + 1}: {product.productName}</h4>
                      <p><strong>Category:</strong> {product.categoryName}</p>
                      <p><strong>Total Quantity:</strong> {getProductTotal(product)}</p>
                      <p><strong>Files:</strong> {product.files.length}</p>
                      <p><strong>Design:</strong> {product.designRequirements}</p>
                    </div>
                  ))}
                  <div className="grand-total">Grand Total Quantity: {grandTotalQuantity}</div>
                </div>

                <label className="bulk-field">
                  <span>Additional Notes</span>
                  <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} rows="4" placeholder="Any additional requirements or special instructions" />
                </label>
              </div>
            </section>
          )}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn-secondary" onClick={prevStep} disabled={isSubmitting}>
                <i className="fas fa-arrow-left" /> Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button type="button" className="btn-primary" onClick={nextStep}>
                Next <i className="fas fa-arrow-right" />
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <><i className="fas fa-spinner fa-spin" /> Submitting...</> : <><i className="fas fa-check" /> Submit Bulk Order</>}
              </button>
            )}
          </div>
        </form>
          </>
        )}
      </div>

      <style>{`
        .bulk-order-page {
          min-height: 100vh;
          padding: 32px 0 56px;
          background: #f8fafc;
          color: #111827;
        }
        .bulk-container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }
        .bulk-order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 22px;
        }
        .bulk-eyebrow {
          margin: 0 0 8px;
          color: #2f4a67;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 12px;
        }
        .bulk-order-header h1 {
          margin: 0;
          font-size: 34px;
          line-height: 1.1;
        }
        .bulk-order-header p {
          margin: 8px 0 0;
          color: #64748b;
        }
        .bulk-total-pill {
          min-width: 140px;
          padding: 14px 18px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          text-align: center;
        }
        .bulk-total-pill span {
          display: block;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }
        .bulk-total-pill strong {
          display: block;
          font-size: 28px;
          color: #2f4a67;
        }
        .progress-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 22px;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 12px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
        }
        .step span {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          color: #64748b;
          font-weight: 800;
          flex: 0 0 auto;
        }
        .step p {
          margin: 0;
          font-weight: 700;
          font-size: 13px;
          overflow-wrap: anywhere;
        }
        .step.active {
          border-color: #2f4a67;
        }
        .step.active span {
          background: #2f4a67;
          color: #ffffff;
        }
        .bulk-panel,
        .bulk-error-banner {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
        }
        .bulk-panel {
          padding: 24px;
        }
        .bulk-panel h2 {
          margin: 0 0 18px;
          font-size: 22px;
        }
        .bulk-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .bulk-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }
        .bulk-field.full {
          grid-column: 1 / -1;
        }
        .bulk-field > span {
          font-size: 13px;
          font-weight: 800;
          color: #334155;
        }
        .bulk-field input,
        .bulk-field select,
        .bulk-field textarea {
          width: 100%;
          min-height: 42px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 12px;
          font: inherit;
          background: #ffffff;
        }
        .bulk-field textarea {
          resize: vertical;
        }
        .field-error {
          color: #dc2626;
          font-size: 12px;
          font-weight: 700;
        }
        .bulk-error-banner {
          padding: 14px 16px;
          margin-bottom: 16px;
          color: #991b1b;
          background: #fef2f2;
          border-color: #fecaca;
          font-weight: 700;
        }
        .bulk-success-screen {
          width: min(680px, 100%);
          margin: 48px auto 0;
          padding: 44px 34px;
          border: 1px solid #dbeafe;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.10);
          text-align: center;
        }
        .bulk-success-icon {
          width: 76px;
          height: 76px;
          margin: 0 auto 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ecfdf5;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          font-size: 34px;
        }
        .bulk-success-screen h1 {
          margin: 0;
          color: #111827;
          font-size: 36px;
          line-height: 1.1;
        }
        .bulk-success-message {
          margin: 14px auto 0;
          color: #334155;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.5;
        }
        .bulk-request-id {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 18px;
          padding: 10px 16px;
          border-radius: 8px;
          background: #eff6ff;
          color: #1d4ed8;
          font-family: monospace;
          font-size: 16px;
          font-weight: 800;
        }
        .bulk-success-support {
          margin: 18px auto 0;
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
        }
        .bulk-success-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }
        .bulk-success-action {
          min-width: 230px;
          justify-content: center;
        }
        .bulk-section-title,
        .product-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }
        .bulk-section-title p {
          margin: 4px 0 0;
          color: #64748b;
        }
        .btn-add-product,
        .btn-remove-product,
        .btn-primary,
        .btn-secondary {
          border: 0;
          border-radius: 8px;
          min-height: 40px;
          padding: 0 16px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
        }
        .btn-add-product {
          background: #16a34a;
          color: #ffffff;
        }
        .btn-remove-product {
          background: #fee2e2;
          color: #991b1b;
        }
        .btn-primary {
          background: #2f4a67;
          color: #ffffff;
        }
        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .btn-secondary {
          background: #e5e7eb;
          color: #111827;
        }
        .bulk-product-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 18px;
          margin-bottom: 16px;
          background: #fbfdff;
        }
        .product-card-header h3 {
          margin: 0;
          font-size: 18px;
        }
        .product-card-header > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .product-total,
        .grand-total {
          background: #eff6ff;
          color: #1d4ed8;
          border-radius: 8px;
          padding: 8px 12px;
          font-weight: 800;
          font-size: 13px;
        }
        .size-grid {
          display: grid;
          grid-template-columns: repeat(8, minmax(64px, 1fr));
          gap: 10px;
        }
        .size-input {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .size-input span {
          font-size: 12px;
          font-weight: 800;
          color: #64748b;
        }
        .size-input input {
          text-align: center;
          padding: 8px;
        }
        .bulk-upload {
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 22px;
          text-align: center;
          cursor: pointer;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
        }
        .bulk-upload input {
          display: none;
        }
        .bulk-upload i {
          font-size: 28px;
          color: #2f4a67;
        }
        .bulk-upload small {
          color: #64748b;
        }
        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
          margin-top: 14px;
        }
        .file-card {
          display: grid;
          grid-template-columns: 52px minmax(0, 1fr) 32px;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #ffffff;
        }
        .file-thumb {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          overflow: hidden;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .file-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .file-card strong,
        .file-card span {
          display: block;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .file-card span {
          color: #64748b;
          font-size: 12px;
          margin-top: 3px;
        }
        .file-card button {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 8px;
          color: #991b1b;
          background: #fee2e2;
          cursor: pointer;
        }
        .review-layout {
          display: grid;
          gap: 16px;
        }
        .review-card {
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f8fafc;
        }
        .review-card h3 {
          margin: 0 0 12px;
        }
        .review-card p {
          margin: 0 0 8px;
        }
        .review-product {
          padding: 12px;
          border-radius: 8px;
          background: #ffffff;
          margin-bottom: 12px;
        }
        .review-product h4 {
          margin: 0 0 8px;
          color: #2f4a67;
        }
        .form-navigation {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 18px;
        }
        .form-navigation .btn-primary {
          margin-left: auto;
        }
        @media (max-width: 820px) {
          .bulk-order-header,
          .bulk-section-title,
          .product-card-header {
            align-items: stretch;
            flex-direction: column;
          }
          .progress-steps {
            grid-template-columns: repeat(2, 1fr);
          }
          .bulk-grid {
            grid-template-columns: 1fr;
          }
          .size-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .bulk-panel {
            padding: 16px;
          }
          .bulk-success-screen {
            margin-top: 24px;
            padding: 34px 22px;
          }
          .bulk-success-screen h1 {
            font-size: 30px;
          }
          .bulk-success-message {
            font-size: 16px;
          }
          .btn-add-product,
          .btn-remove-product,
          .btn-primary,
          .btn-secondary {
            width: 100%;
          }
          .form-navigation {
            flex-direction: column;
          }
        }
        @media (max-width: 420px) {
          .bulk-container {
            width: min(100% - 20px, 1180px);
          }
          .bulk-order-header h1 {
            font-size: 26px;
          }
          .bulk-success-screen {
            padding: 28px 16px;
          }
          .bulk-success-icon {
            width: 64px;
            height: 64px;
            font-size: 28px;
          }
          .bulk-request-id {
            width: 100%;
            font-size: 14px;
          }
          .bulk-success-actions {
            width: 100%;
          }
          .bulk-success-action {
            min-width: 0;
            width: 100%;
          }
          .progress-steps {
            grid-template-columns: 1fr;
          }
          .size-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .file-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BulkOrder;

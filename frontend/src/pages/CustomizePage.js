import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomizePage.css';

const CustomizePage = () => {
  const [selectedProduct, setSelectedProduct] = useState('tshirt');
  const [selectedColor, setSelectedColor] = useState('#2f4a67');
  const [selectedText, setSelectedText] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedFont, setSelectedFont] = useState('Arial');

  const products = [
    { id: 'tshirt', name: 'T-Shirt', icon: 'fa-tshirt' },
    { id: 'hoodie', name: 'Hoodie', icon: 'fa-hoodie-cloak' },
    { id: 'cap', name: 'Cap', icon: 'fa-hat-cowboy' },
    { id: 'mug', name: 'Mug', icon: 'fa-mug' },
    { id: 'bag', name: 'Tote Bag', icon: 'fa-shopping-bag' }
  ];

  const colors = [
    { name: 'Navy Blue', hex: '#2f4a67' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Blue', hex: '#2563EB' }
  ];

  const fonts = [
    { name: 'Arial', value: 'Arial' },
    { name: 'Helvetica', value: 'Helvetica' },
    { name: 'Times New Roman', value: 'Times New Roman' },
    { name: 'Georgia', value: 'Georgia' },
    { name: 'Verdana', value: 'Verdana' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="customize-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Customize Your JNV Gear</h1>
          <p>Create personalized JNV apparel with your custom designs and text</p>
        </div>
      </div>

      <div className="customize-container">
        <div className="container">
          <div className="customize-grid">
            {/* Product Selection */}
            <div className="customization-panel">
              <h3>1. Select Product</h3>
              <div className="product-selector">
                {products.map(product => (
                  <button
                    key={product.id}
                    className={`product-option ${selectedProduct === product.id ? 'active' : ''}`}
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    <i className={`fas ${product.icon}`}></i>
                    <span>{product.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="customization-panel">
              <h3>2. Choose Color</h3>
              <div className="color-selector">
                {colors.map(color => (
                  <button
                    key={color.name}
                    className={`color-option ${selectedColor === color.hex ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.hex)}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="customization-panel">
              <h3>3. Add Custom Text</h3>
              <textarea
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                placeholder="Enter your custom text here..."
                className="text-input"
                maxLength={50}
              />
              <div className="text-info">
                <span className="char-count">{selectedText.length}/50</span>
                <span className="text-limit">50 characters max</span>
              </div>
            </div>

            {/* Font Selection */}
            <div className="customization-panel">
              <h3>4. Choose Font</h3>
              <select 
                value={selectedFont} 
                onChange={(e) => setSelectedFont(e.target.value)}
                className="font-selector"
              >
                {fonts.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selection */}
            <div className="customization-panel">
              <h3>5. Select Size</h3>
              <div className="size-selector">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="preview-panel">
            <h3>Preview</h3>
            <div className="preview-container">
              <div 
                className="product-preview"
                style={{ 
                  backgroundColor: selectedColor,
                  fontFamily: selectedFont,
                  color: selectedColor === '#000000' || selectedColor === '#2f4a67' ? '#FFFFFF' : '#000000'
                }}
              >
                <div className="preview-text" style={{ color: selectedColor === '#000000' || selectedColor === '#2f4a67' ? '#FFFFFF' : '#000000' }}>
                  {selectedText || 'Your Text Here'}
                </div>
                <div className="preview-label">{selectedProduct.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions-section">
        <div className="container">
          <div className="actions-grid">
            <button className="action-btn secondary">
              <i className="fas fa-save"></i>
              Save Design
            </button>
            <button className="action-btn primary">
              <i className="fas fa-shopping-cart"></i>
              Add to Cart
            </button>
            <button className="action-btn secondary">
              <i className="fas fa-share"></i>
              Share Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;

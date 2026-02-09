import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import './SearchBarAmazon.css';

const SearchBarAmazon = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { info } = useToast();
  const searchRef = useRef(null);

  const categories = [
    'All', 'T-Shirts', 'Hoodies', 'Accessories', 'Alumni Kits', 'Customize'
  ];

  // Enhanced product suggestions with more variety
  const allProducts = React.useMemo(() => [
    { id: 'jnv-classic-tshirt', name: 'JNV Classic T-Shirt', category: 'T-Shirts', price: 399, badge: 'Bestseller' },
    { id: 'jnv-alumni-hoodie', name: 'JNV Alumni Hoodie', category: 'Hoodies', price: 799, badge: 'New' },
    { id: 'jnv-baseball-cap', name: 'JNV Baseball Cap', category: 'Accessories', price: 299 },
    { id: 'jnv-backpack', name: 'JNV Backpack', category: 'Accessories', price: 899 },
    { id: 'jnv-polo-tshirt', name: 'JNV Polo T-Shirt', category: 'T-Shirts', price: 499 },
    { id: 'jnv-sports-tshirt', name: 'JNV Sports T-Shirt', category: 'T-Shirts', price: 349 },
    { id: 'jnv-batch-tshirt', name: 'JNV Batch T-Shirt', category: 'T-Shirts', price: 399 },
    { id: 'jnv-alumni-tshirt', name: 'JNV Alumni T-Shirt', category: 'T-Shirts', price: 449 },
    { id: 'jnv-zip-hoodie', name: 'JNV Zip Hoodie', category: 'Hoodies', price: 899 },
    { id: 'jnv-pullover-hoodie', name: 'JNV Pullover Hoodie', category: 'Hoodies', price: 799 },
    { id: 'jnv-sports-jersey', name: 'JNV Sports Jersey', category: 'T-Shirts', price: 549, badge: 'Limited' },
    { id: 'jnv-track-pants', name: 'JNV Track Pants', category: 'Accessories', price: 449 },
    { id: 'jnv-water-bottle', name: 'JNV Water Bottle', category: 'Accessories', price: 199 },
    { id: 'jnv-phone-case', name: 'JNV Phone Case', category: 'Accessories', price: 149 },
    { id: 'jnv-alumni-kit', name: 'JNV Alumni Kit', category: 'Alumni Kits', price: 1999, badge: 'Premium' },
    { id: 'jnv-custom-tshirt', name: 'JNV Custom T-Shirt', category: 'Customize', price: 599 },
    { id: 'jnv-custom-hoodie', name: 'JNV Custom Hoodie', category: 'Customize', price: 999 },
    { id: 'jnv-graduation-gown', name: 'JNV Graduation Gown', category: 'Alumni Kits', price: 1299 },
    { id: 'jnv-id-card-holder', name: 'JNV ID Card Holder', category: 'Accessories', price: 99 },
    { id: 'jnv-notebook-set', name: 'JNV Notebook Set', category: 'Accessories', price: 249 }
  ], []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        let filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );

        // Filter by selected category if not "All"
        if (selectedCategory !== 'All') {
          filtered = filtered.filter(product => product.category === selectedCategory);
        }

        setSuggestions(filtered.slice(0, 6)); // Show more suggestions
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query, selectedCategory, allProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}&category=${selectedCategory}`);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    if (query.length > 0) {
      setIsOpen(true);
    } else {
      // Show trending searches when empty
      setSuggestions(allProducts.slice(0, 4));
      setIsOpen(true);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Re-filter suggestions if query exists
    if (query.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        let filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        if (category !== 'All') {
          filtered = filtered.filter(product => product.category === category);
        }
        setSuggestions(filtered.slice(0, 6));
        setIsLoading(false);
      }, 200);
    }
  };

  const handleQuickSearch = (searchTerm) => {
    setQuery(searchTerm);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`);
    setIsOpen(false);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-wrapper">
        <select 
          className="search-category"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search Navodaya Trendz..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {isOpen && (
        <div className="search-suggestions">
          {isLoading ? (
            <div className="search-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="suggestions-header">
                <span>{query.length > 0 ? 'Products' : 'Trending Searches'}</span>
              </div>
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <div className="suggestion-image">
                    <img 
                      src={`https://picsum.photos/seed/${product.id}/40/40.jpg`} 
                      alt={product.name}
                    />
                  </div>
                  <div className="suggestion-info">
                    <div className="suggestion-name">{product.name}</div>
                    <div className="suggestion-meta">
                      <span className="suggestion-category">{product.category}</span>
                      <span className="suggestion-price">₹{product.price}</span>
                      {product.badge && (
                        <span className="suggestion-badge">{product.badge}</span>
                      )}
                    </div>
                  </div>
                  <i className="fas fa-arrow-right"></i>
                </div>
              ))}
              
              {query.length === 0 && (
                <div className="quick-searches">
                  <div className="quick-search-header">Quick Searches</div>
                  <div className="quick-search-tags">
                    {['T-Shirts', 'Hoodies', 'Alumni Kits', 'Customize', 'Today\'s Deals', 'New Arrivals'].map((tag) => (
                      <button
                        key={tag}
                        className="quick-search-tag"
                        onClick={() => handleQuickSearch(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : query.length > 0 ? (
            <div className="search-no-results">
              <i className="fas fa-search"></i>
              <span>No products found for "{query}"</span>
              <div className="search-suggestions-text">
                <p>Try searching for:</p>
                <div className="suggestion-tags">
                  {['T-Shirts', 'Hoodies', 'Accessories'].map((tag) => (
                    <button
                      key={tag}
                      className="suggestion-tag"
                      onClick={() => handleQuickSearch(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBarAmazon;

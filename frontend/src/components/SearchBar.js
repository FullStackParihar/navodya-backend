import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { info } = useToast();
  const searchRef = useRef(null);

  // Sample product suggestions
  const allProducts = React.useMemo(() => [
    { id: 1, name: 'Brand Era Classic Polo', category: 'T-Shirts' },
    { id: 2, name: 'Corporate Brand Hoodie', category: 'Hoodies' },
    { id: 3, name: 'Logo Baseball Cap', category: 'Accessories' },
    { id: 4, name: 'Custom Brand Backpack', category: 'Accessories' },
    { id: 5, name: 'Premium Cotton T-Shirt', category: 'T-Shirts' },
    { id: 6, name: 'Sports Performance Tee', category: 'T-Shirts' },
    { id: 7, name: 'Company Batch T-Shirt', category: 'T-Shirts' },
    { id: 8, name: 'Alumni Brand Kit', category: 'Alumni Kits' },
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
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
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
    }
  };

  return (
    <div className="search-bar-advanced" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search for products, brands, and more..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </form>

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
                <span>Products</span>
              </div>
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <div className="suggestion-info">
                    <div className="suggestion-name">{product.name}</div>
                    <div className="suggestion-category">{product.category}</div>
                  </div>
                  <i className="fas fa-arrow-right"></i>
                </div>
              ))}
            </>
          ) : query.length > 0 ? (
            <div className="search-no-results">
              <i className="fas fa-search"></i>
              <span>No products found for "{query}"</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

import React, { useState } from 'react';

const SizeFilter = ({ onSizeChange, selectedSizes = [] }) => {
  const [sizes] = useState([
    { id: 'xs', label: 'XS', value: 'xs' },
    { id: 's', label: 'S', value: 's' },
    { id: 'm', label: 'M', value: 'm' },
    { id: 'l', label: 'L', value: 'l' },
    { id: 'xl', label: 'XL', value: 'xl' },
    { id: 'xxl', label: 'XXL', value: 'xxl' },
    { id: '3xl', label: '3XL', value: '3xl' },
    { id: '4xl', label: '4XL', value: '4xl' }
  ]);

  const handleSizeToggle = (sizeValue) => {
    const newSelectedSizes = selectedSizes.includes(sizeValue)
      ? selectedSizes.filter(size => size !== sizeValue)
      : [...selectedSizes, sizeValue];
    
    onSizeChange(newSelectedSizes);
  };

  const clearAllSizes = () => {
    onSizeChange([]);
  };

  return (
    <div className="size-filter">
      <div className="filter-header">
        <h3 className="filter-title">Size</h3>
        {selectedSizes.length > 0 && (
          <button 
            className="clear-filter-btn"
            onClick={clearAllSizes}
            aria-label="Clear all size filters"
          >
            <i className="fas fa-times"></i> Clear
          </button>
        )}
      </div>
      
      <div className="size-options">
        {sizes.map((size) => (
          <div key={size.id} className="size-option">
            <input
              type="checkbox"
              id={`size-${size.id}`}
              value={size.value}
              checked={selectedSizes.includes(size.value)}
              onChange={() => handleSizeToggle(size.value)}
              className="size-checkbox"
            />
            <label 
              htmlFor={`size-${size.id}`}
              className={`size-label ${selectedSizes.includes(size.value) ? 'selected' : ''}`}
            >
              {size.label}
            </label>
          </div>
        ))}
      </div>

      <style jsx>{`
        .size-filter {
          background: var(--bg-primary, white);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-xl, 1rem);
          padding: var(--space-6, 1.5rem);
          box-shadow: var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
          transition: all var(--transition-normal, 250ms cubic-bezier(0.4, 0, 0.2, 1));
        }

        .size-filter:hover {
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4, 1rem);
        }

        .filter-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary, #1e293b);
          margin: 0;
          font-family: var(--font-secondary, 'Poppins', sans-serif);
        }

        .clear-filter-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary, #64748b);
          font-size: 0.875rem;
            cursor: pointer;
          padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
          border-radius: var(--radius-md, 0.5rem);
          transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
          display: flex;
          align-items: center;
          gap: var(--space-1, 0.25rem);
        }

        .clear-filter-btn:hover {
          background: var(--gray-100, #f1f5f9);
          color: var(--danger-color, #fb5607);
        }

        .size-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-3, 0.75rem);
        }

        .size-option {
          position: relative;
        }

        .size-checkbox {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .size-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
          border: 2px solid var(--border-color, #e2e8f0);
          border-radius: var(--radius-lg, 0.75rem);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary, #1e293b);
          cursor: pointer;
          transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
          background: var(--bg-primary, white);
          min-height: 44px;
          user-select: none;
          position: relative;
          overflow: hidden;
        }

        .size-label::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--gradient-primary, linear-gradient(135deg, #ff6b35, #e55a2b));
          opacity: 0;
          transition: opacity var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
        }

        .size-label:hover {
          border-color: var(--primary-color, #ff6b35);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }

        .size-label.selected {
          border-color: var(--primary-color, #ff6b35);
          color: white;
          font-weight: 600;
          transform: scale(1.05);
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
        }

        .size-label.selected::before {
          opacity: 1;
        }

        .size-label span {
          position: relative;
          z-index: 1;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .size-options {
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-2, 0.5rem);
          }

          .size-label {
            padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
            font-size: 0.8rem;
            min-height: 40px;
          }

          .filter-title {
            font-size: 1rem;
          }

          .clear-filter-btn {
            font-size: 0.75rem;
            padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
          }
        }

        @media (max-width: 480px) {
          .size-options {
            grid-template-columns: repeat(2, 1fr);
          }

          .size-filter {
            padding: var(--space-4, 1rem);
          }

          .filter-header {
            margin-bottom: var(--space-3, 0.75rem);
          }
        }

        /* Dark Mode Styles */
        [data-theme="dark"] .size-filter {
          background: var(--bg-secondary, #1a1f2e);
          border-color: var(--border-color, #2d3748);
        }

        [data-theme="dark"] .filter-title {
          color: var(--text-primary, #e2e8f0);
        }

        [data-theme="dark"] .clear-filter-btn {
          color: var(--text-secondary, #94a3b8);
        }

        [data-theme="dark"] .clear-filter-btn:hover {
          background: var(--bg-tertiary, #232937);
          color: var(--danger-color, #fb5607);
        }

        [data-theme="dark"] .size-label {
          background: var(--bg-secondary, #1a1f2e);
          border-color: var(--border-color, #2d3748);
          color: var(--text-primary, #e2e8f0);
        }

        [data-theme="dark"] .size-label:hover {
          border-color: var(--primary-color, #ff6b35);
          background: var(--bg-tertiary, #232937);
        }

        /* Animation for selection */
        @keyframes sizeSelect {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1.05);
          }
        }

        .size-label.selected {
          animation: sizeSelect 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        /* Focus styles for accessibility */
        .size-checkbox:focus + .size-label {
          outline: 2px solid var(--primary-color, #ff6b35);
          outline-offset: 2px;
        }

        /* Loading state */
        .size-filter.loading {
          opacity: 0.6;
          pointer-events: none;
        }

        .size-filter.loading::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          to {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SizeFilter;

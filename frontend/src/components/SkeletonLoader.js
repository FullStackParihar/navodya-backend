import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        );
      case 'product':
        return (
          <div className="skeleton-product">
            <div className="skeleton-product-image"></div>
            <div className="skeleton-product-info">
              <div className="skeleton-product-title"></div>
              <div className="skeleton-product-text"></div>
              <div className="skeleton-product-price"></div>
              <div className="skeleton-product-button"></div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="skeleton-text-container">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        );
      case 'header':
        return (
          <div className="skeleton-header">
            <div className="skeleton-logo"></div>
            <div className="skeleton-search"></div>
            <div className="skeleton-nav">
              <div className="skeleton-nav-item"></div>
              <div className="skeleton-nav-item"></div>
              <div className="skeleton-nav-item"></div>
            </div>
          </div>
        );
      default:
        return <div className="skeleton-box"></div>;
    }
  };

  return (
    <div className="skeleton-loader">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

import React from 'react';
import './ProductSkeleton.scss';

/**
 * ProductSkeleton Component - Loading placeholder for product cards
 * Shows while products are being fetched
 */
export const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="product-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-skeleton-card">
          <div className="skeleton-image">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-title">
              <div className="skeleton-line" style={{ width: '80%' }}></div>
              <div className="skeleton-line" style={{ width: '60%' }}></div>
            </div>
            <div className="skeleton-price">
              <div className="skeleton-line" style={{ width: '40%' }}></div>
            </div>
            <div className="skeleton-button">
              <div className="skeleton-line" style={{ width: '100%', height: '40px' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * TableSkeleton Component - Loading placeholder for tables (orders, etc.)
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="table-skeleton">
      <div className="table-skeleton-header">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="skeleton-header-cell">
            <div className="skeleton-line" style={{ width: '70%' }}></div>
          </div>
        ))}
      </div>
      <div className="table-skeleton-body">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="table-skeleton-row">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="skeleton-cell">
                <div className="skeleton-line" style={{ width: `${60 + Math.random() * 30}%` }}></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CardSkeleton Component - Generic card loading placeholder
 */
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="card-skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card-skeleton">
          <div className="skeleton-header">
            <div className="skeleton-line" style={{ width: '60%', height: '24px' }}></div>
          </div>
          <div className="skeleton-body">
            <div className="skeleton-line" style={{ width: '100%' }}></div>
            <div className="skeleton-line" style={{ width: '90%' }}></div>
            <div className="skeleton-line" style={{ width: '75%' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;

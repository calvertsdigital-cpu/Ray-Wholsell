import React, { useState, useEffect } from 'react';
import { X, Plus, ShoppingCart, GitCompare } from 'lucide-react';
import './ProductComparison.scss';

/**
 * ProductComparison Component - Compare up to 4 products side by side
 * 
 * Features:
 * - Compare up to 4 products
 * - Side-by-side comparison table
 * - Highlight differences
 * - Add to cart from comparison
 * - Save comparison to localStorage
 * - Mobile responsive (horizontal scroll)
 */

const STORAGE_KEY = 'ray_product_comparison';
const MAX_COMPARE = 4;

export const ProductComparison = ({ isOpen, onClose }) => {
  const [compareProducts, setCompareProducts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadCompareProducts();
    }
  }, [isOpen]);

  const loadCompareProducts = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored);
        setCompareProducts(products);
      }
    } catch (error) {
      console.error('Error loading comparison products:', error);
    }
  };

  const removeProduct = (productId) => {
    const updated = compareProducts.filter(p => p._id !== productId);
    setCompareProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const clearAll = () => {
    setCompareProducts([]);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
  };

  if (!isOpen || compareProducts.length === 0) {
    return null;
  }

  const comparisonRows = [
    {
      label: 'Product',
      type: 'image',
      getValue: (p) => ({ name: p.name, image: p.image || p.images?.[0] }),
    },
    {
      label: 'Wholesale Price',
      type: 'price',
      getValue: (p) => p.wholesalePrice,
    },
    {
      label: 'Retail Price',
      type: 'price',
      getValue: (p) => p.retailPrice,
    },
    {
      label: 'Savings',
      type: 'savings',
      getValue: (p) => (p.retailPrice || 0) - (p.wholesalePrice || 0),
    },
    {
      label: 'Manufacturer',
      type: 'text',
      getValue: (p) => p.manufacturer || 'N/A',
    },
    {
      label: 'Category',
      type: 'text',
      getValue: (p) => p.category?.name || 'N/A',
    },
    {
      label: 'Stock Status',
      type: 'stock',
      getValue: (p) => p.stock > 0 ? 'In Stock' : 'Out of Stock',
    },
    {
      label: 'Size/Variants',
      type: 'text',
      getValue: (p) => p.variants?.length > 0 
        ? `${p.variants.length} options` 
        : 'Single size',
    },
  ];

  return (
    <div className="comparison-overlay" onClick={onClose}>
      <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-header">
          <div className="header-left">
            <GitCompare size={24} />
            <h2>Product Comparison</h2>
            <span className="product-count">({compareProducts.length}/{MAX_COMPARE})</span>
          </div>
          <div className="header-actions">
            <button className="btn-clear" onClick={clearAll}>
              Clear All
            </button>
            <button className="btn-close" onClick={onClose} aria-label="Close comparison">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="comparison-scroll">
          <table className="comparison-table">
            <tbody>
              {comparisonRows.map((row, rowIdx) => (
                <tr key={rowIdx} className={`comparison-row row-${row.type}`}>
                  <th className="row-label">{row.label}</th>
                  {compareProducts.map((product, colIdx) => (
                    <td key={colIdx} className="product-cell">
                      {row.type === 'image' && (
                        <div className="product-header">
                          <button 
                            className="remove-btn"
                            onClick={() => removeProduct(product._id)}
                            aria-label="Remove product"
                          >
                            <X size={16} />
                          </button>
                          <div className="product-image">
                            <img 
                              src={row.getValue(product).image || '/placeholder.png'} 
                              alt={row.getValue(product).name}
                            />
                          </div>
                          <h3 className="product-name">{row.getValue(product).name}</h3>
                        </div>
                      )}
                      {row.type === 'price' && (
                        <span className="price-value">
                          ${(row.getValue(product) || 0).toFixed(2)}
                        </span>
                      )}
                      {row.type === 'savings' && (
                        <span className={`savings-value ${row.getValue(product) > 0 ? 'positive' : ''}`}>
                          {row.getValue(product) > 0 
                            ? `Save $${row.getValue(product).toFixed(2)}`
                            : 'No savings'}
                        </span>
                      )}
                      {row.type === 'text' && (
                        <span className="text-value">{row.getValue(product)}</span>
                      )}
                      {row.type === 'stock' && (
                        <span className={`stock-value ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                          {row.getValue(product)}
                        </span>
                      )}
                    </td>
                  ))}
                  {/* Fill empty columns */}
                  {Array.from({ length: MAX_COMPARE - compareProducts.length }).map((_, idx) => (
                    <td key={`empty-${idx}`} className="product-cell empty">
                      {rowIdx === 0 && (
                        <div className="add-product-placeholder">
                          <Plus size={32} />
                          <p>Add product</p>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Action Row */}
              <tr className="comparison-row row-actions">
                <th className="row-label">Actions</th>
                {compareProducts.map((product, idx) => (
                  <td key={idx} className="product-cell">
                    <div className="action-buttons">
                      <button 
                        className="btn-add-cart"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                      <a 
                        href={`/products/${product._id}`}
                        className="btn-view-details"
                      >
                        View Details
                      </a>
                    </div>
                  </td>
                ))}
                {Array.from({ length: MAX_COMPARE - compareProducts.length }).map((_, idx) => (
                  <td key={`empty-action-${idx}`} className="product-cell empty"></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to manage product comparison
 */
export const useProductComparison = () => {
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    updateCount();
    
    const handleStorageChange = () => {
      updateCount();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateCount = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const count = stored ? JSON.parse(stored).length : 0;
      setCompareCount(count);
    } catch (error) {
      setCompareCount(0);
    }
  };

  const addToComparison = (product) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let compare = stored ? JSON.parse(stored) : [];
      
      // Check if already in comparison
      if (compare.some(p => p._id === product._id)) {
        return { success: false, message: 'Product already in comparison' };
      }
      
      // Check max limit
      if (compare.length >= MAX_COMPARE) {
        return { success: false, message: `Maximum ${MAX_COMPARE} products allowed` };
      }
      
      compare.push({
        _id: product._id,
        name: product.name,
        image: product.image || product.images?.[0],
        images: product.images,
        manufacturer: product.manufacturer,
        wholesalePrice: product.wholesalePrice,
        retailPrice: product.retailPrice,
        stock: product.stock,
        category: product.category,
        variants: product.variants,
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compare));
      window.dispatchEvent(new Event('storage'));
      
      return { success: true, message: 'Product added to comparison' };
    } catch (error) {
      console.error('Error adding to comparison:', error);
      return { success: false, message: 'Error adding product' };
    }
  };

  const removeFromComparison = (productId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let compare = stored ? JSON.parse(stored) : [];
      compare = compare.filter(p => p._id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compare));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error removing from comparison:', error);
    }
  };

  const isInComparison = (productId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      const compare = JSON.parse(stored);
      return compare.some(p => p._id === productId);
    } catch (error) {
      return false;
    }
  };

  return {
    compareCount,
    addToComparison,
    removeFromComparison,
    isInComparison,
  };
};

export default ProductComparison;

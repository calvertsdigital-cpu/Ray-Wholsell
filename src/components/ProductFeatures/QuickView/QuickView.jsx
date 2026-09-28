import React, { useState } from 'react';
import { X, ShoppingCart, Heart, Share2, ZoomIn, Minus, Plus } from 'lucide-react';
import './QuickView.scss';

/**
 * QuickView Modal - Quick product preview without leaving the page
 * 
 * Features:
 * - Product image gallery
 * - Quick add to cart
 * - Quantity selector
 * - Price display (wholesale/retail)
 * - Add to wishlist
 * - Share product
 * - View full details link
 */
export const QuickView = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= 999) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      product,
      variant: selectedVariant,
      quantity,
    });
    onClose();
  };

  const price = selectedVariant?.wholesalePrice || product.wholesalePrice || 0;
  const retailPrice = selectedVariant?.retailPrice || product.retailPrice || 0;
  const images = product.images || [product.image];
  const inStock = selectedVariant?.stock > 0 || product.stock > 0;

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose} aria-label="Close quick view">
          <X size={24} />
        </button>

        <div className="quickview-content">
          {/* Left: Product Images */}
          <div className="quickview-images">
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.name} />
              <button className="zoom-btn" aria-label="Zoom image">
                <ZoomIn size={20} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumbnail ${idx === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="quickview-info">
            <div className="product-badges">
              {product.isNew && <span className="badge badge-new">NEW</span>}
              {product.onSale && <span className="badge badge-sale">SALE</span>}
              {!inStock && <span className="badge badge-out">OUT OF STOCK</span>}
            </div>

            <h2 className="product-name">{product.name}</h2>

            {product.manufacturer && (
              <p className="product-brand">by {product.manufacturer}</p>
            )}

            <div className="product-pricing">
              <div className="wholesale-price">
                <span className="price-label">Wholesale Price</span>
                <span className="price-value">${price.toFixed(2)}</span>
              </div>
              {retailPrice > price && (
                <div className="retail-price">
                  <span className="price-label">Retail Price</span>
                  <span className="price-value">${retailPrice.toFixed(2)}</span>
                  <span className="savings">
                    Save ${(retailPrice - price).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {product.description && (
              <div className="product-description">
                <p>{product.description.substring(0, 200)}...</p>
              </div>
            )}

            {/* Variants (Size, etc.) */}
            {product.variants && product.variants.length > 1 && (
              <div className="product-variants">
                <label className="variant-label">Size:</label>
                <div className="variant-options">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      className={`variant-option ${selectedVariant?._id === variant._id ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <label className="quantity-label">Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    if (val >= 1 && val <= 999) setQuantity(val);
                  }}
                  min="1"
                  max="999"
                  className="qty-input"
                />
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 999}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="quickview-actions">
              <button
                className="btn-add-cart"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <ShoppingCart size={20} />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button className="btn-wishlist" aria-label="Add to wishlist">
                <Heart size={20} />
              </button>
              
              <button className="btn-share" aria-label="Share product">
                <Share2 size={20} />
              </button>
            </div>

            <a 
              href={`/products/${product._id}`} 
              className="view-full-details"
            >
              View Full Details →
            </a>

            {/* Additional Info */}
            <div className="product-meta">
              {product.sku && (
                <div className="meta-item">
                  <span className="meta-label">SKU:</span>
                  <span className="meta-value">{product.sku}</span>
                </div>
              )}
              {product.category && (
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{product.category.name}</span>
                </div>
              )}
              {inStock && selectedVariant?.stock && (
                <div className="meta-item">
                  <span className="meta-label">In Stock:</span>
                  <span className="meta-value stock-count">{selectedVariant.stock} units</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;

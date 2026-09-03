import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { stagger, useAnimate, useInView } from "framer-motion";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import "./ProductLists.scss";

// Toast Component
const Toast = ({ message, type, onClose, show }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: type === "success" ? "#10b981" : "#ef4444",
        color: "white",
        padding: "12px 24px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 1000,
      }}
    >
      <div>
        {type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      </div>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ProductLists = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [quantities, setQuantities] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [addingToWishlist, setAddingToWishlist] = useState({});
  const [moq] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ show: false, message: "", type: "" });
  }, []);

  // Sample products for demo
  const sampleProducts = useMemo(() => [
    {
      _id: "sample1",
      name: "B COMPLEX (RASP) 1 OZ",
      item_number: 1,
      product_id: "4013021",
      lookup_code: "810078423539",
      sku: "810078423539",
      bin_location: "1/2 >*",
      buyPrice: 13.99,
      stock: 5,
      category: { name: "B VITAMINS" },
      categoryName: "B VITAMINS",
      department: "VITAMINS A - Z",
      images: []
    },
    {
      _id: "sample2",
      name: "VIT C 500 MG ORNG 4 OZ",
      item_number: 2,
      product_id: "4017614",
      lookup_code: "810078423690",
      sku: "810078423690",
      bin_location: "1/3 >*",
      buyPrice: 19.99,
      stock: 8,
      category: { name: "C VITAMINS" },
      categoryName: "C VITAMINS",
      department: "VITAMINS A - Z",
      images: []
    }
  ], []);

  useEffect(() => {
    setProducts(sampleProducts);
    setLoading(false);
    
    // Fetch wishlist if user is logged in
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setWishlistItems([]);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const wishlistIds = (response.data.wishlist || []).map(item => item._id);
        setWishlistItems(wishlistIds);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setWishlistItems([]);
      }
    };

    fetchWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [sampleProducts]);

  const getQuantity = useCallback(
    (productId) => quantities[productId] || moq,
    [quantities, moq]
  );

  const updateQuantity = useCallback((productId, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  }, []);

  const incrementQuantity = useCallback(
    (productId, maxStock) => {
      const currentQty = getQuantity(productId);
      const nextQty = currentQty + moq;
      if (nextQty <= maxStock) {
        updateQuantity(productId, nextQty);
      }
    },
    [getQuantity, updateQuantity, moq]
  );

  const decrementQuantity = useCallback(
    (productId) => {
      const currentQty = getQuantity(productId);
      if (currentQty > moq) {
        updateQuantity(productId, currentQty - moq);
      }
    },
    [getQuantity, updateQuantity, moq]
  );

  const addToCart = useCallback(
    async (product) => {
      const quantity = getQuantity(product._id);
      
      if (product.stock === 0) {
        showToast("Product is out of stock", "error");
        return;
      }

      if (quantity < moq) {
        showToast(`Minimum order quantity is ${moq} items`, "error");
        return;
      }

      setAddingToCart(prev => ({ ...prev, [product._id]: true }));
      
      // Simulate API call
      setTimeout(() => {
        showToast(`${quantity} items added to cart successfully!`, "success");
        setAddingToCart(prev => ({ ...prev, [product._id]: false }));
      }, 1000);
    },
    [getQuantity, showToast, moq]
  );

  const addToWishlist = useCallback(
    async (product) => {
      if (!product || !product._id) return;
      const productId = product._id;
      setAddingToWishlist((s) => ({ ...s, [productId]: true }));
      
      const isInWishlist = wishlistItems.includes(productId);
      const token = localStorage.getItem("userToken");
      
      if (!token) {
        showToast("Please log in to add to wishlist", "error");
        setAddingToWishlist((s) => ({ ...s, [productId]: false }));
        return;
      }
      
      try {
        if (isInWishlist) {
          // Remove from wishlist
          await axiosInstance.delete(`/api/auth/wishlist/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setWishlistItems((prev) => prev.filter((id) => id !== productId));
          showToast("Removed from wishlist", "success");
        } else {
          // Add to wishlist
          await axiosInstance.post(
            "/api/auth/wishlist",
            { productId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setWishlistItems((prev) => [...prev, productId]);
          showToast("Added to wishlist", "success");
        }
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (error) {
        console.error("Wishlist error:", error);
        showToast("Failed to update wishlist", "error");
      } finally {
        setAddingToWishlist((s) => ({ ...s, [productId]: false }));
      }
    },
    [wishlistItems, showToast]
  );

  return (
    <div className="products-page-container">
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />
      
      <div className="main-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-bar-wrapper">
            <div className="search-input-container">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Products Header */}
        <div className="products-header">
          <div className="products-count">
            <h2>All Products</h2>
            <div className="results-info-wrapper">
              <p className="results-info">
                Showing {products.length} products (Demo Mode)
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map((product, index) => {
            const quantity = getQuantity(product._id);
            const isOutOfStock = product.stock === 0;
            const isMaxQuantity = quantity >= product.stock;
            const isAddingToCart = addingToCart[product._id] || false;
            const isInWishlist = wishlistItems.includes(product._id);
            const subtotal = (product.buyPrice * quantity).toFixed(2);

            return (
              <div key={product._id} className="product-card">
                {/* Product Image */}
                <div className="product-image-container">
                  <img
                    src={`/${((index % 7) + 1)}.png`}
                    alt={product.name}
                    className="product-image"
                  />
                  {/* Stock Badge */}
                  <div className={`stock-badge ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
                    {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                  </div>
                  {/* Wishlist Button */}
                  <button
                    onClick={() => addToWishlist(product)}
                    disabled={addingToWishlist[product._id]}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                  >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Product Info */}
                <div className="product-info">
                  {/* Product Meta */}
                  <div className="product-meta">
                    <span className="product-id">
                      ID: {product.item_number || product.product_id || "N/A"}
                    </span>
                    <span className="product-RHL UPC">
                      RHL UPC: {product.lookup_code || product.sku || "N/A"}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="product-title">{product.originalProductName || product.name}</h3>

                  {/* Category & Bin */}
                  <div className="product-details">
                    <span className="product-category">
                      {product.category?.name || product.categoryName || product.department || "General"}
                    </span>
                    <span className="product-bin">
                      Bin: {product.bin_location || "N/A"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="product-price">
                    <span className="price-label">Price:</span>
                    <span className="price-value">${product.buyPrice.toFixed(2)}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="quantity-controls">
                    <label className="quantity-label">Quantity:</label>
                    <div className="quantity-input-group">
                      <button
                        onClick={() => decrementQuantity(product._id)}
                        disabled={quantity <= moq || isAddingToCart}
                        className="quantity-btn decrease"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="quantity-display">{quantity}</span>
                      <button
                        onClick={() => incrementQuantity(product._id, product.stock)}
                        disabled={isMaxQuantity || isOutOfStock || isAddingToCart}
                        className="quantity-btn increase"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <div className="quantity-info">
                      <span>Stock: {product.stock}</span>
                      <span>MOQ: {moq}</span>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="product-subtotal">
                    <span className="subtotal-label">Subtotal:</span>
                    <span className="subtotal-value">${subtotal}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="product-actions">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={isOutOfStock || isAddingToCart}
                      className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1m0 0h4a1 1 0 001-1m-6 0V13m0 10V13m0 0h6" />
                      </svg>
                      {isOutOfStock ? "Out of Stock" : isAddingToCart ? "Adding..." : "Buy Now"}
                    </button>
                    <button className="details-btn">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductLists;
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
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ show: false, message: "", type: "" });
  }, []);

  // No demo products - using API only
  const sampleProducts = useMemo(() => [], []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let productsData = [];
        
        // Try to fetch real products from public API endpoint (no auth required)
        try {
          console.log('🔄 Fetching products from public endpoint...');
          const response = await axiosInstance.get('/api/wholesaler/get-tirtho-wholesaler', {
            params: {
              role: 'wholesaler',
              page: 1,
              limit: 1000 // Request all products (backend will return up to 1000)
            }
          });
          
          if (response.data?.products && response.data.products.length > 0) {
            productsData = response.data.products;
            console.log('✅ Loaded real products from public API:', productsData.length);
            setProducts(productsData);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('⚠️  Public endpoint failed:', apiError.message);
        }
        
        // Fallback to authenticated endpoint for logged-in users
        if (productsData.length === 0) {
          try {
            const token = localStorage.getItem("userToken");
            
            if (token) {
              console.log('🔄 Fetching products with authentication...');
              const response = await axiosInstance.get('/api/user/get-products', {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              if (response.data?.products && response.data.products.length > 0) {
                productsData = response.data.products;
                console.log('✅ Loaded real products from authenticated endpoint:', productsData.length);
                setProducts(productsData);
                setLoading(false);
                return;
              }
            }
          } catch (authError) {
            console.log('⚠️  Authenticated endpoint also failed:', authError.message);
          }
        }
        
        // If still no data, show error
        if (productsData.length === 0) {
          console.error('❌ No products available from any endpoint');
          setError('Failed to load products. Please try again later.');
          setProducts([]);
        }
        
      } catch (error) {
        console.error('Error in fetchProducts:', error);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Initialize cart count
    const updateCartCount = () => {
      const currentCart = JSON.parse(localStorage.getItem("localCart") || "[]");
      setCartItemsCount(currentCart.length);
    };
    
    updateCartCount();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
      console.log('🔄 Cart updated, refreshing count');
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [BASE_URL]);

  // Handle pagination when products or current page changes
  useEffect(() => {
    if (products && products.length > 0) {
      setTotalProducts(products.length);
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const paginated = products.slice(startIndex, endIndex);
      setPaginatedProducts(paginated);
      window.scrollTo(0, 0); // Scroll to top when page changes
    }
  }, [products, currentPage, productsPerPage]);

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
      const nextQty = currentQty + 1; // Increment by 1
      if (nextQty <= maxStock) {
        updateQuantity(productId, nextQty);
      }
    },
    [getQuantity, updateQuantity]
  );

  const decrementQuantity = useCallback(
    (productId) => {
      const currentQty = getQuantity(productId);
      if (currentQty > moq) {
        updateQuantity(productId, currentQty - 1);
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

      // Enforce MOQ requirement
      if (quantity < moq) {
        showToast(`Minimum order quantity is ${moq} items`, "error");
        return;
      }

      if (quantity > product.stock) {
        showToast(`Only ${product.stock} items available in stock`, "error");
        return;
      }

      setAddingToCart(prev => ({ ...prev, [product._id]: true }));

      try {
        const token = localStorage.getItem("userToken");
        
        if (token) {
          // Authenticated user - add to backend cart
          console.log('🔄 Authenticated mode: Adding to backend cart');
          console.log('📦 Product:', product.name, 'Quantity:', quantity);
          
          try {
            const response = await axiosInstance.post("/api/user/add-to-cart", {
              productId: product._id,
              quantity: quantity,
              websiteRole: 'wholesaler'
            }, {
              headers: { 
                Authorization: `Bearer ${token}`,
                'X-Website-Role': 'wholesaler'
              }
            });

            console.log('✅ Added to backend cart successfully');
            showToast(`${quantity} items added to cart!`, "success");
            
            // Update cart count
            window.dispatchEvent(new Event("cartUpdated"));
            return;
            
          } catch (apiError) {
            console.log('⚠️  Backend cart failed, using local cart:', apiError.message);
            // Fallback to local cart
            throw new Error('Fallback to local');
          }
          
        } else {
          // No token - use local storage cart
          throw new Error('Fallback to local');
        }
        
      } catch (error) {
        // Fallback: Add to local cart
        console.log('💾 Adding to local cart');
        const currentCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        
        // Check if product already in cart
        const existingItem = currentCart.find(item => item._id === product._id);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          currentCart.push({
            _id: product._id,
            name: product.name,
            price: product.sellPrice || product.buyPrice,
            quantity: quantity,
            stock: product.stock,
            category: product.category?.name || product.categoryName,
            sku: product.sku
          });
        }
        
        localStorage.setItem("localCart", JSON.stringify(currentCart));
        console.log('✅ Added to local cart successfully');
        showToast(`${quantity} items added to cart!`, "success");
        
        // Update cart count
        window.dispatchEvent(new Event("cartUpdated"));
      } finally {
        setAddingToCart(prev => ({ ...prev, [product._id]: false }));
      }
    },
    [getQuantity, showToast, moq, navigate]
  );

  const addToWishlist = useCallback(
    async (product) => {
      if (!product || !product._id) return;
      const productId = product._id;
      setAddingToWishlist((s) => ({ ...s, [productId]: true }));
      
      const isInWishlist = wishlistItems.includes(productId);
      
      // Simulate API call
      setTimeout(() => {
        if (isInWishlist) {
          setWishlistItems((prev) => prev.filter((id) => id !== productId));
          showToast("Removed from wishlist", "success");
        } else {
          setWishlistItems((prev) => [...prev, productId]);
          showToast("Added to wishlist", "success");
        }
        setAddingToWishlist((s) => ({ ...s, [productId]: false }));
      }, 500);
    },
    [wishlistItems, showToast]
  );

  const openProductDetails = useCallback((product) => {
    setSelectedProduct(product);
    setShowModal(true);
  }, []);

  const closeProductDetails = useCallback(() => {
    setShowModal(false);
    setSelectedProduct(null);
  }, []);

  // Pagination helpers
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const getPaginationRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          range.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          range.push(i);
        }
      }
    }
    
    return range;
  };

  return (
    <div className="products-page-container">
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />
      
      {/* Filters Sidebar */}
      <div className="filters-sidebar">
        <div className="filters-header">
          <h3>Filters</h3>
          <button className="clear-filters-btn">Show All</button>
        </div>
        
        {/* Category Filters */}
        <div className="filter-section">
          <h4>Product Categories</h4>
          <div className="filter-options">
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              B Vitamins
            </label>
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              C Vitamins
            </label>
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Omega Supplements
            </label>
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Minerals
            </label>
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Probiotics
            </label>
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Herbal Supplements
            </label>
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Multivitamins
            </label>
            <label className="filter-option">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Collagen
            </label>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-filter">
            <div className="price-input-group">
              <div className="price-input-wrapper">
                <label>Min ($)</label>
                <input type="number" placeholder="0" className="price-input" />
              </div>
              <div className="price-input-wrapper">
                <label>Max ($)</label>
                <input type="number" placeholder="1000" className="price-input" />
              </div>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h4>Sort By</h4>
          <select className="sort-select">
            <option value="default">Default</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="stock-asc">Stock Low to High</option>
            <option value="stock-desc">Stock High to Low</option>
          </select>
        </div>
      </div>

      <div className="main-content">
        {/* Search Section */}
        <div className="search-section">
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

        {loading ? (
          <div className="loading-section">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="error-section">
            <div className="error-content">
              <p className="error-text">❌ {error}</p>
              <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-section">
            <div className="empty-content">
              <p className="empty-text">No products available at the moment.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                <span className="results-count">
                  Showing {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} Products
                </span>
                <div className="cart-status">
                  <span className="cart-items-count">
                    Cart: {cartItemsCount} items
                  </span>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th className="col-image">Image</th>
                <th className="col-product">Product ID</th>
                <th className="col-upc">UPC</th>
                <th className="col-title">Product Title</th>
                <th className="col-location">Bin Location</th>
                <th className="col-price">Price</th>
                <th className="col-quantity">Quantity</th>
                <th className="col-subtotal">Subtotal</th>
                <th className="col-actions">Add to Cart</th>
                <th className="col-details">Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, index) => {
                const quantity = getQuantity(product._id);
                const isOutOfStock = product.stock === 0;
                const isMaxQuantity = quantity >= product.stock;
                const isAddingToCart = addingToCart[product._id] || false;
                const isInWishlist = wishlistItems.includes(product._id);
                const subtotal = (product.buyPrice * quantity).toFixed(2);

                return (
                  <tr key={product._id} className={`product-row ${isOutOfStock ? 'out-of-stock' : ''}`}>
                    {/* Product Image */}
                    <td className="col-image">
                      <div className="product-image-wrapper">
                        <img
                          src={`/${((index % 7) + 1)}.png`}
                          alt={product.name}
                          className="product-image"
                        />
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
                    </td>

                    {/* Product ID */}
                    <td className="col-product">
                      <span className="product-id">
                        {product.item_number || product.product_id || "N/A"}
                      </span>
                    </td>

                    {/* UPC */}
                    <td className="col-upc">
                      <span className="upc-code">
                        {product.lookup_code || product.sku || "N/A"}
                      </span>
                    </td>

                    {/* Product Title */}
                    <td className="col-title">
                      <div className="product-title-info">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-category">
                          {product.category?.name || product.categoryName || product.department || "General"}
                        </div>
                        {isOutOfStock && <span className="stock-status out-of-stock">Out of Stock</span>}
                        {!isOutOfStock && <span className="stock-status in-stock">Stock: {product.stock}</span>}
                      </div>
                    </td>

                    {/* Bin Location */}
                    <td className="col-location">
                      <span className="bin-location">
                        {product.bin_location || "N/A"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="col-price">
                      <span className="price">${product.buyPrice.toFixed(2)}</span>
                    </td>

                    {/* Quantity Controls */}
                    <td className="col-quantity">
                      <div className="quantity-controls">
                        <button
                          onClick={() => decrementQuantity(product._id)}
                          disabled={quantity <= moq || isAddingToCart}
                          className="quantity-btn decrease"
                        >
                          −
                        </button>
                        <span className="quantity-display">{quantity}</span>
                        <button
                          onClick={() => incrementQuantity(product._id, product.stock)}
                          disabled={isMaxQuantity || isOutOfStock || isAddingToCart}
                          className="quantity-btn increase"
                        >
                          +
                        </button>
                      </div>
                      <div className="quantity-info">
                        <span>MOQ: {moq}</span>
                      </div>
                    </td>

                    {/* Subtotal */}
                    <td className="col-subtotal">
                      <span className="subtotal">${subtotal}</span>
                    </td>

                    {/* Add to Cart */}
                    <td className="col-actions">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock || isAddingToCart}
                        className={`buy-now-btn ${isOutOfStock ? 'disabled' : ''}`}
                      >
                        {isOutOfStock ? "Out of Stock" : isAddingToCart ? "Adding..." : "BUY NOW"}
                      </button>
                    </td>

                    {/* Details */}
                    <td className="col-details">
                      <button 
                        className="details-btn"
                        onClick={() => openProductDetails(product)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn pagination-prev"
            >
              ← Previous
            </button>

            <div className="pagination-pages">
              {currentPage > 1 && totalPages > 5 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="pagination-number"
                  >
                    1
                  </button>
                  {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
                </>
              )}

              {getPaginationRange().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}

              {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                  <span className="pagination-ellipsis">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="pagination-number"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn pagination-next"
            >
              Next →
            </button>

            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
        </>
        )}
      </div>

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeProductDetails}>
          <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Product Details</h2>
              <button className="close-modal-btn" onClick={closeProductDetails}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="product-image-section">
                <img
                  src={`/${((products.findIndex(p => p._id === selectedProduct._id) % 7) + 1)}.png`}
                  alt={selectedProduct.name}
                  className="modal-product-image"
                />
                <div className="image-actions">
                  <button
                    onClick={() => addToWishlist(selectedProduct)}
                    disabled={addingToWishlist[selectedProduct._id]}
                    className={`modal-wishlist-btn ${wishlistItems.includes(selectedProduct._id) ? 'active' : ''}`}
                  >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {wishlistItems.includes(selectedProduct._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
              
              <div className="product-details-section">
                <div className="product-header">
                  <h3 className="modal-product-name">{selectedProduct.name}</h3>
                  <div className="stock-status-modal">
                    {selectedProduct.stock === 0 ? (
                      <span className="stock-badge out-of-stock">Out of Stock</span>
                    ) : (
                      <span className="stock-badge in-stock">In Stock ({selectedProduct.stock} available)</span>
                    )}
                  </div>
                </div>
                
                <div className="product-info-grid">
                  <div className="info-item">
                    <label>Product ID:</label>
                    <span>{selectedProduct.item_number || selectedProduct.product_id || "N/A"}</span>
                  </div>
                  
                  <div className="info-item">
                    <label>UPC Code:</label>
                    <span>{selectedProduct.lookup_code || selectedProduct.sku || "N/A"}</span>
                  </div>
                  
                  <div className="info-item">
                    <label>Category:</label>
                    <span>{selectedProduct.category?.name || selectedProduct.categoryName || selectedProduct.department || "General"}</span>
                  </div>
                  
                  <div className="info-item">
                    <label>Bin Location:</label>
                    <span>{selectedProduct.bin_location || "N/A"}</span>
                  </div>
                  
                  <div className="info-item">
                    <label>Department:</label>
                    <span>{selectedProduct.department || "N/A"}</span>
                  </div>
                  
                  <div className="info-item">
                    <label>Available Stock:</label>
                    <span>{selectedProduct.stock} units</span>
                  </div>
                </div>
                
                <div className="pricing-section">
                  <div className="price-display">
                    <label>Unit Price:</label>
                    <span className="modal-price">${selectedProduct.buyPrice.toFixed(2)}</span>
                  </div>
                  <div className="moq-info">
                    <label>Minimum Order Quantity:</label>
                    <span>{moq} units</span>
                  </div>
                </div>
                
                <div className="quantity-section">
                  <label>Select Quantity:</label>
                  <div className="modal-quantity-controls">
                    <button
                      onClick={() => decrementQuantity(selectedProduct._id)}
                      disabled={getQuantity(selectedProduct._id) <= moq}
                      className="modal-quantity-btn decrease"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="modal-quantity-display">{getQuantity(selectedProduct._id)}</span>
                    <button
                      onClick={() => incrementQuantity(selectedProduct._id, selectedProduct.stock)}
                      disabled={getQuantity(selectedProduct._id) >= selectedProduct.stock || selectedProduct.stock === 0}
                      className="modal-quantity-btn increase"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="subtotal-display">
                    <label>Subtotal:</label>
                    <span className="modal-subtotal">
                      ${(selectedProduct.buyPrice * getQuantity(selectedProduct._id)).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeProductDetails();
                    }}
                    disabled={selectedProduct.stock === 0 || addingToCart[selectedProduct._id]}
                    className={`modal-add-to-cart ${selectedProduct.stock === 0 ? 'disabled' : ''}`}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1m0 0h4a1 1 0 001-1m-6 0V13m0 10V13m0 0h6" />
                    </svg>
                    {selectedProduct.stock === 0 ? "Out of Stock" : addingToCart[selectedProduct._id] ? "Adding..." : "BUY NOW"}
                  </button>
                  
                  <button className="modal-close-btn" onClick={closeProductDetails}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductLists;
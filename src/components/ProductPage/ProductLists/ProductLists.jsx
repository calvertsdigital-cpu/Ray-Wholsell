import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { stagger, useAnimate, useInView } from "framer-motion";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { SubscriptionOption } from "../../Subscription/SubscriptionOption";
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
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
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
  const [categoryName, setCategoryName] = useState("");
  const [modalSubscription, setModalSubscription] = useState({
    isSubscription: false, frequency: null, discountPercentage: 0, discount: 0,
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  // Filter + sort state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState([]);

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

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        
        const isFiltered = !!categoryId;
        console.log(isFiltered ? `🔄 Fetching products for category: ${categoryId}` : '🔄 Fetching ALL products...');
        
        // Fetch products with optional category filter
        const response = await axios.get(`${BASE_URL}/api/user/catalog/products`, {
          params: {
            page: 1,
            limit: 500,
            search: searchQuery,
            ...(categoryId && { category: categoryId })  // Add category filter if provided
          }
        });
        
        if (response.data?.products && response.data.products.length > 0) {
          console.log(`✅ Loaded ${response.data.products.length} products`);
          
          // Set category name from first product if filtering
          if (categoryId && response.data.products[0]?.category?.name) {
            setCategoryName(response.data.products[0].category.name);
          }
          
          setProducts(response.data.products);
          // Don't set paginatedProducts here — the filter+sort useEffect will handle it
          setLoading(false);
          return;
        }
        
        console.warn('⚠️  No products found');
        setProducts([]);
        setPaginatedProducts([]);
        setTotalProducts(0);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error fetching products:', error.message);
        setError(error.message || "Failed to fetch products");
        setProducts([]);
        setPaginatedProducts([]);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [BASE_URL, searchQuery, categoryId]);

  // Fetch wishlist if user is logged in
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setWishlistItems([]);
          return;
        }

        const response = await axiosInstance.get('/api/auth/wishlist', {
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
  }, []);

  // Initialize cart count and listen for updates
  useEffect(() => {
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

  // ── Apply filters + sort whenever products / filter state changes ───────
  useEffect(() => {
    let result = [...products];

    // 1. Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p =>
        selectedCategories.includes(p.category)
      );
    }

    // 2. Price range filter (use first variant price or buyPrice)
    const min = minPrice !== "" ? parseFloat(minPrice) : null;
    const max = maxPrice !== "" ? parseFloat(maxPrice) : null;
    if (min !== null || max !== null) {
      result = result.filter(p => {
        const price = p.variants?.[0]?.price ?? p.buyPrice ?? 0;
        if (min !== null && price < min) return false;
        if (max !== null && price > max) return false;
        return true;
      });
    }

    // 3. Sort
    if (sortBy === "name-asc")   result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "name-desc")  result.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "price-asc")  result.sort((a, b) => (a.variants?.[0]?.price ?? a.buyPrice ?? 0) - (b.variants?.[0]?.price ?? b.buyPrice ?? 0));
    if (sortBy === "price-desc") result.sort((a, b) => (b.variants?.[0]?.price ?? b.buyPrice ?? 0) - (a.variants?.[0]?.price ?? a.buyPrice ?? 0));
    if (sortBy === "stock-asc")  result.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
    if (sortBy === "stock-desc") result.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));

    setFilteredProducts(result);
    setCurrentPage(1); // reset to page 1 when filters change
  }, [products, selectedCategories, minPrice, maxPrice, sortBy]);

  // ── Paginate filteredProducts ─────────────────────────────────────────────
  // Handle pagination when products or current page changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      setTotalProducts(filteredProducts.length);
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const paginated = filteredProducts.slice(startIndex, endIndex);
      setPaginatedProducts(paginated);
      window.scrollTo(0, 0);
    } else {
      setTotalProducts(0);
      setPaginatedProducts([]);
    }
  }, [filteredProducts, currentPage, productsPerPage]);

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
        
        // Get the correct price from variants or fallback fields
        const itemPrice = product.variants?.[0]?.price || product.sellPrice || product.buyPrice || 0;
        
        // Check if product already in cart
        const existingItem = currentCart.find(item => item._id === product._id);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          currentCart.push({
            _id: product._id,
            name: product.name,
            price: itemPrice,
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

  const openProductDetails = useCallback((product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setModalSubscription({ isSubscription: false, frequency: null, discountPercentage: 0, discount: 0 });
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

  // Derive unique categories from loaded products for the filter sidebar
  const uniqueCategories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    return [...new Set(cats)].sort();
  }, [products]);

  // Handler: toggle a category checkbox
  const handleCategoryToggle = useCallback((cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }, []);

  // Handler: clear all filters
  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
  }, []);

  return (
    <div className="products-page-container">
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />
      
      {/* Filters Sidebar */}
      <div className="filters-sidebar">
        <div className="filters-header">
          <h3>Filters</h3>
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Show All
          </button>
        </div>

        {/* Category Filters — built from real product data */}
        <div className="filter-section">
          <h4>Product Categories</h4>
          <div className="filter-options">
            {uniqueCategories.map(cat => (
              <label key={cat} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                />
                <span className="checkmark"></span>
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-filter">
            <div className="price-input-group">
              <div className="price-input-wrapper">
                <label>Min ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="price-input"
                  value={minPrice}
                  min="0"
                  onChange={e => setMinPrice(e.target.value)}
                />
              </div>
              <div className="price-input-wrapper">
                <label>Max ($)</label>
                <input
                  type="number"
                  placeholder="1000"
                  className="price-input"
                  value={maxPrice}
                  min="0"
                  onChange={e => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h4>Sort By</h4>
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="stock-asc">Stock Low to High</option>
            <option value="stock-desc">Stock High to Low</option>
          </select>
        </div>

        {/* Active filter summary */}
        {(selectedCategories.length > 0 || minPrice || maxPrice || sortBy !== "default") && (
          <div className="filter-section active-filters">
            <h4>Active Filters</h4>
            {selectedCategories.map(cat => (
              <span key={cat} className="active-filter-tag">
                {cat}
                <button onClick={() => handleCategoryToggle(cat)}>×</button>
              </span>
            ))}
            {(minPrice || maxPrice) && (
              <span className="active-filter-tag">
                ${minPrice || "0"} – ${maxPrice || "∞"}
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); }}>×</button>
              </span>
            )}
          </div>
        )}
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
              placeholder="Search by RHL ID, RHL UPC, or Product Title..."
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

            {/* ── MOBILE CARD VIEW (hidden on desktop) ── */}
            <div className="mobile-product-cards">
              {paginatedProducts.map((product, index) => {
                const quantity = getQuantity(product._id);
                const isOutOfStock = product.stock === 0;
                const isAddingToCart = addingToCart[product._id] || false;
                const isInWishlist = wishlistItems.includes(product._id);
                const productPrice = product.variants?.[0]?.price || product.buyPrice || 0;
                const subtotal = (productPrice * quantity).toFixed(2);
                return (
                  <div key={product._id} className={`mobile-product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
                    {/* Image + wishlist */}
                    <div className="mpc-image-wrap">
                      <img src={`/${((index % 7) + 1)}.png`} alt={product.name} className="mpc-img" />
                      <button
                        onClick={() => addToWishlist(product)}
                        className={`mpc-wishlist ${isInWishlist ? 'active' : ''}`}
                        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    {/* Info */}
                    <div className="mpc-info">
                      <h3 className="mpc-name">{product.rhlProductTitle || product.name}</h3>
                      <div className="mpc-badges">
                        {product.category && <span className="badge category-badge">{product.category}</span>}
                        {product.type && <span className="badge type-badge">{product.type}</span>}
                      </div>
                      {product.rhlId && <small className="mpc-rhlid">RHL#{product.rhlId}</small>}
                      <p className="mpc-desc">{product.description}</p>
                      <div className="mpc-row">
                        <span className="mpc-label">Price:</span>
                        <span className="mpc-price">${productPrice.toFixed(2)}</span>
                      </div>
                      <div className="mpc-row">
                        <span className="mpc-label">Stock:</span>
                        <span className={isOutOfStock ? 'mpc-out' : 'mpc-in'}>
                          {isOutOfStock ? 'Out of Stock' : `${product.stock} units`}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="mpc-qty-row">
                        <button onClick={() => decrementQuantity(product._id)} disabled={quantity <= moq} className="quantity-btn decrease">−</button>
                        <span className="quantity-display">{quantity}</span>
                        <button onClick={() => incrementQuantity(product._id, product.stock)} disabled={quantity >= product.stock || isOutOfStock} className="quantity-btn increase">+</button>
                        <span className="mpc-subtotal">= ${subtotal}</span>
                      </div>

                      {/* Actions */}
                      <div className="mpc-actions">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={isOutOfStock || isAddingToCart}
                          className={`buy-now-btn ${isOutOfStock ? 'disabled' : ''}`}
                        >
                          {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'ADD TO CART'}
                        </button>
                        <button className="details-btn" onClick={() => openProductDetails(product)}>Details</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── DESKTOP TABLE VIEW (hidden on mobile) ── */}
            <div className="products-table-container desktop-only-table">
          <table className="products-table">
            <thead>
              <tr>
                <th className="col-image">Image</th>
                <th className="col-product">RHL ID</th>
                <th className="col-rhl-upc">RHL UPC</th>
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
                const productPrice = product.variants?.[0]?.price || product.buyPrice || 0;
                const subtotal = (productPrice * quantity).toFixed(2);

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
                        {product.rhlId || product.item_number || product.product_id || "N/A"}
                      </span>
                    </td>

                    {/* RHL UPC */}
                    <td className="col-rhl-upc">
                      <span className="rhl-upc-code">
                        {product.variants?.[0]?.rhlUpc || product.lookup_code || product.sku || "N/A"}
                      </span>
                    </td>

                    {/* Product Title */}
                    <td className="col-title">
                      <div className="product-title-info">
                        <h3 className="product-name">{product.rhlProductTitle || product.name}</h3>
                        <div className="product-metadata">
                          {product.category && (
                            <span className="badge category-badge">{product.category}</span>
                          )}
                          {product.type && (
                            <span className="badge type-badge">{product.type}</span>
                          )}
                          {product.variants && product.variants.length > 0 && (
                            <span className="badge variant-badge">{product.variants.length} sizes</span>
                          )}
                        </div>
                        {product.description && (
                          <p className="product-description">{product.description}</p>
                        )}
                        {product.rhlId && (
                          <small className="rhl-id">RHL#{product.rhlId}</small>
                        )}
                        {isOutOfStock && <span className="stock-status out-of-stock">Out of Stock</span>}
                        {!isOutOfStock && <span className="stock-status in-stock">Stock: {product.stock}</span>}
                      </div>
                    </td>

                    {/* Bin Location */}
                    <td className="col-location">
                      <span className="bin-location">
                        {product.variants?.[0]?.binLocation || <span className="bin-pending">Not yet assigned</span>}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="col-price">
                      {product.variants && product.variants.length > 0 ? (
                        <div className="price-display">
                          <span className="price">${product.variants[0].price?.toFixed(2) || "N/A"}</span>
                          {product.variants.length > 1 && (
                            <small className="price-range">
                              (${Math.min(...product.variants.map(v => v.price || 0)).toFixed(2)} - ${Math.max(...product.variants.map(v => v.price || 0)).toFixed(2)})
                            </small>
                          )}
                        </div>
                      ) : (
                        <span className="price">${product.buyPrice?.toFixed(2) || "N/A"}</span>
                      )}
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
                        {isOutOfStock ? "Out of Stock" : isAddingToCart ? "Adding..." : "ADD TO CART"}
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
                  src={`/${(Math.floor(Math.random() * 7) + 1)}.png`}
                  alt={selectedProduct.name || 'Product'}
                  className="modal-product-image"
                  onError={(e) => { e.target.src = '/1.png'; }}
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
                  <h3 className="modal-product-name">{selectedProduct.rhlProductTitle || selectedProduct.name}</h3>
                  {selectedProduct.rhlProductTitle && (
                    <p className="modal-manufacturer-name">{selectedProduct.name}</p>
                  )}
                  {selectedProduct.rhlId && (
                    <span className="modal-rhl-id">RHL#{selectedProduct.rhlId}</span>
                  )}
                  <div className="stock-status-modal">
                    {selectedProduct.stock === 0 ? (
                      <span className="stock-badge out-of-stock">Out of Stock</span>
                    ) : (
                      <span className="stock-badge in-stock">In Stock ({selectedProduct.stock} available)</span>
                    )}
                  </div>
                  {selectedProduct.category && (
                    <div className="modal-metadata">
                      <span className="modal-badge category">{selectedProduct.category}</span>
                      {selectedProduct.type && <span className="modal-badge type">{selectedProduct.type}</span>}
                    </div>
                  )}
                </div>
                
                <div className="product-info-grid">
                  {selectedProduct.rhlId && (
                    <div className="info-item">
                      <label>RHL ID:</label>
                      <span>{selectedProduct.rhlId}</span>
                    </div>
                  )}
                  
                  {selectedProduct.variants?.[0]?.rhlUpc && (
                    <div className="info-item">
                      <label>RHL UPC:</label>
                      <span>{selectedProduct.variants[0].rhlUpc}</span>
                    </div>
                  )}

                  {/* Bin Location — always show, null = not yet confirmed */}
                  <div className="info-item">
                    <label>Bin Location:</label>
                    <span>
                      {selectedProduct.variants?.[0]?.binLocation
                        ? selectedProduct.variants[0].binLocation
                        : <span className="bin-pending">Not yet assigned</span>
                      }
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <label>Category:</label>
                    <span>{selectedProduct.category || "General"}</span>
                  </div>

                  {selectedProduct.manufacturerName && (
                    <div className="info-item">
                      <label>Manufacturer:</label>
                      <span>{selectedProduct.manufacturerName}</span>
                    </div>
                  )}
                  
                  {selectedProduct.description && (
                    <div className="info-item full-width">
                      <label>Description:</label>
                      <span>{selectedProduct.description}</span>
                    </div>
                  )}
                  
                  {selectedProduct.ingredients && (
                    <div className="info-item full-width">
                      <label>Ingredients:</label>
                      <span className="ingredients-text">{selectedProduct.ingredients}</span>
                    </div>
                  )}
                </div>
                
                <div className="pricing-section">
                  <div className="price-display">
                    <label>Unit Price:</label>
                    <span className="modal-price">${(selectedProduct?.variants?.[0]?.price || selectedProduct?.buyPrice || 0).toFixed(2)}</span>
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
                      ${((selectedProduct?.variants?.[0]?.price || selectedProduct?.buyPrice || 0) * getQuantity(selectedProduct._id)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Subscribe to Save option */}
                <SubscriptionOption
                  product={selectedProduct}
                  quantity={getQuantity(selectedProduct._id)}
                  basePrice={selectedProduct?.variants?.[0]?.price || selectedProduct?.buyPrice || 0}
                  onSubscriptionChange={(data) => setModalSubscription(data)}
                />

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
                    {selectedProduct.stock === 0 ? "Out of Stock" : addingToCart[selectedProduct._id] ? "Adding..." : modalSubscription.isSubscription ? "SUBSCRIBE & SAVE" : "ADD TO CART"}
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
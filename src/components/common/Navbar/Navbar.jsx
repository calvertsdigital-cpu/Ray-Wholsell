import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import "./Navbar.scss";
import Logo from "../../../assets/images/logos/WholesaleLogo.png";
import {
  CircleX,
  Heart,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
  Menu,
  Search,
  Home,
  Info,
  ShoppingBag,
  FileText,
  Mail,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import _ from "lodash";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

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
    <div className={`toast toast--${type}`}>
      <div className="toast__content">
        <div className="toast__icon">
          {type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        </div>
        <span className="toast__message">{message}</span>
        <button className="toast__close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51Pzw0LP7DJ8fgdDBWpegxFsZqtmbHZkIxChlGrx1cQmacXTlJa5w2FvSr9cEF8phWB7wxsRlzI2qCYoYHcm4YbQw00a45tFQ2c";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
export const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [labelDetails, setLabelDetails] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isCartOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const token = localStorage.getItem("userToken");
  let decodedToken = null;
  let firstName = "User";

  if (token) {
    try {
      decodedToken = jwtDecode(token);
      firstName = decodedToken?.id?.name?.split(" ")[0] || "User";
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("userToken");
    }
  }

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("checkoutSessionId");
    localStorage.removeItem("shipEngineLabelId");
    localStorage.removeItem("trackingNumber");
    localStorage.removeItem("labelDownload");
    showToast("Logged out successfully", "success");
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const searchProducts = useCallback(
    _.debounce(async (query) => {
      if (!query.trim()) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/wholesaler/search-products?search=${encodeURIComponent(query.trim())}&page=1&limit=6`
        );

        if (response.data.products) {
          setSearchSuggestions(response.data.products);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 500),
    [BASE_URL]
  );

  const updateCartCount = useCallback(
    _.debounce(async () => {
      try {
        if (window.isCouponApplying) {
          console.log("[DEBUG] Skipping cart count update during coupon application");
          return;
        }

        const token = localStorage.getItem("userToken");
        if (token) {
          try {
            // PRIORITY: Always get cart from backend first for logged-in users
            const response = await axiosInstance.get("/api/user/get-cart", {
              headers: {
                Authorization: `Bearer ${token}`,
                'X-Website-Role': 'user'
              },
            });
            const backendCart = response.data.cart;
            const backendCount = backendCart.items.length;
            
            console.log("[DEBUG] Backend cart count:", backendCount);
            setCartItemCount(backendCount);
            
            // Sync localStorage with backend for consistency
            if (backendCart.items.length > 0) {
              const syncedLocalCart = backendCart.items.map(item => ({
                _id: item._id,
                product: item.product,
                quantity: item.quantity,
                websiteRole: item.websiteRole || 'wholesaler'
              }));
              localStorage.setItem("localCart", JSON.stringify(syncedLocalCart));
              console.log("[DEBUG] Synchronized localStorage with backend cart");
            }
            
            return; // Exit early if backend call succeeded
            
          } catch (apiError) {
            console.log("[DEBUG] Backend cart API error:", apiError.response?.status);
            // If backend fails, show 0 items (honest empty cart)
            setCartItemCount(0);
            return;
          }
        }

        // No token - show empty cart
        setCartItemCount(0);
        
      } catch (error) {
        console.error("Error in updateCartCount:", error);
        setCartItemCount(0);
      }
    }, 300),
    []
  );

  useEffect(() => {
    updateCartCount();
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      updateCartCount.cancel();
    };
  }, [updateCartCount]);
  // Memoized Coupon Section to prevent unnecessary re-renders
  const CouponSection = memo(({
    couponCode,
    setCouponCode,
    couponError,
    setCouponError,
    couponLoading,
    couponDiscount,
    coupons,
    isCouponsOpen,
    setIsCouponsOpen,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleSelectCoupon,
    loading,
    cartItems,
    totalCartPrice
  }) => {
    return (
      <div style={{ margin: "1rem 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            padding: "0.75rem 1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "0.5rem",
          }}
          onClick={() => setIsCouponsOpen(!isCouponsOpen)}
        >
          <h3
            style={{
              fontSize: window.innerWidth <= 768 ? "3.5vw" : "1.2dvw",
              fontFamily: "Roboto, sans-serif",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Apply Coupon Code
          </h3>
          {isCouponsOpen ? (
            <ChevronUp size={window.innerWidth <= 768 ? 16 : 18} color="#333" />
          ) : (
            <ChevronDown size={window.innerWidth <= 768 ? 16 : 18} color="#333" />
          )}
        </div>

        {isCouponsOpen && coupons.length > 0 && (
          <div style={{ margin: "0.75rem 0", padding: "0.75rem", backgroundColor: "#f9f9f9", borderRadius: "0.5rem" }}>
            <h4 style={{ fontSize: window.innerWidth <= 768 ? "3vw" : "1.1dvw", marginBottom: "0.5rem" }}>
              Available Coupons
            </h4>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {coupons.map((coupon) => {
                const isApplicable = parseFloat(totalCartPrice) >= coupon.minPurchase;
                return (
                  <div
                    key={coupon._id}
                    style={{
                      border: `1px solid ${isApplicable ? "#28a745" : "#e0e0e0"}`,
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      cursor: isApplicable ? "pointer" : "not-allowed",
                      backgroundColor: isApplicable ? "rgba(40, 167, 69, 0.1)" : "#f8f9fa",
                      opacity: isApplicable ? 1 : 0.6,
                    }}
                    onClick={() => isApplicable && handleSelectCoupon(coupon)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h5 style={{ fontSize: window.innerWidth <= 768 ? "3vw" : "1.1dvw", margin: 0 }}>
                        {coupon.code}
                      </h5>
                      <span style={{
                        fontSize: window.innerWidth <= 768 ? "2.5vw" : "0.9dvw",
                        color: isApplicable ? "#28a745" : "#dc3545",
                        fontWeight: "600"
                      }}>
                        {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}
                      </span>
                    </div>
                    <p style={{ fontSize: window.innerWidth <= 768 ? "2.5vw" : "0.9dvw", margin: "0.25rem 0", color: "#666" }}>
                      Min Purchase: ${coupon.minPurchase}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.75rem 0" }}>
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              setCouponError("");
            }}
            style={{
              flex: 1,
              padding: "0.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              fontSize: window.innerWidth <= 768 ? "2.5vw" : "0.9dvw",
              fontFamily: "Open Sans, sans-serif",
              outline: "none",
            }}
            disabled={couponLoading || loading}
          />
          {couponLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}>
              <div className="spinner small-spinner"></div>
              <span style={{ fontSize: window.innerWidth <= 768 ? "2.5vw" : "0.9dvw", color: "#666" }}>
                Applying...
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleApplyCoupon}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                backgroundColor: couponLoading || loading ? "#28a74580" : "#28a745",
                color: "#ffffff",
                fontFamily: "Roboto, sans-serif",
                fontWeight: "600",
                fontSize: window.innerWidth <= 768 ? "2.5vw" : "0.9dvw",
                cursor: couponLoading || loading ? "not-allowed" : "pointer",
                border: "none",
                transition: "background-color 0.2s",
              }}
              disabled={couponLoading || loading}
            >
              Apply
            </button>
          )}
        </div>

        {couponError && (
          <p style={{ color: "#dc3545", fontSize: window.innerWidth <= 768 ? "2.5vw" : "0.9dvw", margin: "0.5rem 0" }}>
            {couponError}
          </p>
        )}

        {couponDiscount > 0 && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem",
            backgroundColor: "#e9f7ef",
            borderRadius: "4px",
            margin: "0.5rem 0"
          }}>
            <span style={{ color: "#28a745", fontWeight: "600" }}>
              Coupon Applied: -${couponDiscount.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              style={{
                padding: "0.25rem 0.5rem",
                backgroundColor: "#dc3545",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontSize: window.innerWidth <= 768 ? "2vw" : "0.8dvw",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  });
  const CartModel = ({ setIsCartOpen }) => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [couponLoading, setCouponLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [shippingCost, setShippingCost] = useState(0);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponId, setCouponId] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [coupons, setCoupons] = useState([]);
    const [isCouponsOpen, setIsCouponsOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const showToast = (message, type = "success") => {
      setToast({ show: true, message, type });
    };

    const hideToast = () => {
      setToast({ show: false, message: "", type: "" });
    };

    const mainWrapperRef = useRef(null);
    const prevCartItemsRef = useRef(cartItems);
    const isCheckingOut = useRef(false);
    const isCouponApplying = useRef(false);
    const shippingFetched = useRef(false);
    const memoizedCartItems = useMemo(() => cartItems, [cartItems]);
    const initialCartFetched = useRef(false);

    useEffect(() => {
      console.log("[DEBUG] Cart modal opened, starting backend-first cart load");
      
      let isMounted = true;
      
      // Listen for cart updates from other components
      const handleCartUpdate = () => {
        console.log("[DEBUG] Cart update event received, refreshing cart...");
        if (isMounted) fetchCart();
      };
      
      // Also listen for storage changes (when localCart is updated from another component/tab)
      const handleStorageChange = (e) => {
        if (e.key === 'localCart' && isMounted) {
          console.log("[DEBUG] localStorage cart changed, refreshing...");
          fetchCart();
        }
      };
      
      window.addEventListener("cartUpdated", handleCartUpdate);
      window.addEventListener("storage", handleStorageChange);
      
      const fetchCart = async () => {
        try {
          console.log("[DEBUG] Starting cart fetch...");
          setLoading(true);
          
          const token = localStorage.getItem("userToken");
          
          if (token) {
            // PRIORITY: Try backend first for logged-in users
            try {
              console.log("[DEBUG] Fetching cart from backend API...");
              const response = await axiosInstance.get("/api/user/get-cart", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'X-Website-Role': 'user'
                },
              });
              
              const backendCart = response.data.cart;
              console.log("[DEBUG] Backend cart items:", backendCart.items.length);
              
              if (backendCart.items && backendCart.items.length > 0) {
                const backendCartFormatted = backendCart.items.map((item, index) => ({
                  _id: item._id || `backend_${item.product._id}_${Date.now()}_${index}`,
                  product: {
                    _id: item.product._id,
                    name: item.product.name || "Unnamed Product",
                    buyPrice: item.product.buyPrice || item.product.sellPrice || 0,
                    images: item.product.images || [],
                    stock: item.product.stock || 0,
                    weight: item.product.weight || 0.016,
                    dimensions: item.product.dimensions || { length: 10, width: 5, height: 2 },
                    description: item.product.description || "No description available",
                  },
                  quantity: item.quantity,
                }));
                
                if (isMounted) setCartItems(backendCartFormatted);
                
                // Sync localStorage with backend
                const localCartSync = backendCartFormatted.map(item => ({
                  _id: item._id,
                  product: item.product,
                  quantity: item.quantity,
                  websiteRole: 'wholesaler'
                }));
                localStorage.setItem("localCart", JSON.stringify(localCartSync));
                
                console.log("[DEBUG] Displayed cart from backend API:", backendCartFormatted.length, "items");
                initialCartFetched.current = true;
                return; // Exit early - backend data loaded successfully
              }
            } catch (apiError) {
              console.log("[DEBUG] Backend cart API failed:", apiError.response?.status);
              // On backend failure, try localStorage as fallback
              console.log("[DEBUG] Trying localStorage fallback...");
              const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
              if (localCart.length > 0) {
                // Transform localCart items to match expected format
                const transformedCart = localCart.map((item, index) => {
                  // Check if item is already in the expected format (has nested product)
                  if (item.product && item.product._id) {
                    return item;
                  }
                  // Transform from ProductLists format to CartModel format
                  return {
                    _id: item._id || `local_${index}_${Date.now()}`,
                    product: {
                      _id: item._id,
                      name: item.name || "Unnamed Product",
                      buyPrice: item.price || 0,
                      sellPrice: item.price || 0,
                      images: item.images || [],
                      stock: item.stock || 0,
                      weight: item.weight || 0.016,
                      dimensions: item.dimensions || { length: 10, width: 5, height: 2 },
                      description: item.description || "No description available",
                    },
                    quantity: item.quantity || 1,
                  };
                });
                if (isMounted) setCartItems(transformedCart);
                console.log("[DEBUG] Loaded from localStorage fallback:", transformedCart.length, "items");
                initialCartFetched.current = true;
                return;
              }
              // If both fail, show empty cart
              if (isMounted) setCartItems([]);
              initialCartFetched.current = true;
              return;
            }
          }
          
          // No token - try localStorage cart
          console.log("[DEBUG] No token - checking localStorage for cart");
          const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
          if (localCart.length > 0) {
            // Transform localCart items to match expected format
            const transformedCart = localCart.map((item, index) => {
              // Check if item is already in the expected format (has nested product)
              if (item.product && item.product._id) {
                return item;
              }
              // Transform from ProductLists format to CartModel format
              return {
                _id: item._id || `local_${index}_${Date.now()}`,
                product: {
                  _id: item._id,
                  name: item.name || "Unnamed Product",
                  buyPrice: item.price || 0,
                  sellPrice: item.price || 0,
                  images: item.images || [],
                  stock: item.stock || 0,
                  weight: item.weight || 0.016,
                  dimensions: item.dimensions || { length: 10, width: 5, height: 2 },
                  description: item.description || "No description available",
                },
                quantity: item.quantity || 1,
              };
            });
            if (isMounted) setCartItems(transformedCart);
            console.log("[DEBUG] Displayed cart from localStorage:", transformedCart.length, "items");
          } else {
            console.log("[DEBUG] No cart found - showing empty cart");
            if (isMounted) setCartItems([]);
          }
          initialCartFetched.current = true;
        } catch (error) {
          console.error("[ERROR] Error in fetchCart:", error);
          if (isMounted) setCartItems([]);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      
      fetchCart();
      
      return () => {
        isMounted = false;
        window.removeEventListener("cartUpdated", handleCartUpdate);
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);
    useEffect(() => {
      const fetchAddresses = async () => {
        if (cartItems.length === 0) {
          setAddressLoading(false);
          return;
        }

        try {
          setAddressLoading(true);
          const res = await axiosInstance.get("/api/auth/get-addresses");
          
          if (!res.data.addresses || res.data.addresses.length === 0) {
            setAddresses([{
              _id: 'temp-address-' + Date.now(),
              fullName: 'Test User',
              address: '123 Main Street',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'US',
              isDefault: true,
              name: 'Test User',
              addressLine1: '123 Main Street',
              zipcode: '10001'
            }]);
            setSelectedAddressId('temp-address-' + Date.now());
            setIsAddressOpen(false);
            showToast("Using default test address for checkout", "info");
          } else {
            setAddresses(res.data.addresses || []);
            const defaultAddress = res.data.addresses?.find((addr) => addr.isDefault);
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress._id);
              setIsAddressOpen(false);
            } else if (res.data.addresses && res.data.addresses.length > 0) {
              setSelectedAddressId(res.data.addresses[0]._id);
              setIsAddressOpen(false);
            } else {
              setIsAddressOpen(true);
            }
          }
        } catch (error) {
          if (error.response?.status === 429) {
            setAddresses([{
              _id: 'temp-address-' + Date.now(),
              fullName: 'Test User', 
              address: '123 Main Street',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'US',
              isDefault: true,
              name: 'Test User',
              addressLine1: '123 Main Street',
              zipcode: '10001'
            }]);
            setSelectedAddressId('temp-address-' + Date.now());
            setIsAddressOpen(false);
          } else {
            showToast("Unable to load addresses", "error");
          }
        } finally {
          setAddressLoading(false);
        }
      };

      const fetchCoupons = async () => {
        try {
          const token = localStorage.getItem("userToken");
          if (!token) return;
          
          const response = await axiosInstance.get(`/api/user/get-coupon`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCoupons(response.data || []);
        } catch (error) {
          if (error.response?.status !== 429) {
            console.error("Coupon fetch error:", error);
          }
          setCoupons([]);
        }
      };

      fetchAddresses();
      fetchCoupons();
    }, [cartItems.length]);
    useEffect(() => {
      const handleCartUpdate = () => {
        console.log("[DEBUG] Cart updated event received, refreshing cart display");
        
        setTimeout(() => {
          const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
          console.log("[DEBUG] Reading localStorage cart:", localCart.length, "items");
          
          if (localCart.length > 0) {
            const localCartFormatted = localCart.map((item, index) => {
              // Handle both formats:
              // Format 1 (from backend): { _id, product: { _id, name, buyPrice, images, stock, weight, dimensions, description }, quantity }
              // Format 2 (from ProductLists): { _id, name, price, quantity, stock, category, sku }
              
              const isBackendFormat = item.product && typeof item.product === 'object' && item.product._id;
              
              if (isBackendFormat) {
                // Already in backend format
                return {
                  _id: item._id || `${item.product._id}_${Date.now()}_${index}`,
                  product: {
                    _id: item.product._id,
                    name: item.product.name || "Unnamed Product",
                    buyPrice: item.product.buyPrice || item.product.sellPrice || 0,
                    images: item.product.images || [],
                    stock: item.product.stock || 0,
                    weight: item.product.weight || 0.016,
                    dimensions: item.product.dimensions || { length: 10, width: 5, height: 2 },
                    description: item.product.description || "No description available",
                  },
                  quantity: item.quantity,
                };
              } else {
                // ProductLists format - convert to backend format
                return {
                  _id: item._id || `product_${item._id}_${Date.now()}_${index}`,
                  product: {
                    _id: item._id,
                    name: item.name || "Unnamed Product",
                    buyPrice: item.price || 0,
                    images: item.images || [],
                    stock: item.stock || 0,
                    weight: item.weight || 0.016,
                    dimensions: item.dimensions || { length: 10, width: 5, height: 2 },
                    description: item.description || "No description available",
                  },
                  quantity: item.quantity,
                };
              }
            });
            
            setCartItems(localCartFormatted);
            setLoading(false);
          } else {
            setCartItems([]);
            setLoading(false);
          }
        }, 50);
      };

      handleCartUpdate();
      window.addEventListener("cartUpdated", handleCartUpdate);
      return () => {
        window.removeEventListener("cartUpdated", handleCartUpdate);
      };
    }, []);

    const fetchShippingRates = useCallback(
      _.debounce(async (addressId, cart) => {
        if (isCouponApplying.current || !addressId || addressLoading || cart.length === 0) {
          setShippingCost(0);
          setShippingLoading(false);
          return;
        }

        if (shippingFetched.current && selectedAddressId === addressId) {
          return;
        }

        try {
          setShippingLoading(true);
          const token = localStorage.getItem("userToken");
          if (!token) {
            setShippingCost(0);
            setShippingLoading(false);
            return;
          }

          const payloadCart = cart.map((item) => ({
            product: {
              _id: item.product._id,
              weight: item.product.weight || 0.016,
              dimensions: item.product.dimensions || { length: 10, width: 5, height: 2 },
            },
            quantity: item.quantity,
          }));

          const response = await axiosInstance.post(
            "/api/user/calculate-shipping-rates",
            { addressId, cartItems: payloadCart },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.shippingRates?.length > 0) {
            const cost = parseFloat(response.data.shippingRates[0].cost);
            setShippingCost(cost);
            shippingFetched.current = true;
          } else {
            setShippingCost(0);
          }
        } catch (err) {
          setShippingCost(0);
        } finally {
          setShippingLoading(false);
        }
      }, 1000),
      [addressLoading]
    );
    useEffect(() => {
      if (isCouponApplying.current || memoizedCartItems.length === 0) return;

      const cartHasChanged = JSON.stringify(
        memoizedCartItems.map((item) => ({
          id: item.product._id,
          quantity: item.quantity,
          weight: item.product.weight || 0.016,
        }))
      ) !== JSON.stringify(
        prevCartItemsRef.current.map((item) => ({
          id: item.product._id,
          quantity: item.quantity,
          weight: item.product.weight || 0.016,
        }))
      );

      if ((cartHasChanged || (selectedAddressId && !shippingFetched.current)) &&
        !addressLoading && !isCheckingOut.current && initialCartFetched.current &&
        !isCouponApplying.current) {
        fetchShippingRates(selectedAddressId, memoizedCartItems);
      }
      prevCartItemsRef.current = memoizedCartItems;
    }, [selectedAddressId, memoizedCartItems, fetchShippingRates, addressLoading]);

    const handleSelectCoupon = useCallback((coupon) => {
      setCouponCode(coupon.code);
      setCouponError("");
      setIsCouponsOpen(false);
      showToast(`Selected coupon: ${coupon.code}`, "success");
    }, []);

    const handleApplyCoupon = useCallback(async (e) => {
      e.preventDefault();
      if (!couponCode) {
        setCouponError("Please enter or select a coupon code");
        showToast("Please enter or select a coupon code", "error");
        return;
      }
      if (!selectedAddressId) {
        setCouponError("Please select a shipping address before applying a coupon");
        showToast("Please select a shipping address", "error");
        return;
      }

      isCouponApplying.current = true;
      window.isCouponApplying = true;
      setCouponLoading(true);
      setCouponError("");

      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          showToast("Please log in to apply coupon", "error");
          navigate("/auth/login");
          setIsCartOpen(false);
          return;
        }

        const payloadCart = memoizedCartItems.map((item) => ({
          product: { _id: item.product._id },
          quantity: item.quantity,
        }));

        const response = await axiosInstance.post(
          "/api/user/apply",
          {
            code: couponCode.trim().toUpperCase(),
            cartItems: payloadCart,
            addressId: selectedAddressId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCouponDiscount(response.data.discount);
        setCouponId(response.data.couponId);
        showToast(`Coupon applied! You saved $${response.data.discount.toFixed(2)}`, "success");

        setTimeout(() => {
          isCouponApplying.current = false;
          window.isCouponApplying = false;
        }, 1000);

      } catch (err) {
        console.error("Error applying coupon:", err.response?.data);
        const errorMessage = err.response?.data?.message || "Failed to apply coupon";
        setCouponError(errorMessage);
        setCouponDiscount(0);
        setCouponId(null);
        showToast(errorMessage, "error");
        isCouponApplying.current = false;
        window.isCouponApplying = false;
        
        if (err.response?.status === 401) {
          localStorage.removeItem("userToken");
          navigate("/auth/login");
          setIsCartOpen(false);
        }
      } finally {
        setCouponLoading(false);
      }
    }, [couponCode, selectedAddressId, memoizedCartItems, navigate]);
    const handleRemoveCoupon = useCallback(() => {
      setCouponCode("");
      setCouponDiscount(0);
      setCouponId(null);
      setCouponError("");
      isCouponApplying.current = false;
      window.isCouponApplying = false;
      showToast("Coupon removed", "success");
    }, []);

    const handleCheckout = async () => {
      if (isCheckingOut.current) {
        showToast("Checkout already in progress, please wait", "error");
        return;
      }

      isCheckingOut.current = true;

      if (memoizedCartItems.length === 0) {
        showToast("Cart is empty", "error");
        isCheckingOut.current = false;
        return;
      }

      if (!selectedAddressId) {
        showToast("Please select a shipping address", "error");
        setIsAddressOpen(true);
        isCheckingOut.current = false;
        return;
      }

      if (shippingLoading) {
        showToast("Shipping cost is still being calculated, please wait", "error");
        isCheckingOut.current = false;
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          showToast("Please log in to proceed to checkout", "error");
          navigate("/auth/login");
          setIsCartOpen(false);
          isCheckingOut.current = false;
          return;
        }

        // Real API mode: Create order with pending_review status
        console.log('🚀 Real checkout mode - calling API');
        console.log('📧 User token exists:', !!token);
        console.log('🏠 Selected address ID:', selectedAddressId);
        console.log('🛒 Cart items count:', cartItems.length);
        
        // Validate required data before API call
        if (!token) {
          throw new Error('User not authenticated');
        }
        if (!selectedAddressId) {
          throw new Error('No shipping address selected');
        }
        if (!cartItems || cartItems.length === 0) {
          throw new Error('Cart is empty');
        }
        
        const orderPayload = {
          addressId: selectedAddressId,
          couponCode: couponCode || null,
          notes: "",
          items: memoizedCartItems
            .filter(item => item?.product?._id)
            .map(item => ({
              productId: item.product?._id,
              quantity: item.quantity,
              price: item.product?.buyPrice || item.product?.sellPrice || item.price,
              websiteRole: 'wholesaler'
            }))
        };

        console.log('📦 Creating order with payload:', orderPayload);

        const orderResponse = await axiosInstance.post(
          "/api/orders/checkout",
          orderPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('✅ Order created successfully:', orderResponse.data);
        console.log('📧 Order number:', orderResponse.data.orderNumber);
        console.log('📧 Order confirmation email sent');

        // Show success message
        showToast(`Order created successfully! Order #${orderResponse.data.orderNumber}`, "success");
        
        // Wait 3 seconds before closing cart so user can see success message
        setTimeout(() => {
          setIsCartOpen(false);
        }, 3000);
        
        // Reset form state
        setSelectedData([]);
        setCouponCode("");
        setCouponDiscount(0);
        setCouponId(null);
        setCouponError("");
        
        // Update cart items (will be empty from backend)
        window.dispatchEvent(new Event("cartUpdated"));
        
        return;
      } catch (err) {
        console.error("Error during checkout:", err.response?.data || err);
        let errorMessage = err.response?.data?.message || err.message || "Failed to create order";
        
        // More specific error handling
        if (err.response?.status === 401) {
          errorMessage = "Please log in to complete checkout";
          localStorage.removeItem("userToken");
          showToast(errorMessage, "error");
          navigate("/auth/login");
          setIsCartOpen(false);
        } else if (err.response?.status === 400) {
          // Check for specific 400 error types
          if (errorMessage.includes('address')) {
            errorMessage = "Please add a shipping address before checkout";
          } else if (errorMessage.includes('cart')) {
            errorMessage = "Your cart is empty or invalid";
          } else {
            errorMessage = "Checkout failed: " + errorMessage;
          }
          showToast(errorMessage, "error");
        } else {
          showToast(errorMessage, "error");
        }
      } finally {
        setLoading(false);
        isCheckingOut.current = false;
      }
    };
    const handleRemoveItem = async (item) => {
      if (isCheckingOut.current) {
        showToast("Checkout in progress, please wait", "error");
        return;
      }

      setLoading(true);
      
      try {
        console.log("[DEBUG] Removing item from cart:", item.product.name);
        
        const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        const updatedLocalCart = localCart.filter(cartItem => cartItem.product?._id !== item.product?._id);
        localStorage.setItem("localCart", JSON.stringify(updatedLocalCart));
        
        const updatedCartItems = memoizedCartItems.filter(cartItem => cartItem.product?._id !== item.product?._id);
        setCartItems(updatedCartItems);
        setSelectedData((prev) => prev.filter((id) => id !== item._id));
        
        window.dispatchEvent(new Event("cartUpdated"));
        showToast("Item removed from cart", "success");
        
      } catch (err) {
        console.error("Error in handleRemoveItem:", err);
        showToast("Failed to remove item from cart", "error");
      } finally {
        setLoading(false);
      }
    };

    const handleQuantityChange = async (item, action) => {
      if (isCheckingOut.current) {
        showToast("Checkout in progress, please wait", "error");
        return;
      }

      const moq = 12; // Minimum Order Quantity
      const newQuantity = action === "increment" ? item.quantity + 1 : item.quantity - 1;
      
      if (newQuantity < moq) {
        showToast(`Minimum order quantity is ${moq} items`, "error");
        return;
      }
      if (newQuantity > (item.product?.stock || 0)) {
        showToast(`Only ${item.product?.stock || 0} items available`, "error");
        return;
      }

      try {
        const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        const updatedLocalCart = localCart.map(cartItem => {
          if (cartItem.product?._id === item.product?._id) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
        localStorage.setItem("localCart", JSON.stringify(updatedLocalCart));

        const updatedCartItems = memoizedCartItems.map(cartItem => {
          if (cartItem.product?._id === item.product?._id) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
        setCartItems(updatedCartItems);
        
        window.dispatchEvent(new Event("cartUpdated"));
        showToast("Cart item updated successfully", "success");
        
      } catch (err) {
        console.error("Error in handleQuantityChange:", err);
        showToast("Failed to update cart item", "error");
      }
    };

    const handleOnChange = (e) => {
      const value = e.target.value;
      if (value === "checkAll" && e.target.checked) {
        const allIds = memoizedCartItems.map((item) => item._id);
        setSelectedData(allIds);
      } else if (value === "checkAll" && !e.target.checked) {
        setSelectedData([]);
      } else {
        setSelectedData((prev) =>
          prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
        );
      }
    };

    const totalCartPrice = memoizedCartItems
      .filter(item => item?.product?._id)
      .reduce((sum, item) => {
        const price = item.product?.buyPrice || item.product?.sellPrice || item.price || 0;
        return sum + (price * (item.quantity || 1));
      }, 0)
      .toFixed(2);
    const totalWithShipping = (parseFloat(totalCartPrice) + shippingCost - couponDiscount).toFixed(2);

    const selectedAddress = addresses.find((addr) => addr._id === selectedAddressId);
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100%",
          zIndex: 99999999,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(5px)",
        }}
      >
        <div
          style={{
            width: window.innerWidth <= 768 ? "100%" : "50%",
            maxWidth: "600px",
            backgroundColor: "#ffffff",
            height: "100%",
            overflowY: "auto",
            padding: "1.5rem",
            borderRadius: window.innerWidth <= 768 ? "0" : "8px 0 0 8px",
            boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Toast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />
          
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              margin: "1.25rem 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3
                style={{
                  color: "#6c757d",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "bold",
                  fontSize: window.innerWidth <= 768 ? "5vw" : "2.5dvw",
                }}
              >
                Your Cart
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <input
                  id="selectAll"
                  onChange={handleOnChange}
                  type="checkbox"
                  value="checkAll"
                  checked={selectedData.length === memoizedCartItems.length && memoizedCartItems.length > 0}
                  style={{ height: window.innerWidth <= 768 ? "3vw" : "1dvw", width: window.innerWidth <= 768 ? "3vw" : "1dvw" }}
                />
                <label
                  style={{
                    fontSize: window.innerWidth <= 768 ? "3vw" : "1.2dvw",
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                  htmlFor="selectAll"
                >
                  Select All
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              style={{ cursor: "pointer" }}
            >
              <CircleX size={window.innerWidth <= 768 ? 24 : 30} />
            </button>
          </div>
          <div ref={mainWrapperRef} style={{ margin: "1.25rem 0" }}>
            {loading && memoizedCartItems.length === 0 && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1rem",
                textAlign: "center"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid #e0e0e0",
                  borderTop: "3px solid #28a745",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "1rem"
                }}></div>
                <p style={{
                  fontSize: window.innerWidth <= 768 ? "3vw" : "1dvw",
                  fontFamily: "Open Sans, sans-serif",
                  color: "#666"
                }}>
                  Loading your cart...
                </p>
              </div>
            )}
            
            {!loading && memoizedCartItems.length === 0 && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 1rem",
                textAlign: "center"
              }}>
                <h3 style={{
                  fontSize: window.innerWidth <= 768 ? "4vw" : "1.5dvw",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "600",
                  color: "#666",
                  marginBottom: "0.5rem"
                }}>
                  Your cart is empty
                </h3>
                <p style={{
                  fontSize: window.innerWidth <= 768 ? "3vw" : "1dvw",
                  fontFamily: "Open Sans, sans-serif",
                  color: "#999",
                  marginBottom: "1.5rem"
                }}>
                  Add some products to get started!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/products");
                  }}
                  style={{
                    padding: "0.75rem 2rem",
                    backgroundColor: "#28a745",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: window.innerWidth <= 768 ? "3vw" : "1dvw",
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Browse Products
                </button>
              </div>
            )}
            {memoizedCartItems.length > 0 && memoizedCartItems.filter(item => item?.product?._id).map((item, index) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 0",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <input
                    onChange={handleOnChange}
                    type="checkbox"
                    value={item._id}
                    checked={selectedData.includes(item._id)}
                    style={{ height: "16px", width: "16px" }}
                  />
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flex: 1,
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <h3 style={{
                      fontSize: "1.2rem",
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: "600",
                      color: "#333",
                    }}>
                      {item.product?.name || "Unnamed Product"}
                    </h3>
                    <h4 style={{
                      fontSize: "1.1rem",
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: "700",
                      color: "#333",
                    }}>
                      ${(item.product?.buyPrice || 0).toFixed(2)}
                      {item.quantity > 1 && (
                        <span style={{ fontSize: "0.9rem", fontWeight: "400", color: "#666" }}>
                          {" "}(Total: ${((item.product?.buyPrice || 0) * item.quantity).toFixed(2)})
                        </span>
                      )}
                    </h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, "decrement")}
                        disabled={item.quantity <= 12}
                        style={{
                          width: "2rem",
                          height: "2rem",
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          cursor: item.quantity <= 12 ? "not-allowed" : "pointer",
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{
                        padding: "0.25rem 1rem",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                      }}>
                        {item.quantity}
                      </span>
                      <span style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        fontStyle: "italic",
                        marginLeft: "0.5rem"
                      }}>
                        (MOQ: 12)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, "increment")}
                        disabled={item.quantity >= (item.product?.stock || 0)}
                        style={{
                          width: "2rem",
                          height: "2rem",
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          cursor: item.quantity >= (item.product?.stock || 0) ? "not-allowed" : "pointer",
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item)}
                    style={{ cursor: "pointer", color: "#666" }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Address Selection Section */}
          <div style={{ margin: "0.75rem 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "0.75rem 1rem",
                backgroundColor: "#f5f5f5",
                borderRadius: "0.5rem",
              }}
              onClick={() => setIsAddressOpen(!isAddressOpen)}
            >
              <h3
                style={{
                  fontSize: window.innerWidth <= 768 ? "3.5vw" : "1.2dvw",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Select Shipping Address
              </h3>
              {isAddressOpen ? (
                <ChevronUp size={window.innerWidth <= 768 ? 16 : 18} color="#333" />
              ) : (
                <ChevronDown size={window.innerWidth <= 768 ? 16 : 18} color="#333" />
              )}
            </div>
            
            {selectedAddress && !isAddressOpen && (
              <div
                style={{
                  margin: "0.75rem 0",
                  padding: "0.75rem",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: window.innerWidth <= 768 ? "2.5vw" : "0.9dvw",
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: "400",
                    color: "#666",
                  }}
                >
                  Shipping to: {selectedAddress.name}, {selectedAddress.addressLine1},{" "}
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipcode}
                </p>
              </div>
            )}
            
            {isAddressOpen && (
              addressLoading ? (
                <div style={{ margin: "0.75rem 0" }}>
                  <p style={{ color: "#666" }}>Loading addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div style={{ margin: "0.75rem 0" }}>
                  <p style={{ color: "#666" }}>No addresses found. Please add a shipping address.</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/account/my-profile", { state: { openTab: "Address" } });
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#28a745",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      marginTop: "0.5rem",
                    }}
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(2, 1fr)",
                    gap: "0.75rem",
                    margin: "0.75rem 0",
                    borderTop: "1px solid #e0e0e0",
                    paddingTop: "0.75rem",
                  }}
                >
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      style={{
                        border: selectedAddressId === addr._id ? "2px solid #28a745" : "1px solid #e0e0e0",
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        cursor: "pointer",
                        backgroundColor: selectedAddressId === addr._id ? "rgba(40, 167, 69, 0.1)" : "#ffffff",
                      }}
                      onClick={() => setSelectedAddressId(addr._id)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#333" }}>
                          {addr.title || addr.name}
                        </h3>
                        {addr.isDefault && (
                          <span
                            style={{
                              backgroundColor: "#6c757d",
                              padding: "0.2rem 0.5rem",
                              fontSize: "0.8rem",
                              borderRadius: "0.75rem",
                              color: "#ffffff",
                              fontWeight: "600",
                            }}
                          >
                            Default
                          </span>
                        )}
                      </div>
                      <div style={{ margin: "0.5rem 0" }}>
                        <p style={{ fontSize: "0.9rem", color: "#666", margin: "0.2rem 0" }}>
                          {addr.addressLine1}
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#666", margin: "0.2rem 0" }}>
                          {addr.city}, {addr.state}, {addr.country} - {addr.zipcode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
          {/* Coupon Section */}
          {memoizedCartItems.length > 0 && (
            <CouponSection
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponError={couponError}
              setCouponError={setCouponError}
              couponLoading={couponLoading}
              couponDiscount={couponDiscount}
              coupons={coupons}
              isCouponsOpen={isCouponsOpen}
              setIsCouponsOpen={setIsCouponsOpen}
              handleApplyCoupon={handleApplyCoupon}
              handleRemoveCoupon={handleRemoveCoupon}
              handleSelectCoupon={handleSelectCoupon}
              loading={loading}
              cartItems={memoizedCartItems}
              totalCartPrice={totalCartPrice}
            />
          )}

          {/* Order Summary and Checkout */}
          {memoizedCartItems.length > 0 && (
            <div
              style={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "#ffffff",
                padding: "1.5rem",
                borderTop: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                marginTop: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: window.innerWidth <= 768 ? "3.5vw" : "1.3dvw",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Order Summary
              </h3>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#666" }}>Subtotal</span>
                <span>${totalCartPrice}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#666" }}>Shipping fee</span>
                {shippingLoading ? (
                  <span style={{ color: "#666" }}>Calculating...</span>
                ) : (
                  <span>${shippingCost.toFixed(2)}</span>
                )}
              </div>
              
              {couponDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#666" }}>Coupon Discount ({couponCode})</span>
                  <span style={{ color: "#28a745" }}>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid #e0e0e0",
                  fontWeight: "600",
                }}
              >
                <span>Total (Incl. Shipping)</span>
                <span style={{ color: "#28a745", fontSize: "1.2rem" }}>${totalWithShipping}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={loading || memoizedCartItems.length === 0 || !selectedAddressId || addressLoading}
                style={{
                  width: "100%",
                  backgroundColor:
                    loading || memoizedCartItems.length === 0 || !selectedAddressId || addressLoading
                      ? "#28a74580"
                      : "#28a745",
                  color: "#ffffff",
                  padding: "0.75rem",
                  marginTop: "1rem",
                  cursor:
                    loading || memoizedCartItems.length === 0 || !selectedAddressId || addressLoading
                      ? "not-allowed"
                      : "pointer",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                }}
              >
                {loading
                  ? "Processing..."
                  : !selectedAddressId
                  ? "Select Address First"
                  : "Proceed to Checkout"}
              </button>
              
              {selectedData.length > 0 && (
                <button
                  onClick={() => {
                    selectedData.forEach(itemId => {
                      const item = memoizedCartItems.find(cartItem => cartItem._id === itemId);
                      if (item) handleRemoveItem(item);
                    });
                    setSelectedData([]);
                  }}
                  disabled={loading}
                  style={{
                    width: "100%",
                    backgroundColor: loading ? "#dc354580" : "#dc3545",
                    color: "#ffffff",
                    padding: "0.75rem",
                    marginTop: "0.5rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  Remove Selected Items
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <nav className="navbar-swanson">
        <Toast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />

        <div className="navbar-swanson__utility">
          <div className="navbar-swanson__container">
            <div className="utility-links">
              <a href="/"><Home size={16} /> Home</a>
              <a href="/about"><Info size={16} /> About</a>
              <a href="/products"><ShoppingBag size={16} /> Products</a>
              <a href="/blogs"><FileText size={16} /> Blogs</a>
              <a href="/contact"><Mail size={16} /> Contact</a>
              <button 
                className="wholesale-btn" 
                onClick={() => window.open(import.meta.env.VITE_RETAIL_URL, "_blank")}
              >
                <Building2 size={16} /> Retail
              </button>
              <button onClick={() => navigate("/feedback")}>
                <MessageSquare size={16} /> Feedback
              </button>
            </div>
          </div>
        </div>

        <div className="navbar-swanson__top">
          <div className="navbar-swanson__container">
            <button
              className="navbar-swanson__mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>

            <div className="navbar-swanson__logo">
              <Link to="/">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>

            <div className="navbar-swanson__search" ref={searchRef}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchProducts(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim() && searchSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
              />
              <button 
                className="navbar-swanson__search-btn" 
                aria-label="Search products" 
                type="button"
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    setShowSuggestions(false);
                  }
                }}
              >
                <Search size={20} />
              </button>
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="navbar-swanson__suggestions">
                  {searchSuggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => {
                        navigate(`/products-details/${product._id}`);
                        setShowSuggestions(false);
                        setSearchQuery("");
                      }}
                      className="navbar-swanson__suggestion-item"
                    >
                      <div>
                        <div className="suggestion-name">{product.name}</div>
                        <div className="suggestion-price">${product.buyPrice?.toFixed(2) || '0.00'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="navbar-swanson__icons">
              <button
                className="navbar-swanson__icon"
                onClick={() => {
                  if (!token) {
                    navigate("/auth/login");
                  } else {
                    navigate("/account/my-profile", { state: { openTab: "Wishlist" } });
                  }
                }}
                title="Wishlist"
              >
                <Heart size={28} />
              </button>

              <div className="navbar-swanson__profile" ref={profileRef}>
                {token ? (
                  <>
                    <button
                      className="navbar-swanson__icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileOpen(!isProfileOpen);
                      }}
                      title={`Welcome, ${firstName}!`}
                    >
                      <User size={28} />
                    </button>
                    {isProfileOpen && (
                      <div className="navbar-swanson__dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-header">
                          <span className="dropdown-name">👋 {firstName}</span>
                          <span className="dropdown-email">{decodedToken?.id?.email || "N/A"}</span>
                        </div>
                        <button onClick={() => { navigate("/account/my-profile"); setIsProfileOpen(false); }}>
                          <User size={18} /> My Profile
                        </button>
                        <button onClick={handleLogout} className="logout-btn">
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className="navbar-swanson__icon"
                    onClick={() => navigate("/auth/login")}
                    title="Login"
                  >
                    <User size={28} />
                  </button>
                )}
              </div>

              <button
                className="navbar-swanson__icon navbar-swanson__cart"
                onClick={() => setIsCartOpen(true)}
                title="Shopping Cart"
              >
                <ShoppingCart size={28} />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="navbar-swanson__mobile-menu">
            <div className="mobile-menu-wrapper">
              <div className="mobile-menu-content">
                <div className="mobile-menu-header">
                  <img src={Logo} alt="Logo" className="mobile-menu-logo" />
                  <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>

                <button 
                  className="mobile-menu-retail" 
                  onClick={() => { 
                    window.open(import.meta.env.VITE_RETAIL_URL, "_blank"); 
                    setIsMobileMenuOpen(false); 
                  }}
                >
                  <Building2 size={18} /> Retail
                </button>

                <div className="mobile-menu-divider"></div>

                <a href="/" className="mobile-menu-utility" onClick={() => setIsMobileMenuOpen(false)}>
                  <Home size={18} /> Home
                </a>
                <a href="/about" className="mobile-menu-utility" onClick={() => setIsMobileMenuOpen(false)}>
                  <Info size={18} /> About
                </a>
                <a href="/products" className="mobile-menu-utility" onClick={() => setIsMobileMenuOpen(false)}>
                  <ShoppingBag size={18} /> Products
                </a>
                <a href="/blogs" className="mobile-menu-utility" onClick={() => setIsMobileMenuOpen(false)}>
                  <FileText size={18} /> Blogs
                </a>
                <a href="/contact" className="mobile-menu-utility" onClick={() => setIsMobileMenuOpen(false)}>
                  <Mail size={18} /> Contact
                </a>
                <button 
                  className="mobile-menu-utility" 
                  onClick={() => { navigate("/feedback"); setIsMobileMenuOpen(false); }}
                >
                  <MessageSquare size={18} /> Feedback
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="navbar-swanson__mobile-search" ref={searchRef}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchProducts(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (searchQuery.trim() && searchSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
          <button 
            className="navbar-swanson__mobile-search-btn"
            onClick={() => {
              if (searchQuery.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                setShowSuggestions(false);
              }
            }}
          >
            <Search size={20} />
          </button>

          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="navbar-swanson__suggestions">
              {searchSuggestions.map((product) => (
                <div
                  key={product._id}
                  onClick={() => {
                    navigate(`/products-details/${product._id}`);
                    setShowSuggestions(false);
                    setSearchQuery("");
                  }}
                  className="navbar-swanson__suggestion-item"
                >
                  <div>
                    <div className="suggestion-name">{product.name}</div>
                    <div className="suggestion-price">${product.buyPrice?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
      {isCartOpen && <CartModel setIsCartOpen={setIsCartOpen} />}
    </>
  );
};

export default memo(Navbar);
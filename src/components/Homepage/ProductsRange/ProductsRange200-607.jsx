import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { stagger, useAnimate, useInView } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductsRange.scss";

const useProductsAPI = (BASE_URL) => {
  const cancelTokenRef = useRef();
  
  const fetchWithCancel = useCallback(async (url, config) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Request cancelled due to new request');
    }
    
    cancelTokenRef.current = axios.CancelToken.source();
    
    try {
      const response = await axios.get(url, {
        ...config,
        cancelToken: cancelTokenRef.current.token
      });
      return response;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled:', error.message);
        return null;
      }
      throw error;
    }
  }, []);
  
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, []);
  
  return { fetchWithCancel };
};

export const ProductsRange200607 = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { fetchWithCancel } = useProductsAPI(BASE_URL);

  const getToken = useCallback(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("Please log in to view products");
      return null;
    }
    return token;
  }, [navigate]);

  const fetchProductsRange = useCallback(
    async () => {
      const token = getToken();
      if (!token) return;
      
      try {
        setError("");
        setLoading(true);
        
        // Fetch products with Product ID range 200-609
        const response = await fetchWithCancel(
          `${BASE_URL}/api/wholesaler/get-products-range?startId=200&endId=609`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response) return;

        const data = Array.isArray(response.data.products) ? response.data.products : [];
        setProducts(data);

        if (data.length === 0) {
          setError("No products found in Product ID range 200-609.");
        }
      } catch (err) {
        console.error("Error fetching products:", err.response?.data, "Status:", err.response?.status);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("userToken");
          setError("Please log in to view products");
        } else {
          setError(err.response?.data?.message || "Failed to load products. Please try again.");
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL, getToken, fetchWithCancel]
  );

  useEffect(() => {
    fetchProductsRange();
  }, [fetchProductsRange]);

  useEffect(() => {
    if (isInView && Array.isArray(products) && products.length > 0 && !loading) {
      animate(
        ".productCard",
        {
          opacity: [0, 1],
          y: ["2vh", "0vh"],
        },
        {
          duration: 0.6,
          ease: "backInOut",
          type: "spring",
          mass: 2.5,
          power: 8,
          delay: stagger(0.1),
        }
      );
    }
  }, [isInView, products, animate, loading]);

  const getImageUrl = useCallback(
    (imagePath) => {
      if (!imagePath) return "https://via.placeholder.com/150";
      return imagePath.startsWith("http") ? imagePath : `${BASE_URL}/${imagePath.replace(/\\/g, "/")}`;
    },
    [BASE_URL]
  );

  const productList = useMemo(() => {
    return products.map((product) => (
      <div
        key={product._id}
        className="productCard"
        onClick={() => navigate(`/products-details/${product._id}`)}
        style={{
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
          height: "auto",
          minHeight: "320px",
          position: "relative",
          transformOrigin: "center",
          display: "flex",
          flexDirection: "column",
        }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate(`/products-details/${product._id}`);
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05) translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0px)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
        }}
      >
        {/* Product ID Badge */}
        <div 
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background: "#77a13d",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            zIndex: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          ID: {product.item_number}
        </div>

        {/* Product Image */}
        <div 
          style={{
            width: "100%",
            height: "160px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafafa",
            position: "relative"
          }}
        >
          <img 
            src={getImageUrl(product.images?.[0])} 
            alt={product.originalProductName || product.name || "Product image"} 
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "8px",
              transition: "transform 0.3s ease",
              position: "relative",
              zIndex: 2
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          />
          
          {/* Stock Status Badge */}
          <div 
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: product.stock > 0 ? 
                "linear-gradient(135deg, #10b981, #059669)" : 
                "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "white",
              padding: "3px 6px",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              zIndex: 3
            }}
          >
            {product.stock > 0 ? "In Stock" : "Out"}
          </div>
        </div>
        
        {/* Product Info */}
        <div 
          style={{
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            position: "relative",
            zIndex: 2
          }}
        >
          <div>
            {product.category && (
              <p style={{ 
                color: "#77a13d", 
                fontSize: "11px", 
                margin: "0 0 4px 0",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.3px"
              }}>
                {product.category.name || ""}
              </p>
            )}
            <h4 style={{ 
              color: "#1f2937", 
              fontSize: "13px", 
              fontWeight: "700", 
              margin: "0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineHeight: "1.3"
            }}>
              {product.originalProductName || product.name}
            </h4>
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginTop: "8px"
          }}>
            <div>
              <h3 style={{ 
                fontSize: "16px", 
                fontWeight: "800", 
                margin: 0,
                background: "linear-gradient(135deg, #e97717, #77a13d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                ${(product.sellPrice || 0).toFixed(2)}
              </h3>
            </div>
            
            {product.purchaseCount > 0 && (
              <div style={{
                background: "rgba(119, 161, 61, 0.1)",
                color: "#77a13d",
                padding: "2px 6px",
                borderRadius: "6px",
                fontSize: "10px",
                fontWeight: "600"
              }}>
                {product.purchaseCount} sold
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  }, [products, getImageUrl, navigate]);

  return (
    <div 
      style={{
        position: "relative",
        fontFamily: "'Inter', sans-serif",
        background: "transparent",
        padding: "40px 24px"
      }}
    >
      <div 
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div 
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            paddingBottom: "16px",
            borderBottom: "2px solid #e5e7eb",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div>
            <h2 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              color: "#1f2937",
              margin: 0,
              letterSpacing: "-0.5px"
            }}>
              Products (ID: 200-609)
            </h2>
            <p style={{
              color: "#6b7280",
              fontSize: "14px",
              margin: "8px 0 0 0"
            }}>
              Ordered by Product ID | Complete Wholesale Catalog
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            style={{
              background: "linear-gradient(135deg, #e97717 0%, #e97717 100%)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "700",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0px)";
              e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            View All Products
          </button>
        </div>

        {loading && (
          <div 
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "60px 20px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "12px",
              border: "1px solid #e5e7eb"
            }}
            role="status"
            aria-live="polite"
          >
            <div style={{
              width: "40px",
              height: "40px",
              border: "4px solid rgba(119,161,61,0.2)",
              borderTop: "4px solid #77a13d",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>
              Loading products...
            </span>
          </div>
        )}

        {!loading && error && (
          <div 
            style={{
              background: "#fef2f2",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid #fee2e2"
            }}
            role="alert"
          >
            <p style={{ color: "#dc2626", fontSize: "16px", margin: 0, fontWeight: "600" }}>{error}</p>
          </div>
        )}

        {!loading && Array.isArray(products) && products.length === 0 && !error && (
          <div 
            style={{
              background: "#f9fafb",
              borderRadius: "8px",
              padding: "40px",
              textAlign: "center",
              border: "1px solid #e5e7eb"
            }}
            role="status"
          >
            <p style={{ color: "#374151", fontSize: "16px", margin: 0, fontWeight: "600" }}>
              No products available in Product ID range 200-609
            </p>
          </div>
        )}

        {!loading && Array.isArray(products) && products.length > 0 && (
          <div
            ref={scope}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "20px",
              width: "100%"
            }}
          >
            {productList}
          </div>
        )}

        {!loading && Array.isArray(products) && products.length > 0 && (
          <div style={{
            marginTop: "32px",
            padding: "16px",
            background: "rgba(119, 161, 61, 0.05)",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid rgba(119, 161, 61, 0.2)"
          }}>
            <p style={{
              color: "#374151",
              fontSize: "14px",
              margin: 0
            }}>
              ✅ Showing <strong>{products.length}</strong> products | Product IDs from <strong>200 to 609</strong>
            </p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .productCard {
              height: auto !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProductsRange200607;

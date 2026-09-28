import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import './RecentlyViewed.scss';

/**
 * RecentlyViewed Component - Shows recently viewed products
 * 
 * Features:
 * - Stores in localStorage
 * - Horizontal scrollable carousel
 * - Max 10 recent products
 * - Auto-updates when viewing products
 * - Responsive design
 */

const STORAGE_KEY = 'ray_recently_viewed';
const MAX_ITEMS = 10;

export const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecentProducts();
    
    // Listen for storage changes (from other tabs or components)
    const handleStorageChange = () => {
      loadRecentProducts();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadRecentProducts = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored);
        setRecentProducts(products);
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
    }
  };

  const handleScroll = (direction) => {
    const container = document.querySelector('.recently-viewed-scroll');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (recentProducts.length === 0) {
    return null; // Don't show if no recent products
  }

  return (
    <section className="recently-viewed-section">
      <div className="recently-viewed-header">
        <div className="header-left">
          <Eye size={24} />
          <h3>Recently Viewed</h3>
        </div>
        <div className="header-controls">
          <button 
            className="scroll-btn"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            disabled={scrollPosition === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="scroll-btn"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="recently-viewed-scroll">
        <div className="recently-viewed-grid">
          {recentProducts.map((product) => (
            <div 
              key={product._id} 
              className="recent-product-card"
              onClick={() => handleProductClick(product._id)}
            >
              <div className="product-image">
                <img 
                  src={product.image || product.images?.[0] || '/placeholder.png'} 
                  alt={product.name}
                  loading="lazy"
                />
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                {product.manufacturer && (
                  <p className="product-brand">{product.manufacturer}</p>
                )}
                <div className="product-price">
                  ${(product.wholesalePrice || 0).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Hook to track recently viewed products
 * Call this when a product is viewed
 */
export const useRecentlyViewed = () => {
  const addToRecentlyViewed = (product) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let recent = stored ? JSON.parse(stored) : [];
      
      // Remove if already exists
      recent = recent.filter(p => p._id !== product._id);
      
      // Add to beginning
      recent.unshift({
        _id: product._id,
        name: product.name,
        image: product.image || product.images?.[0],
        images: product.images,
        manufacturer: product.manufacturer,
        wholesalePrice: product.wholesalePrice,
        viewedAt: new Date().toISOString(),
      });
      
      // Keep only MAX_ITEMS
      recent = recent.slice(0, MAX_ITEMS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
      
      // Dispatch custom event to update other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  };

  const clearRecentlyViewed = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  return { addToRecentlyViewed, clearRecentlyViewed };
};

export default RecentlyViewed;

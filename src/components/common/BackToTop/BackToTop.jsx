import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import './BackToTop.scss';

/**
 * BackToTop Component - Scrolls to top of page
 * Appears after scrolling down 300px
 * Smooth scroll animation
 */
export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default BackToTop;

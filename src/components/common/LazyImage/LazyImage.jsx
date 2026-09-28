import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.scss';

/**
 * LazyImage Component - Optimized image loading with blur-up effect
 * 
 * Features:
 * - Intersection Observer for lazy loading
 * - Blur-up effect while loading
 * - Fallback for failed loads
 * - Responsive image support (srcSet)
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - Additional CSS classes
 * @param {string} srcSet - Responsive image sources
 * @param {string} sizes - Image sizes for different viewports
 * @param {string} placeholderSrc - Low-quality placeholder image
 * @param {string} fallbackSrc - Fallback image if load fails
 */
export const LazyImage = ({
  src,
  alt = '',
  className = '',
  srcSet = '',
  sizes = '',
  placeholderSrc = '',
  fallbackSrc = '',
  style = {},
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load the full image when it enters viewport
            const img = new Image();
            img.src = src;
            
            if (srcSet) {
              img.srcset = srcSet;
            }

            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
            };

            img.onerror = () => {
              setIsError(true);
              if (fallbackSrc) {
                setImageSrc(fallbackSrc);
                setIsLoaded(true);
              }
            };

            // Stop observing after loading
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [src, srcSet, fallbackSrc]);

  return (
    <div className={`lazy-image-wrapper ${className}`} style={style}>
      <img
        ref={imgRef}
        src={imageSrc}
        srcSet={isLoaded && srcSet ? srcSet : ''}
        sizes={isLoaded && sizes ? sizes : ''}
        alt={alt}
        className={`lazy-image ${isLoaded ? 'loaded' : 'loading'} ${isError ? 'error' : ''}`}
        loading="lazy"
        {...props}
      />
      {!isLoaded && (
        <div className="lazy-image-skeleton" aria-hidden="true">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;

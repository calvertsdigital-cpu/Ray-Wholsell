import React from 'react';

const InlineLoader = ({ 
  show = true, 
  text = "Loading...", 
  size = "medium",
  color = "#28a745"
}) => {
  if (!show) return null;

  const sizeMap = {
    small: { width: '30px', height: '30px', border: '3px' },
    medium: { width: '40px', height: '40px', border: '4px' },
    large: { width: '60px', height: '60px', border: '5px' }
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      minHeight: '200px'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        {/* Outer spinning ring */}
        <div style={{
          width: currentSize.width,
          height: currentSize.height,
          border: `${currentSize.border} solid rgba(40, 167, 69, 0.2)`,
          borderTop: `${currentSize.border} solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 2s linear infinite',
          position: 'absolute'
        }} />
        
        {/* Inner spinning ring */}
        <div style={{
          width: `calc(${currentSize.width} - 10px)`,
          height: `calc(${currentSize.height} - 10px)`,
          border: `2px solid transparent`,
          borderTop: `2px solid rgba(119, 161, 61, 0.6)`,
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite reverse',
          position: 'absolute'
        }} />
        
        {/* Logo in center */}
        <div style={{
          width: `calc(${currentSize.width} - 20px)`,
          height: `calc(${currentSize.height} - 20px)`,
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(40, 167, 69, 0.2)',
          position: 'relative',
          zIndex: 2
        }}>
          <img 
            src="/WholesaleLogo2.svg" 
            alt="Loading" 
            style={{
              width: '60%',
              height: '60%',
              objectFit: 'contain',
              /* Removed spinning animation - logo stays still and clearly visible */
            }}
          />
        </div>
      </div>
      
      <p style={{
        color: '#666',
        fontSize: size === 'small' ? '0.9rem' : size === 'large' ? '1.2rem' : '1rem',
        fontFamily: 'Open Sans, sans-serif',
        margin: 0,
        animation: 'textPulse 1.5s ease-in-out infinite'
      }}>
        {text}
      </p>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes logoSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        @keyframes textPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InlineLoader;
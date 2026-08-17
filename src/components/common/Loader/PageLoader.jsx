import React from 'react';
import Loader from './Loader';

const PageLoader = ({ 
  show = true, 
  text = "Loading...", 
  size = "medium",
  overlay = true 
}) => {
  if (!show) return null;

  return (
    <div className={`page-loader ${size} ${overlay ? 'with-overlay' : ''}`}>
      <div className="page-loader-content">
        <div className="loader-spinner">
          <div className="spinner-ring-with-logo">
            <div className="spinner-rings">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="logo-center-small">
              <img 
                src="/WholesaleLogo2.svg" 
                alt="Ray's Wholesale" 
                className="logo-small"
              />
            </div>
          </div>
        </div>
        <p className="loader-text">{text}</p>
      </div>
      
      <style jsx>{`
        .page-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          position: relative;
        }
        
        .page-loader.with-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          z-index: 9999;
        }
        
        .page-loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .loader-spinner {
          margin-bottom: 1rem;
        }
        
        .spinner-ring-with-logo {
          display: inline-block;
          position: relative;
          width: ${size === 'small' ? '40px' : size === 'large' ? '80px' : '64px'};
          height: ${size === 'small' ? '40px' : size === 'large' ? '80px' : '64px'};
        }
        
        .spinner-rings {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .spinner-rings div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: ${size === 'small' ? '32px' : size === 'large' ? '64px' : '51px'};
          height: ${size === 'small' ? '32px' : size === 'large' ? '64px' : '51px'};
          margin: ${size === 'small' ? '4px' : size === 'large' ? '8px' : '6px'};
          border: ${size === 'small' ? '3px' : size === 'large' ? '6px' : '4px'} solid #28a745;
          border-radius: 50%;
          animation: spinner-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: #28a745 transparent transparent transparent;
        }
        
        .logo-center-small {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          width: ${size === 'small' ? '24px' : size === 'large' ? '50px' : '38px'};
          height: ${size === 'small' ? '24px' : size === 'large' ? '50px' : '38px'};
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
        }
        
        .logo-small {
          width: 70%;
          height: 70%;
          object-fit: contain;
          /* Removed spinning animation - logo stays still and clearly visible */
        }
        
        .spinner-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }
        
        .spinner-ring div:nth-child(2) {
          animation-delay: -0.3s;
        }
        
        .spinner-ring div:nth-child(3) {
          animation-delay: -0.15s;
        }
        
        .loader-text {
          color: #666;
          font-family: 'Open Sans', sans-serif;
          font-size: ${size === 'small' ? '0.9rem' : size === 'large' ? '1.2rem' : '1rem'};
          font-weight: 400;
          margin: 0;
          animation: text-pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes logo-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
        
        @keyframes spinner-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes text-pulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
import React from 'react';
import './Loader.scss';

const Loader = ({ show = true, fullScreen = true }) => {
  if (!show) return null;

  return (
    <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loader-content">
        <div className="logo-animation">
          <div className="logo-spinner-wrapper">
            {/* Spinning Circle with Logo */}
            <div className="spinner-circle-with-logo">
              <div className="spinner-border"></div>
              <div className="logo-center">
                <img 
                  src="/WholesaleLogo2.svg" 
                  alt="Ray's Wholesale" 
                  className="logo-image"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="brand-text">
          <h1 className="brand-name">Ray's Wholesale</h1>
          <p className="brand-tagline">Natural Wellness Solutions</p>
        </div>
        
        <div className="loading-text">Loading your products...</div>
      </div>
      
      <div className="loader-background">
        <div className="gradient-overlay"></div>
      </div>
    </div>
  );
};

export default Loader;
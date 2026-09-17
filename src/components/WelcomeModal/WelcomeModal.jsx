import React, { useState, useEffect } from 'react';
import './WelcomeModal.scss';

const STORAGE_KEY = 'rhl_wholesale_notice_accepted';

export const WelcomeModal = () => {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Show every new browser session (sessionStorage clears on tab close)
    const alreadySeen = sessionStorage.getItem(STORAGE_KEY);
    if (!alreadySeen) setVisible(true);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="wm-overlay" role="dialog" aria-modal="true" aria-labelledby="wm-title">
      <div className="wm-modal">

        {/* Header */}
        <div className="wm-header">
          <div className="wm-header-icon">🌿</div>
          <div className="wm-header-text">
            <h2 id="wm-title">Medical Responsibility<br />&amp; Health Awareness Notice</h2>
          </div>
          <button
            className="wm-close"
            onClick={handleClose}
            aria-label="Close notice"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="wm-body">
          <p className="wm-intro">
            At <strong>Ray's Healthy Living</strong>, we respect the medical profession.
          </p>
          <p className="wm-sub">
            Medical doctors are trained to diagnose, interpret lab results, understand
            pathology, and manage disease safely and effectively.
          </p>

          <div className="wm-badges">
            <span>We do not diagnose.</span>
            <span>We do not treat.</span>
            <span>We do not cure disease.</span>
          </div>

          <p className="wm-edu">
            All information and products provided are for <strong>educational</strong> and{' '}
            <strong>wellness support purposes only.</strong>
          </p>

          <p className="wm-consult">
            If you are experiencing pain, discomfort, persistent symptoms, or uncertainty
            about your health,{' '}
            <strong>consult a licensed healthcare provider</strong> before using any
            supplement.
          </p>

          <p className="wm-authority">
            <strong>Your doctor is your primary health authority.</strong>
          </p>

          <label className="wm-checkbox-label">
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
            />
            <span className="wm-checkmark"></span>
            I have read and understand this notice.
          </label>
        </div>

        {/* Footer */}
        <div className="wm-footer">
          <button
            className={`wm-continue ${checked ? 'active' : ''}`}
            onClick={handleClose}
            disabled={!checked}
          >
            Continue to Products
          </button>
          <button className="wm-exit" onClick={handleClose}>
            Exit / Return to Store
          </button>
        </div>

      </div>
    </div>
  );
};

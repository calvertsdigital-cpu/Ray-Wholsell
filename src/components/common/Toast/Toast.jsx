import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.scss';

/**
 * Toast Component - Mobile-optimized notification system
 * 
 * Types: success, error, warning, info
 * Auto-dismiss after duration (default 3000ms)
 * Swipe to dismiss on mobile
 * Stacks multiple toasts
 * 
 * Usage:
 * import { useToast } from './useToast';
 * const { showToast } = useToast();
 * showToast({ type: 'success', message: 'Item added to cart!' });
 */

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export const Toast = ({ 
  id,
  type = 'info', 
  message, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchOffset, setTouchOffset] = useState(0);
  const Icon = toastIcons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose(id);
    }, 300); // Match animation duration
  };

  // Touch handlers for swipe to dismiss
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStart === null) return;
    const currentTouch = e.touches[0].clientX;
    const diff = currentTouch - touchStart;
    setTouchOffset(diff);
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchOffset) > 100) {
      // Swipe threshold met, dismiss toast
      handleClose();
    }
    setTouchStart(null);
    setTouchOffset(0);
  };

  return (
    <div
      className={`toast toast-${type} ${!isVisible ? 'toast-exit' : ''}`}
      style={{ transform: `translateX(${touchOffset}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon">
        <Icon size={20} />
      </div>
      <div className="toast-message">{message}</div>
      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

/**
 * ToastContainer - Container for all toasts
 * Place at root level of app
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default Toast;

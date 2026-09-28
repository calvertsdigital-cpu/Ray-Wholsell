import { useState, useCallback } from 'react';

/**
 * useToast Hook - Manage toast notifications
 * 
 * Usage:
 * const { toasts, showToast, removeToast } = useToast();
 * 
 * showToast({
 *   type: 'success', // 'success' | 'error' | 'warning' | 'info'
 *   message: 'Item added to cart!',
 *   duration: 3000 // optional, defaults to 3000ms
 * });
 */

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'info', message, duration = 3000 }) => {
    const id = toastId++;
    const newToast = { id, type, message, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
  };
};

export default useToast;

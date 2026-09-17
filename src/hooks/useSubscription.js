import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const useSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create subscription
  const createSubscription = useCallback(async (subscriptionData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post(
        '/api/subscriptions/create',
        subscriptionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      return response.data.subscription;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user subscriptions
  const getSubscriptions = useCallback(async (status = 'active') => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/api/subscriptions/my-subscriptions?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      setSubscriptions(response.data.subscriptions);
      return response.data.subscriptions;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch subscriptions';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single subscription
  const getSubscription = useCallback(async (subscriptionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/api/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      return response.data.subscription;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update subscription items
  const updateItems = useCallback(async (subscriptionId, items, discountPercentage) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.put(
        `/api/subscriptions/${subscriptionId}/items`,
        { items, discountPercentage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      return response.data.subscription;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update items';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update frequency
  const updateFrequency = useCallback(async (subscriptionId, frequency) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.put(
        `/api/subscriptions/${subscriptionId}/frequency`,
        { frequency },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      return response.data.subscription;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update frequency';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update delivery address
  const updateAddress = useCallback(async (subscriptionId, deliveryAddress) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.put(
        `/api/subscriptions/${subscriptionId}/address`,
        { deliveryAddress },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      return response.data.subscription;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update address';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Pause subscription
  const pauseSubscription = useCallback(async (subscriptionId, reason) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post(
        `/api/subscriptions/${subscriptionId}/pause`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      return response.data.subscription;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to pause subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Resume subscription
  const resumeSubscription = useCallback(async (subscriptionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post(
        `/api/subscriptions/${subscriptionId}/resume`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      return response.data.subscription;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resume subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Skip delivery
  const skipDelivery = useCallback(async (subscriptionId, reason) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post(
        `/api/subscriptions/${subscriptionId}/skip`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      return response.data.subscription;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to skip delivery';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async (subscriptionId, reason) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post(
        `/api/subscriptions/${subscriptionId}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      return response.data.subscription;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    subscriptions,
    loading,
    error,
    createSubscription,
    getSubscriptions,
    getSubscription,
    updateItems,
    updateFrequency,
    updateAddress,
    pauseSubscription,
    resumeSubscription,
    skipDelivery,
    cancelSubscription,
  };
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscriptionManagement.scss';
import { useSubscription } from '../hooks/useSubscription';
import { ChevronDown, X, Pause, Play, Skip, Trash2, Edit2 } from 'lucide-react';

export const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const {
    subscriptions,
    loading,
    error,
    getSubscriptions,
    getSubscription,
    pauseSubscription,
    resumeSubscription,
    skipDelivery,
    cancelSubscription,
    updateItems,
  } = useSubscription();

  const [activeTab, setActiveTab] = useState('active');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadSubscriptions();
  }, [activeTab]);

  const loadSubscriptions = async () => {
    try {
      await getSubscriptions(activeTab);
    } catch (err) {
      showToast('Failed to load subscriptions', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handlePause = async (subscriptionId) => {
    try {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: true }));
      await pauseSubscription(subscriptionId, 'Paused by user');
      showToast('Subscription paused successfully');
      loadSubscriptions();
    } catch (err) {
      showToast('Failed to pause subscription', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const handleResume = async (subscriptionId) => {
    try {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: true }));
      await resumeSubscription(subscriptionId);
      showToast('Subscription resumed successfully');
      loadSubscriptions();
    } catch (err) {
      showToast('Failed to resume subscription', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const handleSkip = async (subscriptionId) => {
    try {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: true }));
      await skipDelivery(subscriptionId, 'Skipped by user');
      showToast('Next delivery skipped');
      loadSubscriptions();
    } catch (err) {
      showToast('Failed to skip delivery', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const handleCancel = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        setActionLoading(prev => ({ ...prev, [subscriptionId]: true }));
        await cancelSubscription(subscriptionId, 'Cancelled by user');
        showToast('Subscription cancelled');
        loadSubscriptions();
      } catch (err) {
        showToast('Failed to cancel subscription', 'error');
      } finally {
        setActionLoading(prev => ({ ...prev, [subscriptionId]: false }));
      }
    }
  };

  const handleEdit = (subscriptionId) => {
    navigate(`/subscription/${subscriptionId}/edit`);
  };

  const frequencyLabels = {
    '7days': 'Weekly',
    '14days': 'Bi-weekly',
    '30days': 'Every 30 Days',
    '60days': 'Every 60 Days',
    '90days': 'Every 90 Days',
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'paused':
        return 'status-paused';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="subscription-management">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="subscription-header">
        <h1>My Subscriptions</h1>
        <p className="subtitle">Manage your recurring orders and subscriptions</p>
      </div>

      {/* Tab Navigation */}
      <div className="subscription-tabs">
        <button
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active
          <span className="tab-count">
            {subscriptions.filter(s => s.status === 'active').length}
          </span>
        </button>
        <button
          className={`tab ${activeTab === 'paused' ? 'active' : ''}`}
          onClick={() => setActiveTab('paused')}
        >
          Paused
          <span className="tab-count">
            {subscriptions.filter(s => s.status === 'paused').length}
          </span>
        </button>
        <button
          className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
          <span className="tab-count">
            {subscriptions.filter(s => s.status === 'cancelled').length}
          </span>
        </button>
      </div>

      {/* Subscriptions List */}
      <div className="subscriptions-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading subscriptions...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="empty-state">
            <p>No {activeTab} subscriptions yet</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/products')}
            >
              Shop Products
            </button>
          </div>
        ) : (
          subscriptions.map((subscription) => (
            <div key={subscription._id} className="subscription-card">
              {/* Card Header */}
              <div className="subscription-card-header">
                <div className="card-info">
                  <div className="subscription-id">
                    #{subscription.subscriptionNumber}
                  </div>
                  <div className="card-details">
                    <span className={`status-badge ${getStatusColor(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                    <span className="frequency-badge">
                      {frequencyLabels[subscription.frequency]}
                    </span>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-icon"
                    onClick={() => setExpandedId(expandedId === subscription._id ? null : subscription._id)}
                  >
                    <ChevronDown 
                      size={20} 
                      style={{
                        transform: expandedId === subscription._id ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Items Summary */}
              <div className="items-summary">
                <p className="item-count">
                  {subscription.items.length} item{subscription.items.length !== 1 ? 's' : ''}
                </p>
                <p className="item-names">
                  {subscription.items.map(item => item.name).join(', ')}
                </p>
                <div className="pricing-info">
                  <span className="original-price">
                    ${subscription.subtotal.toFixed(2)}
                  </span>
                  {subscription.discountPercentage > 0 && (
                    <>
                      <span className="discount-tag">
                        {subscription.discountPercentage}% off
                      </span>
                      <span className="final-price">
                        ${subscription.total.toFixed(2)}/
                        {subscription.frequency.replace('days', 'd')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Next Delivery */}
              <div className="next-delivery">
                <p className="label">Next Delivery:</p>
                <p className="date">
                  {formatDate(subscription.nextBillingDate)}
                </p>
              </div>

              {/* Expanded Details */}
              {expandedId === subscription._id && (
                <div className="expanded-details">
                  {/* Items List */}
                  <div className="details-section">
                    <h4>Order Items</h4>
                    <div className="items-list">
                      {subscription.items.map((item, idx) => (
                        <div key={idx} className="item-detail">
                          <div className="item-name">{item.name}</div>
                          <div className="item-specs">
                            <span>Qty: {item.quantity}</span>
                            <span>${item.price.toFixed(2)} each</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="details-section">
                    <h4>Delivery Address</h4>
                    <div className="address-info">
                      <p>{subscription.deliveryAddress.name}</p>
                      <p>{subscription.deliveryAddress.fullAddress}</p>
                      <p>
                        {subscription.deliveryAddress.city}, {subscription.deliveryAddress.state} {subscription.deliveryAddress.zipCode}
                      </p>
                    </div>
                  </div>

                  {/* Subscription Details */}
                  <div className="details-section">
                    <h4>Subscription Details</h4>
                    <div className="details-grid">
                      <div>
                        <span className="label">Frequency</span>
                        <span className="value">
                          {frequencyLabels[subscription.frequency]}
                        </span>
                      </div>
                      <div>
                        <span className="label">Discount</span>
                        <span className="value">
                          {subscription.discountPercentage}% off
                        </span>
                      </div>
                      <div>
                        <span className="label">Subtotal</span>
                        <span className="value">
                          ${subscription.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="label">Shipping</span>
                        <span className="value">
                          ${subscription.shippingCost.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="label">Total</span>
                        <span className="value">
                          ${subscription.total.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="label">Started</span>
                        <span className="value">
                          {formatDate(subscription.startDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skip History */}
                  {subscription.skippedDeliveries.length > 0 && (
                    <div className="details-section">
                      <h4>Skipped Deliveries</h4>
                      <div className="skipped-list">
                        {subscription.skippedDeliveries.map((skip, idx) => (
                          <div key={idx} className="skip-item">
                            <span>{formatDate(skip.date)}</span>
                            {skip.reason && <span className="reason">{skip.reason}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    {subscription.status === 'active' && (
                      <>
                        <button
                          className="btn-action btn-secondary"
                          onClick={() => handleSkip(subscription._id)}
                          disabled={actionLoading[subscription._id] || !subscription.canSkipNext}
                          title={!subscription.canSkipNext ? 'Already skipped this cycle' : 'Skip next delivery'}
                        >
                          <Skip size={16} />
                          Skip Next
                        </button>
                        <button
                          className="btn-action btn-secondary"
                          onClick={() => handlePause(subscription._id)}
                          disabled={actionLoading[subscription._id]}
                        >
                          <Pause size={16} />
                          Pause
                        </button>
                        <button
                          className="btn-action btn-primary"
                          onClick={() => handleEdit(subscription._id)}
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                      </>
                    )}

                    {subscription.status === 'paused' && (
                      <button
                        className="btn-action btn-success"
                        onClick={() => handleResume(subscription._id)}
                        disabled={actionLoading[subscription._id]}
                      >
                        <Play size={16} />
                        Resume
                      </button>
                    )}

                    {(subscription.status === 'active' || subscription.status === 'paused') && (
                      <button
                        className="btn-action btn-danger"
                        onClick={() => handleCancel(subscription._id)}
                        disabled={actionLoading[subscription._id]}
                      >
                        <Trash2 size={16} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagement;

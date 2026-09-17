import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SubscriptionEdit.scss';
import { useSubscription } from '../hooks/useSubscription';
import { ArrowLeft, Save, X } from 'lucide-react';

export const SubscriptionEdit = () => {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();
  const { getSubscription, updateItems, updateFrequency, updateAddress } = useSubscription();

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('items');

  // Form states
  const [items, setItems] = useState([]);
  const [frequency, setFrequency] = useState('30days');
  const [address, setAddress] = useState({});

  const frequencyLabels = {
    '7days': 'Weekly (40% off)',
    '14days': 'Bi-weekly (35% off)',
    '30days': '30 Days (30% off)',
    '60days': '60 Days (25% off)',
    '90days': '90 Days (20% off)',
  };

  const discountMap = {
    '7days': 40,
    '14days': 35,
    '30days': 30,
    '60days': 25,
    '90days': 20,
  };

  useEffect(() => {
    loadSubscription();
  }, [subscriptionId]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await getSubscription(subscriptionId);
      setSubscription(data);
      setItems(data.items);
      setFrequency(data.frequency);
      setAddress(data.deliveryAddress);
    } catch (err) {
      showToast('Failed to load subscription', 'error');
      setTimeout(() => navigate('/subscriptions'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleItemQuantityChange = (index, newQuantity) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = parseInt(newQuantity) || 0;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleFrequencyChange = (newFrequency) => {
    setFrequency(newFrequency);
  };

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveItems = async () => {
    try {
      if (items.length === 0) {
        showToast('Please add at least one item', 'error');
        return;
      }

      setSaving(true);
      const discount = discountMap[frequency] || 30;
      await updateItems(subscriptionId, items, discount);
      setSubscription(prev => ({
        ...prev,
        items,
      }));
      showToast('Items updated successfully');
      setActiveTab('frequency');
    } catch (err) {
      showToast('Failed to update items', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFrequency = async () => {
    try {
      setSaving(true);
      const discount = discountMap[frequency] || 30;
      await updateFrequency(subscriptionId, frequency);
      setSubscription(prev => ({
        ...prev,
        frequency,
        discountPercentage: discount,
      }));
      showToast('Frequency updated successfully');
      setActiveTab('address');
    } catch (err) {
      showToast('Failed to update frequency', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      // Validate address
      if (!address.name || !address.fullAddress || !address.city || !address.state || !address.zipCode) {
        showToast('Please fill in all address fields', 'error');
        return;
      }

      setSaving(true);
      await updateAddress(subscriptionId, address);
      setSubscription(prev => ({
        ...prev,
        deliveryAddress: address,
      }));
      showToast('Address updated successfully');
      setTimeout(() => navigate(`/subscriptions`), 1500);
    } catch (err) {
      showToast('Failed to update address', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="subscription-edit">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="subscription-edit">
        <div className="error-state">
          <p>Subscription not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-edit">
      {/* Toast */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="edit-header">
        <button className="btn-back" onClick={() => navigate('/subscriptions')}>
          <ArrowLeft size={20} />
          Back to Subscriptions
        </button>
        <h1>Edit Subscription #{subscription.subscriptionNumber}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="edit-tabs">
        <button
          className={`tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button
          className={`tab ${activeTab === 'frequency' ? 'active' : ''}`}
          onClick={() => setActiveTab('frequency')}
        >
          Frequency
        </button>
        <button
          className={`tab ${activeTab === 'address' ? 'active' : ''}`}
          onClick={() => setActiveTab('address')}
        >
          Address
        </button>
      </div>

      <div className="edit-content">
        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="edit-section">
            <h2>Manage Items</h2>
            <p className="section-help">Edit quantities or remove items from your subscription</p>

            <div className="items-edit-list">
              {items.map((item, index) => (
                <div key={index} className="item-edit-row">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-variant">{item.variant}</p>
                    <p className="item-price">${item.price.toFixed(2)} each</p>
                  </div>

                  <div className="quantity-control">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemQuantityChange(index, e.target.value)}
                    />
                    <p className="item-total">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveItem(index)}
                    title="Remove item"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pricing-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span className="amount">
                  ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
              <div className="summary-row">
                <span>Discount ({discountMap[frequency]}%):</span>
                <span className="amount discount">
                  -${(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * discountMap[frequency] / 100).toFixed(2)}
                </span>
              </div>
              <div className="summary-row total">
                <span>New Total:</span>
                <span className="amount">
                  ${(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * (100 - discountMap[frequency]) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={handleSaveItems}
                disabled={saving}
              >
                <Save size={18} />
                Save Items
              </button>
              <button
                className="btn-secondary"
                onClick={() => setItems(subscription.items)}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Frequency Tab */}
        {activeTab === 'frequency' && (
          <div className="edit-section">
            <h2>Change Delivery Frequency</h2>
            <p className="section-help">Adjust how often you want to receive deliveries. Discount will adjust automatically.</p>

            <div className="frequency-selector">
              {Object.entries(frequencyLabels).map(([freq, label]) => (
                <button
                  key={freq}
                  className={`frequency-option ${frequency === freq ? 'selected' : ''}`}
                  onClick={() => handleFrequencyChange(freq)}
                >
                  <div className="option-label">{label}</div>
                  <div className="option-desc">
                    {freq === '7days' && 'Every week'}
                    {freq === '14days' && 'Every 2 weeks'}
                    {freq === '30days' && 'Every month'}
                    {freq === '60days' && 'Every 2 months'}
                    {freq === '90days' && 'Every 3 months'}
                  </div>
                </button>
              ))}
            </div>

            <div className="info-box">
              <p>
                <strong>Next billing:</strong> In{' '}
                {frequency === '7days' && '7 days'}
                {frequency === '14days' && '14 days'}
                {frequency === '30days' && '30 days'}
                {frequency === '60days' && '60 days'}
                {frequency === '90days' && '90 days'}
              </p>
              <p>
                <strong>Current discount:</strong> {discountMap[frequency]}% off
              </p>
            </div>

            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={handleSaveFrequency}
                disabled={saving || frequency === subscription.frequency}
              >
                <Save size={18} />
                Save Frequency
              </button>
              <button
                className="btn-secondary"
                onClick={() => setFrequency(subscription.frequency)}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Address Tab */}
        {activeTab === 'address' && (
          <div className="edit-section">
            <h2>Update Delivery Address</h2>
            <p className="section-help">Change where your subscriptions will be delivered</p>

            <form className="address-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={address.name || ''}
                  onChange={(e) => handleAddressChange('name', e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Full Address</label>
                <input
                  type="text"
                  value={address.fullAddress || ''}
                  onChange={(e) => handleAddressChange('fullAddress', e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={address.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={address.state || ''}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>

                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={address.zipCode || ''}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    placeholder="ZIP code"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone (optional)</label>
                <input
                  type="tel"
                  value={address.phone || ''}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>

              <div className="form-group">
                <label>Special Instructions (optional)</label>
                <textarea
                  value={address.instructions || ''}
                  onChange={(e) => handleAddressChange('instructions', e.target.value)}
                  placeholder="e.g., Leave at side door, Ring doorbell"
                  rows="3"
                />
              </div>
            </form>

            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={handleSaveAddress}
                disabled={saving}
              >
                <Save size={18} />
                Save Address
              </button>
              <button
                className="btn-secondary"
                onClick={() => setAddress(subscription.deliveryAddress)}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionEdit;

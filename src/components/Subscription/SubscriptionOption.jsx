import React, { useState } from 'react';
import './SubscriptionOption.scss';

export const SubscriptionOption = ({ 
  product, 
  quantity, 
  onSubscriptionChange,
  basePrice 
}) => {
  const [isSubscription, setIsSubscription] = useState(false);
  const [frequency, setFrequency] = useState('30days');

  // Discount tiers for subscriptions
  const discountTiers = {
    '7days': 40,
    '14days': 35,
    '30days': 30,
    '60days': 25,
    '90days': 20,
  };

  const frequencyLabels = {
    '7days': 'Weekly',
    '14days': 'Bi-weekly',
    '30days': '30 Days (Most Popular)',
    '60days': '60 Days',
    '90days': '90 Days',
  };

  // Always derive from current frequency — no stale state
  const currentDiscount = discountTiers[frequency] ?? 30;
  const price = Number(basePrice) || 0;
  const qty = Number(quantity) || 1;
  const savingsAmount = price * qty * currentDiscount / 100;
  const discountedPrice = price * (100 - currentDiscount) / 100;

  const handleSubscriptionToggle = (e) => {
    const checked = e.target.checked;
    setIsSubscription(checked);
    onSubscriptionChange({
      isSubscription: checked,
      frequency: checked ? frequency : null,
      discountPercentage: checked ? currentDiscount : 0,
      discount: checked ? savingsAmount : 0,
    });
  };

  const handleFrequencyChange = (freq) => {
    setFrequency(freq);
    const newDiscount = discountTiers[freq];
    const newSavings = price * qty * newDiscount / 100;
    onSubscriptionChange({
      isSubscription: true,
      frequency: freq,
      discountPercentage: newDiscount,
      discount: newSavings,
    });
  };

  return (
    <div className="subscription-option">
      <div className="subscription-header">
        <label className="subscription-checkbox">
          <input 
            type="checkbox" 
            checked={isSubscription}
            onChange={handleSubscriptionToggle}
          />
          <span className="checkmark"></span>
          <span className="label-text">
            Subscribe to Save
            {isSubscription && <span className="best-value">Best Value</span>}
          </span>
        </label>
      </div>

      {isSubscription && (
        <div className="subscription-details">

          <div className="frequency-selector">
            <label className="frequency-label">Delivery Frequency:</label>
            <div className="frequency-options">
              {Object.entries(frequencyLabels).map(([freq, label]) => (
                <button
                  key={freq}
                  type="button"
                  className={`frequency-btn ${frequency === freq ? 'active' : ''}`}
                  onClick={() => handleFrequencyChange(freq)}
                >
                  <div className="freq-main">{label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="subscription-benefits">
            <h4>Subscription Benefits:</h4>
            <ul>
              <li>✓ Save on every delivery</li>
              <li>✓ Free shipping on orders $35+</li>
              <li>✓ Edit, pause, skip or cancel any time</li>
              <li>✓ Flexible delivery schedules</li>
            </ul>
          </div>

          <div className="frequency-dropdown">
            <select
              value={frequency}
              onChange={(e) => handleFrequencyChange(e.target.value)}
              className="frequency-select-mobile"
            >
              {Object.entries(frequencyLabels).map(([freq, label]) => (
                <option key={freq} value={freq}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!isSubscription && (
        <div className="one-time-purchase">
          <p className="one-time-label">One-time purchase</p>
          <p className="one-time-price">${price.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

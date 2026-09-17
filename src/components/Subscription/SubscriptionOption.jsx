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
  const [discountTier, setDiscountTier] = useState(0);

  // Discount tiers for subscriptions
  const discountTiers = {
    '7days': 40,   // 40% off
    '14days': 35,  // 35% off
    '30days': 30,  // 30% off (most popular)
    '60days': 25,  // 25% off
    '90days': 20,  // 20% off
  };

  const frequencyLabels = {
    '7days': 'Weekly',
    '14days': 'Bi-weekly',
    '30days': '30 Days (Most Popular)',
    '60days': '60 Days',
    '90days': '90 Days',
  };

  const handleSubscriptionToggle = (e) => {
    const checked = e.target.checked;
    setIsSubscription(checked);
    
    if (checked) {
      setDiscountTier(discountTiers[frequency]);
      onSubscriptionChange({
        isSubscription: true,
        frequency,
        discountPercentage: discountTiers[frequency],
        discount: basePrice * quantity * discountTiers[frequency] / 100,
      });
    } else {
      onSubscriptionChange({
        isSubscription: false,
        frequency: null,
        discountPercentage: 0,
        discount: 0,
      });
    }
  };

  const handleFrequencyChange = (freq) => {
    setFrequency(freq);
    const newDiscount = discountTiers[freq];
    setDiscountTier(newDiscount);
    
    onSubscriptionChange({
      isSubscription: true,
      frequency: freq,
      discountPercentage: newDiscount,
      discount: basePrice * quantity * newDiscount / 100,
    });
  };

  const savingsAmount = basePrice * quantity * discountTier / 100;

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
          <div className="savings-banner">
            <p className="savings-text">
              💰 Save ${savingsAmount.toFixed(2)} ({discountTier}% off)
            </p>
            <p className="per-serving">
              ${(basePrice * (100 - discountTier) / 100).toFixed(2)}/serving
            </p>
          </div>

          <div className="frequency-selector">
            <label className="frequency-label">Delivery Frequency:</label>
            <div className="frequency-options">
              {Object.entries(frequencyLabels).map(([freq, label]) => (
                <button
                  key={freq}
                  className={`frequency-btn ${frequency === freq ? 'active' : ''}`}
                  onClick={() => handleFrequencyChange(freq)}
                >
                  <div className="freq-main">{label}</div>
                  <div className="freq-discount">{discountTiers[freq]}% off</div>
                </button>
              ))}
            </div>
          </div>

          <div className="subscription-benefits">
            <h4>Subscription Benefits:</h4>
            <ul>
              <li>✓ {discountTier}% off today + additional discounts on future deliveries</li>
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
                <option key={freq} value={freq}>
                  {label} - Save {discountTiers[freq]}%
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!isSubscription && (
        <div className="one-time-purchase">
          <p className="one-time-label">One-time purchase</p>
          <p className="one-time-price">${basePrice.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

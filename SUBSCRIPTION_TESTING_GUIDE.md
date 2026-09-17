# Subscription Feature - End-to-End Testing Guide

## Overview
This guide covers testing the complete subscription/recurring order feature for Ray-Wholsell wholesale platform.

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- MongoDB connected and running
- Stripe test account configured
- User account created and logged in

---

## 1. Integration Setup

### 1.1 Backend Integration

Add to your main `app.js` or `server.js`:

```javascript
// Import subscription routes and job setup
const subscriptionRoute = require('./Routes/subscriptionRoute');
const subscriptionAdminRoute = require('./Routes/subscriptionAdminRoute');
const SubscriptionJobSetup = require('./Utils/subscriptionJobSetup');

// Routes
app.use('/api/subscriptions', subscriptionRoute);
app.use('/api/admin/subscriptions', subscriptionAdminRoute);

// Initialize background jobs (on server startup)
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_JOBS === 'true') {
  SubscriptionJobSetup.initializeSubscriptionJobs();
}
```

### 1.2 Frontend Integration

Add routes to your React Router configuration:

```javascript
import SubscriptionManagement from './Pages/SubscriptionManagement';
import SubscriptionEdit from './Pages/SubscriptionEdit';

// In your routes configuration:
{
  path: '/subscriptions',
  element: <SubscriptionManagement />
},
{
  path: '/subscription/:subscriptionId/edit',
  element: <SubscriptionEdit />
}
```

Add link to Navbar:

```jsx
<Link to="/subscriptions">My Subscriptions</Link>
```

### 1.3 Import SubscriptionOption in Product Pages

In your ProductDetails page:

```jsx
import { SubscriptionOption } from '../components/Subscription/SubscriptionOption';

// In your component:
<SubscriptionOption
  product={product}
  quantity={quantity}
  basePrice={product.price}
  onSubscriptionChange={(subscriptionData) => {
    // Handle subscription toggle
    setSubscriptionData(subscriptionData);
  }}
/>
```

---

## 2. Frontend Testing

### 2.1 Test Subscription Option Component

**Location:** Product Details Page

**Test Cases:**

1. **Toggle Subscribe**
   - [ ] Click "Subscribe to Save" checkbox
   - [ ] "Best Value" badge appears
   - [ ] Subscription details section expands
   - [ ] Savings calculator shows correct amount
   - [ ] Per-serving price calculates correctly

2. **Frequency Selection**
   - [ ] Click each frequency option (7d, 14d, 30d, 60d, 90d)
   - [ ] Selected option highlights in green
   - [ ] Discount percentage updates: 40%, 35%, 30%, 25%, 20%
   - [ ] Savings amount recalculates
   - [ ] On mobile: dropdown appears instead of buttons

3. **Pricing Calculations**
   - Test with different quantities:
     - Qty 1, 30-day: Price should be base × 0.70
     - Qty 5, 7-day: Price should be base × 5 × 0.60
   - Verify free shipping triggers over $35

4. **Uncheck Subscribe**
   - [ ] Uncheck "Subscribe to Save"
   - [ ] Shows one-time purchase option
   - [ ] Savings amount becomes $0
   - [ ] Can toggle back on

---

### 2.2 Test Subscription Management Page

**Location:** `/subscriptions`

**Test Cases:**

1. **Tab Navigation**
   - [ ] Click "Active" tab - shows only active subscriptions
   - [ ] Click "Paused" tab - shows only paused subscriptions
   - [ ] Click "Cancelled" tab - shows only cancelled subscriptions
   - [ ] Tab counts update correctly

2. **Subscription Cards**
   - [ ] Subscription number displays (e.g., "#SUB-001")
   - [ ] Status badge shows correct color
   - [ ] Frequency badge shows delivery schedule
   - [ ] Items list displays all products
   - [ ] Pricing shows subtotal, discount, and final total
   - [ ] Next delivery date formats correctly

3. **Expand Card**
   - [ ] Click expand icon on card
   - [ ] Shows detailed information:
     - Order items with quantities
     - Delivery address
     - Subscription details grid
     - Skip history (if any)
   - [ ] Collapse works when clicked again

4. **Action Buttons (Active Subscription)**
   - [ ] **Skip Next**: Disables after first click, re-enables next cycle
   - [ ] **Pause**: Changes status to "paused" and moves to Paused tab
   - [ ] **Edit**: Navigates to edit page
   - [ ] **Cancel**: Shows confirmation, then moves to Cancelled tab

5. **Action Buttons (Paused Subscription)**
   - [ ] **Resume**: Changes status back to "active"
   - [ ] **Cancel**: Still available

6. **Toast Notifications**
   - [ ] Success message appears on action
   - [ ] Error message appears on failure
   - [ ] Toast auto-dismisses after 3 seconds

7. **Empty State**
   - [ ] When no subscriptions exist: Shows "No subscriptions" message
   - [ ] "Shop Products" button navigates to products page

---

### 2.3 Test Subscription Edit Page

**Location:** `/subscription/:subscriptionId/edit`

**Test Cases:**

1. **Items Tab**
   - [ ] All items display with name, variant, price
   - [ ] Quantity input allows changes
   - [ ] Total updates in real-time
   - [ ] "Remove" button removes item from list
   - [ ] Pricing summary calculates correctly
   - [ ] Discount tier shows (30% for monthly)
   - [ ] Save button works
   - [ ] Reset button restores original items

2. **Frequency Tab**
   - [ ] All 5 frequency options display
   - [ ] Current frequency is highlighted
   - [ ] Click new frequency: background changes to green
   - [ ] Info box shows discount % for selected frequency
   - [ ] Save button disabled if same frequency selected
   - [ ] After save: redirects to edit address tab

3. **Address Tab**
   - [ ] All address fields populated from current subscription
   - [ ] Name field is editable
   - [ ] Full address field is editable
   - [ ] City, state, ZIP code fields are editable
   - [ ] Phone field is optional
   - [ ] Special instructions textarea works
   - [ ] Form validation prevents saving empty required fields
   - [ ] After save: redirects to subscriptions list with success message

---

## 3. Backend API Testing

### 3.1 Create Subscription Endpoint

**Endpoint:** `POST /api/subscriptions/create`

**Test with curl:**

```bash
curl -X POST http://localhost:5000/api/subscriptions/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product": "PRODUCT_ID",
        "name": "Product Name",
        "variant": "Size/Color",
        "quantity": 2,
        "price": 25.99
      }
    ],
    "frequency": "30days",
    "deliveryAddress": {
      "name": "John Doe",
      "fullAddress": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "subscription": {
    "_id": "...",
    "subscriptionNumber": "SUB-001",
    "status": "active",
    "nextBillingDate": "2024-09-24",
    "total": 51.98,
    "discountPercentage": 30,
    ...
  }
}
```

### 3.2 Get User Subscriptions

**Endpoint:** `GET /api/subscriptions/my-subscriptions?status=active`

```bash
curl http://localhost:5000/api/subscriptions/my-subscriptions?status=active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Test Cases:**
- [ ] With `status=active`: Returns only active subscriptions
- [ ] With `status=paused`: Returns only paused subscriptions
- [ ] Without status param: Returns all subscriptions

### 3.3 Update Subscription Items

**Endpoint:** `PUT /api/subscriptions/:subscriptionId/items`

```bash
curl -X PUT http://localhost:5000/api/subscriptions/SUBSCRIPTION_ID/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product": "PRODUCT_ID",
        "name": "Product Name",
        "variant": "Size",
        "quantity": 3,
        "price": 25.99
      }
    ],
    "discountPercentage": 30
  }'
```

**Test Cases:**
- [ ] Quantity updates reflect in response
- [ ] Total price recalculates with new quantities
- [ ] Removing all items returns error

### 3.4 Update Frequency

**Endpoint:** `PUT /api/subscriptions/:subscriptionId/frequency`

```bash
curl -X PUT http://localhost:5000/api/subscriptions/SUBSCRIPTION_ID/frequency \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "frequency": "14days"
  }'
```

**Test Cases:**
- [ ] Frequency changes to selected option
- [ ] Discount updates correctly (14d = 35%)
- [ ] nextBillingDate recalculates

### 3.5 Pause/Resume Subscription

**Endpoint:** `POST /api/subscriptions/:subscriptionId/pause`

```bash
curl -X POST http://localhost:5000/api/subscriptions/SUBSCRIPTION_ID/pause \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Need a break"}'
```

**Test Cases:**
- [ ] Status changes to "paused"
- [ ] pausedDate is set
- [ ] Resume endpoint changes status back to "active"

### 3.6 Skip Delivery

**Endpoint:** `POST /api/subscriptions/:subscriptionId/skip`

```bash
curl -X POST http://localhost:5000/api/subscriptions/SUBSCRIPTION_ID/skip \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Traveling"}'
```

**Test Cases:**
- [ ] Skip added to skippedDeliveries array
- [ ] canSkipNext set to false
- [ ] nextBillingDate moved forward by one cycle
- [ ] Second skip call returns error (max 1 per cycle)

### 3.7 Cancel Subscription

**Endpoint:** `POST /api/subscriptions/:subscriptionId/cancel`

```bash
curl -X POST http://localhost:5000/api/subscriptions/SUBSCRIPTION_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Not needed anymore"}'
```

**Test Cases:**
- [ ] Status changes to "cancelled"
- [ ] cancelledDate is set
- [ ] Reason is recorded

---

## 4. Admin API Testing

### 4.1 Get All Subscriptions

**Endpoint:** `GET /api/admin/subscriptions/all`

```bash
curl 'http://localhost:5000/api/admin/subscriptions/all?status=active&page=1&limit=10' \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Test Cases:**
- [ ] Filtering by status works
- [ ] Pagination works (page, limit)
- [ ] Search by subscription number works
- [ ] Sorting works

### 4.2 Dashboard Statistics

**Endpoint:** `GET /api/admin/subscriptions/dashboard/stats`

```bash
curl 'http://localhost:5000/api/admin/subscriptions/dashboard/stats?timeframe=30' \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Verify Response Contains:**
- [ ] Total subscriptions count
- [ ] Active/paused/cancelled/failed counts
- [ ] Recent created/cancelled counts
- [ ] Total revenue
- [ ] Revenue by frequency breakdown
- [ ] Revenue by role breakdown
- [ ] Average order value
- [ ] Churn rate percentage

### 4.3 Retry Failed Payment

**Endpoint:** `POST /api/admin/subscriptions/:subscriptionId/retry-payment`

```bash
curl -X POST http://localhost:5000/api/admin/subscriptions/SUBSCRIPTION_ID/retry-payment \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Test Cases:**
- [ ] Works when subscription status is "payment_failed"
- [ ] Returns error if subscription is not in failed state
- [ ] Status changes to "active" on success

### 4.4 Export Subscriptions

**Endpoint:** `GET /api/admin/subscriptions/export?format=csv`

```bash
curl 'http://localhost:5000/api/admin/subscriptions/export?format=csv' \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -o subscriptions.csv
```

**Test Cases:**
- [ ] CSV export downloads with correct headers
- [ ] JSON export returns valid JSON
- [ ] Filtering by status works in export

---

## 5. Background Job Testing

### 5.1 Enable Jobs (Development)

Set environment variable:
```bash
ENABLE_JOBS=true
```

### 5.2 Test Billing Job (Manual Trigger)

Add a test endpoint to trigger job:

```javascript
router.post('/test/process-subscriptions', async (req, res) => {
  const result = await SubscriptionBillingJob.processSubscriptions();
  res.json(result);
});
```

**Test Cases:**
- [ ] Find subscriptions with nextBillingDate <= today
- [ ] Create orders for each subscription
- [ ] Update nextBillingDate for next cycle
- [ ] Log statistics of processed subscriptions

### 5.3 Test Stripe Integration

**Setup:**
1. Use Stripe test card: `4242 4242 4242 4242`
2. Set expiry to future date (e.g., 12/25)
3. Set CVC to any 3 digits

**Test Cases:**
- [ ] Stripe customer created on first subscription
- [ ] Payment charges successfully
- [ ] Charge ID stored in subscription
- [ ] Failed charge creates "payment_failed" status

---

## 6. End-to-End Workflow Testing

### 6.1 Complete User Journey

**Scenario 1: Create and Manage Subscription**

1. [ ] User logs in
2. [ ] Navigate to product page
3. [ ] Check "Subscribe to Save"
4. [ ] Select 30-day frequency
5. [ ] Add to cart
6. [ ] Proceed to checkout
7. [ ] Complete payment
8. [ ] Subscription created
9. [ ] Navigate to My Subscriptions
10. [ ] View subscription details
11. [ ] Edit subscription (change items)
12. [ ] Save changes
13. [ ] Pause subscription
14. [ ] Resume subscription
15. [ ] Skip next delivery
16. [ ] Cancel subscription
17. [ ] Verify in Cancelled tab

**Scenario 2: Payment Failure Recovery**

1. [ ] Create subscription
2. [ ] Use failed test card (e.g., 4000 0000 0000 0002)
3. [ ] Verify status is "payment_failed"
4. [ ] Admin retries payment
5. [ ] Verify status changes to "active"

**Scenario 3: Multiple Subscriptions**

1. [ ] Create 3 subscriptions with different frequencies
2. [ ] View all in Active tab
3. [ ] Pause one
4. [ ] Verify others remain active
5. [ ] Cancel one
6. [ ] Verify count updates in tabs

---

## 7. Verification Checklist

### Data Integrity
- [ ] Subscription numbers are unique
- [ ] Prices calculated correctly with discounts
- [ ] Shipping costs applied correctly
- [ ] nextBillingDate updates on each billing cycle
- [ ] Skip history tracks all skipped deliveries
- [ ] Admin notes append (don't overwrite)

### User Experience
- [ ] All forms validate input
- [ ] Toast notifications appear and dismiss
- [ ] Loading states show during API calls
- [ ] Error messages are helpful
- [ ] Responsive design works on mobile/tablet/desktop

### Security
- [ ] Authenticated users only can access own subscriptions
- [ ] Admin users only can access admin endpoints
- [ ] Payment details never stored on server
- [ ] Stripe credentials are environment variables

### Performance
- [ ] Pagination works with large datasets
- [ ] Search/filter queries are fast
- [ ] Background jobs don't block user requests
- [ ] Loading states appear within 1 second

---

## 8. Troubleshooting

### Common Issues

**Issue: "Subscription not found" error**
- Verify subscription ID is correct
- Check user owns the subscription
- Ensure subscription wasn't deleted

**Issue: Stripe payment fails**
- Check Stripe keys in environment variables
- Verify test card is valid
- Check customer has default payment method

**Issue: nextBillingDate not updating**
- Verify billing job is running
- Check if subscription is active (not paused)
- Check if edit window validation passed

**Issue: Frequency not updating**
- Verify frequency value is one of: 7days, 14days, 30days, 60days, 90days
- Check discount map has entry for frequency

---

## 9. Performance Benchmarks

- Product page load: < 1s
- Subscription list load: < 2s
- Subscription creation: < 3s
- Payment processing: < 5s
- Billing job (100 subscriptions): < 30s

---

## 10. Demo Script

**For Stakeholders:**

1. Create subscription (40% off weekly)
2. Show savings calculator
3. Edit frequency (change to 30-day = 30% off)
4. Show pricing update
5. Skip next delivery
6. Pause and resume
7. Admin dashboard with stats
8. Export to CSV

---

## Notes for Future Enhancement

- [ ] Add email notifications (Stripe webhook integration)
- [ ] Implement auto-replenishment alerts
- [ ] Add subscription gift option
- [ ] Support multi-item discounts
- [ ] Implement loyalty points for subscriptions
- [ ] Add subscription analytics dashboard

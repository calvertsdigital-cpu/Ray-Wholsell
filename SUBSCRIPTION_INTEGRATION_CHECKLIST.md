# Subscription Feature - Integration Checklist

## Backend Integration Checklist

### 1. Dependencies
- [ ] `node-cron` installed (`npm install node-cron`)
- [ ] `stripe` package already installed
- [ ] `mongoose` for MongoDB ORM

### 2. Database Models
- [ ] `Ray-wholsell-1/Models/subscriptionModel.js` created
  - [ ] Schema includes all required fields
  - [ ] Indexes on user, status, nextBillingDate
  - [ ] Pre-save hooks for auto-generation (if needed)

### 3. Backend Files Created
- [ ] `Ray-wholsell-1/Controllers/subscriptionController.js` - User operations
- [ ] `Ray-wholsell-1/Routes/subscriptionRoute.js` - User routes
- [ ] `Ray-wholsell-1/Controllers/subscriptionAdminController.js` - Admin operations
- [ ] `Ray-wholsell-1/Routes/subscriptionAdminRoute.js` - Admin routes
- [ ] `Ray-wholsell-1/Jobs/subscriptionBillingJob.js` - Cron job for billing
- [ ] `Ray-wholsell-1/Utils/subscriptionRetry.js` - Retry logic
- [ ] `Ray-wholsell-1/Utils/subscriptionJobSetup.js` - Job initialization

### 4. Environment Variables
Add to `.env`:
```
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Jobs
ENABLE_JOBS=true  # Only enable in production or development testing

# Email (optional, for notifications)
SENDGRID_API_KEY=your_key
```

### 5. Server Initialization

In `app.js` or `server.js`, add:

```javascript
// Near other route imports
const subscriptionRoute = require('./Routes/subscriptionRoute');
const subscriptionAdminRoute = require('./Routes/subscriptionAdminRoute');
const SubscriptionJobSetup = require('./Utils/subscriptionJobSetup');

// After other routes
app.use('/api/subscriptions', subscriptionRoute);
app.use('/api/admin/subscriptions', subscriptionAdminRoute);

// After database connection, in server startup
if (process.env.ENABLE_JOBS === 'true') {
  console.log('📅 Initializing subscription background jobs...');
  SubscriptionJobSetup.initializeSubscriptionJobs();
}
```

### 6. Error Handling
- [ ] `AppError` utility exists (for consistent error responses)
- [ ] `catchAsync` utility exists (for try-catch wrapping)
- [ ] Global error handler catches subscription errors

### 7. Authentication Middleware
- [ ] `protect` middleware checks JWT token
- [ ] `restrictTo` middleware checks user role for admin routes
- [ ] Both used in subscription routes

### 8. Testing Endpoints
Add these temporary endpoints for testing:

```javascript
// In subscriptionRoute.js (development only)
if (process.env.NODE_ENV !== 'production') {
  router.post('/test/process-all', async (req, res) => {
    const SubscriptionBillingJob = require('../Jobs/subscriptionBillingJob');
    const result = await SubscriptionBillingJob.processSubscriptions();
    res.json(result);
  });
}
```

---

## Frontend Integration Checklist

### 1. Files Created
- [ ] `Ray-Wholsell/src/components/Subscription/SubscriptionOption.jsx`
- [ ] `Ray-Wholsell/src/components/Subscription/SubscriptionOption.scss`
- [ ] `Ray-Wholsell/src/hooks/useSubscription.js`
- [ ] `Ray-Wholsell/src/Pages/SubscriptionManagement.jsx`
- [ ] `Ray-Wholsell/src/Pages/SubscriptionManagement.scss`
- [ ] `Ray-Wholsell/src/Pages/SubscriptionEdit.jsx`
- [ ] `Ray-Wholsell/src/Pages/SubscriptionEdit.scss`

### 2. Dependencies
- [ ] `lucide-react` installed (for icons)
- [ ] `react-router-dom` already configured
- [ ] axios or fetch API for HTTP requests

### 3. API Client Setup
- [ ] `axiosInstance` configured with:
  - Base URL (e.g., `http://localhost:5000/api`)
  - Authorization header with Bearer token
  - Error interceptor

Example in `useSubscription.js`:
```javascript
const token = localStorage.getItem('userToken');
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};
```

### 4. Routes Configuration

In your main routing file (e.g., `App.jsx`):

```javascript
import SubscriptionManagement from './Pages/SubscriptionManagement';
import SubscriptionEdit from './Pages/SubscriptionEdit';

// In routes array:
{
  path: '/subscriptions',
  element: <SubscriptionManagement />
},
{
  path: '/subscription/:subscriptionId/edit',
  element: <SubscriptionEdit />
}
```

### 5. Product Page Integration

In your `ProductDetails.jsx` or similar:

```javascript
import { SubscriptionOption } from '../components/Subscription/SubscriptionOption';

export const ProductDetails = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);

  const handleAddToCart = () => {
    const cartItem = {
      product: product._id,
      quantity: quantity,
      price: product.price,
      ...subscriptionData  // Include subscription data if subscribed
    };
    addToCart(cartItem);
  };

  return (
    <>
      {/* Product info */}
      <SubscriptionOption
        product={product}
        quantity={quantity}
        basePrice={product.price}
        onSubscriptionChange={setSubscriptionData}
      />
      <button onClick={handleAddToCart}>Add to Cart</button>
    </>
  );
};
```

### 6. Navbar Link

Add to your Navbar component:

```javascript
<Link to="/subscriptions" className="nav-link">
  My Subscriptions
</Link>
```

### 7. Auth Check

Ensure user is logged in before accessing subscription pages:

```javascript
// In SubscriptionManagement.jsx at top:
useEffect(() => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    navigate('/login');
  }
}, []);
```

### 8. Styling Integration

Ensure SCSS is imported in component files:
```javascript
import './SubscriptionOption.scss';
import './SubscriptionManagement.scss';
import './SubscriptionEdit.scss';
```

### 9. Icon Library

Verify `lucide-react` icons used:
- `ChevronDown` - Expand/collapse
- `Pause`, `Play` - Pause/resume buttons
- `Skip` - Skip delivery
- `Trash2` - Delete/cancel
- `Edit2` - Edit button
- `X` - Close button
- `ArrowLeft` - Back button
- `Save` - Save button

### 10. Testing Setup

Create mock data for development:

```javascript
// In useSubscription.js or separate file
const mockSubscription = {
  _id: '123abc',
  subscriptionNumber: 'SUB-001',
  status: 'active',
  frequency: '30days',
  items: [
    {
      name: 'Product 1',
      quantity: 2,
      price: 19.99
    }
  ],
  total: 27.99,
  nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  // ... other fields
};
```

---

## Checkout/Payment Integration

### 1. Checkout Page Updates

In your checkout/payment page, detect subscription:

```javascript
const { subscriptionData } = useLocation().state || {};

if (subscriptionData?.isSubscription) {
  // Show subscription frequency/discount info
  // Create subscription after payment
}
```

### 2. Payment Processing

After successful Stripe payment:

```javascript
const handlePaymentSuccess = async (paymentIntentId) => {
  if (subscriptionData?.isSubscription) {
    try {
      const subscription = await createSubscription({
        items: cartItems,
        frequency: subscriptionData.frequency,
        deliveryAddress: shippingAddress,
        stripeCustomerId: customerId,
        stripePaymentIntentId: paymentIntentId
      });
      
      // Clear cart, show success
      clearCart();
      navigate('/subscriptions', { 
        state: { message: `Subscription #${subscription.subscriptionNumber} created!` }
      });
    } catch (error) {
      showError('Failed to create subscription');
    }
  }
};
```

### 3. Order vs Subscription

Add logic to differentiate:

```javascript
if (subscriptionData?.isSubscription) {
  // Don't create Order, let billing job create it
  // Just create Subscription
} else {
  // Create one-time Order
  createOrder(cartItems, shippingAddress);
}
```

---

## Testing & Verification

### Backend Verification

```bash
# 1. Check if routes registered
curl http://localhost:5000/api/subscriptions/my-subscriptions \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Check if admin routes accessible
curl http://localhost:5000/api/admin/subscriptions/all \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 3. Check if jobs initialized (look in console logs)
# Should see: "🚀 Initializing Subscription Jobs..."
```

### Frontend Verification

```bash
# 1. Check if routes defined
# Open browser console: see if no 404s for /subscriptions

# 2. Check if components load
# Navigate to /subscriptions - should load without errors

# 3. Check console for API errors
# Open DevTools → Console → Network tabs
```

---

## Common Integration Issues & Fixes

### Issue: "Cannot find module 'subscriptionRoute'"
**Fix:** Ensure file path is correct in require statement
```javascript
// Correct:
const subscriptionRoute = require('./Routes/subscriptionRoute');
// Not:
const subscriptionRoute = require('./subscriptionRoute');
```

### Issue: 401 Unauthorized on subscription API
**Fix:** Ensure token is being sent in Authorization header
```javascript
headers: {
  Authorization: `Bearer ${localStorage.getItem('userToken')}`
}
```

### Issue: Stripe payment fails
**Fix:** Verify Stripe keys in environment variables
```bash
# .env should have:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Issue: Background jobs not running
**Fix:** Enable jobs environment variable
```bash
# In .env:
ENABLE_JOBS=true
```

### Issue: SCSS styles not applying
**Fix:** Import style files in components
```javascript
import './SubscriptionManagement.scss';
```

---

## Deployment Checklist

### Before Going to Production

- [ ] All tests passing
- [ ] Error handling comprehensive
- [ ] Logging implemented
- [ ] Security checks passed
- [ ] Rate limiting on API endpoints
- [ ] CORS properly configured
- [ ] Stripe in production mode (not test mode)
- [ ] Email notifications configured (if applicable)
- [ ] Database backups enabled
- [ ] Monitoring/alerting set up for background jobs
- [ ] Load testing done for billing job
- [ ] Documentation updated

### Production Environment Variables

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
NODE_ENV=production
ENABLE_JOBS=true
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_strong_secret_key
```

---

## Rollback Plan

If issues occur in production:

1. **Disable new subscriptions:**
   - Hide SubscriptionOption component
   - Return 503 on create endpoint

2. **Pause background jobs:**
   - Set `ENABLE_JOBS=false`
   - Restart server

3. **Investigate:**
   - Check server logs
   - Check Stripe logs
   - Check database

4. **Recovery:**
   - Fix issue
   - Test in development
   - Gradually re-enable

---

## Success Criteria

✅ Feature is complete when:

- [ ] User can create subscription from product page
- [ ] Subscription appears in My Subscriptions page
- [ ] User can edit/pause/resume/cancel subscription
- [ ] Admin can view all subscriptions & statistics
- [ ] Background job processes subscriptions daily
- [ ] Failed payments retry automatically
- [ ] All unit tests pass
- [ ] E2E tests pass
- [ ] No console errors
- [ ] Mobile responsive works
- [ ] Performance acceptable

---

## Support & Debugging

### Useful Debugging Commands

```javascript
// Check all active subscriptions
db.subscriptions.find({ status: 'active' })

// Check failed subscriptions
db.subscriptions.find({ status: 'payment_failed' })

// Count by status
db.subscriptions.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } }
])

// View subscription with most recent billing
db.subscriptions.findOne({ status: 'active' }, { sort: { lastBilledDate: -1 } })
```

### Logs to Monitor

- `[SubscriptionBillingJob]` - Billing process logs
- `[SubscriptionRetry]` - Payment retry logs
- `[subscriptionController]` - User operation logs
- `[subscriptionAdminController]` - Admin operation logs

---

## Next Steps After Integration

1. [ ] Deploy to staging
2. [ ] Perform full E2E testing
3. [ ] Get stakeholder approval
4. [ ] Deploy to production
5. [ ] Monitor for issues
6. [ ] Gather user feedback
7. [ ] Plan enhancements

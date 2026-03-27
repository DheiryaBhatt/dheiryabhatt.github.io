# Analytics Setup for New Website

## Google Analytics Configuration

### Configure GitHub Variables and Secrets

In GitHub repo settings, configure:

1. `Settings -> Secrets and variables -> Actions -> Variables`
2. Add:
  - `GA_MEASUREMENT_ID` = `G-3LBSW1PYPS`
  - `COHORT_SPLIT_PERCENT` = `10`

For Notion sync workflow, keep these Action Secrets configured:

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

To enable analytics for the new design at `/new/`, follow these steps:

### 1. Get Your Measurement ID
1. Go to [Google Analytics 4](https://analytics.google.com/)
2. Create a new property OR use existing one
3. Copy your **Measurement ID** (looks like: `G-XXXXXXXXXX`)

### 2. Update index.html
Configured Measurement ID: `G-3LBSW1PYPS`

This ID has already been applied in the code.

**In the `<head>` tag:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-3LBSW1PYPS"></script>
```

**In the gtag config:**
```javascript
gtag('config', 'G-3LBSW1PYPS', {
  'page_path': '/new/',
  'user_cohort': getCohort()
});
```

### 3. Cohort Tracking
The system automatically tracks:
- **User Cohort**: Whether user is in "new" (10%) or "old" (90%) group
- **Cohort Assignment Date**: When the user was first assigned
- **Page Views**: Separate metrics for `/` vs `/new/`
- **Custom Events**: 
  - `page_view_new_design` - Fired on `/new/` page load
  - `cohort_enrollment` - Fired on first visit

### 4. View Your Data
In Google Analytics dashboard:
- Navigate to **Reports > Engagement > Pages and screens**
- Filter by `/new/` to see new design metrics
- Create a **Custom Dimension** for `user_cohort` to segment traffic

## Metrics to Monitor

### Performance Metrics
- Bounce rate (compare `/` vs `/new/`)
- Average session duration
- Pages per session
- Scroll depth

### User Engagement
- Click-through rate on cards
- AMA widget interactions
- Link card clicks
- Time on page

### Conversion Funnel (if applicable)
- Email subscriptions
- GitHub profile visits
- Project views

## Cohort Comparison

Once you have enough data (100+ users per cohort):

1. Go to Analytics Dashboard
2. Create a **Custom Report** with these dimensions:
   - User Cohort (custom dimension)
   - Metrics: Users, Sessions, Engagement Rate, Bounce Rate, Avg Session Duration

3. Compare `new` vs `old` to measure:
   - Is new design performing better?
   - Are users engaging more?
   - Lower bounce rate?

## Gradual Rollout Checklist

- [ ] Set up Google Analytics property
- [ ] Add Measurement ID to index.html in `/new/`
- [ ] Test on staging that analytics events fire
- [ ] Establish baseline metrics for current site (/)
- [ ] Deploy `/new/` with 10% cohort split
- [ ] Monitor metrics for 1 week
- [ ] Increase cohort split to 25% if looking good
- [ ] Continue monitoring and iterate

## Quick Test

Open DevTools console and run:
```javascript
// Should return 'new' or 'old'
localStorage.getItem('user_cohort');

// Should return analytics events
gtag('event', 'test_event', {'test': true});
```

Check Google Analytics > Realtime to see incoming events.

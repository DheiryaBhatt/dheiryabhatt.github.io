# New Website Redesign

This directory contains the new website redesign for dheiryabhatt.com, served at `/new/`.

## Structure

```
/new/
├── index.html              # Main landing page
├── cohort-router.js        # Cohort routing & A/B testing system
├── ANALYTICS.md            # Analytics setup guide
└── README.md              # This file
```

## How It Works During Development

1. **Old site** continues at `dheiryabhatt.com/` (root)
2. **New site** available at `dheiryabhatt.com/new/`
3. When approved → Everything moves to root, old site archived

## Current State: STAGING

✅ Design ready
⏳ Under review
⏳ Analytics not yet connected
⏳ Cohort system ready to activate

## For the Design Team

### Making Changes
1. Edit files in `/new/` directly
2. Test at `dheiryabhatt.com/new/` on staging
3. When confirmed → Create PR to `main`

### Testing Your Changes
```bash
# Build Jekyll (if needed)
jekyll build

# View at http://localhost:4000/new/
jekyll serve
```

### Important Links in the Design
- `href="/"` → Links back to root (old site) during transition
- `href="/blog"` → Links to blog section (unchanged)
- All paths are relative root URLs for easy migration

## Before Launching

### Checklist
- [ ] Analytics configured with Measurement ID
- [ ] All links tested and working
- [ ] Mobile responsiveness verified
- [ ] Performance baseline established
- [ ] SEO optimization complete (meta tags, structured data)
- [ ] Accessibility audit performed (WCAG 2.1 AA)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Testing Cohort System
```javascript
// Clear previous assignment (if testing)
localStorage.removeItem('user_cohort');
localStorage.removeItem('user_cohort_assigned_at');

// Page reload automatically assigns
pageload → cohort assigned → analytics tracked
```

## Deployment Strategy

### Phase 1: Merge to Main (When Approved)
```bash
git merge staging → main
GitHub Pages auto-deploys
```

### Phase 2: Enable Cohort Routing
1. Uncomment cohort router in root `index.html`
2. Set traffic split: 10% → `/new/`, 90% → `/` (old)
3. Monitor metrics for 1 week

### Phase 3: Gradual Rollout
- Week 1: 10% to new design
- Week 2: 25% (if metrics good)
- Week 3: 50%
- Week 4: 100% (make default)

### Phase 4: Cleanup
1. Archive old site code
2. Remove cohort router (if design stable)
3. Update DNS/CNAME if needed

## Troubleshooting

### Analytics Not Showing Data?
1. Check Measurement ID is correct
2. Verify gtag script loads (DevTools > Network)
3. Check user hasn't disabled JS

### Links Not Working?
1. All links should use `/path/` format (root-relative)
2. Avoid relative `../` paths
3. Test both at `/` and `/new/`

### Build Issues?
1. Ensure Jekyll config includes `/new/` directory
2. Check `.gitignore` doesn't exclude `/new/`
3. Verify no conflicting CSS names with main site

## Questions?

See:
- [Analytics Setup](./ANALYTICS.md)
- [Cohort Router Docs](./cohort-router.js)
- Root level README for overall strategy

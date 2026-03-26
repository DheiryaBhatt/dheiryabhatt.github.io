# Website Revamp Strategy & Deployment Plan

## Overview

This document outlines the complete strategy for safely deploying the redesigned website using a subdirectory approach with GitHub Pages, cohort-based rollout, and analytics-driven decisions.

## Architecture

### Repository Structure
```
main branch (master)
  ├── / → Current Jekyll site (protected)
  ├── /new/ → New redesign (staging)
  ├── /blog/ → Blog posts (via Notion Sync)
  └── .gitignore, _config.yml, etc.

staging branch
  ├── All changes to /new/ directory
  ├── Design team works here
  └── Merged to main when approved
```

### GitHub Pages Setup
- **Repository**: `dheiryabhatt.github.io`
- **Custom Domain**: `dheiryabhatt.com`
- **Build**: Automatic (on push to main)
- **URLs**:
  - Old site: `dheiryabhatt.com/` (root)
  - New design: `dheiryabhatt.com/new/`
  - Blog: `dheiryabhatt.com/blog/`

## Branching Strategy

### Branch Protection Rules

**For `main` branch:**
```
✅ Require pull request reviews before merging (1+ approval)
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging
❌ Do NOT allow direct pushes
```

**For `staging` branch:**
```
⚠️ Design team can push directly (for iteration)
✅ PR required to merge into main
```

### Workflow

```
1. Create staging branch (if not exists)
   git checkout -b staging
   git push origin staging

2. Design team works on /new/ directory
   → Commits to staging branch
   → Tests at dheiryabhatt.com/new/

3. When ready for approval
   → Create PR: staging → main
   → You review & approve
   → Merge to main

4. GitHub Pages auto-deploys
   → New design live at /new/

5. Monitor analytics for 1 week
   → If successful: increase cohort percentage
   → If issues: rollback via Git
```

## Cohort Rollout Timeline

### Week 1: Silent Launch (10% to New Design)
- **Start**: Today (after approval)
- **Traffic Split**: 90% old, 10% new
- **Goal**: Catch bugs before wider audience
- **Metrics to track**:
  ```
  Error rate (console errors)
  Page load time (target: <3s)
  Bounce rate (target: <50%)
  Session interactions (card clicks, AMA)
  ```
- **Action**: If error rate < 2%, proceed to Week 2

### Week 2: Expanded Test (25% to New Design)
- **Traffic Split**: 75% old, 25% new
- **Goal**: Real user engagement patterns
- **New metrics**:
  ```
  Avg session duration (target: >2min)
  Pages per session (target: >1.5)
  Link click-through rates
  Form interactions
  ```
- **Decision**: If all metrics good, increase; if not, debug & hold at 10%

### Week 3: Confidence (50% to New Design)
- **Traffic Split**: 50% old, 50% new
- **Goal**: Large enough sample for statistical significance
- **Check**: Compare performance side-by-side
- **Fallback**: If issues appear, can rollback to 10% immediately

### Week 4: Full Deployment (100% to New Design)
- **Traffic Split**: 100% new
- **Move**: Move new design to root `/`
- **Archive**: Old site backed up, moved to `/old/`
- **Cleanup**: Remove cohort routing code

## Implementation: Cohort Routing

### How It Works

```javascript
// User visits dheiryabhatt.com/
↓
CohortRouter checks localStorage
↓
├─ If new user: Random assignment (10% new, 90% old)
├─ If returning: Same cohort as before
↓
Stores in localStorage: user_cohort = "new" or "old"
↓
Sends to Google Analytics for segmentation
↓
User sees their assigned version
```

### Modifying Split Percentage

Edit `/new/cohort-router.js`:
```javascript
const router = new CohortRouter({
  splitPercent: 10  // Change this: 10 to 25 to 50 to 100
});
```

Then redeploy:
```bash
git add dheiryabhatt.github.io/new/cohort-router.js
git commit -m "Update cohort split to 25%"
git push origin main
```

Takes effect within 1 minute (no server restart needed).

## Analytics Integration

### Setup (First Time)
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property: "New Website Design"
3. Copy Measurement ID
4. Update `/new/ANALYTICS.md` with ID
5. Add to `/new/index.html` in two places

### Key Events to Track

| Event | Metric | Target |
|-------|--------|--------|
| `page_view_new_design` | Page loads | Monitor volume |
| `cohort_enrollment` | User assignment | 10% should hit new |
| `click` | Link interactions | Compare vs old |
| `bounce` | Bounce rate | <50% |
| `scroll` | Engagement depth | >75% scroll |

### Dashboard Views

**Create Custom Report:**
1. Analytics → Explore
2. Dimensions: Custom Dimension (user_cohort), Page Path
3. Metrics: Users, Bounce Rate, Avg Session Duration, Events

**Compare Results:**
- Filter by `/` (old site)
- Filter by `/new/` (new design)
- Segment by cohort assignment date

## Rollback Strategy

### If Major Issues Found

**Immediate Rollback (any time):**
```bash
# Reduce cohort to 0%
Edit: dheiryabhatt.github.io/new/cohort-router.js
Change: splitPercent: 0

# Commit & deploy
git add .
git commit -m "Emergency rollback: 0 users to new design"
git push origin main
```

Takes effect immediately. 100% of new visitors go to old site.

**Full Rollback (if `/new/` is broken):**
```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main
```

**Emergency**: If GitHub Pages CDN is slow, temporary fix:
```bash
# Serve from staging until fixed
git checkout staging
git push origin staging:main -f
```

## Success Metrics

**Before Launching:**
- [ ] Analytics configured
- [ ] Cohort router tested (localStorage working)
- [ ] Links verified (no 404s)
- [ ] Mobile responsive
- [ ] Core elements visible on 3G network

**After Week 1 (10%):**
- [ ] Error rate < 2%
- [ ] Page load < 3 seconds
- [ ] Navigation working
- [ ] No 'new' cohort complaints

**After Week 2 (25%):**
- [ ] Engagement > old site
- [ ] Bounce rate acceptable
- [ ] No accessibility issues
- [ ] Load times maintained

**After Week 4 (100%):**
- [ ] All metrics exceed old site
- [ ] User feedback positive
- [ ] Performance stable

## Communication Plan

### Before Launch
- [ ] Announce redesign (teaser)
- [ ] Set expectations ("rolling out gradually")

### During Rollout
- [ ] Weekly update on metrics
- [ ] Share improvement highlights
- [ ] Collect user feedback

### After Full Launch
- [ ] Celebrate success
- [ ] Thank early testers
- [ ] Show performance improvements

## Contingency Plans

| Scenario | Action |
|----------|--------|
| High error rate (>5%) | Reduce cohort to 0%, debug, redeploy |
| Low engagement (<1min avg) | Compare designs, gather feedback, iterate |
| Performance degradation | Check analytics pipeline, optimize assets |
| User complaints | Document feedback, prioritize fixes, communicate ETA |
| Network issues | Check CDN status, fallback to edge locations |

## Files to Monitor

```
.git/config              → Verify upstream is correct
_config.yml              → Jekyll build settings
dheiryabhatt.github.io/
  ├── index.html         → Root site (do NOT edit during transition)
  ├── /new/              → New design (design team works here)
  │   ├── index.html     → Main page
  │   ├── cohort-router.js
  │   ├── ANALYTICS.md
  │   └── README.md
  └── /blog/             → Notion Sync (unchanged)
```

## Next Steps

1. ✅ Set up Git protection rules
2. ✅ Create `/new/` directory with design
3. ⏳ Configure analytics (Google Analytics Measurement ID)
4. ⏳ Merge to main → live at `/new/`
5. ⏳ Activate cohort router (10% split)
6. ⏳ Monitor metrics for 1 week
7. ⏳ Increase split based on data
8. ⏳ Full deployment when confident

---

**Questions?** Check:
- [Analytics Guide](./dheiryabhatt.github.io/new/ANALYTICS.md)
- [Cohort Router Code](./dheiryabhatt.github.io/new/cohort-router.js)
- This README

// Cohort Routing System for A/B Testing
// This determines which version users see and tracks it via analytics

class CohortRouter {
  constructor(options = {}) {
    this.cohortKey = options.cohortKey || 'user_cohort';
    this.splitPercent = options.splitPercent || 10; // 10% to new design by default
    this.analyticsId = options.analyticsId || (typeof GA_MEASUREMENT_ID !== 'undefined' ? GA_MEASUREMENT_ID : 'G-3LBSW1PYPS');
    this.newUrl = options.newUrl || '/new/';
    this.oldUrl = options.oldUrl || '/';
  }

  /**
   * Get or create user cohort assignment
   * @returns {string} 'new' or 'old'
   */
  getCohort() {
    const stored = localStorage.getItem(this.cohortKey);
    if (stored) {
      return stored;
    }

    // New visitor - assign to cohort
    const cohort = Math.random() * 100 < this.splitPercent ? 'new' : 'old';
    localStorage.setItem(this.cohortKey, cohort);
    localStorage.setItem(`${this.cohortKey}_assigned_at`, new Date().toISOString());
    
    return cohort;
  }

  /**
   * Redirect user to their assigned version
   * Only call this on root path
   */
  initRedirect() {
    const cohort = this.getCohort();
    const currentPath = window.location.pathname;

    // Only redirect from root
    if (currentPath === '/' || currentPath === '') {
      if (cohort === 'new' && !window.location.pathname.startsWith('/new')) {
        window.location.href = this.newUrl;
      } else if (cohort === 'old' && window.location.pathname.startsWith('/new')) {
        window.location.href = this.oldUrl;
      }
    }
  }

  /**
   * Send cohort info to analytics
   */
  trackCohortToAnalytics() {
    if (typeof gtag === 'undefined') return;

    const cohort = this.getCohort();
    const assignedAt = localStorage.getItem(`${this.cohortKey}_assigned_at`);

    gtag('config', this.analyticsId, {
      'user_cohort': cohort,
      'user_cohort_assigned_at': assignedAt,
      'page_path': window.location.pathname
    });

    gtag('event', 'cohort_enrollment', {
      'cohort': cohort,
      'assigned_at': assignedAt,
      'page_path': window.location.pathname
    });
  }

  /**
   * Get cohort stats from localStorage
   * @returns {object} Cohort assignment details
   */
  getStats() {
    return {
      cohort: this.getCohort(),
      assignedAt: localStorage.getItem(`${this.cohortKey}_assigned_at`),
      visitCount: parseInt(localStorage.getItem(`${this.cohortKey}_visits`) || 0) + 1
    };
  }

  /**
   * Increment visit counter
   */
  trackVisit() {
    const visits = parseInt(localStorage.getItem(`${this.cohortKey}_visits`) || 0);
    localStorage.setItem(`${this.cohortKey}_visits`, visits + 1);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CohortRouter;
}

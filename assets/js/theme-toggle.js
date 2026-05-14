/**
 * Theme Toggle Functionality
 * Switches between dark and light themes with icon changes
 */

(function() {
  'use strict';

  const THEME_KEY = 'site-theme';
  const THEMES = {
    dark: {
      name: 'dark',
      icon: '/assets/images/sun-icon.svg', // Sun icon to switch to light theme
      stylesheet: '/assets/main-dark.css',
      ariaLabel: 'Switch to light theme'
    },
    light: {
      name: 'light',
      icon: '/assets/images/moon-icon.svg', // Moon icon to switch to dark theme
      stylesheet: '/assets/main-light.css',
      ariaLabel: 'Switch to dark theme'
    }
  };

  // Get current theme from localStorage or default to dark
  function getCurrentTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    return saved && THEMES[saved] ? saved : 'dark';
  }

  // Save theme preference
  function saveTheme(themeName) {
    localStorage.setItem(THEME_KEY, themeName);
  }

  // Apply theme by updating the stylesheet
  function applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;

    // Find or create the theme stylesheet link
    let themeLink = document.getElementById('theme-stylesheet');
    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.id = 'theme-stylesheet';
      themeLink.rel = 'stylesheet';
      themeLink.type = 'text/css';
      document.head.appendChild(themeLink);
    }

    // Update the stylesheet
    themeLink.href = theme.stylesheet;
    
    // Update body data attribute for additional styling hooks
    document.body.setAttribute('data-theme', themeName);

    // Update the toggle button
    updateToggleButton(themeName);
  }

  // Update toggle button icon and aria-label
  function updateToggleButton(currentTheme) {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    const theme = THEMES[currentTheme];
    const img = button.querySelector('img');
    if (img) {
      img.src = theme.icon;
      img.alt = theme.ariaLabel;
    }
    button.setAttribute('aria-label', theme.ariaLabel);
    button.setAttribute('title', theme.ariaLabel);
  }

  // Toggle between themes
  function toggleTheme() {
    const current = getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    
    saveTheme(next);
    
    // Add animation class before theme change
    const button = document.getElementById('theme-toggle');
    document.body.classList.add('theme-transitioning');
    
    if (button) {
      button.classList.add('theme-toggle--animating');
      setTimeout(() => {
        applyTheme(next);
        setTimeout(() => {
          button.classList.remove('theme-toggle--animating');
          document.body.classList.remove('theme-transitioning');
        }, 600);
      }, 150);
    } else {
      applyTheme(next);
      setTimeout(() => document.body.classList.remove('theme-transitioning'), 600);
    }
  }

  // Initialize theme on page load
  function init() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    // Add click handler to toggle button
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.addEventListener('click', toggleTheme);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Apply theme immediately to prevent flash
  applyTheme(getCurrentTheme());
})();

/* =========================================================
   CoderAnimeMe - theme.js
   Premium theme engine
   - dark default
   - light theme toggle
   - persistent localStorage
   - icon swapping
   ========================================================= */

(function() {
  "use strict";
  
  const STORAGE_KEY = "coderanimeme-theme";
  const CLASS_LIGHT = "light-theme";
  
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }
  
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.warn("Theme save failed:", error);
    }
  }
  
  function getCurrentTheme() {
    return document.body.classList.contains(CLASS_LIGHT) ?
      "light" :
      "dark";
  }
  
  function getThemeIcon(theme) {
    if (theme === "light") {
      return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3V5.2M12 18.8V21M3 12H5.2M18.8 12H21M5.64 5.64L7.2 7.2M16.8 16.8L18.36 18.36M18.36 5.64L16.8 7.2M7.2 16.8L5.64 18.36" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      `;
    }
    
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.7 8.7 0 1 0 11.2 11.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `;
  }
  
  function updateThemeButton(theme) {
    const toggleButtons = document.querySelectorAll("[data-theme-toggle]");
    
    toggleButtons.forEach((button) => {
      button.innerHTML = getThemeIcon(theme);
      button.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      );
      button.setAttribute(
        "title",
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      );
    });
  }
  
  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add(CLASS_LIGHT);
    } else {
      document.body.classList.remove(CLASS_LIGHT);
      theme = "dark";
    }
    
    updateThemeButton(theme);
    saveTheme(theme);
    
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        "content",
        theme === "light" ? "#ffffff" : "#080b12"
      );
    }
  }
  
  function toggleTheme() {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  }
  
  function bindThemeToggle() {
    const toggleButtons = document.querySelectorAll("[data-theme-toggle]");
    
    toggleButtons.forEach((button) => {
      button.addEventListener("click", toggleTheme);
    });
  }
  
  function initTheme() {
    const savedTheme = getSavedTheme();
    const theme = savedTheme === "light" ? "light" : "dark";
    applyTheme(theme);
    bindThemeToggle();
  }
  
  window.CoderAnimeTheme = {
    initTheme,
    applyTheme,
    toggleTheme,
    getCurrentTheme
  };
})();
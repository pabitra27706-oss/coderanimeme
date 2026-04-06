/* =========================================================
   CoderAnimeMe - nav.js
   Premium navigation system
   - sticky navbar state
   - mobile menu open/close
   - active links
   - auto close on outside click
   ========================================================= */

(function() {
  "use strict";
  
  const SELECTORS = {
    navbar: "[data-navbar]",
    mobileMenu: "[data-mobile-menu]",
    menuToggle: "[data-menu-toggle]",
    mobileLinks: "[data-mobile-link]",
    allLinks: "[data-nav-link]"
  };
  
  function getIconMenu() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `;
  }
  
  function getIconClose() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `;
  }
  
  function setScrolledState() {
    const navbar = document.querySelector(SELECTORS.navbar);
    if (!navbar) return;
    
    if (window.scrollY > 12) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  
  function openMobileMenu() {
    const menu = document.querySelector(SELECTORS.mobileMenu);
    const toggle = document.querySelector(SELECTORS.menuToggle);
    
    if (!menu || !toggle) return;
    
    menu.classList.add("open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.innerHTML = getIconClose();
    document.body.style.overflow = "hidden";
  }
  
  function closeMobileMenu() {
    const menu = document.querySelector(SELECTORS.mobileMenu);
    const toggle = document.querySelector(SELECTORS.menuToggle);
    
    if (!menu || !toggle) return;
    
    menu.classList.remove("open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = getIconMenu();
    document.body.style.overflow = "";
  }
  
  function toggleMobileMenu() {
    const menu = document.querySelector(SELECTORS.mobileMenu);
    if (!menu) return;
    
    if (menu.classList.contains("open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
  
  function bindMobileMenu() {
    const toggle = document.querySelector(SELECTORS.menuToggle);
    const menu = document.querySelector(SELECTORS.mobileMenu);
    const mobileLinks = document.querySelectorAll(SELECTORS.mobileLinks);
    
    if (toggle) {
      toggle.innerHTML = getIconMenu();
      toggle.addEventListener("click", toggleMobileMenu);
    }
    
    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
    
    document.addEventListener("click", (event) => {
      if (!menu || !toggle) return;
      
      const clickedInsideMenu = menu.contains(event.target);
      const clickedToggle = toggle.contains(event.target);
      
      if (!clickedInsideMenu && !clickedToggle && menu.classList.contains("open")) {
        closeMobileMenu();
      }
    });
    
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        closeMobileMenu();
      }
    });
  }
  
  function markActiveLinks() {
    const allLinks = document.querySelectorAll(SELECTORS.allLinks);
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    
    allLinks.forEach((link) => {
      const href = link.getAttribute("href");
      
      if (
        (currentPage === "" || currentPage === "index.html") &&
        (href === "index.html" || href === "./" || href === "/")
      ) {
        link.classList.add("active");
      } else if (href === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
  
  function initNav() {
    setScrolledState();
    bindMobileMenu();
    markActiveLinks();
    window.addEventListener("scroll", setScrolledState, { passive: true });
  }
  
  window.CoderAnimeNav = {
    initNav,
    openMobileMenu,
    closeMobileMenu
  };
})();
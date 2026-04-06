/* =========================================================
   CoderAnimeMe - animate.js
   Reveal-on-scroll and subtle motion engine
   ========================================================= */

(function() {
  "use strict";
  
  function initReveal() {
    const revealItems = document.querySelectorAll(".reveal");
    
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("show"));
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
      }
    );
    
    revealItems.forEach((item) => observer.observe(item));
  }
  
  function initParallaxGlow() {
    const glows = document.querySelectorAll("[data-glow]");
    
    if (window.innerWidth < 981 || glows.length === 0) return;
    
    window.addEventListener("mousemove", (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      
      glows.forEach((glow, index) => {
        const speed = (index + 1) * 10;
        const moveX = (x - 0.5) * speed;
        const moveY = (y - 0.5) * speed;
        glow.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }
  
  function initAnimations() {
    initReveal();
    initParallaxGlow();
  }
  
  window.CoderAnimeAnimate = {
    initAnimations
  };
})();
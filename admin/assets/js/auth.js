/* =========================================================
   CoderAnimeMe Admin - auth.js
   SHA-256 password verification using Web Crypto API
   Uses localStorage for persistent login
   Stays logged in until explicit logout
   ========================================================= */
(function() {
  "use strict";
  
  const CONFIG_PATH = "../admin/config.json";
  const REDIRECT_DASHBOARD = "index.html";
  const REDIRECT_AUTH = "auth.html";
  
  /* ===================================================
     SHA-256 HASH USING WEB CRYPTO API
     Built into all modern browsers — no library needed
     =================================================== */
  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  
  /* ===================================================
     LOAD CONFIG
     Fetches admin/config.json for stored hashes
     =================================================== */
  async function loadConfig() {
    try {
      const res = await fetch(CONFIG_PATH, { cache: "no-store" });
      if (!res.ok) throw new Error("Config not found");
      return await res.json();
    } catch (err) {
      console.error("[Auth] Config load failed:", err);
      return null;
    }
  }
  
  /* ===================================================
     GET SESSION KEY
     Reads key name from config
     Falls back to default if config unavailable
     =================================================== */
  async function getSessionKey() {
    const config = await loadConfig();
    return config ? config.sessionKey || "cam-admin-auth" : "cam-admin-auth";
  }
  
  /* ===================================================
     IS AUTHENTICATED
     Checks localStorage for valid auth flag
     Persists across browser closes until logout
     =================================================== */
  async function isAuthenticated() {
    const key = await getSessionKey();
    return localStorage.getItem(key) === "granted";
  }
  
  /* ===================================================
     SET SESSION
     Writes auth flag to localStorage
     Stays until clearSession() is called
     =================================================== */
  async function setSession() {
    const key = await getSessionKey();
    localStorage.setItem(key, "granted");
  }
  
  /* ===================================================
     CLEAR SESSION
     Removes auth flag from localStorage
     Called on logout button click
     =================================================== */
  async function clearSession() {
    const key = await getSessionKey();
    localStorage.removeItem(key);
  }
  
  /* ===================================================
     VERIFY PASSWORD
     Hashes input and compares to stored hashes
     Supports multiple valid passwords
     =================================================== */
  async function verifyPassword(input) {
    const config = await loadConfig();
    if (!config || !Array.isArray(config.passwordHashes)) return false;
    
    const inputHash = await sha256(input);
    return config.passwordHashes.includes(inputHash);
  }
  
  /* ===================================================
     GUARD PAGE
     Call on every protected admin page
     Redirects to auth.html if not authenticated
     =================================================== */
  async function guardPage() {
    const authed = await isAuthenticated();
    if (!authed) {
      window.location.href = REDIRECT_AUTH;
    }
  }
  
  /* ===================================================
     INIT LOGIN FORM
     Only called from auth.html
     If already logged in goes straight to dashboard
     =================================================== */
  async function initLoginForm() {
    /* already logged in — skip straight to dashboard */
    const authed = await isAuthenticated();
    if (authed) {
      window.location.href = REDIRECT_DASHBOARD;
      return;
    }
    
    const form = document.querySelector("[data-login-form]");
    const input = document.querySelector("[data-password-input]");
    const errorMsg = document.querySelector("[data-login-error]");
    const submitBtn = document.querySelector("[data-login-submit]");
    
    if (!form || !input) return;
    
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const password = input.value.trim();
      if (!password) return;
      
      /* loading state */
      submitBtn.disabled = true;
      submitBtn.textContent = "Verifying...";
      if (errorMsg) errorMsg.style.display = "none";
      
      const valid = await verifyPassword(password);
      
      if (valid) {
        await setSession();
        window.location.href = REDIRECT_DASHBOARD;
      } else {
        if (errorMsg) {
          errorMsg.textContent = "Incorrect password. Please try again.";
          errorMsg.style.display = "block";
        }
        input.value = "";
        input.focus();
        submitBtn.disabled = false;
        submitBtn.textContent = "Enter Admin";
      }
    });
    
    /* show/hide password toggle */
    const toggleBtn = document.querySelector("[data-toggle-password]");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const type = input.getAttribute("type") === "password" ?
          "text" :
          "password";
        input.setAttribute("type", type);
        toggleBtn.textContent = type === "password" ? "Show" : "Hide";
      });
    }
  }
  
  /* ===================================================
     INIT LOGOUT
     Binds to any [data-logout] button on admin pages
     Clears localStorage and redirects to auth
     =================================================== */
  function initLogout() {
    document.querySelectorAll("[data-logout]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await clearSession();
        window.location.href = REDIRECT_AUTH;
      });
    });
  }
  
  /* ===================================================
     EXPORTS
     =================================================== */
  window.CoderAnimeAuth = {
    guardPage,
    isAuthenticated,
    verifyPassword,
    setSession,
    clearSession,
    initLoginForm,
    initLogout
  };
})();
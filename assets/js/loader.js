/* =========================================================
   CoderAnimeMe - loader.js
   JSON data loader
   - profile
   - skills
   - content index
   - all project files
   - all video files
   ========================================================= */

(function() {
  "use strict";
  
  async function fetchJSON(path) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      
      if (!response.ok) {
        throw new Error(`Failed to load ${path} (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("[Loader]", error);
      return null;
    }
  }
  
  async function loadProfile() {
    return await fetchJSON("assets/data/profile.json");
  }
  
  async function loadSkills() {
    const data = await fetchJSON("assets/data/skills.json");
    return data && Array.isArray(data.skills) ? data.skills : [];
  }
  
  async function loadIndex() {
    const data = await fetchJSON("assets/data/index.json");
    return data || { projects: [], videos: [] };
  }
  
  async function loadProjects() {
    const index = await loadIndex();
    const entries = Array.isArray(index.projects) ? index.projects : [];
    
    const files = await Promise.all(
      entries.map(async (item) => {
        const data = await fetchJSON(item.file);
        if (!data) return null;
        data._featured = !!item.featured;
        return data;
      })
    );
    
    return files.filter(Boolean);
  }
  
  async function loadVideos() {
    const index = await loadIndex();
    const entries = Array.isArray(index.videos) ? index.videos : [];
    
    const files = await Promise.all(
      entries.map(async (item) => {
        const data = await fetchJSON(item.file);
        if (!data) return null;
        data._featured = !!item.featured;
        return data;
      })
    );
    
    return files.filter(Boolean);
  }
  
  async function loadEverything() {
    const [profile, skills, projects, videos] = await Promise.all([
      loadProfile(),
      loadSkills(),
      loadProjects(),
      loadVideos()
    ]);
    
    return {
      profile,
      skills,
      projects,
      videos
    };
  }
  
  window.CoderAnimeLoader = {
    fetchJSON,
    loadProfile,
    loadSkills,
    loadIndex,
    loadProjects,
    loadVideos,
    loadEverything
  };
})();
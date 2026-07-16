/* =========================================================
   CoderAnimeMe Admin - storage.js
   localStorage registry for created content
   Tracks video IDs, project IDs, and content history
   ========================================================= */
(function() {
  "use strict";
  
  const KEYS = {
    videos: "cam-videos",
    projects: "cam-projects",
    lastVideoNum: "cam-last-video-num",
    lastProjNum: "cam-last-proj-num"
  };
  
  /* ===================================================
     SAFE JSON HELPERS
     =================================================== */
  function safeGet(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("[Storage] Read failed:", key, err);
      return null;
    }
  }
  
  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error("[Storage] Write failed:", key, err);
      return false;
    }
  }
  
  /* ===================================================
     VIDEO REGISTRY
     =================================================== */
  function getVideos() {
    return safeGet(KEYS.videos) || [];
  }
  
  function saveVideo(videoData) {
    const list = getVideos();
    const existing = list.findIndex((v) => v.id === videoData.id);
    if (existing !== -1) {
      list[existing] = videoData;
    } else {
      list.unshift(videoData);
    }
    safeSet(KEYS.videos, list);
  }
  
  function deleteVideo(id) {
    const list = getVideos().filter((v) => v.id !== id);
    safeSet(KEYS.videos, list);
  }
  
  function getVideoById(id) {
    return getVideos().find((v) => v.id === id) || null;
  }
  
  /* ===================================================
     PROJECT REGISTRY
     =================================================== */
  function getProjects() {
    return safeGet(KEYS.projects) || [];
  }
  
  function saveProject(projectData) {
    const list = getProjects();
    const existing = list.findIndex((p) => p.id === projectData.id);
    if (existing !== -1) {
      list[existing] = projectData;
    } else {
      list.unshift(projectData);
    }
    safeSet(KEYS.keys, list);
    safeSet(KEYS.projects, list);
  }
  
  function deleteProject(id) {
    const list = getProjects().filter((p) => p.id !== id);
    safeSet(KEYS.projects, list);
  }
  
  function getProjectById(id) {
    return getProjects().find((p) => p.id === id) || null;
  }
  
  /* ===================================================
     AUTO ID GENERATION
     Tracks last used number for video-XXX / project-XXX
     =================================================== */
  function getNextVideoId() {
    const last = safeGet(KEYS.lastVideoNum) || 0;
    const next = last + 1;
    return `video-${String(next).padStart(3, "0")}`;
  }
  
  function confirmVideoId(id) {
    const num = parseInt(id.replace("video-", ""), 10);
    if (!isNaN(num)) {
      const current = safeGet(KEYS.lastVideoNum) || 0;
      if (num > current) {
        safeSet(KEYS.lastVideoNum, num);
      }
    }
  }
  
  function getNextProjectId() {
    const last = safeGet(KEYS.lastProjNum) || 0;
    const next = last + 1;
    return `project-${String(next).padStart(3, "0")}`;
  }
  
  function confirmProjectId(id) {
    const num = parseInt(id.replace("project-", ""), 10);
    if (!isNaN(num)) {
      const current = safeGet(KEYS.lastProjNum) || 0;
      if (num > current) {
        safeSet(KEYS.lastProjNum, num);
      }
    }
  }
  
  /* ===================================================
     STATS
     =================================================== */
  function getStats() {
    const videos = getVideos();
    const projects = getProjects();
    
    return {
      totalVideos: videos.length,
      totalProjects: projects.length,
      lastVideoId: videos[0]?.id || "none",
      lastProjectId: projects[0]?.id || "none",
      nextVideoId: getNextVideoId(),
      nextProjectId: getNextProjectId()
    };
  }
  
  /* ===================================================
     EXPORT BACKUP
     Downloads full registry as JSON file
     =================================================== */
  function exportBackup() {
    const backup = {
      exportedAt: new Date().toISOString(),
      videos: getVideos(),
      projects: getProjects()
    };
    
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = `cam-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  /* ===================================================
     IMPORT BACKUP
     Restores registry from a backup JSON file
     =================================================== */
  function importBackup(jsonText) {
    try {
      const data = JSON.parse(jsonText);
      
      if (Array.isArray(data.videos)) {
        safeSet(KEYS.videos, data.videos);
        const maxVideo = data.videos.reduce((max, v) => {
          const num = parseInt(v.id.replace("video-", ""), 10);
          return isNaN(num) ? max : Math.max(max, num);
        }, 0);
        safeSet(KEYS.lastVideoNum, maxVideo);
      }
      
      if (Array.isArray(data.projects)) {
        safeSet(KEYS.projects, data.projects);
        const maxProj = data.projects.reduce((max, p) => {
          const num = parseInt(p.id.replace("project-", ""), 10);
          return isNaN(num) ? max : Math.max(max, num);
        }, 0);
        safeSet(KEYS.lastProjNum, maxProj);
      }
      
      return { success: true, message: "Backup restored successfully." };
    } catch (err) {
      return { success: false, message: "Invalid backup file." };
    }
  }
  
  /* ===================================================
     CLEAR ALL
     Full reset — use with caution
     =================================================== */
  function clearAll() {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  }
  
  /* ===================================================
     EXPORTS
     =================================================== */
  window.CoderAnimeStorage = {
    getVideos,
    saveVideo,
    deleteVideo,
    getVideoById,
    getProjects,
    saveProject,
    deleteProject,
    getProjectById,
    getNextVideoId,
    confirmVideoId,
    getNextProjectId,
    confirmProjectId,
    getStats,
    exportBackup,
    importBackup,
    clearAll
  };
})();
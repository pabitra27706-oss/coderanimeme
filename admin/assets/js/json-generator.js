/* =========================================================
   CoderAnimeMe Admin - json-generator.js
   Builds final JSON from form data
   Shared by both Mode A (manual) and Mode B (quick add)
   ========================================================= */
(function() {
  "use strict";
  
  /* ===================================================
     DATE HELPER
     Returns today as YYYY-MM-DD
     =================================================== */
  function todayDate() {
    return new Date().toISOString().split("T")[0];
  }
  
  /* ===================================================
     ID SLUG GENERATOR
     Converts title to clean kebab-case id
     =================================================== */
  function slugify(text = "") {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  
  /* ===================================================
     BUILD VIDEO JSON
     Takes raw form data object
     Returns clean video JSON object
     =================================================== */
  function buildVideoJSON(data = {}) {
    const id = data.id || `video-${String(Date.now()).slice(-3)}`;
    
    /* build files array */
    const files = (data.files || [])
      .filter((f) => f.name && f.name.trim())
      .map((f) => {
        const entry = {
          name: f.name.trim(),
          path: `assets/code/video/${id}/${f.name.trim()}`,
          language: f.language || "python"
        };
        if (f.directLink && f.directLink.trim()) {
          entry.directLink = f.directLink.trim();
        }
        return entry;
      });
    
    /* build final object — only include non-empty fields */
    const json = {
      id: id,
      title: data.title || "",
      description: data.description || "",
      longDescription: data.longDescription || "",
      category: data.category || "tutorial",
      tags: Array.isArray(data.tags) ?
        data.tags.filter(Boolean) :
        [],
      thumbnail: data.thumbnail ?
        `assets/images/videos/${id}/${data.thumbnail}` :
        "",
      youtubeUrl: data.youtubeUrl || "",
      youtubeId: data.youtubeId || null,
      datePublished: data.datePublished || todayDate(),
      duration: data.duration || null,
      relatedProject: data.relatedProject || null,
      sourceRepo: data.sourceRepo || "",
      hasLiveLink: !!data.hasLiveLink,
      liveLink: data.hasLiveLink && data.liveLink ?
        data.liveLink :
        null,
      files: files
    };
    
    return json;
  }
  
  /* ===================================================
     BUILD PROJECT JSON
     Takes raw form data object
     Returns clean project JSON object
     =================================================== */
  function buildProjectJSON(data = {}) {
    const id = data.id || `project-${String(Date.now()).slice(-3)}`;
    
    const json = {
      id: id,
      title: data.title || "",
      description: data.description || "",
      longDescription: data.longDescription || "",
      category: data.category || "python",
      tags: Array.isArray(data.tags) ?
        data.tags.filter(Boolean) :
        [],
      status: data.status || "coming-soon",
      thumbnail: data.thumbnail ?
        `assets/images/projects/${id}/${data.thumbnail}` :
        "",
      dateCreated: data.dateCreated || todayDate(),
      repoUrl: data.repoUrl || null,
      hasLiveLink: !!data.hasLiveLink,
      liveLink: data.hasLiveLink && data.liveLink ?
        data.liveLink :
        null,
      relatedVideo: data.relatedVideo || null,
      whatILearned: Array.isArray(data.whatILearned) ?
        data.whatILearned.filter(Boolean) :
        []
    };
    
    return json;
  }
  
  /* ===================================================
     FORMAT JSON STRING
     Pretty prints with 2 space indent
     =================================================== */
  function formatJSON(obj) {
    return JSON.stringify(obj, null, 2);
  }
  
  /* ===================================================
     DOWNLOAD JSON FILE
     Triggers browser download with correct filename
     =================================================== */
  function downloadJSON(obj, filename) {
    const json = formatJSON(obj);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  /* ===================================================
     COPY JSON TO CLIPBOARD
     =================================================== */
  async function copyJSON(obj, button) {
    const json = formatJSON(obj);
    try {
      await navigator.clipboard.writeText(json);
      const old = button.innerHTML;
      button.innerHTML = "✓ Copied!";
      button.style.color = "#31d0aa";
      setTimeout(() => {
        button.innerHTML = old;
        button.style.color = "";
      }, 1800);
    } catch (err) {
      console.error("[Generator] Copy failed:", err);
    }
  }
  
  /* ===================================================
     GENERATE FILENAME
     video-003.json or project-002.json
     =================================================== */
  function getFilename(id, type) {
    return `${id}.json`;
  }
  
  /* ===================================================
     GENERATE FILE PATH HINT
     Shows user where to place files after download
     =================================================== */
  function getPlacementHint(json, type) {
    if (type === "video") {
      const lines = [
        `Place JSON at:`,
        `  assets/data/videos/${json.id}.json`,
        ``,
        `Place code files at:`
      ];
      (json.files || []).forEach((f) => {
        lines.push(`  ${f.path}`);
      });
      if (json.thumbnail) {
        lines.push(``, `Place thumbnail at:`, `  ${json.thumbnail}`);
      }
      return lines.join("\n");
    }
    
    if (type === "project") {
      const lines = [
        `Place JSON at:`,
        `  assets/data/projects/${json.id}.json`
      ];
      if (json.thumbnail) {
        lines.push(``, `Place thumbnail at:`, `  ${json.thumbnail}`);
      }
      return lines.join("\n");
    }
    
    return "";
  }
  
  /* ===================================================
     EXPORTS
     =================================================== */
  window.CoderAnimeGenerator = {
    todayDate,
    slugify,
    buildVideoJSON,
    buildProjectJSON,
    formatJSON,
    downloadJSON,
    copyJSON,
    getFilename,
    getPlacementHint
  };
})();
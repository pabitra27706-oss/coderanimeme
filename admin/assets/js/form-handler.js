/* =========================================================
   CoderAnimeMe Admin - form-handler.js
   Shared form filling logic
   Used by Mode B to pre-fill the editable form
   from parsed AI input JSON
   ========================================================= */
(function() {
  "use strict";
  
  /* ===================================================
     EXPECTED AI INPUT JSON SCHEMA — VIDEO
     {
       "title": "Rainbow Flower",
       "description": "Short desc",
       "longDescription": "Full explanation",
       "category": "tutorial",
       "duration": "05:30",
       "youtubeUrl": "https://youtube.com/...",
       "sourceRepo": "https://github.com/...",
       "tags": ["python", "turtle"],
       "files": [
         {
           "filename": "main.py",
           "language": "python",
           "directLink": ""
         },
         {
           "filename": "utils.py",
           "language": "python",
           "directLink": ""
         }
       ]
     }

     EXPECTED AI INPUT JSON SCHEMA — PROJECT
     {
       "title": "Task Manager",
       "description": "Short desc",
       "longDescription": "Full explanation",
       "category": "python",
       "status": "completed",
       "repoUrl": "https://github.com/...",
       "tags": ["python", "cli"],
       "whatILearned": [
         "How to use dictionaries",
         "How to handle user input"
       ]
     }
     =================================================== */
  
  /* ===================================================
     PARSE AI INPUT JSON
     Safely parses pasted JSON text
     Returns { success, data, error }
     =================================================== */
  function parseInputJSON(text = "") {
    try {
      const data = JSON.parse(text.trim());
      if (typeof data !== "object" || Array.isArray(data)) {
        return {
          success: false,
          error: "Input must be a JSON object { ... } not an array."
        };
      }
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: `JSON parse error: ${err.message}`
      };
    }
  }
  
  /* ===================================================
     DETECT TYPE FROM INPUT JSON
     Checks for video-specific or project-specific fields
     Returns "video" | "project" | "unknown"
     =================================================== */
  function detectType(data = {}) {
    const videoFields = ["youtubeUrl", "duration", "files"];
    const projectFields = ["repoUrl", "status", "whatILearned"];
    
    const hasVideoField = videoFields.some((f) => f in data);
    const hasProjectField = projectFields.some((f) => f in data);
    
    if (hasVideoField && !hasProjectField) return "video";
    if (hasProjectField && !hasVideoField) return "project";
    if (hasVideoField && hasProjectField) return "video";
    return "unknown";
  }
  
  /* ===================================================
     NORMALIZE VIDEO INPUT
     Fills in missing fields with safe defaults
     Normalizes "filename" → "name" in files array
     =================================================== */
  function normalizeVideoInput(data = {}, suggestedId = "") {
    const files = (data.files || []).map((f) => ({
      name: f.filename || f.name || "main.py",
      language: f.language || "python",
      directLink: f.directLink || ""
    }));
    
    return {
      id: suggestedId,
      title: data.title || "",
      description: data.description || "",
      longDescription: data.longDescription || "",
      category: data.category || "tutorial",
      tags: Array.isArray(data.tags) ? data.tags : [],
      youtubeUrl: data.youtubeUrl || "",
      youtubeId: data.youtubeId || "",
      duration: data.duration || "",
      sourceRepo: data.sourceRepo || "",
      relatedProject: data.relatedProject || "",
      thumbnail: data.thumbnail || "",
      hasLiveLink: !!data.hasLiveLink,
      liveLink: data.liveLink || "",
      files
    };
  }
  
  /* ===================================================
     NORMALIZE PROJECT INPUT
     Fills in missing fields with safe defaults
     =================================================== */
  function normalizeProjectInput(data = {}, suggestedId = "") {
    return {
      id: suggestedId,
      title: data.title || "",
      description: data.description || "",
      longDescription: data.longDescription || "",
      category: data.category || "python",
      status: data.status || "coming-soon",
      tags: Array.isArray(data.tags) ? data.tags : [],
      repoUrl: data.repoUrl || "",
      relatedVideo: data.relatedVideo || "",
      thumbnail: data.thumbnail || "",
      hasLiveLink: !!data.hasLiveLink,
      liveLink: data.liveLink || "",
      whatILearned: Array.isArray(data.whatILearned) ?
        data.whatILearned :
        []
    };
  }
  
  /* ===================================================
     EXPORTS
     =================================================== */
  window.CoderAnimeFormHandler = {
    parseInputJSON,
    detectType,
    normalizeVideoInput,
    normalizeProjectInput
  };
})();
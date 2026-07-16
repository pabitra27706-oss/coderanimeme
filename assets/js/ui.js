(function() {
  "use strict";
  
  /* ===================================================
     ICONS
     =================================================== */
  function iconCode() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 8L4 12L8 16M16 8L20 12L16 16M14 5L10 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  
  function iconPlay() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 6.5V17.5L17 12L8 6.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `;
  }
  
  function iconGithub() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 19C4 20.5 4 16.5 2 16M16 22V18.13C16.0375 17.6532 15.9731 17.1738 15.811 16.723C15.6489 16.2722 15.3929 15.8618 15.06 15.52C18.2 15.17 21.5 13.98 21.5 8.52C21.4997 7.12383 20.9627 5.7814 20 4.77C20.4559 3.54851 20.4236 2.19835 19.91 1C19.91 1 18.73 0.65 16 2.48C13.708 1.85999 11.292 1.85999 9 2.48C6.27 0.65 5.09 1 5.09 1C4.57638 2.19835 4.54414 3.54851 5 4.77C4.03013 5.7889 3.49252 7.14136 3.5 8.55C3.5 13.97 6.8 15.16 9.94 15.55C9.611 15.888 9.35658 16.2936 9.19468 16.7388C9.03279 17.184 8.96721 17.6578 9.002 18.13V22" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  
  function iconYoutube() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M22.54 6.42A2.78 2.78 0 0 0 20.58 4.46C18.88 4 12 4 12 4S5.12 4 3.42 4.46A2.78 2.78 0 0 0 1.46 6.42A29 29 0 0 0 1 12A29 29 0 0 0 1.46 17.58A2.78 2.78 0 0 0 3.42 19.54C5.12 20 12 20 12 20S18.88 20 20.58 19.54A2.78 2.78 0 0 0 22.54 17.58A29 29 0 0 0 23 12A29 29 0 0 0 22.54 6.42Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M10 15L16 12L10 9V15Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>
    `;
  }
  
  function iconArrowRight() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  
  function iconSpark() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `;
  }
  
  function iconDownload() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3V15M12 15L8 11M12 15L16 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `;
  }
  
  function iconZip() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M12 11V13M12 15V17M10 11H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `;
  }
  
  function iconGlobe() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21M12 3C12 3 16 7 16 12C16 17 12 21 12 21M3 12H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `;
  }
  
  /* ===================================================
     AUTO THUMBNAIL HELPER
     =================================================== */
  function getCategoryClass(category = "") {
    const cat = category.toLowerCase();
    if (cat.includes("python")) return "cat-python";
    if (cat.includes("tutorial")) return "cat-tutorial";
    if (cat.includes("creative")) return "cat-creative";
    if (cat.includes("web") || cat.includes("frontend")) return "cat-web";
    if (cat.includes("tool") || cat.includes("project")) return "cat-tool";
    return "cat-default";
  }
  
  function renderAutoThumb(title = "", category = "", badge = "") {
    const catClass = getCategoryClass(category);
    return `
      <div class="auto-thumb ${catClass}">
        <span class="auto-thumb-title">${title}</span>
        <span class="auto-thumb-badge">${badge || category || "Project"}</span>
      </div>
    `;
  }
  
  /* ===================================================
     BADGE LIST
     =================================================== */
  function renderBadgeList(tags = []) {
    return tags.map((tag) => `<span class="badge">${tag}</span>`).join("");
  }
  
  /* ===================================================
     STATUS HELPERS
     =================================================== */
  function getStatusClass(status = "") {
    if (status === "completed") return "completed";
    if (status === "in-progress") return "progress";
    return "coming-soon";
  }
  
  function getStatusLabel(status = "") {
    if (status === "completed") return "Completed";
    if (status === "in-progress") return "In Progress";
    return "Coming Soon";
  }
  
  /* ===================================================
     PROJECT CARD
     =================================================== */
  function renderProjectCard(project = {}) {
    const title = project.title || "Untitled Project";
    const description = project.description || "Project description coming soon.";
    const tags = Array.isArray(project.tags) ? project.tags.filter(Boolean) : [];
    const statusClass = getStatusClass(project.status);
    const statusLabel = getStatusLabel(project.status);
    
    const thumbHTML = project.thumbnail ?
      `<img src="${project.thumbnail}" alt="${title} project thumbnail" loading="lazy">` :
      renderAutoThumb(title, project.category || "", "Project");
    
    return `
      <article class="card reveal">
        <div class="project-thumb">
          ${thumbHTML}
        </div>
        <div class="card-body">
          <div class="card-topline">
            <h3>${title}</h3>
            <span class="status ${statusClass}">${statusLabel}</span>
          </div>
          <p>${description}</p>
          <div class="badges">${renderBadgeList(tags)}</div>
          <div class="project-links">
            <a class="btn btn-primary btn-small" href="project.html?id=${project.id}">
              ${iconArrowRight()} Details
            </a>
            ${project.repoUrl ? `
              <a class="btn btn-ghost btn-small" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">
                ${iconGithub()} Repo
              </a>
            ` : ""}
            ${project.hasLiveLink && project.liveLink ? `
              <a class="btn btn-ghost btn-small" href="${project.liveLink}" target="_blank" rel="noopener noreferrer">
                ${iconGlobe()} Live
              </a>
            ` : ""}
          </div>
        </div>
      </article>
    `;
  }
  
  /* ===================================================
     VIDEO CARD
     =================================================== */
  function renderVideoCard(video = {}) {
    const title = video.title || "Untitled Video";
    const description = video.description || "Video description coming soon.";
    const tags = Array.isArray(video.tags) ? video.tags.filter(Boolean) : [];
    
    const thumbHTML = video.thumbnail ?
      `<img src="${video.thumbnail}" alt="${title} video thumbnail" loading="lazy">` :
      renderAutoThumb(title, video.category || "tutorial", "Tutorial");
    
    return `
      <article class="card reveal">
        <div class="video-thumb">
          ${thumbHTML}
        </div>
        <div class="card-body">
          <div class="card-topline">
            <h3>${title}</h3>
            <span class="status coming-soon">${video.category || "Video"}</span>
          </div>
          <p>${description}</p>
          <div class="badges">${renderBadgeList(tags)}</div>
          <div class="video-links">
            <a class="btn btn-primary btn-small" href="video.html?id=${video.id}">
              ${iconCode()} Code Page
            </a>
            ${video.youtubeUrl ? `
              <a class="btn btn-ghost btn-small" href="${video.youtubeUrl}" target="_blank" rel="noopener noreferrer">
                ${iconYoutube()} Watch
              </a>
            ` : ""}
            ${video.hasLiveLink && video.liveLink ? `
              <a class="btn btn-ghost btn-small" href="${video.liveLink}" target="_blank" rel="noopener noreferrer">
                ${iconGlobe()} Live
              </a>
            ` : ""}
          </div>
        </div>
      </article>
    `;
  }
  
  /* ===================================================
     SKILL CARD
     =================================================== */
  function renderSkillCard(skill = {}) {
    const name = skill.name || "Skill";
    const level = skill.level || "learning";
    const category = skill.category || "tech";
    
    return `
      <article class="card skill-box reveal">
        <div class="skill-icon-wrap">
          ${iconSpark()}
        </div>
        <h3>${name}</h3>
        <p>${category}</p>
        <div class="badges">
          <span class="badge">${level}</span>
        </div>
      </article>
    `;
  }
  
  /* ===================================================
     EXPORTS
     =================================================== */
  window.CoderAnimeUI = {
    iconCode,
    iconPlay,
    iconGithub,
    iconYoutube,
    iconArrowRight,
    iconSpark,
    iconDownload,
    iconZip,
    iconGlobe,
    getCategoryClass,
    renderAutoThumb,
    renderBadgeList,
    renderProjectCard,
    renderVideoCard,
    renderSkillCard
  };
})();
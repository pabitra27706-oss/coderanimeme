(function() {
  "use strict";
  
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
  
  function renderBadgeList(tags = []) {
    return tags.map((tag) => `<span class="badge">${tag}</span>`).join("");
  }
  
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
  
  function renderProjectCard(project = {}) {
    const title = project.title || "Untitled Project";
    const description = project.description || "Project description coming soon.";
    const tags = Array.isArray(project.tags) ? project.tags.filter(Boolean) : [];
    const statusClass = getStatusClass(project.status);
    const statusLabel = getStatusLabel(project.status);
    
    return `
      <article class="card reveal">
        <div class="project-thumb">
          ${project.thumbnail ? `<img src="${project.thumbnail}" alt="${title} project thumbnail" loading="lazy">` : ""}
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
          </div>
        </div>
      </article>
    `;
  }
  
  function renderVideoCard(video = {}) {
    const title = video.title || "Untitled Video";
    const description = video.description || "Video description coming soon.";
    const tags = Array.isArray(video.tags) ? video.tags.filter(Boolean) : [];
    
    return `
      <article class="card reveal">
        <div class="video-thumb">
          ${video.thumbnail ? `<img src="${video.thumbnail}" alt="${title} video thumbnail" loading="lazy">` : ""}
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
          </div>
        </div>
      </article>
    `;
  }
  
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
  
  window.CoderAnimeUI = {
    iconCode,
    iconPlay,
    iconGithub,
    iconYoutube,
    iconArrowRight,
    iconSpark,
    renderBadgeList,
    renderProjectCard,
    renderVideoCard,
    renderSkillCard
  };
})();
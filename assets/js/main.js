(function() {
  "use strict";
  
  function fillYear() {
    document.querySelectorAll("[data-year]").forEach((item) => {
      item.textContent = new Date().getFullYear();
    });
  }
  
  function renderEmptyCard(title, text, buttonLabel, buttonHref) {
    return `
      <article class="card reveal">
        <div class="card-body">
          <div class="kicker" style="margin-bottom:18px;">Content Preparing</div>
          <h3>${title}</h3>
          <p>${text}</p>
          <div class="btn-row">
            <a class="btn btn-primary btn-small" href="${buttonHref}">
              ${buttonLabel}
            </a>
          </div>
        </div>
      </article>
    `;
  }
  
  function renderHomePreviewProjects(projects) {
    const wrap = document.querySelector("[data-home-projects]");
    if (!wrap) return;
    
    if (!projects || !projects.length) {
      wrap.innerHTML = renderEmptyCard(
        "Projects are being prepared",
        "The first showcased build will appear here soon as the public coding archive begins to grow.",
        "Open Projects Page",
        "projects.html"
      );
      return;
    }
    
    const featured = projects.slice(0, 3);
    wrap.innerHTML = featured
      .map((item) => window.CoderAnimeUI.renderProjectCard(item))
      .join("");
  }
  
  function renderHomePreviewVideos(videos) {
    const wrap = document.querySelector("[data-home-videos]");
    if (!wrap) return;
    
    if (!videos || !videos.length) {
      wrap.innerHTML = renderEmptyCard(
        "Videos are on the way",
        "The creator video archive will begin here with walkthroughs, explanations, and build logs.",
        "Open Videos Page",
        "videos.html"
      );
      return;
    }
    
    const featured = videos.slice(0, 3);
    wrap.innerHTML = featured
      .map((item) => window.CoderAnimeUI.renderVideoCard(item))
      .join("");
  }
  
  function renderSkills(skills) {
    const wrap = document.querySelector("[data-skills-grid]");
    if (!wrap) return;
    
    if (!skills || !skills.length) {
      wrap.innerHTML = renderEmptyCard(
        "Skills will be added soon",
        "Technologies and learning progress will appear here as the stack grows.",
        "Read About",
        "about.html"
      );
      return;
    }
    
    wrap.innerHTML = skills
      .slice(0, 6)
      .map((item) => window.CoderAnimeUI.renderSkillCard(item))
      .join("");
  }
  
  function renderAboutMini(profile) {
    const targets = document.querySelectorAll("[data-profile-name]");
    targets.forEach((node) => {
      node.textContent = profile?.name || "CoderAnimeMe";
    });
    
    const aboutTargets = document.querySelectorAll("[data-profile-focus]");
    aboutTargets.forEach((node) => {
      node.textContent = profile?.currentFocus || "Python & Creative Coding";
    });
  }
  
  async function renderByPage() {
    const data = await window.CoderAnimeLoader.loadEverything();
    
    renderAboutMini(data.profile);
    renderSkills(data.skills);
    renderHomePreviewProjects(data.projects);
    renderHomePreviewVideos(data.videos);
    
    document.querySelectorAll("[data-projects-grid]").forEach((wrap) => {
      if (!data.projects || !data.projects.length) {
        wrap.innerHTML = renderEmptyCard(
          "No public projects yet",
          "The first project will be published soon. This page is already prepared to showcase the journey properly.",
          "Back Home",
          "index.html"
        );
        return;
      }
      
      wrap.innerHTML = data.projects
        .map((item) => window.CoderAnimeUI.renderProjectCard(item))
        .join("");
    });
    
    document.querySelectorAll("[data-videos-grid]").forEach((wrap) => {
      if (!data.videos || !data.videos.length) {
        wrap.innerHTML = renderEmptyCard(
          "No public videos yet",
          "The first video will be added soon and connected with projects and creator updates.",
          "Visit YouTube",
          "https://youtube.com/@coderanimeme"
        );
        return;
      }
      
      wrap.innerHTML = data.videos
        .map((item) => window.CoderAnimeUI.renderVideoCard(item))
        .join("");
    });
    
    if (window.CoderAnimeAnimate) {
      window.CoderAnimeAnimate.initAnimations();
    }
  }
  
  function initAll() {
    if (window.CoderAnimeTheme) {
      window.CoderAnimeTheme.initTheme();
    }
    
    if (window.CoderAnimeNav) {
      window.CoderAnimeNav.initNav();
    }
    
    fillYear();
    renderByPage();
  }
  
  document.addEventListener("DOMContentLoaded", initAll);
})();
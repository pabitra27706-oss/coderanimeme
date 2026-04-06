(function () {
  "use strict";

  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  async function fetchTextFile(path) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Unable to load file: ${path}`);
      }
      return await response.text();
    } catch (error) {
      console.error("[Detail] Text file load failed:", error);
      return null;
    }
  }

  function escapeHTML(text = "") {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function setPageMeta(title, description) {
    if (title) document.title = title;

    const desc = document.querySelector('meta[name="description"]');
    if (desc && description) {
      desc.setAttribute("content", description);
    }
  }

  function findById(items, id) {
    return Array.isArray(items) ? items.find((item) => item.id === id) : null;
  }

  function createButton(label, href, className = "btn btn-ghost", external = false, icon = "") {
    if (!href) return "";
    return `
      <a href="${href}" class="${className}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        ${icon}
        ${label}
      </a>
    `;
  }

  function renderProjectDetail(project, allVideos) {
    const root = document.querySelector("[data-detail-root]");
    if (!root || !project) return;

    const relatedVideo = findById(allVideos, project.relatedVideo);

    setPageMeta(
      `${project.title} | CoderAnimeMe`,
      project.description || "Project detail page"
    );

    root.innerHTML = `
      <section class="detail-hero">
        <div class="container">
          <div class="detail-header">
            <div class="reveal">
              <div class="kicker">Project Detail</div>
              <h1>${project.title}</h1>
              <p>${project.longDescription || project.description || ""}</p>

              <div class="badges">
                ${(project.tags || []).map(tag => `<span class="badge">${tag}</span>`).join("")}
              </div>

              <div class="detail-actions">
                ${createButton(
                  "Repository",
                  project.repoUrl,
                  "btn btn-primary",
                  true,
                  window.CoderAnimeUI.iconGithub()
                )}
                ${createButton(
                  "Live Website",
                  project.liveUrl,
                  "btn btn-secondary",
                  true,
                  window.CoderAnimeUI.iconArrowRight()
                )}
                ${relatedVideo ? createButton(
                  "Related Video",
                  `video.html?id=${relatedVideo.id}`,
                  "btn btn-ghost",
                  false,
                  window.CoderAnimeUI.iconPlay()
                ) : ""}
              </div>
            </div>

            <div class="reveal">
              <div class="detail-thumb">
                ${project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.title} project thumbnail">` : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="container detail-content-grid">

          <div class="card detail-meta-box reveal">
            <h2>Project Overview</h2>
            <p>${project.description || ""}</p>

            <div class="list-clean">
              <li><strong>Status:</strong> ${project.status || "coming-soon"}</li>
              <li><strong>Category:</strong> ${project.category || "project"}</li>
              <li><strong>Date:</strong> ${project.dateCreated || "N/A"}</li>
            </div>
          </div>

          <div class="detail-sidebar">
            <article class="card notice-box reveal">
              <h3>What I learned</h3>
              <ul class="list-clean">
                ${(project.whatILearned || []).map(item => `<li>${item}</li>`).join("")}
              </ul>
            </article>

            <article class="card notice-box reveal">
              <h3>Source code access</h3>
              <p>
                This project uses a separate repository. The full source code lives on GitHub and is linked directly above.
              </p>
            </article>
          </div>

        </div>
      </section>
    `;

    if (window.CoderAnimeAnimate) {
      window.CoderAnimeAnimate.initAnimations();
    }
  }

  async function renderVideoDetail(video, allProjects) {
    const root = document.querySelector("[data-detail-root]");
    if (!root || !video) return;

    const relatedProject = findById(allProjects, video.relatedProject);

    setPageMeta(
      `${video.title} | CoderAnimeMe`,
      video.description || "Video detail page"
    );

    const fileHTML = await Promise.all(
      (video.files || []).map(async (file, index) => {
        const content = await fetchTextFile(file.path);
        const safeContent = escapeHTML(content || "File could not be loaded.");

        return `
          <article class="card code-file-card reveal" data-code-file>
            <div class="code-file-header">
              <div class="code-file-meta">
                <span class="code-file-name">${file.name}</span>
                <span class="code-file-lang">${file.language || "text"}</span>
              </div>

              <button class="copy-btn" data-copy-file="${index}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                  <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M5 15V7C5 5.89543 5.89543 5 7 5H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
                Copy
              </button>
            </div>

            <div class="code-block-wrap">
              <pre class="code-block" data-code-content="${index}">${safeContent}</pre>
            </div>
          </article>
        `;
      })
    );

    root.innerHTML = `
      <section class="detail-hero">
        <div class="container">
          <div class="detail-header">
            <div class="reveal">
              <div class="kicker">Video Resource</div>
              <h1>${video.title}</h1>
              <p>${video.longDescription || video.description || ""}</p>

              <div class="badges">
                ${(video.tags || []).map(tag => `<span class="badge">${tag}</span>`).join("")}
              </div>

              <div class="detail-actions">
                ${createButton(
                  "Watch Video",
                  video.youtubeUrl,
                  "btn btn-primary",
                  true,
                  window.CoderAnimeUI.iconYoutube()
                )}
                ${createButton(
                  "Source Repository",
                  video.sourceRepo,
                  "btn btn-secondary",
                  true,
                  window.CoderAnimeUI.iconGithub()
                )}
                ${createButton(
                  "Website Link",
                  video.websiteLink,
                  "btn btn-ghost",
                  true,
                  window.CoderAnimeUI.iconArrowRight()
                )}
                ${relatedProject ? createButton(
                  "Related Project",
                  `project.html?id=${relatedProject.id}`,
                  "btn btn-ghost",
                  false,
                  window.CoderAnimeUI.iconCode()
                ) : ""}
              </div>
            </div>

            <div class="reveal">
              <div class="detail-thumb">
                ${video.thumbnail ? `<img src="${video.thumbnail}" alt="${video.title} video thumbnail">` : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="container detail-content-grid">

          <div>
            <article class="card detail-meta-box reveal">
              <div class="code-toolbar">
                <div>
                  <h2 style="margin-bottom:6px;">Source Files</h2>
                  <p style="margin:0;">Tap any file to copy its code instantly.</p>
                </div>

                <button class="btn btn-primary btn-small" data-copy-all>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                    <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
                    <path d="M5 15V7C5 5.89543 5.89543 5 7 5H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                  Copy All
                </button>
              </div>

              <div class="code-section">
                ${fileHTML.join("")}
              </div>
            </article>
          </div>

          <div class="detail-sidebar">
            <article class="card notice-box reveal">
              <h3>Video Summary</h3>
              <p>${video.description || ""}</p>
              <div class="list-clean">
                <li><strong>Category:</strong> ${video.category || "video"}</li>
                <li><strong>Date:</strong> ${video.datePublished || "N/A"}</li>
                <li><strong>Duration:</strong> ${video.duration || "N/A"}</li>
              </div>
            </article>

            <article class="card notice-box reveal">
              <h3>How to use this page</h3>
              <p>
                You can copy each file separately or use the Copy All button to get all code in one combined text block.
              </p>
            </article>
          </div>

        </div>
      </section>
    `;

    bindCopyButtons(video.files || []);

    if (window.CoderAnimeAnimate) {
      window.CoderAnimeAnimate.initAnimations();
    }
  }

  function bindCopyButtons(files) {
    const fileButtons = document.querySelectorAll("[data-copy-file]");
    const copyAllBtn = document.querySelector("[data-copy-all]");

    fileButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const index = Number(button.getAttribute("data-copy-file"));
        const file = files[index];
        if (!file) return;

        const content = await fetchTextFile(file.path);
        if (!content) return;

        const finalText = content;
        await copyText(finalText, button, "Copied");
      });
    });

    if (copyAllBtn) {
      copyAllBtn.addEventListener("click", async () => {
        let combined = "";

        for (const file of files) {
          const content = await fetchTextFile(file.path);
          combined += `===== ${file.name} =====\n`;
          combined += `${content || ""}\n\n`;
        }

        await copyText(combined.trim(), copyAllBtn, "Copied All");
      });
    }
  }

  async function copyText(text, button, successLabel) {
    try {
      await navigator.clipboard.writeText(text);
      const old = button.innerHTML;
      button.classList.add("copied");
      button.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${successLabel}
      `;

      setTimeout(() => {
        button.classList.remove("copied");
        button.innerHTML = old;
      }, 1600);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  function renderNotFound(type) {
    const root = document.querySelector("[data-detail-root]");
    if (!root) return;

    root.innerHTML = `
      <section class="detail-hero">
        <div class="container">
          <article class="card detail-meta-box">
            <div class="kicker">Not Found</div>
            <h1>${type} not found</h1>
            <p>The requested ${type.toLowerCase()} could not be loaded. Please return to the main page and try again.</p>
            <div class="detail-actions">
              <a href="index.html" class="btn btn-primary">Back Home</a>
            </div>
          </article>
        </div>
      </section>
    `;
  }

  async function initDetailPage() {
    const pageType = document.body.getAttribute("data-detail-type");
    if (!pageType) return;

    const id = getParam("id");
    if (!id) {
      renderNotFound(pageType);
      return;
    }

    const data = await window.CoderAnimeLoader.loadEverything();

    if (pageType === "project") {
      const project = findById(data.projects, id);
      if (!project) return renderNotFound("Project");
      renderProjectDetail(project, data.videos);
    }

    if (pageType === "video") {
      const video = findById(data.videos, id);
      if (!video) return renderNotFound("Video");
      renderVideoDetail(video, data.projects);
    }
  }

  document.addEventListener("DOMContentLoaded", initDetailPage);
})();
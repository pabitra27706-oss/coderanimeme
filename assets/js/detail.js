(function () {
  "use strict";

  /* ===================================================
     HELPERS
     =================================================== */
  function getParam(name) {
    return new URL(window.location.href).searchParams.get(name);
  }

  async function fetchTextFile(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(`Cannot load: ${path}`);
      return await res.text();
    } catch (err) {
      console.error("[Detail] File load failed:", err);
      return null;
    }
  }

  function setPageMeta(title, description) {
    if (title) document.title = title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && description) desc.setAttribute("content", description);
  }

  function findById(items, id) {
    return Array.isArray(items) ? items.find((i) => i.id === id) : null;
  }

  function createButton(label, href, className = "btn btn-ghost", external = false, icon = "") {
    if (!href) return "";
    return `
      <a href="${href}" class="${className}"
        ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        ${icon}${label}
      </a>
    `;
  }

  /* ===================================================
     LANGUAGE MAP
     Maps file extension or language string to Prism class
     =================================================== */
  function getPrismClass(language = "") {
    const map = {
      python:     "language-python",
      py:         "language-python",
      javascript: "language-javascript",
      js:         "language-javascript",
      css:        "language-css",
      html:       "language-markup",
      markup:     "language-markup",
      text:       "language-none",
      txt:        "language-none",
      none:       "language-none"
    };
    return map[language.toLowerCase()] || "language-none";
  }

  /* ===================================================
     DOWNLOAD — SINGLE FILE
     =================================================== */
  function downloadSingleFile(content, filename) {
    const blob = new Blob([content], { type: "text/plain" });
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
     DOWNLOAD — ZIP
     Only called when 2+ files exist
     Requires JSZip loaded via CDN in video.html
     =================================================== */
  async function downloadZip(files, videoId) {
    if (typeof JSZip === "undefined") {
      console.error("[Detail] JSZip not available.");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder(videoId);

    for (const file of files) {
      const content = await fetchTextFile(file.path);
      folder.file(file.name, content || "");
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoId}-code.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ===================================================
     COPY TO CLIPBOARD
     =================================================== */
  async function copyText(text, button, successLabel) {
    try {
      await navigator.clipboard.writeText(text);
      const old = button.innerHTML;
      button.classList.add("copied");
      button.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M5 13L9 17L19 7" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${successLabel}
      `;
      setTimeout(() => {
        button.classList.remove("copied");
        button.innerHTML = old;
      }, 1600);
    } catch (err) {
      console.error("[Detail] Copy failed:", err);
    }
  }

  /* ===================================================
     INJECT CODE + PRISM HIGHLIGHT
     Sets textContent safely then triggers Prism
     =================================================== */
  async function injectCodeContent(files) {
    for (let i = 0; i < files.length; i++) {
      const codeEl = document.querySelector(`[data-code-content="${i}"]`);
      if (!codeEl) continue;

      const content = await fetchTextFile(files[i].path);
      codeEl.textContent = content || "File could not be loaded.";

      if (typeof Prism !== "undefined") {
        Prism.highlightElement(codeEl);
      }
    }
  }

  /* ===================================================
     BUILD FILE CARD HTML
     Single file → copy + download
     Multi file  → copy + download per file
     =================================================== */
  function buildFileCardHTML(file, index) {
    const langClass = getPrismClass(file.language || "none");

    return `
      <article class="card code-file-card reveal" data-code-file>
        <div class="code-file-header">
          <div class="code-file-meta">
            <span class="code-file-name">${file.name}</span>
            <span class="code-file-lang">${file.language || "text"}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <button class="copy-btn" data-copy-file="${index}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <rect x="9" y="9" width="10" height="10" rx="2"
                  stroke="currentColor" stroke-width="1.8"/>
                <path d="M5 15V7C5 5.89543 5.89543 5 7 5H15"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              Copy
            </button>
            <button class="download-btn" data-download-file="${index}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M12 3V15M12 15L8 11M12 15L16 11"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                  stroke-linejoin="round"/>
                <path d="M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              Download
            </button>
          </div>
        </div>
        <div class="code-block-wrap">
          <pre><code class="${langClass}" data-code-content="${index}"></code></pre>
        </div>
      </article>
    `;
  }

  /* ===================================================
     BUILD TOOLBAR HTML
     Shows copy all always
     Shows ZIP button only when 2+ files
     =================================================== */
  function buildToolbarHTML(files) {
    const multiFile = files.length > 1;

    return `
      <div class="code-toolbar">
        <div>
          <h2 style="margin-bottom:6px;">Source Files</h2>
          <p style="margin:0;">
            Copy or download any file instantly.
          </p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
          <button class="btn btn-ghost btn-small" data-copy-all>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <rect x="9" y="9" width="10" height="10" rx="2"
                stroke="currentColor" stroke-width="1.8"/>
              <path d="M5 15V7C5 5.89543 5.89543 5 7 5H15"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            Copy All
          </button>
          ${multiFile ? `
            <button class="zip-download-btn" data-download-zip>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z"
                  stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                <path d="M14 2V8H20"
                  stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                <path d="M12 11V13M12 15V17M10 11H14"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              Download ZIP
            </button>
          ` : ""}
        </div>
      </div>
    `;
  }

  /* ===================================================
     BIND ALL BUTTONS
     Called after HTML is injected into DOM
     =================================================== */
  function bindFileButtons(files, videoId) {
    const multiFile = files.length > 1;

    /* per-file copy */
    document.querySelectorAll("[data-copy-file]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const index = Number(btn.getAttribute("data-copy-file"));
        const file = files[index];
        if (!file) return;
        const content = await fetchTextFile(file.path);
        if (content === null) return;
        await copyText(content, btn, "Copied");
      });
    });

    /* per-file download */
    document.querySelectorAll("[data-download-file]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const index = Number(btn.getAttribute("data-download-file"));
        const file = files[index];
        if (!file) return;
        const content = await fetchTextFile(file.path);
        if (content === null) return;
        downloadSingleFile(content, file.name);
      });
    });

    /* copy all */
    const copyAllBtn = document.querySelector("[data-copy-all]");
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

    /* zip download — only active when multiFile */
    const zipBtn = document.querySelector("[data-download-zip]");
    if (zipBtn && multiFile) {
      zipBtn.addEventListener("click", async () => {
        const original = zipBtn.innerHTML;
        zipBtn.disabled = true;
        zipBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor"
              stroke-width="1.8" stroke-dasharray="56" stroke-dashoffset="14"/>
          </svg>
          Zipping...
        `;
        await downloadZip(files, videoId);
        zipBtn.disabled = false;
        zipBtn.innerHTML = original;
      });
    }
  }

  /* ===================================================
     RENDER — NOT FOUND
     =================================================== */
  function renderNotFound(type) {
    const root = document.querySelector("[data-detail-root]");
    if (!root) return;

    const listPage = type === "Project" ? "projects.html" : "videos.html";

    root.innerHTML = `
      <section class="detail-hero">
        <div class="container">
          <article class="card detail-meta-box">
            <div class="kicker">Not Found</div>
            <h1>${type} not found</h1>
            <p>
              The requested ${type.toLowerCase()} could not be loaded.
              Please return and try again.
            </p>
            <div class="detail-actions">
              <a href="index.html" class="btn btn-primary">Back Home</a>
              <a href="${listPage}" class="btn btn-ghost">
                Browse All ${type}s
              </a>
            </div>
          </article>
        </div>
      </section>
    `;
  }

  /* ===================================================
     RENDER — PROJECT DETAIL
     =================================================== */
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
                ${(project.tags || [])
                  .map((t) => `<span class="badge">${t}</span>`)
                  .join("")}
              </div>

              <div class="detail-actions">
                ${createButton(
                  "Repository",
                  project.repoUrl,
                  "btn btn-primary",
                  true,
                  window.CoderAnimeUI.iconGithub()
                )}
                ${project.hasLiveLink && project.liveLink
                  ? createButton(
                      "View Live",
                      project.liveLink,
                      "btn btn-secondary",
                      true,
                      window.CoderAnimeUI.iconGlobe()
                    )
                  : ""
                }
                ${relatedVideo
                  ? createButton(
                      "Related Video",
                      `video.html?id=${relatedVideo.id}`,
                      "btn btn-ghost",
                      false,
                      window.CoderAnimeUI.iconPlay()
                    )
                  : ""
                }
              </div>
            </div>

            <div class="reveal">
              <div class="detail-thumb">
                ${project.thumbnail
                  ? `<img src="${project.thumbnail}"
                       alt="${project.title} thumbnail">`
                  : window.CoderAnimeUI.renderAutoThumb(
                      project.title,
                      project.category || "",
                      "Project"
                    )
                }
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
            <ul class="list-clean">
              <li><strong>Status:</strong> ${project.status || "coming-soon"}</li>
              <li><strong>Category:</strong> ${project.category || "project"}</li>
              <li><strong>Date:</strong> ${project.dateCreated || "N/A"}</li>
            </ul>
          </div>

          <div class="detail-sidebar">
            <article class="card notice-box reveal">
              <h3>What I learned</h3>
              <ul class="list-clean">
                ${(project.whatILearned || [])
                  .map((item) => `<li>${item}</li>`)
                  .join("")}
              </ul>
            </article>

            <article class="card notice-box reveal">
              <h3>Source code access</h3>
              <p>
                This project uses a separate repository.
                The full source code lives on GitHub
                and is linked directly above.
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

  /* ===================================================
     RENDER — VIDEO DETAIL
     =================================================== */
  async function renderVideoDetail(video, allProjects) {
    const root = document.querySelector("[data-detail-root]");
    if (!root || !video) return;

    const relatedProject = findById(allProjects, video.relatedProject);
    const files = video.files || [];

    setPageMeta(
      `${video.title} | CoderAnimeMe`,
      video.description || "Video detail page"
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
                ${(video.tags || [])
                  .map((t) => `<span class="badge">${t}</span>`)
                  .join("")}
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
                  "Source Repo",
                  video.sourceRepo,
                  "btn btn-secondary",
                  true,
                  window.CoderAnimeUI.iconGithub()
                )}
                ${video.hasLiveLink && video.liveLink
                  ? createButton(
                      "View Live",
                      video.liveLink,
                      "btn btn-ghost",
                      true,
                      window.CoderAnimeUI.iconGlobe()
                    )
                  : ""
                }
                ${relatedProject
                  ? createButton(
                      "Related Project",
                      `project.html?id=${relatedProject.id}`,
                      "btn btn-ghost",
                      false,
                      window.CoderAnimeUI.iconCode()
                    )
                  : ""
                }
              </div>
            </div>

            <div class="reveal">
              <div class="detail-thumb">
                ${video.thumbnail
                  ? `<img src="${video.thumbnail}"
                       alt="${video.title} thumbnail">`
                  : window.CoderAnimeUI.renderAutoThumb(
                      video.title,
                      video.category || "tutorial",
                      "Tutorial"
                    )
                }
              </div>
            </div>

          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="container detail-content-grid">

          <div>
            <article class="card detail-meta-box reveal">
              ${buildToolbarHTML(files)}
              <div class="code-section">
                ${files.length > 0
                  ? files.map((file, i) => buildFileCardHTML(file, i)).join("")
                  : `<p style="color:var(--text-3);padding:16px 0;">
                       No source files attached to this video yet.
                     </p>`
                }
              </div>
            </article>
          </div>

          <div class="detail-sidebar">
            <article class="card notice-box reveal">
              <h3>Video Summary</h3>
              <p>${video.description || ""}</p>
              <ul class="list-clean">
                <li><strong>Category:</strong> ${video.category || "video"}</li>
                <li><strong>Date:</strong> ${video.datePublished || "N/A"}</li>
                <li><strong>Duration:</strong> ${video.duration || "N/A"}</li>
              </ul>
            </article>

            <article class="card notice-box reveal">
              <h3>How to use this page</h3>
              <p>
                Copy any file individually or use Copy All
                for a combined text block.
                ${files.length > 1
                  ? "Use Download ZIP to get all files in one organized archive."
                  : "Use the Download button to save the file directly."
                }
              </p>
            </article>
          </div>

        </div>
      </section>
    `;

    await injectCodeContent(files);
    bindFileButtons(files, video.id);

    if (window.CoderAnimeAnimate) {
      window.CoderAnimeAnimate.initAnimations();
    }
  }

  /* ===================================================
     INIT
     =================================================== */
  async function initDetailPage() {
    const pageType = document.body.getAttribute("data-detail-type");
    if (!pageType) return;

    const id = getParam("id");
    if (!id) {
      renderNotFound(pageType === "project" ? "Project" : "Video");
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
      await renderVideoDetail(video, data.projects);
    }
  }

  document.addEventListener("DOMContentLoaded", initDetailPage);
})();
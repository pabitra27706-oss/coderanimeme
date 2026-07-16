/* =========================================================
   CoderAnimeMe Admin - quick-form.js
   Mode B — AI JSON paste → auto-fill editable form
   ========================================================= */
(function () {
  "use strict";

  const Gen     = window.CoderAnimeGenerator;
  const Storage = window.CoderAnimeStorage;
  const Handler = window.CoderAnimeFormHandler;

  /* ===================================================
     STATE
     =================================================== */
  let currentType = "video";
  let vTags       = null;
  let pTags       = null;
  let vFileCount  = 0;

  /* ===================================================
     TAGS INPUT SYSTEM
     =================================================== */
  function initTagsInput(wrapId, inputId) {
    const wrap  = document.getElementById(wrapId);
    const input = document.getElementById(inputId);
    let tags    = [];

    function renderTags() {
      wrap.querySelectorAll(".tag-chip").forEach((c) => c.remove());
      tags.forEach((tag, i) => {
        const chip = document.createElement("span");
        chip.className = "tag-chip";
        chip.innerHTML = `
          ${tag}
          <button type="button" class="tag-chip-remove"
            aria-label="Remove ${tag}">✕</button>
        `;
        chip.querySelector(".tag-chip-remove")
          .addEventListener("click", () => {
            tags.splice(i, 1);
            renderTags();
          });
        wrap.insertBefore(chip, input);
      });
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const val = input.value.trim().replace(/,$/, "");
        if (val && !tags.includes(val)) {
          tags.push(val);
          renderTags();
        }
        input.value = "";
      }
      if (e.key === "Backspace" && !input.value && tags.length) {
        tags.pop();
        renderTags();
      }
    });

    wrap.addEventListener("click", () => input.focus());

    return {
      getTags: ()  => [...tags],
      setTags: (t) => { tags = [...t]; renderTags(); },
      clear:   ()  => { tags = [];    renderTags(); }
    };
  }

  /* ===================================================
     FILE ENTRY BUILDER
     =================================================== */
  function addVideoFile(data = {}) {
    const idx  = vFileCount++;
    const list = document.getElementById("qv-files-list");
    const div  = document.createElement("div");
    div.className = "file-entry";
    div.dataset.fileIdx = idx;
    div.innerHTML = `
      <div class="file-entry-grid">
        <div class="field-group">
          <label class="field-label">Filename</label>
          <input class="field-input" type="text"
            placeholder="main.py" data-file-name
            value="${data.name || ""}">
        </div>
        <div class="field-group">
          <label class="field-label">Language</label>
          <select class="field-select" data-file-lang>
            <option value="python"
              ${(data.language || "python") === "python" ? "selected" : ""}>
              Python
            </option>
            <option value="javascript"
              ${data.language === "javascript" ? "selected" : ""}>
              JavaScript
            </option>
            <option value="css"
              ${data.language === "css" ? "selected" : ""}>CSS</option>
            <option value="html"
              ${data.language === "html" ? "selected" : ""}>HTML</option>
            <option value="text"
              ${data.language === "text" ? "selected" : ""}>Text</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Direct Link (optional)</label>
          <input class="field-input" type="url"
            placeholder="https://raw.github..."
            data-file-direct
            value="${data.directLink || ""}">
        </div>
        <button type="button" class="file-entry-remove"
          aria-label="Remove file">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
            <path d="M18 6L6 18M6 6L18 18"
              stroke="currentColor" stroke-width="1.8"
              stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    div.querySelector(".file-entry-remove")
      .addEventListener("click", () => div.remove());

    list.appendChild(div);
  }

  /* ===================================================
     WHAT I LEARNED ENTRY
     =================================================== */
  function addLearnedItem(value = "") {
    const list = document.getElementById("qp-learned-list");
    const div  = document.createElement("div");
    div.className = "learned-item";
    div.innerHTML = `
      <input class="field-input" type="text"
        placeholder="What did you learn?"
        data-learned-item
        value="${value}">
      <button type="button" class="learned-item-remove">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
          <path d="M18 6L6 18M6 6L18 18"
            stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round"/>
        </svg>
      </button>
    `;
    div.querySelector(".learned-item-remove")
      .addEventListener("click", () => div.remove());
    list.appendChild(div);
  }

  /* ===================================================
     FILL VIDEO FORM
     Sets all video form fields from normalized data
     =================================================== */
  function fillVideoForm(d = {}) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };

    set("qv-id",       d.id);
    set("qv-title",    d.title);
    set("qv-desc",     d.description);
    set("qv-longdesc", d.longDescription);
    set("qv-yt-url",   d.youtubeUrl);
    set("qv-yt-id",    d.youtubeId);
    set("qv-duration", d.duration);
    set("qv-repo",     d.sourceRepo);
    set("qv-related",  d.relatedProject);
    set("qv-thumb",    d.thumbnail);
    set("qv-live-url", d.liveLink);
    set("qv-date",     d.datePublished || Gen.todayDate());

    /* category select */
    const catEl = document.getElementById("qv-category");
    if (catEl && d.category) catEl.value = d.category;

    /* tags */
    if (vTags && d.tags) vTags.setTags(d.tags);

    /* live link toggle */
    const liveChk = document.getElementById("qv-has-live");
    const liveGrp = document.getElementById("qv-live-url-group");
    if (liveChk) {
      liveChk.checked = !!d.hasLiveLink;
      if (liveGrp) liveGrp.style.display = d.hasLiveLink ? "" : "none";
    }

    /* files */
    const list = document.getElementById("qv-files-list");
    if (list) {
      list.innerHTML = "";
      vFileCount = 0;
      if (d.files && d.files.length) {
        d.files.forEach((f) => addVideoFile(f));
      } else {
        addVideoFile();
      }
    }
  }

  /* ===================================================
     FILL PROJECT FORM
     Sets all project form fields from normalized data
     =================================================== */
  function fillProjectForm(d = {}) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };

    set("qp-id",       d.id);
    set("qp-title",    d.title);
    set("qp-desc",     d.description);
    set("qp-longdesc", d.longDescription);
    set("qp-repo",     d.repoUrl);
    set("qp-related",  d.relatedVideo);
    set("qp-thumb",    d.thumbnail);
    set("qp-live-url", d.liveLink);
    set("qp-date",     d.dateCreated || Gen.todayDate());

    /* selects */
    const catEl    = document.getElementById("qp-category");
    const statusEl = document.getElementById("qp-status");
    if (catEl    && d.category) catEl.value    = d.category;
    if (statusEl && d.status)   statusEl.value = d.status;

    /* tags */
    if (pTags && d.tags) pTags.setTags(d.tags);

    /* live link toggle */
    const liveChk = document.getElementById("qp-has-live");
    const liveGrp = document.getElementById("qp-live-url-group");
    if (liveChk) {
      liveChk.checked = !!d.hasLiveLink;
      if (liveGrp) liveGrp.style.display = d.hasLiveLink ? "" : "none";
    }

    /* what I learned */
    const learnedList = document.getElementById("qp-learned-list");
    if (learnedList) {
      learnedList.innerHTML = "";
      if (d.whatILearned && d.whatILearned.length) {
        d.whatILearned.forEach((item) => addLearnedItem(item));
      } else {
        addLearnedItem();
        addLearnedItem();
      }
    }
  }

  /* ===================================================
     COLLECT VIDEO FORM DATA
     =================================================== */
  function collectVideoData() {
    const files = [];
    document.querySelectorAll("#qv-files-list .file-entry")
      .forEach((entry) => {
        const name   = entry.querySelector("[data-file-name]").value.trim();
        const lang   = entry.querySelector("[data-file-lang]").value;
        const direct = entry.querySelector("[data-file-direct]").value.trim();
        if (name) files.push({ name, language: lang, directLink: direct });
      });

    return {
      id:              document.getElementById("qv-id").value.trim(),
      title:           document.getElementById("qv-title").value.trim(),
      description:     document.getElementById("qv-desc").value.trim(),
      longDescription: document.getElementById("qv-longdesc").value.trim(),
      category:        document.getElementById("qv-category").value,
      tags:            vTags ? vTags.getTags() : [],
      thumbnail:       document.getElementById("qv-thumb").value.trim(),
      youtubeUrl:      document.getElementById("qv-yt-url").value.trim(),
      youtubeId:       document.getElementById("qv-yt-id").value.trim() || null,
      datePublished:   document.getElementById("qv-date").value || Gen.todayDate(),
      duration:        document.getElementById("qv-duration").value.trim() || null,
      relatedProject:  document.getElementById("qv-related").value.trim() || null,
      sourceRepo:      document.getElementById("qv-repo").value.trim(),
      hasLiveLink:     document.getElementById("qv-has-live").checked,
      liveLink:        document.getElementById("qv-live-url").value.trim(),
      files
    };
  }

  /* ===================================================
     COLLECT PROJECT FORM DATA
     =================================================== */
  function collectProjectData() {
    const learned = [];
    document.querySelectorAll("[data-learned-item]").forEach((el) => {
      const val = el.value.trim();
      if (val) learned.push(val);
    });

    return {
      id:              document.getElementById("qp-id").value.trim(),
      title:           document.getElementById("qp-title").value.trim(),
      description:     document.getElementById("qp-desc").value.trim(),
      longDescription: document.getElementById("qp-longdesc").value.trim(),
      category:        document.getElementById("qp-category").value,
      status:          document.getElementById("qp-status").value,
      tags:            pTags ? pTags.getTags() : [],
      thumbnail:       document.getElementById("qp-thumb").value.trim(),
      dateCreated:     document.getElementById("qp-date").value || Gen.todayDate(),
      repoUrl:         document.getElementById("qp-repo").value.trim() || null,
      relatedVideo:    document.getElementById("qp-related").value.trim() || null,
      hasLiveLink:     document.getElementById("qp-has-live").checked,
      liveLink:        document.getElementById("qp-live-url").value.trim(),
      whatILearned:    learned
    };
  }

  /* ===================================================
     SHOW PREVIEW
     =================================================== */
  function showPreview(json, type) {
    const card   = document.getElementById("q-preview-card");
    const output = document.getElementById("q-json-output");
    const hint   = document.getElementById("q-placement-hint");

    card.style.display = "";
    output.textContent = Gen.formatJSON(json);
    hint.textContent   = Gen.getPlacementHint(json, type);
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ===================================================
     INIT — called from create-quick.html
     =================================================== */
  function init() {

    /* init tags */
    vTags = initTagsInput("qv-tags-wrap", "qv-tags-input");
    pTags = initTagsInput("qp-tags-wrap", "qp-tags-input");

    /* default one file entry */
    addVideoFile();

    /* default learned items */
    addLearnedItem();
    addLearnedItem();

    /* set today date defaults */
    const today = Gen.todayDate();
    const dvDate = document.getElementById("qv-date");
    const dpDate = document.getElementById("qp-date");
    if (dvDate) dvDate.value = today;
    if (dpDate) dpDate.value = today;

    /* -----------------------------------------------
       PARSE BUTTON
       ----------------------------------------------- */
    document.getElementById("q-parse-btn")
      .addEventListener("click", () => {
        const text     = document.getElementById("q-paste-area").value;
        const errorEl  = document.getElementById("q-parse-error");
        const successEl = document.getElementById("q-parse-success");

        errorEl.className   = "parse-error";
        successEl.className = "parse-success";

        const result = Handler.parseInputJSON(text);

        if (!result.success) {
          errorEl.textContent = result.error;
          errorEl.className   = "parse-error show";
          return;
        }

        /* detect type */
        const detected = Handler.detectType(result.data);
        const useType  = currentType;

        /* get next suggested ID */
        const suggestedId = currentType === "video"
          ? Storage.getNextVideoId()
          : Storage.getNextProjectId();

        /* fill appropriate form */
        if (useType === "video") {
          const normalized = Handler.normalizeVideoInput(
            result.data, suggestedId
          );
          fillVideoForm(normalized);
          document.getElementById("qv-form-section").style.display = "";
          document.getElementById("qp-form-section").style.display = "none";
        } else {
          const normalized = Handler.normalizeProjectInput(
            result.data, suggestedId
          );
          fillProjectForm(normalized);
          document.getElementById("qv-form-section").style.display = "none";
          document.getElementById("qp-form-section").style.display = "";
        }

        successEl.textContent = `JSON parsed. Form filled for ${useType}. Review and edit before downloading.`;
        successEl.className   = "parse-success show";

        /* scroll to form */
        document.getElementById("q-form-area")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      });

    /* -----------------------------------------------
       TAB SWITCHING
       ----------------------------------------------- */
    document.getElementById("q-tab-video")
      .addEventListener("click", () => {
        currentType = "video";
        setTab("video");
      });

    document.getElementById("q-tab-project")
      .addEventListener("click", () => {
        currentType = "project";
        setTab("project");
      });

    function setTab(type) {
      const tabV = document.getElementById("q-tab-video");
      const tabP = document.getElementById("q-tab-project");
      if (type === "video") {
        tabV.className = "btn btn-primary";
        tabP.className = "btn btn-ghost";
      } else {
        tabV.className = "btn btn-ghost";
        tabP.className = "btn btn-primary";
      }
    }

    /* check URL param */
    const urlType = new URLSearchParams(window.location.search).get("type");
    if (urlType === "project") {
      currentType = "project";
      setTab("project");
    } else {
      setTab("video");
    }

    /* -----------------------------------------------
       SUGGEST ID BUTTONS
       ----------------------------------------------- */
    document.getElementById("qv-suggest-id")
      .addEventListener("click", () => {
        document.getElementById("qv-id").value =
          Storage.getNextVideoId();
      });

    document.getElementById("qp-suggest-id")
      .addEventListener("click", () => {
        document.getElementById("qp-id").value =
          Storage.getNextProjectId();
      });

    /* -----------------------------------------------
       ADD FILE BUTTON
       ----------------------------------------------- */
    document.getElementById("qv-add-file")
      .addEventListener("click", () => addVideoFile());

    /* -----------------------------------------------
       ADD LEARNED BUTTON
       ----------------------------------------------- */
    document.getElementById("qp-add-learned")
      .addEventListener("click", () => addLearnedItem());

    /* -----------------------------------------------
       LIVE LINK TOGGLES
       ----------------------------------------------- */
    document.getElementById("qv-has-live")
      .addEventListener("change", (e) => {
        document.getElementById("qv-live-url-group").style.display =
          e.target.checked ? "" : "none";
      });

    document.getElementById("qp-has-live")
      .addEventListener("change", (e) => {
        document.getElementById("qp-live-url-group").style.display =
          e.target.checked ? "" : "none";
      });

    /* -----------------------------------------------
       VIDEO FORM SUBMIT
       ----------------------------------------------- */
    document.getElementById("qv-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const data = collectVideoData();
        if (!data.id || !data.title) return;
        const json = Gen.buildVideoJSON(data);
        Storage.saveVideo(json);
        Storage.confirmVideoId(json.id);
        Gen.downloadJSON(json, Gen.getFilename(json.id, "video"));
        showPreview(json, "video");
      });

    /* -----------------------------------------------
       VIDEO PREVIEW BUTTON
       ----------------------------------------------- */
    document.getElementById("qv-preview-btn")
      .addEventListener("click", () => {
        const data = collectVideoData();
        const json = Gen.buildVideoJSON(data);
        showPreview(json, "video");
      });

    /* -----------------------------------------------
       PROJECT FORM SUBMIT
       ----------------------------------------------- */
    document.getElementById("qp-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const data = collectProjectData();
        if (!data.id || !data.title) return;
        const json = Gen.buildProjectJSON(data);
        Storage.saveProject(json);
        Storage.confirmProjectId(json.id);
        Gen.downloadJSON(json, Gen.getFilename(json.id, "project"));
        showPreview(json, "project");
      });

    /* -----------------------------------------------
       PROJECT PREVIEW BUTTON
       ----------------------------------------------- */
    document.getElementById("qp-preview-btn")
      .addEventListener("click", () => {
        const data = collectProjectData();
        const json = Gen.buildProjectJSON(data);
        showPreview(json, "project");
      });

    /* -----------------------------------------------
       COPY + DOWNLOAD FROM PREVIEW
       ----------------------------------------------- */
    document.getElementById("q-copy-json")
      .addEventListener("click", (e) => {
        const isVideo = document.getElementById("qv-form-section")
          .style.display !== "none";
        const data = isVideo ? collectVideoData() : collectProjectData();
        const json = isVideo
          ? Gen.buildVideoJSON(data)
          : Gen.buildProjectJSON(data);
        Gen.copyJSON(json, e.currentTarget);
      });

    document.getElementById("q-download-json")
      .addEventListener("click", () => {
        const isVideo = document.getElementById("qv-form-section")
          .style.display !== "none";
        const data = isVideo ? collectVideoData() : collectProjectData();
        const json = isVideo
          ? Gen.buildVideoJSON(data)
          : Gen.buildProjectJSON(data);
        Gen.downloadJSON(json, Gen.getFilename(json.id,
          isVideo ? "video" : "project"));
      });

    /* -----------------------------------------------
       CLEAR PASTE AREA
       ----------------------------------------------- */
    document.getElementById("q-clear-btn")
      .addEventListener("click", () => {
        document.getElementById("q-paste-area").value = "";
        document.getElementById("q-parse-error").className   = "parse-error";
        document.getElementById("q-parse-success").className = "parse-success";
      });

  }

  /* ===================================================
     EXPORTS
     =================================================== */
  window.CoderAnimeQuickForm = { init };
})();
/* =====================================================================
   main.js — builds the pages from the files in /data.
   You shouldn't need to edit this to add projects; use data/*.js.
   ===================================================================== */
(function () {
  "use strict";

  const PROFILE = window.PROFILE || {};
  const PROJECTS = (window.PROJECTS || []).filter(p => !p.hidden);
  const UPDATES = window.UPDATES || [];

  const STATUS = {
    "completed":   { label: "Completed",   eye: "var(--s-completed)" },
    "in-progress": { label: "In progress", eye: "var(--s-in-progress)" },
    "upcoming":    { label: "Upcoming",    eye: "var(--s-upcoming)" },
    "paused":      { label: "Paused",      eye: "var(--s-paused)" }
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const statusBadge = s => `<span class="status ${esc(s)}">${esc((STATUS[s] || { label: s }).label)}</span>`;
  const projectUrl = p => `project.html?id=${encodeURIComponent(p.id)}`;
  const fmtDate = d => {
    const dt = new Date(d + "T12:00:00");
    return isNaN(dt) ? esc(d) : dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  function placeholder(p, i = 0) {
    const color = (STATUS[p.status] || STATUS.upcoming).eye;
    return `<div class="ph" style="--eye-color:${color};--delay:${(i * 0.7) % 4}s">
      <div class="eyes"><div class="eye"></div><div class="eye"></div></div>
      <span class="label">${esc(p.status === "paused" ? "paused" : "photos soon")}</span>
    </div>`;
  }

  function card(p, i) {
    const media = p.cover
      ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="${i < 3 ? "eager" : "lazy"}" decoding="async" width="1400" height="875">`
      : placeholder(p, i);
    return `<a class="card" href="${projectUrl(p)}">
      <div class="card-media">${media}</div>
      <div class="card-body">
        ${statusBadge(p.status)}
        <h3 class="card-title">${esc(p.title)}</h3>
        <p class="card-tag">${esc(p.tagline)}</p>
        <ul class="tags">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        ${p.progress && p.status !== "completed" ? `<p class="card-progress">${esc(p.progress)}</p>` : ""}
      </div>
    </a>`;
  }

  // ---------- shared: nav + footer ----------
  function initNav() {
    const btn = $(".nav-toggle"), list = $("#nav-links");
    if (btn && list) {
      btn.addEventListener("click", () => {
        const open = list.classList.toggle("open");
        btn.setAttribute("aria-expanded", open);
        btn.textContent = open ? "close" : "menu";
      });
      list.addEventListener("click", e => {
        if (e.target.tagName === "A") { list.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.textContent = "menu"; }
      });
    }
    const fn = $("#footer-name");
    if (fn && PROFILE.name) fn.textContent = `© ${new Date().getFullYear()} ${PROFILE.name}`;
  }

  // ---------- hero robot eyes ----------
  function initEyes(el) {
    if (!el) return;
    const face = el.closest(".face");
    let mood = "", idleTimer, moodTimer;

    const setMood = (m, ms) => {
      el.classList.remove("happy", "sleepy");
      mood = m;
      if (m) el.classList.add(m);
      clearTimeout(moodTimer);
      if (ms) moodTimer = setTimeout(() => setMood(""), ms);
    };
    const blink = () => {
      if (mood !== "sleepy") {
        el.classList.add("blink");
        setTimeout(() => el.classList.remove("blink"), 130);
      }
      setTimeout(blink, 2200 + Math.random() * 4200);
    };
    const resetIdle = () => {
      if (mood === "sleepy") setMood("");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setMood("sleepy"), 25000);
    };

    if (!reduceMotion) {
      setTimeout(blink, 1500);
      window.addEventListener("pointermove", e => {
        const r = face.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        const clamp = v => Math.max(-1, Math.min(1, v));
        el.style.transform = `translate(${clamp(dx * 2) * 14}%, ${clamp(dy * 2) * 16}%)`;
        resetIdle();
      }, { passive: true });
      resetIdle();
    }
    face.addEventListener("click", () => { setMood("happy", 1400); resetIdle(); });
  }

  // =================================================================
  // HOME PAGE
  // =================================================================
  function renderHome() {
    // Hero
    $("#hero-name").textContent = PROFILE.name || "";
    $("#hero-role").innerHTML = `<b>${esc(PROFILE.role || "")}</b>${PROFILE.school ? " · " + esc(PROFILE.school) : ""}`;
    $("#hero-tagline").textContent = PROFILE.tagline || "";
    initEyes($("#hero-eyes"));

    // Projects + filters
    const state = { status: "all", tag: null };
    const statusRow = $("#status-filters"), tagRow = $("#tag-filters"), grid = $("#project-grid");

    const statuses = ["all", ...Object.keys(STATUS).filter(s => PROJECTS.some(p => p.status === s))];
    statuses.forEach(s => {
      const n = s === "all" ? PROJECTS.length : PROJECTS.filter(p => p.status === s).length;
      const b = document.createElement("button");
      b.className = "chip"; b.dataset.status = s;
      b.innerHTML = `${s === "all" ? "All" : esc(STATUS[s].label)} <span class="n">${n}</span>`;
      b.setAttribute("aria-pressed", s === "all");
      b.onclick = () => { state.status = s; update(); };
      statusRow.appendChild(b);
    });

    // tags sorted by how often they appear
    const counts = {};
    PROJECTS.forEach(p => (p.tags || []).forEach(t => counts[t] = (counts[t] || 0) + 1));
    Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b)).forEach(t => {
      const b = document.createElement("button");
      b.className = "chip"; b.dataset.tag = t;
      b.textContent = t;
      b.setAttribute("aria-pressed", "false");
      b.onclick = () => { state.tag = state.tag === t ? null : t; update(); };
      tagRow.appendChild(b);
    });

    function update() {
      statusRow.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.status === state.status));
      tagRow.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.tag === state.tag));
      const list = PROJECTS.filter(p =>
        (state.status === "all" || p.status === state.status) &&
        (!state.tag || (p.tags || []).includes(state.tag)));
      grid.innerHTML = list.length
        ? list.map(card).join("")
        : `<div class="empty">no projects match that filter yet — check back soon</div>`;
      $("#project-count").textContent = `showing ${list.length} of ${PROJECTS.length}`;
    }
    update();

    // Build log
    const byId = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
    $("#log-list").innerHTML = UPDATES.length ? UPDATES.map(u => {
      const p = byId[u.project];
      return `<li>
        <time datetime="${esc(u.date)}">${fmtDate(u.date)}</time>${p ? ` · <a class="mono" style="font-size:12px" href="${projectUrl(p)}">${esc(p.title)}</a>` : ""}
        <h3>${esc(u.title)}</h3>
        <p>${esc(u.text)}</p>
      </li>`;
    }).join("") : `<li><p>No updates yet.</p></li>`;

    // About
    $("#bio").innerHTML = (PROFILE.bio || []).map(t => `<p>${esc(t)}</p>`).join("");
    $("#interests").innerHTML = (PROFILE.interests || []).map(t => `<li>${esc(t)}</li>`).join("");
    $("#experience").innerHTML = (PROFILE.experience || []).map(x => `
      <div class="xp-item">
        <h3>${esc(x.title)}</h3>
        <p class="meta">${esc(x.org)} · ${esc(x.dates)}</p>
        <p>${esc(x.text)}</p>
      </div>`).join("");
    $("#skills").innerHTML = (PROFILE.skills || []).map(g => `
      <div class="panel"><h3>${esc(g.group)}</h3>
        <ul>${g.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>`).join("");

    // Resume
    $("#resume-slot").innerHTML = PROFILE.resumeReady
      ? `<div class="btns"><a class="btn primary" href="${esc(PROFILE.resume)}" download>Download PDF ↓</a><a class="btn" href="${esc(PROFILE.resume)}" target="_blank" rel="noopener">Open in browser</a></div>`
      : `<div class="btns"><span class="btn" aria-disabled="true">Download PDF ↓</span></div><p class="soon" style="margin:12px 0 0">// resume PDF coming soon</p>`;

    // Contact
    const row = (k, v) => `<li><span class="k">${k}</span>${v}</li>`;
    const soon = `<span class="soon">coming soon</span>`;
    const short = url => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    $("#contact-list").innerHTML =
      row("email", PROFILE.email ? `<a href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a>` : soon) +
      row("github", PROFILE.github ? `<a href="${esc(PROFILE.github)}" target="_blank" rel="noopener">${esc(short(PROFILE.github))}</a>` : soon) +
      row("linkedin", PROFILE.linkedin ? `<a href="${esc(PROFILE.linkedin)}" target="_blank" rel="noopener">${esc(short(PROFILE.linkedin))}</a>` : soon) +
      row("school", esc(PROFILE.school || ""));

    // Highlight current section in nav
    const links = [...document.querySelectorAll(".nav-links a")];
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => entries.forEach(en => {
        if (en.isIntersecting) links.forEach(a => a.setAttribute("aria-current", a.getAttribute("href") === "#" + en.target.id));
      }), { rootMargin: "-45% 0px -50% 0px" });
      document.querySelectorAll("main section[id]").forEach(s => io.observe(s));
    }
  }

  // =================================================================
  // PROJECT DETAIL PAGE
  // =================================================================
  function renderProject() {
    const root = $("#project-root");
    const id = new URLSearchParams(location.search).get("id");
    const p = PROJECTS.find(x => x.id === id);

    if (!p) {
      root.innerHTML = `<div class="wrap detail-hero"><a class="back" href="index.html#projects">← all projects</a>
        <h1>Project not found</h1><p class="lead">That project doesn't exist (yet).</p></div>`;
      return;
    }
    document.title = `${p.title} · ${PROFILE.name || "Portfolio"}`;

    const gallery = p.gallery || [];
    const section = (title, html) => html ? `<section><h2>${title}</h2>${html}</section>` : "";

    const overview = (p.overview || []).map(t => `<p>${esc(t)}</p>`).join("");
    const built = (p.built || []).length ? `<ul class="built">${p.built.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : "";
    const challenges = (p.challenges || []).map(c => `
      <div class="challenge">
        <div class="q"><span class="k">Problem</span><p>${esc(c.problem)}</p></div>
        <div class="a"><span class="k">How I solved it</span><p>${esc(c.solution)}</p></div>
      </div>`).join("");
    const galleryHtml = gallery.length ? `<div class="gallery">${gallery.map((g, i) => `
      <figure style="margin:0"><button data-i="${i}" aria-label="Open image: ${esc(g.caption)}">
        <img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy" decoding="async" width="400" height="300">
      </button><figcaption>${esc(g.caption)}</figcaption></figure>`).join("")}</div>` : "";

    const parts = (p.parts || []).length ? `<div class="panel"><h3>Parts &amp; specs</h3>
      <table class="specs">${p.parts.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table></div>` : "";
    const links = (p.links || []).length ? `<div class="panel"><h3>Links</h3><div class="link-list">
      ${p.links.map(l => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} <span>↗</span></a>`).join("")}</div></div>` : "";
    const tags = `<div class="panel"><h3>Tech</h3><ul class="tags">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>`;

    const others = PROJECTS.filter(x => x.id !== p.id).slice(0, 4);

    root.innerHTML = `
      <div class="detail-hero"><div class="wrap">
        <a class="back" href="index.html#projects">← all projects</a><br>
        ${statusBadge(p.status)}
        <h1>${esc(p.title)}</h1>
        <p class="lead">${esc(p.tagline)}</p>
        ${p.progress && p.status !== "completed" ? `<p class="progress-line">status: ${esc(p.progress)}</p>` : ""}
        <ul class="tags">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        <div class="detail-cover">${p.cover ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" width="1400" height="700">` : placeholder(p)}</div>
      </div></div>
      <div class="wrap detail-body">
        <div>
          ${section("Overview", overview)}
          ${section(p.status === "completed" ? "What I designed &amp; built" : "What I'm designing", built)}
          ${section("Challenges &amp; solutions", challenges)}
          ${section("Gallery", galleryHtml)}
        </div>
        <aside>${parts}${links}${tags}</aside>
      </div>
      ${others.length ? `<section style="padding-top:24px"><div class="wrap">
        <p class="sec-label"><b>→</b> // more projects</p>
        <div class="more" style="margin-top:18px">${others.map(card).join("")}</div>
      </div></section>` : ""}`;

    // Lightbox
    const dlg = $("#lightbox");
    if (!gallery.length || !dlg || !dlg.showModal) return;
    let cur = 0;
    const show = i => {
      cur = (i + gallery.length) % gallery.length;
      $("#lb-img").src = gallery[cur].src;
      $("#lb-img").alt = gallery[cur].caption;
      $("#lb-cap").textContent = `${cur + 1} / ${gallery.length} · ${gallery[cur].caption}`;
    };
    root.querySelectorAll(".gallery button").forEach(b => b.addEventListener("click", () => { show(+b.dataset.i); dlg.showModal(); }));
    $("#lb-close").onclick = () => dlg.close();
    $("#lb-prev").onclick = () => show(cur - 1);
    $("#lb-next").onclick = () => show(cur + 1);
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }

  // ---------- boot ----------
  initNav();
  if (document.body.dataset.page === "home") renderHome();
  if (document.body.dataset.page === "project") renderProject();
})();

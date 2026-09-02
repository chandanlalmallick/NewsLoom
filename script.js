/* News Loom — dashboard + article logic (vanilla JS, no dependencies) */

const CATEGORIES = [
  { key: "geopolitics", label: "Geopolitics", full: "Geopolitics & World Affairs", emoji: "🌍" },
  { key: "science", label: "Science & Space", full: "Science & Space", emoji: "🚀" },
  { key: "climate", label: "Climate", full: "Climate & Environment", emoji: "🌱" },
  { key: "economy", label: "Economy", full: "Economy, Business & Markets", emoji: "💰" },
  { key: "tech", label: "Technology & AI", full: "Technology & AI", emoji: "🤖" },
  { key: "sports", label: "Sports & Culture", full: "Sports & Culture", emoji: "🎭" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));
const ARTICLES_BY_ID = Object.fromEntries(ARTICLES.map(a => [a.id, a]));

const SEARCH_CHIPS = ["World", "India", "AI", "Technology", "Science", "Climate", "Business", "Space", "Sports", "Culture"];

let state = {
  category: "all",
  query: "",
  sort: "latest", // 'latest' | 'trending'
};

/* ---------- Build a full-text search index once (all 100 articles, every field) ---------- */

function buildSearchIndex() {
  ARTICLES.forEach(a => {
    const keyFactsText = Object.entries(a.keyFacts || {}).map(([k, v]) => `${k} ${v}`).join(" ");
    const parts = [
      a.headline,
      CAT_MAP[a.category] ? CAT_MAP[a.category].full : a.category,
      a.category,
      a.date,
      a.dateline,
      a.region,
      a.summary,
      a.lead,
      a.whatHappened,
      a.whyItMatters,
      a.background,
      (a.keyDevelopments || []).join(" "),
      a.globalImpact,
      a.reactions,
      a.whatsNext,
      keyFactsText,
    ];
    a._searchText = parts.join(" \u2022 ").toLowerCase();
  });
}

/* ---------- Init ---------- */

function init() {
  document.getElementById("todayDate").textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  buildSearchIndex();
  buildCategoryNav();
  buildSearchChips();
  bindGlobalControls();
  bindKeyboardShortcut();
  initTheme();

  window.addEventListener("hashchange", router);
  router();
}

function buildSearchChips() {
  const container = document.getElementById("searchChips");
  container.innerHTML = SEARCH_CHIPS.map(term =>
    `<button class="chip" data-term="${escapeHtml(term)}" type="button">${escapeHtml(term)}</button>`
  ).join("");
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const input = document.getElementById("searchInput");
    input.value = btn.dataset.term;
    state.query = btn.dataset.term.trim().toLowerCase();
    updateSearchChipsActive();
    updateSearchClearVisibility();
    renderDashboard();
  });
}

function updateSearchChipsActive() {
  const current = state.query;
  document.querySelectorAll(".chip").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.term.toLowerCase() === current);
  });
}

function bindKeyboardShortcut() {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/") return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return; // already typing somewhere
    e.preventDefault();
    const input = document.getElementById("searchInput");
    input.focus();
    input.select();
  });
}

function buildCategoryNav() {
  const scroll = document.getElementById("categoryScroll");
  const sortControls = document.getElementById("sortControls");
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.dataset.cat = cat.key;
    btn.textContent = `${cat.emoji} ${cat.label}`;
    btn.addEventListener("click", () => setCategory(cat.key));
    scroll.insertBefore(btn, sortControls);
  });
  document.querySelector('.cat-btn[data-cat="all"]').addEventListener("click", () => setCategory("all"));
}

function bindGlobalControls() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    updateSearchChipsActive();
    updateSearchClearVisibility();
    renderDashboard();
  });

  document.getElementById("searchClear").addEventListener("click", () => {
    searchInput.value = "";
    state.query = "";
    updateSearchChipsActive();
    updateSearchClearVisibility();
    renderDashboard();
    searchInput.focus();
  });

  document.getElementById("sortControls").addEventListener("click", (e) => {
    const btn = e.target.closest(".sort-btn");
    if (!btn) return;
    state.sort = btn.dataset.sort;
    document.querySelectorAll(".sort-btn").forEach(b => b.classList.toggle("active", b === btn));
    renderDashboard();
  });

  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    state.category = "all";
    state.query = "";
    searchInput.value = "";
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.toggle("active", b.dataset.cat === "all"));
    updateSearchChipsActive();
    updateSearchClearVisibility();
    renderDashboard();
  });

  document.getElementById("backLink").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "";
  });
}

function updateSearchClearVisibility() {
  document.getElementById("searchClear").classList.toggle("visible", state.query.length > 0);
}

function initTheme() {
  const saved = localStorage.getItem("newsloom-theme");
  const theme = saved || "light";
  applyTheme(theme);
  document.getElementById("themeToggle").addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("newsloom-theme", next);
  });
}

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  document.getElementById("themeToggle").textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

function setCategory(key) {
  state.category = key;
  document.querySelectorAll(".cat-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === key);
  });
  renderDashboard();
}

/* ---------- Routing ---------- */

function router() {
  const hash = window.location.hash;
  const match = hash.match(/^#article-(\d+)/);
  if (match) {
    const id = parseInt(match[1], 10);
    const article = ARTICLES_BY_ID[id];
    if (article) {
      showArticle(article);
      return;
    }
  }
  showDashboard();
}

function showDashboard() {
  document.getElementById("articleView").classList.remove("visible");
  document.getElementById("dashboardView").classList.remove("hidden");
  renderDashboard();
}

function showArticleById(id) {
  window.location.hash = `#article-${id}`;
}

/* ---------- Filtering / sorting ---------- */

function getFilteredArticles() {
  let list = ARTICLES.slice();

  if (state.category !== "all") {
    list = list.filter(a => a.category === state.category);
  }

  if (state.query) {
    // Multi-word AND search, case-insensitive, partial-word matching, across the
    // full precomputed search text (headline, category, date, dateline, summary,
    // full article body, key developments, key facts — everything).
    const terms = state.query.split(/\s+/).filter(Boolean);
    list = list.filter(a => terms.every(term => a._searchText.includes(term)));
  }

  if (state.sort === "trending") {
    list.sort((a, b) => (b.trending === a.trending ? b.id - a.id : b.trending ? 1 : -1));
  } else {
    list.sort((a, b) => b.id - a.id); // higher id = "later" in our synthetic timeline
  }

  return list;
}

/* ---------- Rendering: dashboard ---------- */

function categoryBadge(catKey) {
  const cat = CAT_MAP[catKey];
  return `<span class="badge" style="background:var(--cat-${cat.key})">${cat.emoji} ${cat.label}</span>`;
}

function renderDashboard() {
  const list = getFilteredArticles();
  const featuredHead = document.getElementById("featuredHead");
  const featuredGrid = document.getElementById("featuredGrid");
  const gridTitle = document.getElementById("gridTitle");
  const gridCount = document.getElementById("gridCount");
  const storyGrid = document.getElementById("storyGrid");
  const noResults = document.getElementById("noResults");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");

  const isFiltering = state.category !== "all" || state.query;
  clearFiltersBtn.classList.toggle("visible", isFiltering);

  if (isFiltering) {
    featuredHead.style.display = "none";
    featuredGrid.style.display = "none";

    if (state.query && state.category !== "all") {
      gridTitle.textContent = `"${document.getElementById("searchInput").value}" in ${CAT_MAP[state.category].full}`;
    } else if (state.query) {
      gridTitle.textContent = `Results for "${document.getElementById("searchInput").value}"`;
    } else {
      gridTitle.textContent = CAT_MAP[state.category].full;
    }

    gridCount.textContent = state.query
      ? `${list.length} article${list.length === 1 ? "" : "s"} found`
      : `${list.length} of 100 headlines`;

    storyGrid.className = "story-grid";

    if (list.length === 0) {
      storyGrid.innerHTML = "";
      storyGrid.style.display = "none";
      noResults.style.display = "block";
    } else {
      storyGrid.style.display = "";
      noResults.style.display = "none";
      renderStoryGrid(list, storyGrid);
    }
    return;
  }

  noResults.style.display = "none";
  storyGrid.style.display = "";
  featuredHead.style.display = "";
  featuredGrid.style.display = "grid";
  gridTitle.textContent = "All Headlines";
  gridCount.textContent = "100 headlines";

  const featured = list.slice(0, 5);
  const rest = list.slice(5);

  renderFeatured(featured, featuredGrid);
  storyGrid.className = "story-grid";
  renderStoryGrid(rest, storyGrid);
}

function renderFeatured(items, container) {
  if (items.length === 0) {
    container.innerHTML = "";
    return;
  }
  const [lead, ...side] = items;
  container.innerHTML = `
    <a href="#article-${lead.id}" class="featured-lead">
      ${categoryBadge(lead.category)}
      <h3>${escapeHtml(lead.headline)}</h3>
      <p class="dek">${escapeHtml(lead.summary)}</p>
      <div class="card-meta">
        <span>${lead.dateline}</span><span>·</span><span>${lead.date}</span>
        ${lead.trending ? '<span class="trending-tag">● Trending</span>' : ""}
      </div>
    </a>
    <div class="featured-side">
      ${side.map(a => `
        <a href="#article-${a.id}" class="featured-side-item">
          ${categoryBadge(a.category)}
          <h4>${escapeHtml(a.headline)}</h4>
          <div class="card-meta">
            <span>${a.dateline}</span><span>·</span><span>${a.date}</span>
            ${a.trending ? '<span class="trending-tag">● Trending</span>' : ""}
          </div>
        </a>
      `).join("")}
    </div>
  `;
}

function renderStoryGrid(items, container) {
  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state">No headlines match your search or filter.</div>`;
    return;
  }
  container.innerHTML = items.map(a => `
    <a href="#article-${a.id}" class="story-card">
      ${categoryBadge(a.category)}
      <h3>${escapeHtml(a.headline)}</h3>
      <p>${escapeHtml(a.summary)}</p>
      <div class="card-meta">
        <span>${a.dateline}</span><span>·</span><span>${a.date}</span>
        ${a.trending ? '<span class="trending-tag">● Trending</span>' : ""}
      </div>
    </a>
  `).join("");
}

/* ---------- Rendering: article view ---------- */

function showArticle(article) {
  document.getElementById("dashboardView").classList.add("hidden");
  const view = document.getElementById("articleView");
  view.classList.add("visible");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  document.getElementById("articleHeader").innerHTML = `
    ${categoryBadge(article.category)}
    <h1>${escapeHtml(article.headline)}</h1>
    <div class="article-meta">
      <span>${article.dateline}</span>
      <span>·</span>
      <span>${article.date}</span>
      <span>·</span>
      <span>${CAT_MAP[article.category].full}</span>
    </div>
  `;

  const keyFactsRows = Object.entries(article.keyFacts)
    .map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(String(v))}</dd>`)
    .join("");

  document.getElementById("articleBody").innerHTML = `
    <p class="lede">${escapeHtml(article.lead)}</p>

    <h2>What Happened</h2>
    <p>${escapeHtml(article.whatHappened)}</p>

    <h2>Why It Matters</h2>
    <p>${escapeHtml(article.whyItMatters)}</p>

    <h2>Background</h2>
    <p>${escapeHtml(article.background)}</p>

    <h2>Key Developments</h2>
    <ul>
      ${article.keyDevelopments.map(d => `<li>${escapeHtml(d)}</li>`).join("")}
    </ul>

    <div class="key-facts-box">
      <h3>Key Facts</h3>
      <dl>${keyFactsRows}</dl>
    </div>

    <h2>Global Impact</h2>
    <p>${escapeHtml(article.globalImpact)}</p>

    <h2>Reactions</h2>
    <p>${escapeHtml(article.reactions)}</p>

    <h2>What Happens Next</h2>
    <p>${escapeHtml(article.whatsNext)}</p>

    <div class="dataset-note">
      This article is part of News Loom's static demo dataset, built to showcase the site's layout and
      article structure. It is not a confirmed, sourced report — no quotes, statistics, or outcomes here
      should be treated as verified real-world facts.
    </div>
  `;

  renderRelated(article);
  document.title = `${article.headline} — News Loom`;
}

function renderRelated(article) {
  const grid = document.getElementById("relatedGrid");
  const related = (article.related || [])
    .map(id => ARTICLES_BY_ID[id])
    .filter(Boolean);

  if (related.length === 0) {
    document.getElementById("relatedSection").style.display = "none";
    return;
  }
  document.getElementById("relatedSection").style.display = "";
  grid.innerHTML = related.map(a => `
    <a href="#article-${a.id}" class="related-item">
      <span>${CAT_MAP[a.category].label}</span>
      ${escapeHtml(a.headline)}
    </a>
  `).join("");
}

/* ---------- Utilities ---------- */

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", init);

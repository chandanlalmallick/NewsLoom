document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("storyGrid");
  const leadFeature = document.getElementById("leadFeature");
  const dashboardView = document.getElementById("dashboardView");
  const articleView = document.getElementById("articleView");
  const backLink = document.getElementById("backLink");
  const searchInput = document.getElementById("searchInput");
  const searchClear = document.getElementById("searchClear");
  const noResults = document.getElementById("noResults");
  const todayDate = document.getElementById("todayDate");
  const tickerText = document.getElementById("tickerText");
  const themeToggle = document.getElementById("themeToggle");

  let currentCategory = "all";
  let searchQuery = "";

  // Set date
  if (todayDate) {
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    todayDate.textContent = new Date().toLocaleDateString('en-US', opts);
  }

  // Set ticker
  if (tickerText && ARTICLES.length > 0) {
    tickerText.textContent = `${ARTICLES[0].categoryLabel}: ${ARTICLES[0].title}`;
  }

  // Render main dashboard
  function render() {
    const filtered = ARTICLES.filter(item => {
      const matchesCat = currentCategory === "all" || item.category === currentCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.lead.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = "";
      leadFeature.style.display = "none";
      noResults.style.display = "block";
      return;
    }

    noResults.style.display = "none";

    // Hero Lead Story (Top filtered article)
    const [lead, ...others] = filtered;
    leadFeature.style.display = "grid";
    leadFeature.innerHTML = `
      <div class="lead-media">
        <img src="${lead.image}" alt="${lead.title}" loading="eager">
      </div>
      <div class="lead-body">
        <span class="badge">${lead.categoryLabel}</span>
        <h2 class="lead-title">${lead.title}</h2>
        <p class="lead-excerpt">${lead.lead}</p>
        <div class="meta-row">${lead.date} • ${lead.location} • ${lead.readTime}</div>
      </div>
    `;
    leadFeature.onclick = () => openArticle(lead);

    // Remaining stories grid
    grid.innerHTML = others.map(item => `
      <article class="story-card" onclick="openArticleBySlug('${item.slug}')">
        <div class="card-media">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="card-content">
          <span class="badge">${item.categoryLabel}</span>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-summary">${item.lead}</p>
          <div class="meta-row" style="margin-top:14px;">${item.date} • ${item.readTime}</div>
        </div>
      </article>
    `).join("");
  }

  // Open Article Detail
  window.openArticle = function(item) {
    window.location.hash = item.slug;
    dashboardView.style.display = "none";
    articleView.style.display = "block";

    document.getElementById("readerCategory").textContent = item.categoryLabel;
    document.getElementById("readerTitle").textContent = item.title;
    document.getElementById("readerLead").textContent = item.lead;
    document.getElementById("readerDate").textContent = item.date;
    document.getElementById("readerLocation").textContent = item.location;
    document.getElementById("readerReadTime").textContent = item.readTime;
    document.getElementById("readerImage").src = item.image;
    document.getElementById("readerImage").alt = item.title;
    document.getElementById("readerCaption").textContent = item.caption || "";
    document.getElementById("readerBody").innerHTML = item.body;

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.openArticleBySlug = function(slug) {
    const item = ARTICLES.find(a => a.slug === slug);
    if (item) openArticle(item);
  };

  // Back Navigation
  backLink.onclick = (e) => {
    e.preventDefault();
    history.pushState(null, "", window.location.pathname);
    articleView.style.display = "none";
    dashboardView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Category filter
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.cat;
      render();
    });
  });

  // Search input handler
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    searchClear.style.display = searchQuery ? "block" : "none";
    render();
  });

  searchClear.onclick = () => {
    searchInput.value = "";
    searchQuery = "";
    searchClear.style.display = "none";
    render();
  };

  // Theme Toggle
  themeToggle.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
  });

  // URL Hash routing on direct load
  if (window.location.hash) {
    const targetSlug = window.location.hash.replace("#", "");
    openArticleBySlug(targetSlug);
  } else {
    render();
  }
});

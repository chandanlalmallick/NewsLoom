const fs = require('fs');
const path = require('path');

// 1. Load articles array (ensure articles.js exports: module.exports = articles; or window.ARTICLES)
const articlesPath = path.join(__dirname, 'articles.js');
let articlesContent = fs.readFileSync(articlesPath, 'utf8');

// Quick parse if articles.js uses "const ARTICLES = [...]"
if (articlesContent.includes('const ARTICLES =')) {
  articlesContent = articlesContent.replace('const ARTICLES =', 'module.exports =');
}
const articles = eval(articlesContent);

const outputDir = path.join(__dirname, 'news');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const siteUrl = 'https://chandanlalmallick.github.io/NewsLoom';

// 2. Generate an individual HTML page for each article
articles.forEach((item, index) => {
  const slug = item.slug || `article-${index + 1}`;
  const articleUrl = `${siteUrl}/news/${slug}.html`;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title} — News Loom</title>
  <meta name="description" content="${item.summary || item.lead || ''}">
  <link rel="canonical" href="${articleUrl}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${item.title}">
  <meta property="og:description" content="${item.summary || item.lead || ''}">
  <meta property="og:url" content="${articleUrl}">
  
  <!-- Structured Data: NewsArticle -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "${item.title.replace(/"/g, '\\"')}",
    "description": "${(item.summary || '').replace(/"/g, '\\"')}",
    "mainEntityOfPage": "${articleUrl}",
    "datePublished": "${item.date || new Date().toISOString().split('T')[0]}",
    "author": {
      "@type": "Organization",
      "name": "News Loom"
    },
    "publisher": {
      "@type": "Organization",
      "name": "News Loom"
    }
  }
  </script>
  <link rel="stylesheet" href="../style.css">
</head>
<body data-theme="light">
  <header class="masthead">
    <div class="wrap">
      <a href="../index.html" class="back-link">← Back to News Loom Home</a>
    </div>
  </header>

  <main class="wrap">
    <article class="article-view" style="display:block;">
      <div class="article-header">
        <span class="article-tag">${item.category || 'News'}</span>
        <h1>${item.title}</h1>
        <div class="article-meta">
          <span>${item.date || ''}</span> | <span>${item.location || 'Global'}</span>
        </div>
      </div>
      <div class="article-body">
        <p class="article-lead"><strong>${item.lead || ''}</strong></p>
        <div class="article-content">${item.body || item.content || ''}</div>
      </div>
    </article>
  </main>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf8');
});

console.log(`Generated ${articles.length} individual static article pages.`);

// 3. Generate XML Sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <priority>1.0</priority>
  </url>
  ${articles.map((item, index) => {
    const slug = item.slug || `article-${index + 1}`;
    return `
  <url>
    <loc>${siteUrl}/news/${slug}.html</loc>
    <priority>0.8</priority>
  </url>`;
  }).join('')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');
console.log('Generated sitemap.xml.');

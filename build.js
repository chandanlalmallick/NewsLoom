const fs = require('fs');
const path = require('path');

const siteUrl = 'https://chandanlalmallick.github.io/NewsLoom';

// 1. Read articles safely
const articles = require('./articles.js');

const outputDir = path.join(__dirname, 'news');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 2. Generate individual HTML files
articles.forEach((item, index) => {
  const slug = item.slug || `article-${index + 1}`;
  const title = (item.title || 'News Update').replace(/"/g, '&quot;');
  const desc = (item.lead || item.title || '').replace(/"/g, '&quot;');
  const articleUrl = `${siteUrl}/news/${slug}.html`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — The News Loom</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${articleUrl}">
  
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:image" content="${item.image || ''}">

  <link rel="stylesheet" href="../style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,600&display=swap" rel="stylesheet">
</head>
<body data-theme="light">
  <header class="masthead">
    <div class="wrap">
      <a href="../index.html" class="back-action" style="text-decoration:none;">← Return to The News Loom</a>
    </div>
  </header>
  <main class="wrap" style="max-width:820px;margin:40px auto;padding:0 15px;">
    <article>
      <span class="badge">${item.categoryLabel || 'Briefing'}</span>
      <h1 class="reader-title">${item.title}</h1>
      <p class="reader-lead">${item.lead}</p>
      <div class="reader-byline" style="margin-bottom:24px;">
        ${item.date} • ${item.location || 'Global'} • ${item.readTime || '3 min read'}
      </div>
      <div class="reader-hero-media">
        <img src="${item.image}" alt="${item.title}" style="width:100%;border-radius:8px;aspect-ratio:16/9;object-fit:cover;">
        <figcaption style="font-size:0.8rem;color:#888;margin-top:6px;text-align:right;">${item.caption || ''}</figcaption>
      </div>
      <div class="reader-content" style="margin-top:30px;">
        ${item.body}
      </div>
    </article>
  </main>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf8');
});

// 3. Generate sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <priority>1.0</priority>
  </url>
  ${articles.map((item, index) => {
    const slug = item.slug || `article-${index + 1}`;
    return `<url>
    <loc>${siteUrl}/news/${slug}.html</loc>
    <priority>0.8</priority>
  </url>`;
  }).join('\n  ')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Generated ${articles.length} news pages and updated sitemap.xml`);

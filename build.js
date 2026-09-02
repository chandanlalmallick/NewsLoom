const fs = require('fs');
const path = require('path');

const siteUrl = 'https://chandanlalmallick.github.io/NewsLoom';

// 1. Read and safely parse articles.js
const articlesPath = path.join(__dirname, 'articles.js');
if (!fs.existsSync(articlesPath)) {
  console.error('articles.js not found');
  process.exit(1);
}

let code = fs.readFileSync(articlesPath, 'utf8');

// Isolate and extract the array data safely
let articles = [];
try {
  const sandbox = {};
  const fn = new Function('window', `${code}; return window.ARTICLES || ARTICLES || [];`);
  articles = fn(sandbox);
} catch (err) {
  console.log('Fallback parsing articles...');
  const jsonMatch = code.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (jsonMatch) {
    articles = eval(jsonMatch[0]);
  }
}

if (!Array.isArray(articles) || articles.length === 0) {
  console.warn('No articles parsed. Generating base sitemap only.');
  articles = [];
}

// 2. Prepare news output directory
const outputDir = path.join(__dirname, 'news');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 3. Generate static HTML files
articles.forEach((item, index) => {
  const slug = item.slug || `article-${index + 1}`;
  const title = (item.title || 'News Update').replace(/"/g, '&quot;');
  const desc = (item.summary || item.lead || item.title || '').replace(/"/g, '&quot;');
  const articleUrl = `${siteUrl}/news/${slug}.html`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — News Loom</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${articleUrl}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${articleUrl}">
  <link rel="stylesheet" href="../style.css">
</head>
<body data-theme="light">
  <header class="masthead">
    <div class="wrap">
      <a href="../index.html" style="color:inherit;text-decoration:none;font-weight:bold;">← Back to News Loom</a>
    </div>
  </header>
  <main class="wrap" style="max-width:800px;margin:30px auto;padding:0 15px;">
    <article>
      <span style="font-size:0.85rem;text-transform:uppercase;color:#e63946;font-weight:700;">${item.category || 'World'}</span>
      <h1 style="margin:12px 0 16px;">${item.title || ''}</h1>
      <p style="color:#666;font-size:0.9rem;margin-bottom:20px;">${item.date || ''} • ${item.location || 'Global'}</p>
      <p style="font-size:1.15rem;line-height:1.7;font-weight:500;">${item.lead || ''}</p>
      <div style="line-height:1.8;margin-top:16px;">${item.body || item.content || ''}</div>
    </article>
  </main>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf8');
});

// 4. Generate sitemap.xml
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
console.log(`Successfully generated ${articles.length} article pages and sitemap.xml`);

const fs = require('fs');
const https = require('https');

// Top RSS Wires across high-traffic global categories
const FEEDS = [
  { cat: "world", label: "World Affairs", url: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en" },
  { cat: "india", label: "India & South Asia", url: "https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRE55YXpBU0FtVnVLQUFQAQ?hl=en-IN&gl=IN&ceid=IN:en" },
  { cat: "tech", label: "Frontier Tech & AI", url: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en" },
  { cat: "business", label: "Markets & Silicon", url: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en" },
  { cat: "science", label: "Deep Space & Science", url: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en" },
  { cat: "sports", label: "Global Sports", url: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en" }
];

const CATEGORY_IMAGES = {
  world: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=80",
  india: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
  business: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80",
  science: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
  sports: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80"
};

function fetchXml(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function parseItems(xml, cat, catLabel) {
  const items = [];
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
    const descMatch = itemXml.match(/<description>(.*?)<\/description>/);

    if (titleMatch && linkMatch) {
      let cleanTitle = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&#39;/g, "'");
      let cleanDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').slice(0, 220) : cleanTitle;

      items.push({
        id: Math.random().toString(36).substring(2, 9),
        cat,
        catLabel,
        title: cleanTitle,
        lead: cleanDesc,
        date: pubDateMatch ? new Date(pubDateMatch[1]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
        url: linkMatch[1],
        img: CATEGORY_IMAGES[cat]
      });
    }
  }
  return items;
}

async function main() {
  console.log("Fetching live global wire dispatches...");
  let allArticles = [];

  for (const feed of FEEDS) {
    const xml = await fetchXml(feed.url);
    const parsed = parseItems(xml, feed.cat, feed.label);
    allArticles = allArticles.concat(parsed);
  }

  // Deduplicate and trim to latest 500
  const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.title, a])).values()).slice(0, 500);

  fs.writeFileSync('articles.json', JSON.stringify(uniqueArticles, null, 2), 'utf8');
  console.log(`Saved ${uniqueArticles.length} live trending articles to articles.json`);
}

main();


# News Loom

A static, editorial-style global news dashboard — 100 headlines across six categories, each with a full
detail view. Built with plain HTML/CSS/JS so it runs directly on GitHub Pages with no backend, database,
or paid APIs.

## Files

- `index.html` — page shell (masthead, category nav, dashboard grid, article view)
- `style.css` — all styling (light/dark themes, responsive layout)
- `script.js` — rendering, search, category filters, sort, hash-based article routing
- `articles.js` — the 100-article dataset as a plain JS array (`const ARTICLES = [...]`)

## About the dataset

The 100 stories are a **static, illustrative editorial dataset**, not a live news feed. They're built to
demonstrate the full site structure — dashboard, search, filtering, and a detailed article template with
Lead / What Happened / Why It Matters / Background / Key Developments / Key Facts / Global Impact /
Reactions / What Happens Next / Related Stories — without presenting invented quotes, statistics, or
outcomes as confirmed real-world facts. A banner in the footer and a note on every article page say this
explicitly.

To turn this into a genuine live news site, swap the contents of `articles.js` for real, sourced stories
(or generate it from a news API at build time) — the dashboard and article-view code don't need to change,
since everything reads from that one array.

## Running locally

No build step. Either:

- Open `index.html` directly in a browser, or
- Serve the folder locally, e.g. `python3 -m http.server`, then visit `http://localhost:8000`

## Deploying to GitHub Pages

1. Push these four files (plus this README) to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose the branch (e.g. `main`) and root folder (`/`).
4. Save — GitHub will publish the site at `https://<username>.github.io/<repo-name>/`.

No further configuration is needed — routing is handled client-side via URL hashes
(e.g. `#article-42`), which GitHub Pages serves natively.

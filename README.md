# Richard Barber Creative — Portfolio Site

A Jekyll portfolio site for Richard Barber, a propmaker, modelmaker, and
sculptor based in London. Static site, deployed to GitHub Pages via GitHub
Actions, with a lightweight GitHub-authenticated admin panel so the site
owner can add, edit, and remove projects without touching code.

If you're looking for the non-technical, step-by-step guide (setting up
GitHub Pages, signing in to the admin panel, adding projects) see
**[DEPLOYMENT.md](DEPLOYMENT.md)**. This file is the developer-facing
overview.

## Tech stack

- [Jekyll](https://jekyllrb.com/) 4.x (Ruby) — no other build tooling
- Plain HTML, SCSS, and vanilla JS — no frontend framework, no npm/webpack
- Content lives in a single JSON data file, not scattered across markdown files
- Deploys via GitHub Actions to the `gh-pages` branch

## Project structure

```
_data/portfolio.json     Single source of truth for all site content —
                          projects, categories, homepage/about/contact copy,
                          and the color palette used for theming.
_layouts/, _includes/    Page templates and reusable partials.
_sass/                   Design tokens (CSS custom properties) and styles.
_plugins/                project_pages_generator.rb generates a page per
                          project at /work/<slug>/ directly from the
                          data file — no need to hand-create a file per
                          project.
_categories/             The five fixed category pages
                          (/work/category/<slug>/).
assets/images/            All project photography — flat, one file per image.
assets/documents/         Downloadable CV PDF.
assets/js/admin.js        GitHub API client used by the admin panel.
admin/                    The admin panel (see "Admin panel" below).
.github/workflows/        The GitHub Actions build & deploy workflow.
```

## Running locally

Requires Ruby and [Bundler](https://bundler.io/).

```
bundle install
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds
the site with Jekyll and publishes the result to the `gh-pages` branch.
GitHub Pages is configured to serve from that branch. No manual build step
is ever needed — including when content is changed through the admin panel,
since every admin save is itself a commit to `master`.

## Editing content

Two ways to change what's on the site:

1. **Admin panel** (`/admin/`) — a form-based interface for adding, editing,
   and deleting projects and categories, meant for the non-technical site
   owner. Full sign-in instructions are in [DEPLOYMENT.md](DEPLOYMENT.md).
2. **Directly edit `_data/portfolio.json`** — for anything the admin forms
   don't cover (reordering, bulk changes, new fields), edit the file and
   commit as normal. The admin panel and the static site both simply read
   this one file, so there's nothing else to keep in sync.

## Admin panel & authentication

GitHub Pages is entirely static hosting — there's no server and no
database, and this repository is public, so nothing checked into it could
ever function as a real secret. Because of that, the admin panel doesn't
use a password at all. Instead:

- Signing in means providing a GitHub personal access token belonging to
  an account that has write access to this repository.
- The panel checks that token against GitHub's API and only allows
  sign-in if the account has push access to *this specific repo* — GitHub
  reports `permissions.push: false` for any token belonging to someone
  who isn't a collaborator with write access, so an unrelated token is
  rejected regardless of whether it's otherwise valid.
- Every save the panel makes is a real, authenticated write to GitHub's
  Contents API, and GitHub enforces that same write-permission check
  again, server-side, on every request — not something that could be
  bypassed from the browser.
- The token lives only in the signed-in browser's `localStorage`. It's
  never committed, logged, or sent anywhere except to GitHub's API.

In short: access is controlled by GitHub's own repository permissions, not
by anything in this codebase. To give someone admin access, add them as a
collaborator on the repository (or as a member of the organization, if
it's org-owned); to revoke access, remove them as a collaborator or have
them revoke their token.

## Data model

`_data/portfolio.json`, abridged:

```jsonc
{
  "projects": [
    {
      "slug": "the-golden-carriage",
      "title": "The Golden Carriage",
      "category_slug": "props-weapons",
      "client": "The Royals",
      "description": "…",
      "main_image_url": "/assets/images/the-golden-carriage-main.jpg",
      "gallery_images": [ { "url": "…", "alt_text": "…" } ]
    }
  ],
  "categories": [ { "slug": "props-weapons", "name": "Props & Weapons" } ],
  "homepage": { "hero_image_url": "…", "introductory_text": "…" },
  "about_page": { "title": "…", "bio_paragraphs": ["…"] },
  "contact_page": { "email_address": "…", "phone_number": "…", "location": "…" },
  "ui_ux_directives": {
    "color_palettes": { "light_mode": { "...": "..." }, "dark_mode": { "...": "..." } }
  }
}
```

## Design system

Light/dark theme is implemented with CSS custom properties
(`_sass/_variables.scss`), toggled via a `data-theme` attribute on
`<html>`. It follows the visitor's system preference by default, and once
they use the toggle their choice is remembered per-browser in
`localStorage`. See `_sass/` for the rest of the design tokens
(typography, spacing, component styles).

## Image lightbox

Clicking any image on a project page opens a fullscreen carousel. It isn't
scoped to just that project — every project's photos sit in one
continuous, site-wide sequence (built at build time by
`_plugins/project_pages_generator.rb`), so paging past the last photo of
one project carries straight into the next project's photos.

## How this was built: a repeatable "make your portfolio free" playbook

This site replaced a paid Wix subscription with $0/month hosting, without
losing any of the original content. The steps below are the general
playbook, not just a changelog — worth re-reading if this ever needs
doing again for another site.

### 1. Reverse-engineer the source site properly

Don't trust a scraped-text or screenshot export of the old site — it
misses most of the real content. What actually worked:

- Fetch the **raw HTML** of every page (`curl` with a normal browser
  User-Agent), not a text-only extraction. Wix (and most site builders)
  render their content client-side from a JSON blob embedded in the page,
  typically a `<script type="application/json" id="wix-warmup-data">` tag.
  That blob contains the real, per-photo titles and descriptions — the
  visible gallery grid usually shows none of this.
- Grep that JSON for the gallery/media component's `items` array and pull
  out `metaData.title` and `metaData.description` for every image. This
  is what turned an initial placeholder-only dataset (generic titles like
  "Three Figures with Bucket") into the real one (e.g. "Three Pissing
  Dwarves" from a named Keith Tyson sculpture series, with the artist's
  own account of the materials and process).
- Images referenced in page markup are small responsive thumbnails
  (`.../fit/w_220,h_220,.../hash~mv2.jpg`). Strip the transform path and
  request `https://static.wixstatic.com/media/<hash>~mv2.jpg` directly to
  get the original full-resolution upload instead.
- The same photo often appears on more than one category page (e.g. a
  sculpture listed under both "Sculpting" and "Artworks"). Dedupe by the
  hash in the filename across *all* pages before treating something as a
  distinct item, and check every nav page individually — a page that
  looks empty in a quick fetch can still have real content once dedup and
  chrome-image filtering (logos, backgrounds shared across every page) are
  applied.
- Multiple photos of the *same physical piece* will have matching or
  near-identical description text even if their captions differ (e.g.
  "On Location" vs "Workshop" shots). Group by description first, then
  use editorial judgement for the ones that don't cleanly auto-group —
  don't let a scrape produce five projects for one artwork.

### 2. Establish a design direction before writing real code

[Google Stitch](https://stitch.withgoogle.com/) (or similar AI UI tools)
is useful for quickly generating a handful of throwaway HTML mockups
(home page, admin login, admin dashboard) to nail down a design language —
typography pairing, color palette, spacing scale, corner radius, component
shapes — before touching the real templates. Treat the output purely as a
visual reference, not shippable code: it typically leans on a CDN-loaded
framework (Tailwind via `<script src="cdn.tailwindcss.com">` in this case)
that isn't appropriate for a production static site. Translate the
*language* it establishes into hand-written, dependency-free CSS.

### 3. Scaffold a data-driven static site

- Keep all content in one JSON file (`_data/portfolio.json`) rather than
  one file per project. A generator plugin
  (`_plugins/project_pages_generator.rb`) turns that data into real pages
  at build time.
- This is what makes a simple, non-technical admin panel possible later:
  it only ever has to read and write one file, never create new files or
  touch template code.

### 4. Keep scrape output out of the way, then delete it

While reverse-engineering, dump raw scrape/mockup material into its own
folder excluded from the Jekyll build (this repo used
`design-reference/`) rather than letting it clutter the working tree.
Once its content has been correctly parsed and copied into the real data
file and `assets/`, delete it — an unlabelled dump of `hash~mv2.jpg`
filenames has no ongoing value and just becomes repo mess.

### 5. Categorize and de-duplicate with editorial judgement, not just scripts

- Map the source site's ad hoc categories onto whatever fixed taxonomy
  the new site needs — they rarely line up 1:1.
- Merge anything the automated grouping split incorrectly (same piece,
  different angle or process-stage photos) into a single project with one
  gallery, and sanity-check the final list against the live site rather
  than trusting the scrape blindly.

### 6. Ship it for free

GitHub Pages + GitHub Actions gives static hosting, HTTPS, and CI/CD for
$0/month — see `.github/workflows/deploy.yml`. Every push to `master`
rebuilds and republishes automatically; there's no server to pay for or
maintain.

### 7. Next step if wanted: a custom domain, still free to host

Moving off Wix doesn't require keeping a `github.io` address — a custom
domain works too, and hosting is still $0 (the only cost is the domain
registration itself, typically ~$10–15/year, unrelated to GitHub).

1. Buy/keep a domain with any registrar.
2. In the domain's DNS settings, add either:
   - **Apex domain** (`example.com`): four `A` records at `@` pointing to
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and
     `185.199.111.153` (GitHub Pages' current IPs — worth double-checking
     [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
     in case they've changed since this was written), **or**
   - **Subdomain** (`www.example.com`): a `CNAME` record pointing to
     `richard-barber-creative.github.io`.
3. In the repo on GitHub: **Settings → Pages → Custom domain**, enter the
   domain, save. GitHub will verify DNS and auto-provision an HTTPS
   certificate once it propagates (can take a few hours).
4. Tick **Enforce HTTPS** once it's available.
5. Update `url` (and `baseurl`, likely back to `""`) in `_config.yml` to
   match the new domain, commit, push.

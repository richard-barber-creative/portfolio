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

# Putting your website online — a simple guide

You don't need to know how to code to follow this. It's a one-time setup;
after that, publishing changes is as easy as filling in a form.

## Part 1 — Put this project on GitHub

1. Go to [github.com](https://github.com) and sign in (or create a free account).
2. Click the **+** in the top-right corner → **New repository**.
3. Name it anything you like, e.g. `rbarbercreative`. Leave it **Public**. Don't add a README — click **Create repository**.
4. On your computer, open this project folder in a terminal and run:
   ```
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git add -A
   git commit -m "Initial site"
   git push -u origin master
   ```
   (Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your own. This project's
   main branch is named `master`, not `main` — the commands above and the
   publishing workflow are already set up to match.)

## Part 2 — Set the site's web address in the config file

Open `_config.yml` and update two lines near the top:

```yaml
url: "https://YOUR-USERNAME.github.io"
baseurl: "/YOUR-REPO-NAME"
repository: "YOUR-USERNAME/YOUR-REPO-NAME"
```

If your repository is literally named `YOUR-USERNAME.github.io`, set `baseurl: ""` instead.

Commit and push this change the same way as above (`git add -A && git commit -m "Set site URL" && git push`).

## Part 3 — Turn on GitHub Pages

1. On your repository's GitHub page, click **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Under **Branch**, select **gh-pages** and **/ (root)**, then click **Save**.
   (The `gh-pages` branch doesn't exist yet — that's fine, it appears automatically
   after the first deployment finishes in the next step.)
4. Click the **Actions** tab at the top of your repository. You should see a
   workflow called "Build and deploy to GitHub Pages" running (it starts
   automatically whenever you push to `master`). Wait for it to finish (a green
   checkmark ✅ — usually 1–2 minutes).
5. Go back to **Settings → Pages** — you'll see your live site link at the top,
   something like `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`.

From now on, any time you push a change to the `master` branch (or save something
through the Admin panel — see below), the site rebuilds and updates
automatically. You never need to run any build commands yourself.

**This project is already using a custom domain.** The live site is at
**https://rbarbercreative.com** — not the `github.io` address described
above. That's set up via the `CNAME` file at the repo root and the `url`/
`baseurl` values in `_config.yml`; if you ever change domains, update
both of those together (see the README's custom-domain section for the
DNS side of it). Don't delete the `CNAME` file — without it, GitHub Pages
falls back to serving from the plain `github.io` address and the custom
domain stops working after the next deploy.

## Part 4 — Using the Admin panel to edit your portfolio

Visit `https://rbarbercreative.com/admin/` to sign in.

**There is no separate admin password to remember or keep secret.** This
site is a public GitHub repository, so anything checked into it (including
a password, even "hashed") could be read by anyone — that would protect
nothing. Instead, signing in means proving you can write to the repository,
using your own GitHub account via an access token. That token is the real
credential — GitHub doesn't allow a plain "Sign in with GitHub" button on a
site with no server behind it (this site is 100% GitHub Pages, nothing
else to pay for or maintain), so this is the closest equivalent: a couple
of clicks, no app to install.

### Signing in (every time, or whenever your token expires)

1. Go to `https://rbarbercreative.com/admin/`.
2. Type your repository name into the **Repository** field, e.g.
   `YOUR-USERNAME/YOUR-REPO-NAME`.
3. Click **Open GitHub to create my token →**. This opens a GitHub page in
   a new tab with everything already filled in.
4. On that GitHub page, scroll to the bottom and click the green
   **Generate token** button. GitHub will show you a long code — click the
   copy icon next to it (you will only see this code once).
5. Come back to the admin sign-in tab, paste the code into **Step 2**, and
   click **Sign In**.

The page checks the token directly against GitHub before letting you in —
if it's wrong, expired, or doesn't have write access, you'll see an error
and won't be signed in.

Keep this token private — anyone who has it can edit your site. It's stored
only in this browser's local storage (never uploaded anywhere else), so
you'll need to sign in again (repeat the steps above) if you use a
different computer or browser, or once the token expires. Use **Sign Out**
in the admin sidebar on any shared or public computer — it deletes the
token from that browser. If a token is ever exposed, revoke it immediately
from **GitHub → Settings → Developer settings → Personal access tokens
(classic)** and sign in again to generate a new one.

### Adding, editing, and deleting projects

- Go to **Projects** in the admin sidebar.
- **New Project** opens a form: title, category, client, description, and
  image paths. Fill it in and click **Save Project**.
- Click **Edit** or **Delete** next to any project in the list to change it.
- Every save updates your live site automatically within a minute or two —
  no need to touch any code.

### Managing categories

- Go to **Categories** in the admin sidebar to add new categories or remove
  ones you no longer need.

### Adding new images

The Admin panel doesn't upload images directly. To add a new photo:

1. Add the image file to the `assets/images/` folder in your project (via
   GitHub's web interface: open the folder on GitHub → **Add file → Upload files**).
2. In the project form, set the image path to `/assets/images/your-file-name.jpg`.

You don't need to resize or compress it yourself first — every push
automatically strips hidden metadata (camera info, GPS, etc.) from any new
`.jpg` under `assets/images/` and generates a small preview version used
in grids and the admin list, without touching the full-quality version
used on the actual project page. This runs as part of the same GitHub
Actions workflow that publishes the site, so there's nothing extra to do.

## Troubleshooting

- **"Connected" fails with a 404** — double check the repository name is
  exactly `username/repo-name` (no spaces, correct capitalization).
- **"This token does not have write access"** — sign in again and generate a
  fresh token using the "Open GitHub to create my token" button, so the
  `repo` permission checkbox is filled in correctly.
- **Site shows a 404 after deploying** — check that `baseurl` in
  `_config.yml` matches your repository name exactly, including the leading `/`.
- **Changes don't appear** — check the **Actions** tab for a red ✗; click into
  the failed run to see what went wrong, or wait a minute and refresh — builds
  usually take 1–2 minutes.

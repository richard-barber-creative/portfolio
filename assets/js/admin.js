/*
 * Shared admin panel logic: a thin GitHub Contents API client used for
 * every CRUD operation against _data/portfolio.json.
 *
 * How access control works here:
 * GitHub Pages serves static files only — there is no server to check a
 * password against, and this repository is public, so nothing checked
 * into it can be a real secret. Anyone who reads the page source would
 * see a client-side password instantly, so a fake "password screen"
 * would protect nothing.
 *
 * Instead, the actual credential is a GitHub Personal Access Token with
 * write access to this repository, entered once on the Sign In page.
 * Every save is a real authenticated write to the GitHub API — without a
 * valid token, nothing can be changed, published, or deleted. The token
 * is stored only in this browser's localStorage; it is never committed,
 * uploaded, or visible to anyone else. Revoke it from GitHub Settings if
 * this computer is ever shared, lost, or compromised.
 */
(function (window) {
  "use strict";

  var KEYS = {
    token: "rbc-admin-gh-token",
    repo: "rbc-admin-gh-repo",
    branch: "rbc-admin-gh-branch"
  };

  function adminRoot() {
    var match = window.location.pathname.match(/^(.*\/admin\/)/);
    return match ? match[1] : "/admin/";
  }

  var GitHub = {
    get repo() { return localStorage.getItem(KEYS.repo) || ""; },
    set repo(v) { localStorage.setItem(KEYS.repo, v.trim()); },
    get token() { return localStorage.getItem(KEYS.token) || ""; },
    set token(v) { localStorage.setItem(KEYS.token, v.trim()); },
    get branch() { return localStorage.getItem(KEYS.branch) || "master"; },
    set branch(v) { localStorage.setItem(KEYS.branch, (v || "master").trim()); },

    configured: function () {
      return Boolean(this.repo && this.token);
    },

    disconnect: function () {
      localStorage.removeItem(KEYS.token);
      localStorage.removeItem(KEYS.repo);
      localStorage.removeItem(KEYS.branch);
    },

    apiHeaders: function () {
      return {
        Authorization: "Bearer " + this.token,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      };
    },

    // Confirms the repo exists and this token can push to it. Throws with
    // a human-readable message on any failure. This is the real "login".
    verifyAccess: async function () {
      var res = await fetch("https://api.github.com/repos/" + this.repo, { headers: this.apiHeaders() });
      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        if (res.status === 401) throw new Error("That token was rejected. Double-check you copied it correctly.");
        if (res.status === 404) throw new Error("Repository not found. Check the spelling and that the token can see it.");
        throw new Error("GitHub error (" + res.status + "): " + (err.message || "could not access repository"));
      }
      var repoInfo = await res.json();
      if (!repoInfo.permissions || !repoInfo.permissions.push) {
        throw new Error("This token does not have write access to " + this.repo + ".");
      }
      return repoInfo;
    },

    // Reads a UTF-8 JSON file from the repo. Returns { data, sha }.
    getJsonFile: async function (path) {
      if (!this.configured()) throw new Error("Sign in with a GitHub repository and token first.");
      var url = "https://api.github.com/repos/" + this.repo + "/contents/" + path + "?ref=" + encodeURIComponent(this.branch);
      var res = await fetch(url, { headers: this.apiHeaders() });
      if (res.status === 401) { RBCAdmin.logout(); throw new Error("Your session expired. Please sign in again."); }
      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        throw new Error("GitHub error (" + res.status + "): " + (err.message || ("could not read " + path)));
      }
      var body = await res.json();
      var decoded = decodeURIComponent(escape(atob(body.content.replace(/\n/g, ""))));
      return { data: JSON.parse(decoded), sha: body.sha };
    },

    // Writes a JS object back as pretty-printed JSON. `sha` must be the
    // sha of the file version you last read (optimistic concurrency).
    putJsonFile: async function (path, dataObj, sha, message) {
      if (!this.configured()) throw new Error("Sign in with a GitHub repository and token first.");
      var text = JSON.stringify(dataObj, null, 2) + "\n";
      var content = btoa(unescape(encodeURIComponent(text)));
      var url = "https://api.github.com/repos/" + this.repo + "/contents/" + path;
      var res = await fetch(url, {
        method: "PUT",
        headers: Object.assign({ "Content-Type": "application/json" }, this.apiHeaders()),
        body: JSON.stringify({
          message: message || ("Update " + path + " via admin panel"),
          content: content,
          sha: sha,
          branch: this.branch
        })
      });
      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        if (res.status === 409) {
          throw new Error("Someone else saved changes first. Reload the page and try again.");
        }
        throw new Error("GitHub error (" + res.status + "): " + (err.message || ("could not save " + path)));
      }
      return res.json();
    }
  };

  function isAuthed() {
    return GitHub.configured();
  }

  function requireAuth() {
    if (!isAuthed()) {
      window.location.href = adminRoot() + "login/";
    }
  }

  function logout() {
    GitHub.disconnect();
    window.location.href = adminRoot() + "login/";
  }

  function slugify(text) {
    return (text || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  window.RBCAdmin = {
    logout: logout,
    isAuthed: isAuthed,
    requireAuth: requireAuth,
    adminRoot: adminRoot,
    GitHub: GitHub,
    slugify: slugify,
    PORTFOLIO_PATH: "_data/portfolio.json"
  };
})(window);

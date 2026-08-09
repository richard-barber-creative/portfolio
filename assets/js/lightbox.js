(function () {
  var dataEl = document.getElementById("lightbox-data");
  if (!dataEl) return;

  var images = [];
  try {
    images = JSON.parse(dataEl.textContent || "[]");
  } catch (e) {
    images = [];
  }
  if (!images.length) return;

  var baseurl = window.RBC_BASEURL || "";
  function withBase(path) {
    if (!path) return path;
    return baseurl + path;
  }

  var overlay = document.getElementById("lightbox");
  var imageEl = document.getElementById("lightbox-image");
  var eyebrowEl = document.getElementById("lightbox-eyebrow");
  var projectEl = document.getElementById("lightbox-project");
  var altEl = document.getElementById("lightbox-alt");
  var linkEl = document.getElementById("lightbox-link");
  var thumbsEl = document.getElementById("lightbox-thumbs");
  var closeBtn = document.getElementById("lightbox-close");
  var prevBtn = document.getElementById("lightbox-prev");
  var nextBtn = document.getElementById("lightbox-next");

  var currentIndex = 0;
  var lastFocused = null;
  var thumbsRenderedFor = null;

  // Images from the same project sit contiguously in the flat list, so the
  // photo's position "within its own project" is just how far it is from
  // the nearest neighbour with a different project_url.
  function projectRange(index) {
    var url = images[index].project_url;
    var start = index;
    var end = index;
    while (start > 0 && images[start - 1].project_url === url) start--;
    while (end < images.length - 1 && images[end + 1].project_url === url) end++;
    return { start: start, end: end, position: index - start + 1, count: end - start + 1 };
  }

  function renderThumbs(range) {
    if (thumbsRenderedFor === range.start) {
      // Same project as last render: just move the active state, no rebuild.
      thumbsEl.querySelectorAll(".lightbox__thumb").forEach(function (btn) {
        var i = parseInt(btn.getAttribute("data-lightbox-index"), 10);
        btn.classList.toggle("is-active", i === currentIndex);
      });
      return;
    }
    thumbsRenderedFor = range.start;
    thumbsEl.innerHTML = "";
    if (range.count <= 1) return;
    for (var i = range.start; i <= range.end; i++) {
      var item = images[i];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lightbox__thumb" + (i === currentIndex ? " is-active" : "");
      btn.setAttribute("data-lightbox-index", i);
      btn.setAttribute("aria-label", "Show photo " + (i - range.start + 1) + " of " + range.count);
      var img = document.createElement("img");
      img.src = withBase(item.src.replace(/\.jpg$/, "-thumb.jpg"));
      img.alt = "";
      img.loading = "lazy";
      btn.appendChild(img);
      thumbsEl.appendChild(btn);
    }
  }

  function render() {
    var item = images[currentIndex];
    imageEl.src = withBase(item.src);
    imageEl.alt = item.alt || item.project_title || "";
    projectEl.textContent = item.project_title || "";
    altEl.textContent = item.project_description || item.alt || "";
    linkEl.href = withBase(item.project_url);

    var range = projectRange(currentIndex);
    eyebrowEl.textContent = (item.project_category || "Richard Barber Creative") +
      (range.count > 1 ? " — Image " + range.position + " of " + range.count : "");
    renderThumbs(range);
  }

  function open(index) {
    currentIndex = ((index % images.length) + images.length) % images.length;
    lastFocused = document.activeElement;
    render();
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function step(delta) {
    currentIndex = ((currentIndex + delta) % images.length + images.length) % images.length;
    render();
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-lightbox-index]");
    if (!trigger) return;
    e.preventDefault();
    var idx = parseInt(trigger.getAttribute("data-lightbox-index"), 10);
    if (!isNaN(idx)) open(idx);
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", function (e) {
    if (overlay.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  var touchStartX = null;
  overlay.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  overlay.addEventListener("touchend", function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });
})();

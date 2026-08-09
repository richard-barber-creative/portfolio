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
  var projectEl = document.getElementById("lightbox-project");
  var linkEl = document.getElementById("lightbox-link");
  var closeBtn = document.getElementById("lightbox-close");
  var prevBtn = document.getElementById("lightbox-prev");
  var nextBtn = document.getElementById("lightbox-next");

  var currentIndex = 0;
  var lastFocused = null;

  function render() {
    var item = images[currentIndex];
    imageEl.src = withBase(item.src);
    imageEl.alt = item.alt || item.project_title || "";
    projectEl.textContent = item.project_title || "";
    linkEl.href = withBase(item.project_url);
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

// Alerta — shared interactions
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector("[data-nav-toggle]");
  var links = document.querySelector("[data-nav-links]");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Lightbox (album)
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbContent = lb.querySelector(".lightbox-content");
    var lbClose = lb.querySelector(".lightbox-close");
    var lastFocused = null;

    function openLb(tile) {
      lastFocused = tile;
      lbContent.textContent = tile.textContent.trim();
      lb.hidden = false;
      lbClose.focus();
    }
    function closeLb() {
      lb.hidden = true;
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll("[data-lightbox]").forEach(function (tile) {
      tile.addEventListener("click", function () { openLb(tile); });
    });
    lbClose.addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lb.hidden) closeLb();
    });
  }
})();

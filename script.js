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
      lbContent.textContent = "";
      var img = tile.querySelector("img");
      if (img) {
        var big = document.createElement("img");
        big.src = img.src.replace(/\/(\d+)\/(\d+)$/, "/1200/900");
        big.alt = img.alt;
        lbContent.appendChild(big);
      } else {
        lbContent.textContent = tile.textContent.trim();
      }
      var cap = lb.querySelector(".lightbox-cap");
      if (cap) cap.textContent = tile.getAttribute("data-caption") || "";
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

  // Scroll reveal (stagger per section)
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var ioAlive = false;
      var counters = new WeakMap();
      var io = new IntersectionObserver(function (entries) {
        ioAlive = true;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var parent = entry.target.parentElement || document.body;
          var i = counters.get(parent) || 0;
          counters.set(parent, i + 1);
          entry.target.style.setProperty("--d", (i * 0.07) + "s");
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
      // Pojistka: observer po observe() vzdy dorucuje inicialni entries;
      // pokud nedorazi (napr. pozastaveny renderer), obsah nesmi zustat skryty.
      setTimeout(function () {
        if (!ioAlive) {
          io.disconnect();
          revealEls.forEach(function (el) { el.classList.add("in"); });
        }
      }, 1500);
    }
  }

  // Card pointer glow
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
})();

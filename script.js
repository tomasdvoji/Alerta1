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
    var finishReveal = function (el, delayS) {
      setTimeout(function () {
        el.removeAttribute("data-reveal");
        el.style.removeProperty("--d");
      }, 750 + (delayS || 0) * 1000);
    };
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); finishReveal(el, 0); });
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
          // po dokonceni reveal animace odstranit atribut, aby pomaly
          // reveal-prechod nebrzdil hover efekty karet
          finishReveal(entry.target, i * 0.07);
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
      // Pojistka: observer po observe() vzdy dorucuje inicialni entries;
      // pokud nedorazi (napr. pozastaveny renderer), obsah nesmi zustat skryty.
      setTimeout(function () {
        if (!ioAlive) {
          io.disconnect();
          revealEls.forEach(function (el) { el.classList.add("in"); finishReveal(el, 0); });
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

  // Pohybove efekty jen pro presny kurzor a bez reduced-motion
  var fancy = window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    && window.matchMedia("(pointer: fine)").matches;
  if (fancy) {
    // Hero: kuzely svetla jemne sleduji kurzor
    var hero = document.querySelector(".hero");
    if (hero) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5) * 2);
        hero.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5) * 2);
      });
      hero.addEventListener("pointerleave", function () {
        hero.style.setProperty("--px", 0);
        hero.style.setProperty("--py", 0);
      });
    }

    // 3D tilt karet sluzeb
    document.querySelectorAll(".svc-grid .card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (dx * 6) + "deg");
        card.style.setProperty("--rx", (dy * -6) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }
})();

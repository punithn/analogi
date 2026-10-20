
(function () {
  "use strict";

  var root = document.documentElement;
  var overlay = document.getElementById("overlay");
  var openBtn = document.getElementById("menuBtn");
  var closeBtn = document.getElementById("closeBtn");
  var pageNumber = document.getElementById("pageno");

  var reduceMotion = false;

  if (window.matchMedia) {
    reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  // Keep Analogi in night mode. No paper/light theme toggle.
  root.dataset.theme = "night";

  try {
    localStorage.setItem("analogi-theme", "night");
  } catch (error) {
    // The page still works if local storage is unavailable.
  }

  // Navigation menu
  function setMenu(isOpen) {
    if (!overlay) return;

    overlay.classList.toggle("open", isOpen);
    overlay.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";

    if (openBtn) {
      openBtn.setAttribute("aria-expanded", String(isOpen));
    }

    var focusTarget = isOpen ? closeBtn : openBtn;

    if (focusTarget && typeof focusTarget.focus === "function") {
      focusTarget.focus({ preventScroll: true });
    }
  }

  if (openBtn) {
    openBtn.addEventListener("click", function () {
      setMenu(true);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      setMenu(false);
    });
  }

  if (overlay) {
    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        setMenu(false);
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay &&
        overlay.classList.contains("open")) {
      setMenu(false);
    }
  });

  // Reveal content as it enters the viewport.
  var revealItems = document.querySelectorAll(".rv");

  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealItems.forEach(function (item) {
      item.classList.add("in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = (index % 3) * 80 + "ms";
      revealObserver.observe(item);
    });
  }

  // Update the page number only when the number element exists.
  if (
    pageNumber &&
    "IntersectionObserver" in window
  ) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            pageNumber.textContent =
              entry.target.getAttribute("data-n") || "";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    document.querySelectorAll("[data-n]").forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
})();

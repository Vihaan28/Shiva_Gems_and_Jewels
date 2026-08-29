/* =========================================================================
   SHIVA GEMS AND JEWELS — NAVIGATION
   Handles: header scroll state, mobile full-screen menu toggle.
   ========================================================================= */
(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const logo = document.querySelector(".site-logo");
  const body = document.body;
  let lastScrollY = 0;

  function onScroll() {
    if (!header) return;
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    if (currentScrollY <= 24) {
      header.classList.remove("is-scrolled", "is-collapsed");
    } else if (scrollingDown) {
      header.classList.remove("is-scrolled");
      header.classList.add("is-collapsed");
    } else if (currentScrollY < lastScrollY) {
      header.classList.remove("is-collapsed");
      header.classList.add("is-scrolled");
    }

    lastScrollY = currentScrollY;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // The compact logo restores the full navbar without navigating away.
  if (logo) {
    logo.addEventListener("click", (event) => {
      if (!header.classList.contains("is-collapsed")) return;
      event.preventDefault();
      header.classList.remove("is-collapsed");
      header.classList.add("is-scrolled");
    });
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const isOpen = body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Close mobile menu when a link inside it is clicked.
  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close mobile menu with Escape key.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      body.classList.remove("menu-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Mark the current page's nav link as active (aria-current).
  const currentPage = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-link, .mobile-menu__list a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.split("/").pop() === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
})();

/* =========================================================================
   SHIVA GEMS AND JEWELS — SCROLL ANIMATIONS
   Handles: splash screen, scroll-reveal via IntersectionObserver,
   gentle hero parallax. Respects prefers-reduced-motion.
   ========================================================================= */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Splash screen ---------- */
  const splash = document.querySelector(".splash");
  if (splash) {
    const hide = () => {
      splash.classList.add("is-hidden");
      document.body.classList.remove("splash-active");
    };
    if (reduceMotion) {
      hide();
    } else {
      window.setTimeout(hide, 1300);
    }
  }

  /* ---------- Scroll reveal ----------
     Exposed as window.refreshRevealObserver() so that content injected
     later (e.g. product cards rendered from js/products.js) also gets
     picked up. main.js calls this again after it builds those cards. */
  let revealObserver = null;
  function getObserver() {
    if (revealObserver || reduceMotion || !("IntersectionObserver" in window)) return revealObserver;
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );
    return revealObserver;
  }

  window.refreshRevealObserver = function () {
    const els = document.querySelectorAll(".reveal:not(.is-visible), .reveal-fade:not(.is-visible), .reveal-clip:not(.is-visible)");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = getObserver();
    els.forEach((el) => observer.observe(el));
  };

  window.refreshRevealObserver();

  /* ---------- Subtle hero parallax (desktop only, disabled for reduced motion) ---------- */
  if (!reduceMotion) {
    const heroImg = document.querySelector(".hero__media img");
    if (heroImg && window.innerWidth > 768) {
      window.addEventListener(
        "scroll",
        () => {
          const offset = Math.min(window.scrollY * 0.12, 60);
          heroImg.style.transform = `scale(1.06) translateY(${offset}px)`;
        },
        { passive: true }
      );
    }
  }
})();

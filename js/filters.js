/* =========================================================================
   SHIVA GEMS AND JEWELS — JOURNAL FILTERS
   Simple client-side category filter for the Journal archive page.
   Add a new category by adding a button with a matching data-filter value
   in journal.html and giving its article card the same data-category value.
   ========================================================================= */
(function () {
  const filterButtons = document.querySelectorAll(".journal-filter");
  const cards = document.querySelectorAll("[data-category]");
  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter");

      cards.forEach((card) => {
        const match = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });
})();

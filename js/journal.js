/* =========================================================================
   SHIVA GEMS AND JEWELS — JOURNAL CONTENT
   Renders CMS-managed journal categories and entries.
   ========================================================================= */
(function () {
  const filters = document.querySelector("[data-journal-filters]");
  const grid = document.querySelector("[data-journal-grid]");
  if (!filters || !grid) return;

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      "\"": "&quot;"
    })[character]);
  }

  Promise.all([
    fetch("data/journal-categories.json").then((response) => response.ok ? response.json() : []),
    fetch("data/journal.json").then((response) => response.ok ? response.json() : [])
  ]).then(([categories, entries]) => {
    filters.innerHTML = [
      '<button class="journal-filter is-active" data-filter="all">All</button>',
      ...categories.map((category) => `<button class="journal-filter" data-filter="${escapeHtml(category.slug)}">${escapeHtml(category.name)}</button>`)
    ].join("");

    grid.innerHTML = entries.map((entry, index) => {
      const category = categories.find((item) => item.slug === entry.category);
      const categoryName = category ? category.name : entry.category;
      return `
        <a class="journal-card reveal reveal-delay-${index % 3}" data-category="${escapeHtml(entry.category)}" href="#${encodeURIComponent(entry.slug)}">
          <span class="journal-card__tag">${escapeHtml(categoryName)}</span>
          <h3 class="journal-card__title">${escapeHtml(entry.title)}</h3>
          <p class="journal-card__excerpt">${escapeHtml(entry.excerpt)}</p>
        </a>
      `;
    }).join("");

    if (typeof window.refreshRevealObserver === "function") window.refreshRevealObserver();
  }).catch(() => {
    grid.innerHTML = '<p class="product-empty">Journal entries are temporarily unavailable.</p>';
  });
})();

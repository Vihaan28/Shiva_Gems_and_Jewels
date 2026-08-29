/* =========================================================================
   SHIVA GEMS AND JEWELS — MAIN
   General site setup: grain overlay, footer year, product grid init.
   ========================================================================= */
(function () {
  // Insert the subtle grain-texture overlay on every page.
  const grain = document.createElement("div");
  grain.className = "grain-overlay";
  grain.setAttribute("aria-hidden", "true");
  document.body.appendChild(grain);

  // Auto-fill copyright year in the footer.
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Populate homepage collection tiles from products.js, if present on this page.
  if (typeof renderFeaturedCollections === "function") {
    renderFeaturedCollections();
  }

  // Populate a category product grid if this page declares one.
  // (Products now load asynchronously from the CMS-generated JSON files —
  // see js/products.js — so the reveal-observer refresh happens there
  // once the cards actually finish rendering, not here.)
  const grid = document.querySelector("[data-product-grid]");
  if (grid && typeof renderProductGrid === "function") {
    const category = grid.getAttribute("data-product-grid");
    renderProductGrid("[data-product-grid]", category);
  }
})();

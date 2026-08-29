/* =========================================================================
   SHIVA GEMS AND JEWELS — DYNAMIC CATEGORY PAGE CONTROLLER
   -------------------------------------------------------------------------
   Powers collection.html?category=<slug> — the page any category an
   employee creates in the CMS (beyond the original Diamonds/Gold/Polki
   pages, which keep their own dedicated files) automatically uses.

   Must run AFTER js/products.js (needs loadShivaData) and BEFORE js/main.js
   (needs data-product-grid set before main.js reads it) — see the script
   order in collection.html.
   ========================================================================= */
(function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get("category") || "";

  // Set synchronously so js/main.js (which runs right after this file)
  // renders the correct product grid on first pass.
  const grid = document.querySelector("[data-product-grid]");
  if (grid) grid.setAttribute("data-product-grid", slug);

  if (typeof loadShivaData !== "function") return;

  loadShivaData().then(({ categories }) => {
    const category = categories.find((c) => c.slug === slug);
    if (!category) {
      const heading = document.getElementById("categoryHeading");
      if (heading) heading.textContent = "Collection not found";
      const desc = document.getElementById("categoryDescription");
      if (desc) desc.textContent = "This collection may have been renamed or removed. Please see our full Collections page.";
      return;
    }

    document.getElementById("pageTitle").textContent = category.name + " | Shiva Gems and Jewels";
    document.getElementById("pageDescription").setAttribute("content", category.description || "");
    document.getElementById("ogTitle").setAttribute("content", category.name);
    document.getElementById("ogDescription").setAttribute("content", category.description || "");
    if (category.heroImage) document.getElementById("ogImage").setAttribute("content", category.heroImage);

    document.getElementById("categoryEyebrow").textContent = category.name;
    document.getElementById("categoryHeading").textContent = category.name;
    document.getElementById("categoryDescription").textContent = category.description || "";
    document.getElementById("categoryEnquireText").textContent =
      `Our ${category.name.toLowerCase()} edit is only ever a starting point. Tell us what you have in mind and we will help you find — or create — the right piece.`;

    if (category.heroImage) {
      document.getElementById("categoryHeroImage").setAttribute("src", category.heroImage);
      document.getElementById("categoryHeroImage").setAttribute("alt", category.name + " jewellery — Shiva Gems and Jewels");
      document.getElementById("categorySplitImage").setAttribute("src", category.heroImage);
      document.getElementById("categorySplitImage").setAttribute("alt", category.name + " jewellery — Shiva Gems and Jewels");
    }

    const context = category.name.toLowerCase() + " jewellery";
    ["categoryWhatsapp", "categoryWhatsappFab"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("data-whatsapp", context);
    });
    if (typeof refreshShivaEnquiryLinks === "function") refreshShivaEnquiryLinks();
  });
})();

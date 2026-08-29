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
  const slug = params.get("category") || document.body.dataset.categorySlug || "";

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

    const pageTitle = document.getElementById("pageTitle");
    const pageDescription = document.getElementById("pageDescription");
    const ogTitle = document.getElementById("ogTitle");
    const ogDescription = document.getElementById("ogDescription");
    const ogImage = document.getElementById("ogImage");
    const categoryEyebrow = document.getElementById("categoryEyebrow");
    const categoryHeading = document.getElementById("categoryHeading");
    const categoryDescription = document.getElementById("categoryDescription");
    const categoryEnquireText = document.getElementById("categoryEnquireText");
    const imageAlt = category.name + " jewellery — Shiva Gems and Jewels";

    if (pageTitle) pageTitle.textContent = category.name + " | Shiva Gems and Jewels";
    if (pageDescription) pageDescription.setAttribute("content", category.description || "");
    if (ogTitle) ogTitle.setAttribute("content", category.name);
    if (ogDescription) ogDescription.setAttribute("content", category.description || "");

    if (categoryEyebrow) categoryEyebrow.textContent = category.name;
    if (categoryHeading) categoryHeading.textContent = category.name;
    if (categoryDescription) categoryDescription.textContent = category.description || "";
    if (categoryEnquireText) categoryEnquireText.textContent =
      `Our ${category.name.toLowerCase()} edit is only ever a starting point. Tell us what you have in mind and we will help you find — or create — the right piece.`;

    // Use the horizontal page hero image for the category header.
    const pageHero = category.pageHeroImage || category.heroImage;
    const heroImage = document.getElementById("categoryHeroImage");
    const splitImage = document.getElementById("categorySplitImage");
    if (pageHero && heroImage) {
      heroImage.setAttribute("src", pageHero);
      heroImage.setAttribute("alt", imageAlt);
    }
    if (category.heroImage && splitImage) {
      splitImage.setAttribute("src", category.heroImage);
      splitImage.setAttribute("alt", imageAlt);
    }
    if (pageHero && ogImage) ogImage.setAttribute("content", pageHero);

    const context = category.name.toLowerCase() + " jewellery";
    ["categoryWhatsapp", "categoryWhatsappFab"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("data-whatsapp", context);
    });
    if (typeof refreshShivaEnquiryLinks === "function") refreshShivaEnquiryLinks();
  });
})();

/* =========================================================================
   SHIVA GEMS AND JEWELS — DYNAMIC PRODUCT PAGE CONTROLLER
   -------------------------------------------------------------------------
   Powers product-view.html?slug=<id> — every product added through the
   CMS automatically gets a detail page here; nobody creates a new HTML
   file per product any more.
   ========================================================================= */
(function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug") || "";
  if (typeof loadShivaData !== "function") return;

  const priceLabels = {
    on_request: "Enquire for Price",
    fixed: null,
    starting_from: null
  };

  loadShivaData().then(({ products, categories }) => {
    const product = products.find((p) => p.id === slug);
    if (!product) {
      document.getElementById("productName").textContent = "Piece not found";
      document.getElementById("productDescription").textContent =
        "This piece may have been sold or is no longer listed. Please browse our current collections.";
      return;
    }

    const category = categories.find((c) => c.slug === product.category);
    const categoryName = category ? category.name : product.category;
    const priceText = formatShivaPrice(product);

    document.getElementById("pageTitle").textContent = `${product.name} | ${categoryName} | Shiva Gems and Jewels`;
    document.getElementById("pageDescription").setAttribute("content", `${product.name} — ${categoryName} jewellery from Shiva Gems and Jewels, Delhi. Enquire for details and pricing.`);
    document.getElementById("ogTitle").setAttribute("content", `${product.name} | ${categoryName} | Shiva Gems and Jewels`);
    document.getElementById("ogDescription").setAttribute("content", product.description || "");
    document.getElementById("ogImage").setAttribute("content", product.primaryImage);

    const categoryHref = { diamonds: "diamonds.html", gold: "gold.html", polki: "polki.html" }[product.category]
      || `collection.html?category=${encodeURIComponent(product.category)}`;
    document.getElementById("breadcrumbLink").setAttribute("href", categoryHref);
    document.getElementById("breadcrumbLink").textContent = categoryName;
    document.getElementById("backToCollectionLink").setAttribute("href", categoryHref);
    document.getElementById("backToCollectionLink").textContent = "↖ Back to " + categoryName;

    const altText = `${product.name} — Shiva Gems and Jewels`;
    document.getElementById("mainProductImage").setAttribute("src", product.primaryImage);
    document.getElementById("mainProductImage").setAttribute("alt", altText);

    const allImages = [product.primaryImage].concat(product.additionalImages ? product.additionalImages.map((i) => i.image) : []);
    document.getElementById("productThumbs").innerHTML = allImages.map((src, i) => `
      <img src="${src}" alt="${altText} — view ${i + 1}" class="${i === 0 ? "is-active" : ""}">
    `).join("");
    document.querySelectorAll("#productThumbs img").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        document.getElementById("mainProductImage").setAttribute("src", thumb.getAttribute("src"));
        document.querySelectorAll("#productThumbs img").forEach((t) => t.classList.remove("is-active"));
        thumb.classList.add("is-active");
      });
    });

    document.getElementById("productCategoryLabel").textContent = categoryName;
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productDescription").textContent =
      (product.description || "") + " Details available on request — our team is glad to share further information in person or over a private appointment.";
    document.getElementById("productPrice").textContent = priceText;

    document.getElementById("specCategory").textContent = categoryName;
    document.getElementById("specBridal").textContent = product.bridal ? "Yes" : "No";
    document.getElementById("specAvailability").textContent = product.available === false ? "Currently unavailable" : "By appointment";
    document.getElementById("specPricing").textContent = priceText;

    document.title = document.getElementById("pageTitle").textContent;
    ["productWhatsapp", "productWhatsappFab"].forEach((id) => {
      document.getElementById(id).setAttribute("data-whatsapp", product.name);
    });
    document.getElementById("productEmail").setAttribute("data-email-enquiry", product.name);
    if (typeof refreshShivaEnquiryLinks === "function") refreshShivaEnquiryLinks();

    if (typeof window.refreshRevealObserver === "function") window.refreshRevealObserver();
  });
})();

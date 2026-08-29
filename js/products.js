/* =========================================================================
   SHIVA GEMS AND JEWELS — PRODUCT DATA (CMS-DRIVEN)
   -------------------------------------------------------------------------
   Product, category and settings content now comes from the Decap CMS at
   /admin — employees add/edit pieces there, NOT in this file.

   This script fetches the JSON files that /scripts/build-data.js generates
   from /content/ on every deploy:
     /data/products.json
     /data/categories.json

   Everything below only RENDERS that data using the exact same markup and
   CSS classes as before — no visual/design changes.
   ========================================================================= */

let SHIVA_PRODUCTS = [];
let SHIVA_CATEGORIES = [];
let SHIVA_DATA_READY = null;
const FEATURED_TILE_IMAGE = "assets/placeholders/featured collections verticle placeholder.png";

function loadShivaData() {
  if (SHIVA_DATA_READY) return SHIVA_DATA_READY;
  SHIVA_DATA_READY = Promise.all([
    fetch(shivaAssetPath("data/products.json")).then((r) => (r.ok ? r.json() : [])),
    fetch(shivaAssetPath("data/categories.json")).then((r) => (r.ok ? r.json() : []))
  ]).then(([products, categories]) => {
    SHIVA_PRODUCTS = products || [];
    SHIVA_CATEGORIES = categories || [];
    return { products: SHIVA_PRODUCTS, categories: SHIVA_CATEGORIES };
  }).catch(() => {
    SHIVA_PRODUCTS = [];
    SHIVA_CATEGORIES = [];
    return { products: [], categories: [] };
  });
  return SHIVA_DATA_READY;
}

/* Pages inside /product/ or using clean subfolders need a "../" prefix
   for root-relative content — detect it the same way the rest of the
   site already structures its asset paths. */
function shivaAssetPath(relativePath) {
  const inSubfolder = location.pathname.includes("/product/");
  return (inSubfolder ? "../" : "") + relativePath;
}
/* -------------------------------------------------------------------------
   Formats a product's price according to its Price Type — see PRICE
   DISPLAY LOGIC in the CMS spec.
   ------------------------------------------------------------------------- */
function formatShivaPrice(product) {
  const formatted = product.price
    ? "₹" + Number(product.price).toLocaleString("en-IN")
    : "";
  if (product.priceType === "fixed" && formatted) return formatted;
  if (product.priceType === "starting_from" && formatted) return "Starting from " + formatted;
  return "Enquire for Price";
}

/* -------------------------------------------------------------------------
   Renders a grid of product cards into a container element.
   Usage: renderProductGrid("#productGrid", "diamonds")
   Pass category = "all" to show every product regardless of category.
   Pass category = "featured" to show all products marked as featured.
   ------------------------------------------------------------------------- */
function renderProductGrid(containerSelector, category) {
  const container = document.querySelector(containerSelector);
  if (!container) return Promise.resolve();

  return loadShivaData().then(() => {
    let items = SHIVA_PRODUCTS;
    
    // Filter by category or featured status
    if (category === "featured") {
      items = items.filter((p) => p.featured === true);
    } else if (category !== "all") {
      items = items.filter((p) => p.category === category);
    }
    
    items = items.filter((p) => p.available !== false);

    if (items.length === 0) {
      container.innerHTML = '<p class="product-empty">More pieces from this collection are on their way. Please enquire for current availability.</p>';
      return;
    }

    const prefix = location.pathname.includes("/product/") ? "../" : "";
    container.innerHTML = items.map((p) => `
      <a class="product-card reveal" href="${prefix}product-view.html?slug=${encodeURIComponent(p.id)}">
        <div class="product-card__media ratio-4-5">
          <span class="product-card__cat">${p.category}</span>
          <img src="${prefix}${p.primaryImage}" alt="${p.name} — Shiva Gems and Jewels" loading="lazy" width="640" height="800">
        </div>
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">Details available on request.</p>
        <span class="product-card__price">${formatShivaPrice(p)}</span>
      </a>
    `).join("");

    if (typeof window.refreshRevealObserver === "function") {
      window.refreshRevealObserver();
    }
  });
}

/* -------------------------------------------------------------------------
   Renders the three-collection preview strip (used on the homepage).
   Shows only the first 3 collections; users can view all at collections.html
   Includes Featured collection + any new categories created in the CMS.
   ------------------------------------------------------------------------- */
function renderFeaturedCollections() {
  const container = document.querySelector("[data-featured-collections]");
  if (!container) return Promise.resolve();

  return loadShivaData().then(() => {
    // Always include Featured first, then the core/custom categories
    let cats = [
      { name: "Featured", slug: "featured", isFeatured: true }
    ];
    
    if (SHIVA_CATEGORIES.length) {
      cats.push(...SHIVA_CATEGORIES);
    } else {
      cats.push(
        { name: "Diamonds", slug: "diamonds" },
        { name: "Gold", slug: "gold" },
        { name: "Polki", slug: "polki" }
      );
    }

    // The homepage previews three; the collections page shows the full set.
    if (container.dataset.featuredCollections !== "all") {
      cats = cats.slice(0, 3);
    }

    container.innerHTML = cats.map((c, i) => {
      // Get representative image
      let img = "";
      if (c.isFeatured) {
        img = FEATURED_TILE_IMAGE;
      } else {
        const item = SHIVA_PRODUCTS.find((p) => p.category === c.slug);
        img = c.heroImage || (item ? item.primaryImage : "");
      }
      
      // Determine the link
      let href;
      if (c.isFeatured) {
        href = "featured.html";
      } else {
        // Existing three core categories keep their original dedicated pages
        const coreHrefs = { diamonds: "diamonds.html", gold: "gold.html", polki: "polki.html" };
        href = coreHrefs[c.slug] || `collection.html?category=${encodeURIComponent(c.slug)}`;
      }
      
      return `
        <a class="collection-card reveal" href="${href}">
          <div class="collection-card__media">
            <img src="${img}" alt="${c.name} jewellery — Shiva Gems and Jewels" loading="lazy">
          </div>
          <div class="collection-card__scrim"></div>
          <div class="collection-card__content">
            <span class="collection-card__num">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="collection-card__name">${c.name}</h3>
            <div class="collection-card__foot">
              <span>Explore</span>
              <span class="collection-card__arrow">↗</span>
            </div>
          </div>
        </a>
      `;
    }).join("");

    if (typeof window.refreshRevealObserver === "function") {
      window.refreshRevealObserver();
    }
  });
}

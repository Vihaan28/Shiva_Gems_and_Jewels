/* =========================================================================
   SHIVA GEMS AND JEWELS — SITE SETTINGS (CMS-DRIVEN)
   -------------------------------------------------------------------------
   Fetches /data/settings.json (built from content/settings/*.yml by
   scripts/build-data.js) and applies it to every page:

     - Phone numbers, email and Instagram link wherever they already
       appear in the header, footer and mobile menu (no HTML changes
       needed — it matches the existing tel:/mailto:/instagram.com links)
     - Homepage hero + "Our Story" teaser text, if this page has the
       data-cms-field attributes (see index.html)

   This must load BEFORE js/enquiry.js finishes building its links, which
   is why its <script> tag is placed first in the script list. It updates
   enquiry.js's links again once settings arrive either way, so order
   only affects which text briefly flashes before the real numbers load.
   ========================================================================= */
(function () {
  const prefix = location.pathname.includes("/product/") ? "../" : "";

  fetch(prefix + "data/settings.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((settings) => {
      if (!settings) return;
      applyContactSettings(settings.contact);
      applyHomepageSettings(settings.homepage);
    })
    .catch(() => {});

  function applyContactSettings(contact) {
    if (!contact) return;

    // Known original numbers -> which settings field they represent.
    // This lets us update the right link even though phone1/2/3 are not
    // individually marked up in the HTML.
    const knownDigits = {
      "919899501107": "phone1",
      "919711693793": "phone2",
      "919811076800": "phone3"
    };

    document.querySelectorAll('a[href^="tel:"]').forEach((el) => {
      const digits = el.getAttribute("href").replace(/[^\d]/g, "");
      const field = knownDigits[digits];
      const value = field && contact[field] ? contact[field] : null;
      if (value) {
        el.setAttribute("href", "tel:+91" + value.replace(/[^\d]/g, "").slice(-10));
        if (el.textContent.replace(/\D/g, "") === digits.slice(-10)) {
          el.textContent = value;
        }
      }
    });

    if (contact.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach((el) => {
        const wasEmailText = el.textContent.includes("@");
        el.setAttribute("href", el.getAttribute("href").replace(/^mailto:[^?]*/, "mailto:" + contact.email));
        if (wasEmailText) el.textContent = contact.email;
      });
    }

    if (contact.instagram) {
      document.querySelectorAll('a[href*="instagram.com"]').forEach((el) => {
        el.setAttribute("href", contact.instagram);
      });
    }

    if (typeof applyShivaContactSettings === "function") {
      applyShivaContactSettings(contact);
    }
  }

  function applyHomepageSettings(homepage) {
    if (!homepage) return;
    document.querySelectorAll("[data-cms-field]").forEach((el) => {
      const field = el.getAttribute("data-cms-field");
      const value = homepage[field];
      if (value === undefined || value === null || value === "") return;
      if (field === "heroImage" && el.tagName === "IMG") {
        el.setAttribute("src", value);
      } else if (field.endsWith("Heading")) {
        el.innerHTML = String(value).split("|").join("<br>");
      } else {
        el.textContent = value;
      }
    });
  }
})();

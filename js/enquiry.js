/* =========================================================================
   SHIVA GEMS AND JEWELS — ENQUIRY / WHATSAPP / CONTACT FORM
   -------------------------------------------------------------------------
   No backend server is set up for this site. Enquiries are sent using:
     - WhatsApp deep links (wa.me)
     - mailto: links (opens the visitor's email app)

   -------------------------------------------------------------------------
   CONNECTING A REAL FORM BACKEND LATER (optional)
   If you later want the contact form to submit to a real backend (for
   example Formspree, Getform, a Google Sheet, or your own server), replace
   the handleContactForm() function below with a fetch() call to your
   endpoint. Everything else on the site does not need to change.
   ========================================================================= */

// Defaults below are used until /js/settings.js finishes loading the
// CMS-managed values from /data/settings.json and calls
// applyShivaContactSettings() — see js/settings.js.
let SHIVA_WHATSAPP_NUMBER = "919899501107"; // +91 9899501107, no + or spaces for wa.me links
let SHIVA_EMAIL = "shivadiamondandjwellers@gmail.com";

function refreshShivaEnquiryLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    const context = el.getAttribute("data-whatsapp");
    const message = context && context.trim().length
      ? `Hello Shiva Gems and Jewels, I would like to enquire about ${context}.`
      : "Hello Shiva Gems and Jewels, I would like to make an enquiry.";
    el.setAttribute("href", buildWhatsAppLink(message));
  });
  document.querySelectorAll("[data-email-enquiry]").forEach((el) => {
    const context = el.getAttribute("data-email-enquiry");
    const subject = "Enquiry — Shiva Gems and Jewels";
    const body = context && context.trim().length
      ? `Hello Shiva Gems and Jewels,\n\nI would like to enquire about ${context}.\n\n`
      : "Hello Shiva Gems and Jewels,\n\nI would like to make an enquiry.\n\n";
    el.setAttribute("href", buildMailtoLink(subject, body));
  });
}

// Called by js/settings.js once /data/settings.json has loaded.
function applyShivaContactSettings(contact) {
  if (!contact) return;
  if (contact.whatsappNumber) SHIVA_WHATSAPP_NUMBER = contact.whatsappNumber;
  if (contact.email) SHIVA_EMAIL = contact.email;
  refreshShivaEnquiryLinks();
}

function buildWhatsAppLink(message) {
  return `https://wa.me/${SHIVA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildMailtoLink(subject, body) {
  return `mailto:${SHIVA_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

(function () {
  /* ---------- Context-aware WhatsApp buttons ----------
     Add data-whatsapp="short context text" to any link/button and its
     href will be filled in automatically with a pre-written message. */
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    const context = el.getAttribute("data-whatsapp");
    const message = context && context.trim().length
      ? `Hello Shiva Gems and Jewels, I would like to enquire about ${context}.`
      : "Hello Shiva Gems and Jewels, I would like to make an enquiry.";
    el.setAttribute("href", buildWhatsAppLink(message));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  /* ---------- Context-aware mailto buttons ---------- */
  document.querySelectorAll("[data-email-enquiry]").forEach((el) => {
    const context = el.getAttribute("data-email-enquiry");
    const subject = "Enquiry — Shiva Gems and Jewels";
    const body = context && context.trim().length
      ? `Hello Shiva Gems and Jewels,\n\nI would like to enquire about ${context}.\n\n`
      : "Hello Shiva Gems and Jewels,\n\nI would like to make an enquiry.\n\n";
    el.setAttribute("href", buildMailtoLink(subject, body));
  });

  /* ---------- "What are you looking for" chip selector (contact page) ---------- */
  document.querySelectorAll(".chip").forEach((chip) => {
    const input = chip.querySelector("input");
    if (!input) return;
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-selected", true);
      document.querySelectorAll(".chip").forEach((c) => {
        if (c !== chip && c.parentElement === chip.parentElement) {
          c.classList.remove("is-selected");
        }
      });
    });
  });

  /* ---------- Contact / appointment form ---------- */
  const form = document.querySelector("#enquiryForm");
  if (!form) return;

  function collectFormData() {
    const data = new FormData(form);
    return {
      name: (data.get("name") || "").toString().trim(),
      phone: (data.get("phone") || "").toString().trim(),
      email: (data.get("email") || "").toString().trim(),
      interest: (data.get("interest") || "").toString().trim(),
      date: (data.get("date") || "").toString().trim(),
      message: (data.get("message") || "").toString().trim()
    };
  }

  function buildMessageBody(d) {
    let lines = [
      "New enquiry from the Shiva Gems and Jewels website:",
      "",
      `Name: ${d.name || "-"}`,
      `Phone / WhatsApp: ${d.phone || "-"}`,
      `Email: ${d.email || "-"}`,
      `Looking for: ${d.interest || "-"}`
    ];
    if (d.date) lines.push(`Preferred appointment date: ${d.date}`);
    lines.push("", `Message: ${d.message || "-"}`);
    return lines.join("\n");
  }

  function handleContactForm(sendVia) {
    const d = collectFormData();
    if (!d.name || !d.phone) {
      const notice = document.querySelector("#formNotice");
      if (notice) notice.textContent = "Please share your name and phone number so we can reach you.";
      return;
    }
    const body = buildMessageBody(d);
    if (sendVia === "whatsapp") {
      window.open(buildWhatsAppLink(body), "_blank", "noopener,noreferrer");
    } else {
      window.location.href = buildMailtoLink("Appointment Enquiry — Shiva Gems and Jewels", body);
    }
  }

  const whatsappBtn = document.querySelector("#sendWhatsApp");
  const emailBtn = document.querySelector("#sendEmail");

  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleContactForm("whatsapp");
    });
  }
  if (emailBtn) {
    emailBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleContactForm("email");
    });
  }

  // Prevent native submit (no backend configured) — see comment block above.
  form.addEventListener("submit", (e) => e.preventDefault());
})();

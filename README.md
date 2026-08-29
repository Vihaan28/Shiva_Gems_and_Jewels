# Shiva Gems and Jewels — Website

A multi-page website for Shiva Gems and Jewels (Delhi, est. 2006), covering
Diamonds, Gold, Polki and any collections added later. Built with plain
HTML, CSS and JavaScript — the original visual design, animations and
layouts are unchanged — now paired with a **Decap CMS** admin dashboard
at `/admin` so non-technical employees can manage products, categories
and homepage content without touching any code.

---

## 1. Local development

You don't need Node, npm, or any build step to just view the site.

### Option A — just open it (quickest)
Double-click `index.html`. Good enough for a quick look, but the product
grids need `data/*.json` to be fetched via `fetch()`, which most browsers
block when opening a file directly — **Option B is recommended**.

### Option B — run a tiny local server (recommended)
```bash
cd SHIVA-GEMS-AND-JEWELS
python3 -m http.server 8000
```
Then open **http://localhost:8000**.

### Regenerating `/data/*.json` locally
If you edit anything under `/content/` by hand while testing, regenerate
the JSON files the frontend reads:
```bash
npm run build
```
This has no external dependencies — it just runs
`scripts/build-data.js` with plain Node.

---

## 2. Project structure

```
SHIVA-GEMS-AND-JEWELS/
│
├── index.html, collections.html, diamonds.html, gold.html, polki.html,
│   bridal.html, bespoke.html, story.html, craftsmanship.html,
│   journal.html, visit.html, contact.html    Existing static pages
│
├── collection.html          NEW — dynamic template for any category
│                              an employee creates in the CMS beyond
│                              Diamonds/Gold/Polki, e.g.
│                              collection.html?category=jadau
├── product-view.html        NEW — dynamic template for every product;
│                              product-view.html?slug=<product-id>
├── product/                  Original static product pages (kept for
│   ├── diamond-001.html      backward-compatible links; new products
│   ├── gold-001.html         use product-view.html instead — see
│   └── polki-001.html        "Product pages" below)
│
├── content/                  NEW — CMS-managed content (edited via
│   ├── products/*.md         /admin, not by hand)
│   ├── categories/*.md
│   └── settings/{contact,homepage}.yml
│
├── data/                     NEW — generated JSON the frontend fetches;
│   ├── products.json         rebuilt automatically on every deploy —
│   ├── categories.json       never edit these directly
│   └── settings.json
│
├── admin/                     NEW — the CMS dashboard
│   ├── index.html
│   └── config.yml
│
├── scripts/
│   └── build-data.js          NEW — turns /content into /data on deploy
│
├── css/                       Colours, typography, layout, animations —
│                                unchanged
├── js/
│   ├── products.js            UPDATED — now fetches data/products.json
│   │                            and data/categories.json instead of a
│   │                            hardcoded array
│   ├── settings.js            NEW — applies contact/homepage CMS
│   │                            content across every page
│   ├── category-view.js       NEW — powers collection.html
│   ├── product-view.js        NEW — powers product-view.html
│   ├── main.js, navigation.js, animations.js, filters.js, enquiry.js
│                                Unchanged in behaviour (enquiry.js can
│                                now be updated live from CMS settings)
│
├── assets/                    Photos, logo, favicon — unchanged.
│                               New CMS uploads land in assets/uploads/
│
├── netlify.toml                NEW — build command + config
├── package.json                NEW — declares the build script
├── EMPLOYEE-GUIDE.md            NEW — for staff managing the site
├── ADMIN-GUIDE.md                NEW — for the site owner/admin
└── README.md                    This file
```

---

## 3. Content management system (CMS)

Employees manage the site at **`/admin`** — see **EMPLOYEE-GUIDE.md**
for full click-by-click instructions. In short:

1. Log in at `/admin`.
2. Add/edit Products or Categories, or update Site Settings.
3. Click **Publish** (or **Save** for Settings).
4. The site rebuilds automatically within 1–2 minutes.

### How it works technically
Decap CMS commits content as Markdown/YAML files under `/content/`.
Netlify's build step (`scripts/build-data.js`) reads those files and
writes plain JSON to `/data/`, which the existing frontend JavaScript
fetches at runtime to render product grids, category pages, product
detail pages and site-wide contact info — all using the original,
unchanged CSS and markup.

---

## 4. Admin login

Authentication is handled by **Netlify Identity** + **Git Gateway** —
see **ADMIN-GUIDE.md** for enabling this, inviting/removing employees,
and resetting access.

---

## 5. Product management

- **Add / edit / delete / hide** a product, set its primary and
  additional images, price and price type, featured/homepage/bridal
  flags, and display order — all from `/admin` → Products. See
  **EMPLOYEE-GUIDE.md**.
- New products automatically get a detail page at
  `product-view.html?slug=<id>` — nobody creates a new HTML file.
- **Price display logic:** *Price on Request* → "Enquire for Price";
  *Fixed Price* → "₹4,50,000"; *Starting From* → "Starting from
  ₹2,00,000" — handled by `formatShivaPrice()` in `js/products.js`.

---

## 6. Category management

New categories are created at `/admin` → Categories — no HTML file is
created by hand. The three original categories (Diamonds, Gold, Polki)
keep their existing dedicated pages (`diamonds.html`, `gold.html`,
`polki.html`) exactly as designed; any category created afterwards
automatically uses `collection.html?category=<slug>` instead, with the
same design.

---

## 7. Image management

Employees upload images directly in the CMS (drag-and-drop supported).
New uploads are stored under `assets/uploads/`. Existing photography in
`assets/diamonds/`, `assets/gold/`, `assets/polki/` etc. is untouched
and still selectable from the CMS media library.

---

## 8. Deployment

Full step-by-step instructions (GitHub → Netlify → Identity → Git
Gateway → inviting employees → testing) are in **ADMIN-GUIDE.md**.

---

## 9. Custom domain

See **ADMIN-GUIDE.md → Section 4** for connecting
`www.shivagemsandjewels.com` (or any domain), DNS records, and SSL —
Netlify issues HTTPS automatically once the domain is verified.

---

## 10. Troubleshooting

See **ADMIN-GUIDE.md → Section 6** for a table of common CMS/deploy
issues and fixes.

---

## 11. Everything unchanged from the original build

- Colours, fonts, spacing: `css/styles.css` — see its `:root` variables.
- Animations/scroll-reveal: `css/animations.css`, `js/animations.js`.
- Navigation structure: unchanged; still appears in desktop nav, mobile
  menu and footer on every page.
- WhatsApp/email enquiry buttons: `js/enquiry.js` — the phone number and
  email address are now kept in sync with CMS Contact Details
  automatically (`applyShivaContactSettings()`).
- Contact form: still has no backend by default (opens WhatsApp/email
  pre-filled) — see the comment block at the top of `js/enquiry.js` if
  you want to connect a real backend later.

---

Built for Shiva Gems and Jewels — Delhi, est. 2006.

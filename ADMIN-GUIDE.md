# Admin Guide — Shiva Gems and Jewels Website

This guide is for the site owner/administrator. It covers deployment,
employee access, backups, and troubleshooting. For day-to-day product
editing, send employees to **EMPLOYEE-GUIDE.md** instead.

---

## 1. How the system works (in plain terms)

- The website's design (HTML/CSS/JS) lives in a **GitHub repository**.
- **Netlify** hosts the live site and rebuilds it automatically every
  time something changes.
- **Decap CMS**, at `/admin`, is the dashboard employees use. When they
  click Publish, it saves a small content file into the GitHub
  repository on their behalf (they never see GitHub itself).
- Netlify notices that change, runs a small build step
  (`node scripts/build-data.js`) that turns all the content files into
  `data/products.json`, `data/categories.json` and `data/settings.json`,
  and republishes the site — usually within 1–2 minutes.
- **Netlify Identity** + **Git Gateway** control who can log into
  `/admin` — this is separate from GitHub accounts, so employees never
  need a GitHub login.

---

## 2. First-time deployment

### Step 1 — Prepare the project
You already have the full project folder (with `/admin`, `/content`,
`/scripts`, `netlify.toml`, and `package.json` added). No further setup
is needed before uploading it.

### Step 2 — Create a GitHub repository
1. Go to [github.com](https://github.com) and sign in (create a free
   account if you don't have one).
2. Click **New repository**. Name it e.g. `shiva-gems-and-jewels`. Keep
   it **Private** if you prefer.
3. Don't initialise it with a README (you already have one).

### Step 3 — Upload the project
Easiest option if you're not familiar with Git: on the new repository's
GitHub page, click **uploading an existing file**, then drag the whole
project folder's contents in and commit.

(If you're comfortable with the command line instead:
```bash
cd SHIVA-GEMS-AND-JEWELS
git init
git remote add origin https://github.com/<your-username>/shiva-gems-and-jewels.git
git add .
git commit -m "Initial upload"
git branch -M main
git push -u origin main
```
)

### Step 4 — Connect GitHub to Netlify
1. Go to [app.netlify.com](https://app.netlify.com) and sign up/sign in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and authorise Netlify, then select your
   `shiva-gems-and-jewels` repository.

### Step 5 — Configure build settings
Netlify will read `netlify.toml` automatically:
- **Build command:** `node scripts/build-data.js`
- **Publish directory:** `.` (the project root)

You shouldn't need to change anything here — just confirm and deploy.

### Step 6 — Deploy
Click **Deploy site**. Netlify gives you a temporary address like
`random-name-123.netlify.app` — the site is now live there.

### Step 7 — Set up Decap CMS
Already done in the project (`/admin/index.html` and
`/admin/config.yml`) — nothing further needed here.

### Step 8 — Turn on Netlify Identity
1. In your Netlify site dashboard, go to **Site configuration →
   Identity**.
2. Click **Enable Identity**.
3. Under **Registration**, set it to **Invite only** (so random people
   can't sign themselves up).

### Step 9 — Turn on Git Gateway
1. Still under **Identity → Services**, click **Enable Git Gateway**.
   This lets the CMS save content on employees' behalf without giving
   them a GitHub account.

### Step 10 — Invite employees
1. Go to **Identity** in your Netlify dashboard.
2. Click **Invite users**, enter their email address.
3. They'll receive an email with a secure set-password link. Invite emails do not contain a plain-text password; they are meant to be opened and used to create one.
4. Make sure the Netlify Identity site URL points at your admin route, e.g. `https://www.yoursite.com/admin` or `https://your-site-name.netlify.app/admin`. The project now redirects any identity token sent to the public homepage back into `/admin` automatically.

### Step 11 — Access the admin panel
Once your custom domain is connected (see Section 4), employees go to:
```
https://mywebsite.com/admin
```
Until then, use the Netlify address, e.g.
`https://random-name-123.netlify.app/admin`.

### Step 12 — Test adding a product
Log in, add a test product with a placeholder photo, publish, and
confirm it appears on the live site within a couple of minutes.

### Step 13 — Test uploading images
Confirm the image appears correctly on both the collection page and the
product's own page.

### Step 14 — Test editing a price
Edit the test product's price and price type, publish, and confirm the
live site shows the new price formatted correctly (₹ with commas).

### Step 15 — Test creating a new category
Create a test category (e.g. "Test Category"), confirm it appears on
the homepage collections strip and that its page loads at
`/collection.html?category=test-category`.

### Step 16 — Test publishing and confirm changes go live
Delete your test product and test category once you've confirmed
everything works.

---

## 3. Adding, removing, and resetting employee access

- **Add an employee:** Netlify dashboard → Identity → Invite users.
- **Remove an employee:** Netlify dashboard → Identity → click the user
  → Delete user. Do this as soon as someone leaves — their access
  doesn't expire on its own.
- **Reset access:** click the user → "Send password recovery" or delete
  and re-invite them.

Nobody gets access automatically — every employee must be individually
invited.

---

## 4. Custom domain

1. In Netlify: **Site configuration → Domain management → Add a
   custom domain**, e.g. `www.shivagemsandjewels.com`.
2. Netlify shows you DNS records to add (usually a `CNAME` for `www`
   pointing to your Netlify site, and an `A` record for the bare
   domain). Add these at wherever you bought the domain (GoDaddy,
   Namecheap, Google Domains, etc.) under its DNS settings.
3. DNS changes can take a few minutes to 48 hours to take effect.
4. Netlify automatically issues a free HTTPS/SSL certificate once the
   domain is verified — no extra steps needed.

---

## 5. Backups and version history

- Every single change (every product add/edit/delete, every category
  change) is automatically recorded as a "commit" in your GitHub
  repository — this is a complete history you never have to think
  about.
- To see the history: open your GitHub repository → **Commits**.
- To restore an earlier version of a specific content file: open that
  file in GitHub, click **History**, pick an earlier version, and
  either copy its content back into the CMS or use GitHub's "Revert"
  option.
- Netlify also keeps every past deploy under **Deploys** in its
  dashboard — you can roll the entire live site back to any previous
  deploy with one click if something ever looks wrong.

---

## 6. CMS troubleshooting

| Problem | Likely cause / fix |
|---|---|
| Employee can't log in | Check they were invited (Identity tab) and used the invite link. Resend if the invite expired. |
| Published a change but the site doesn't update | Wait 2 minutes, then hard-refresh (Ctrl/Cmd+Shift+R). If it's still not updated after 5 minutes, check **Deploys** in Netlify for a failed build. |
| Build failed in Netlify | Open the failed deploy's log. Most failures are a malformed content file — check the most recently published product/category for anything unusual, or contact your developer with the log. |
| New category page shows "Collection not found" | The slug field on the category doesn't match the URL — check spelling/case, they must match exactly. |
| Images not showing | Make sure the image finished uploading (a progress bar appears) before publishing. |

---

## 7. Scalability notes

See the **Scalability** section of the main patch document / README for
what (if anything) to revisit as the catalogue grows — in short: this
setup comfortably handles hundreds of products as-is, and the main
future consideration is moving image hosting to a dedicated image CDN
(e.g. Cloudinary) once the catalogue is very large or very
high-resolution.

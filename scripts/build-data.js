/* =========================================================================
   SHIVA GEMS AND JEWELS — CMS BUILD SCRIPT
   -------------------------------------------------------------------------
   Runs automatically on every Netlify deploy (see netlify.toml).
   It does NOT touch any HTML/CSS/JS design files. All it does is:

     1. Read every file the CMS (Decap) has saved under /content/
     2. Convert them into three plain JSON files under /data/
     3. The existing frontend JavaScript fetches those JSON files

   This is the ONLY piece that turns "employee clicked Publish in the CMS"
   into "the live website shows the change" — nothing else in the build
   is required, and nothing here needs to be edited by hand.
   ========================================================================= */

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "content");
const DATA_DIR = path.join(__dirname, "..", "data");

/* -------------------------------------------------------------------------
   Minimal YAML reader for the flat structures Decap CMS writes for this
   project (simple key: value pairs, one level of "- image: x" lists,
   [] for empty lists). No npm dependency required — see
   ADMIN-GUIDE.md if the CMS schema ever grows beyond what this parses.
   ------------------------------------------------------------------------- */
function parseScalar(raw) {
  const v = raw.trim();
  if (v === "" ) return "";
  if (v === "[]") return [];
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseSimpleYaml(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const result = {};
  let currentListKey = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const listItemMatch = line.match(/^\s+-\s+(.*)$/);
    if (listItemMatch && currentListKey) {
      const itemContent = listItemMatch[1];
      const subFieldMatch = itemContent.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (subFieldMatch) {
        result[currentListKey].push({ [subFieldMatch[1]]: parseScalar(subFieldMatch[2]) });
      } else {
        result[currentListKey].push(parseScalar(itemContent));
      }
      continue;
    }

    const kvMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const rest = kvMatch[2];
      if (rest === "" || rest === undefined) {
        // Could be the start of a list on following lines.
        result[key] = [];
        currentListKey = key;
      } else {
        result[key] = parseScalar(rest);
        currentListKey = null;
      }
    }
  }
  return result;
}

function readFrontmatterFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return parseSimpleYaml(match[1]);
}

function readCollection(dirName) {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readFrontmatterFile(path.join(dir, f)));
}

function readSettingsFile(fileName) {
  const filePath = path.join(CONTENT_DIR, "settings", fileName);
  if (!fs.existsSync(filePath)) return {};
  return parseSimpleYaml(fs.readFileSync(filePath, "utf8"));
}

function build() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  // ---- Products ----
  const products = readCollection("products")
    .filter((p) => p.published !== false)
    .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  fs.writeFileSync(
    path.join(DATA_DIR, "products.json"),
    JSON.stringify(products, null, 2)
  );

  // ---- Categories ----
  const categories = readCollection("categories")
    .filter((c) => c.published !== false)
    .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  fs.writeFileSync(
    path.join(DATA_DIR, "categories.json"),
    JSON.stringify(categories, null, 2)
  );

  // ---- Settings (contact + homepage merged into one file) ----
  const settings = {
    contact: readSettingsFile("contact.yml"),
    homepage: readSettingsFile("homepage.yml")
  };
  fs.writeFileSync(
    path.join(DATA_DIR, "settings.json"),
    JSON.stringify(settings, null, 2)
  );

  console.log(
    `Built data: ${products.length} products, ${categories.length} categories, settings.json`
  );
}

build();

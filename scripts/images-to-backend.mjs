// images-to-backend.mjs — move the app's static UI images to the backend.
//
// Static UI/demo art was bundled via require(), which made the release APK
// 363 MB (232 of them are lossless PNG photos ~2.7 MB each). The backend
// already serves GET /assets/*, so these belong there: the app then ships lean
// and the images swap by data source, not by rebuild.
//
// Reads every require("…/assets/images/X") in the app, converts that file to
// WebP (downscaled — they render at ~300-400px on a phone), and writes it to
// apana_backend/assets/images/X.webp preserving the relative path, so the URL
// is a pure function of the original ref.
//
//   node scripts/images-to-backend.mjs [--dry]
import sharp from "sharp";
import { readdirSync, readFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname, extname } from "node:path";

const APP = resolve(import.meta.dirname, "..");
const SRC_ROOT = join(APP, "assets/images");
const DEST_ROOT = resolve(APP, "../apana_backend/assets/images");
const DRY = process.argv.includes("--dry");

const MAX_EDGE = 720;   // phones render these at ~300-400px; 720 keeps 2x crisp
const QUALITY = 80;

// ── collect every referenced image path (relative to assets/images) ──
const RE = /require\("[^"]*assets\/images\/([^"]+)"\)/g;
const refs = new Set();

function scan(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) { scan(p); continue; }
    if (!/\.(ts|tsx|js|jsx)$/.test(e.name)) continue;
    const src = readFileSync(p, "utf8");
    for (const m of src.matchAll(RE)) refs.add(m[1]);
  }
}
for (const d of ["data", "components", "app", "lib", "hooks"]) {
  const p = join(APP, d);
  if (existsSync(p)) scan(p);
}

console.log(`referenced images: ${refs.size}`);

let done = 0, missing = [], bytesIn = 0, bytesOut = 0;

for (const rel of [...refs].sort()) {
  const src = join(SRC_ROOT, rel);
  if (!existsSync(src)) { missing.push(rel); continue; }
  // URL always ends .webp — assetImg() swaps the extension to match.
  const outRel = rel.slice(0, -extname(rel).length) + ".webp";
  const out = join(DEST_ROOT, outRel);
  bytesIn += statSync(src).size;
  if (DRY) { done++; continue; }
  mkdirSync(dirname(out), { recursive: true });
  await sharp(src)
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  bytesOut += statSync(out).size;
  done++;
  if (done % 100 === 0) console.log(`  ${done}/${refs.size}`);
}

const mb = (b) => (b / 1048576).toFixed(1) + " MB";
console.log(`converted ${done}${DRY ? " (dry)" : ""}  ${mb(bytesIn)} -> ${mb(bytesOut)}`);
if (missing.length) {
  console.log(`\nMISSING ${missing.length} (referenced but not on disk — these would 404):`);
  for (const m of missing) console.log("  " + m);
}

// fix-bad-pngs.mjs — make every *.png under assets/ a REAL png.
// Some assets are JPEG/WebP wearing a .png extension (AAPT rejects them in the
// release build: "does not start with PNG signature"). RN decodes by content so
// dev worked; the native drawable compiler does not. Re-encode in place (sharp
// reads the real format, writes valid PNG — pixels unchanged). Unreadable files
// become a 1x1 transparent PNG so the build never dies on one corrupt asset.
//   node scripts/fix-bad-pngs.mjs
import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// default = this app's assets; pass a path to fix another app's assets
// (run from here so sharp resolves from this app's node_modules).
const ROOT = process.argv[2] ? resolve(process.argv[2]) : resolve(import.meta.dirname, "../assets");
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

let ok = 0, fixed = 0, placeholder = 0;
const placeholders = [];

async function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { await walk(p); continue; }
    if (!e.name.toLowerCase().endsWith(".png")) continue;
    const data = readFileSync(p);
    if (data.subarray(0, 8).equals(PNG_SIG)) { ok++; continue; }
    try {
      const buf = await sharp(data).png().toBuffer();
      writeFileSync(p, buf);
      fixed++;
    } catch {
      const ph = await sharp({ create: { width: 1, height: 1, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).png().toBuffer();
      writeFileSync(p, ph);
      placeholder++;
      placeholders.push(p.replace(ROOT, "assets"));
    }
  }
}

await walk(ROOT);
console.log(`valid ${ok} · re-encoded ${fixed} · placeholder ${placeholder}`);
if (placeholders.length) console.log("unreadable → 1x1 placeholder:\n  " + placeholders.join("\n  "));

// ============================================================
// One-shot: category product PNG -> WebP (q95, visually lossless).
//
// These are 1024x1024 illustrated tiles. True-lossless WebP measured
// LARGER than the PNG on ~half of them (PNG already packs flat art well),
// so it gives no bundle win. q95 + smartSubsample is perceptually
// indistinguishable from source — no visible artifacts at full 1024 view,
// let alone the 110px tile — while cutting ~75% of the weight. Original
// resolution is preserved (format change only, no resize).
//
//   node tools/convert-category-webp.mjs           # convert, keep PNGs
//   node tools/convert-category-webp.mjs --prune   # also delete source PNGs
//
// Writes <name>.webp beside each <name>.png. Verifies every output exists
// and is non-empty before (optionally) pruning the PNG.
// ============================================================

import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";

const DIR   = "assets/images/category/products";
const PRUNE = process.argv.includes("--prune");

const files = (await readdir(DIR)).filter((f) => f.toLowerCase().endsWith(".png"));
if (files.length === 0) {
  console.error(`No PNGs in ${DIR}`);
  process.exit(1);
}

let inTotal = 0;
let outTotal = 0;
let done = 0;
const failed = [];

for (const f of files) {
  const src = join(DIR, f);
  const dst = join(DIR, f.replace(/\.png$/i, ".webp"));
  try {
    const inSize = (await stat(src)).size;
    // q95 + smartSubsample + max effort: visually lossless, ~75% smaller.
    await sharp(src).webp({ quality: 95, effort: 6, smartSubsample: true }).toFile(dst);
    const outSize = (await stat(dst)).size;
    if (outSize === 0) throw new Error("empty output");
    inTotal += inSize;
    outTotal += outSize;
    done++;
    if (done % 50 === 0) console.log(`  ...${done}/${files.length}`);
  } catch (e) {
    failed.push(`${f}: ${e.message}`);
  }
}

console.log(`\nconverted ${done}/${files.length}`);
console.log(`in   ${(inTotal / 1e6).toFixed(1)} MB`);
console.log(`out  ${(outTotal / 1e6).toFixed(1)} MB`);
if (inTotal > 0) console.log(`save ${(100 * (1 - outTotal / inTotal)).toFixed(1)}%`);
if (failed.length) {
  console.log(`\nFAILED (${failed.length}):`);
  for (const m of failed) console.log("  " + m);
  process.exit(1);
}

if (PRUNE) {
  // Only prune a PNG whose WebP twin verifiably exists and is non-empty.
  let pruned = 0;
  for (const f of files) {
    const webp = join(DIR, f.replace(/\.png$/i, ".webp"));
    try {
      if ((await stat(webp)).size > 0) {
        await unlink(join(DIR, f));
        pruned++;
      }
    } catch {
      /* leave the PNG if its WebP is missing */
    }
  }
  console.log(`pruned ${pruned} PNGs`);
}

// gen-app-logos.mjs — rasterize each app's brand SVG into the Expo PNG asset set.
// Launcher icon + splash + adaptive icon require PNG (Expo/native constraint),
// so this bakes the SVG (source of truth in ../../Apana Logo) into:
//   assets/images/{icon,splash-icon,android-icon-foreground,android-icon-background,favicon}.png
// Filenames match app.json, so no config edit is needed. Re-run after a logo change.
//   (from apana_store_native, which has sharp):  node scripts/gen-app-logos.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");        // apana_store monorepo root
const LOGO_DIR = resolve(ROOT, "Apana Logo");

// bg = opaque icon/adaptive-background fill. White reads best: the logo carries
// both orange (#f89047) and blue (#4683bb), and blue would vanish on a blue bg.
const WHITE = "#ffffff";
const APPS = [
  { dir: "apana_store_native",                   svg: "Apana Store Logo.svg" },
  { dir: "apana_seller/apana_seller_native",     svg: "Apana Seller Logo.svg" },
  { dir: "apana_partner",                        svg: "Apana Partner Logo.svg" },
];

const ICON = 1024;

// render the SVG to a transparent PNG buffer at `edge` px (crisp via high density)
async function logoBuf(svgPath, edge) {
  const svg = readFileSync(svgPath);
  return sharp(svg, { density: 512 })
    .resize(edge, edge, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

// logo centered on a solid canvas (opaque — iOS icons must have no alpha)
async function onSolid(svgPath, size, scale, bg, out) {
  const edge = Math.round(size * scale);
  const logo = await logoBuf(svgPath, edge);
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: logo, gravity: "center" }])
    .flatten({ background: bg })
    .png()
    .toFile(out);
}

// logo centered on a transparent canvas (splash + adaptive foreground)
async function onClear(svgPath, size, scale, out) {
  const edge = Math.round(size * scale);
  const logo = await logoBuf(svgPath, edge);
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(out);
}

// solid color square (adaptive background)
async function solid(size, bg, out) {
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } }).png().toFile(out);
}

for (const app of APPS) {
  const svgPath = resolve(LOGO_DIR, app.svg);
  const img = (f) => resolve(ROOT, app.dir, "assets/images", f);

  // icon: 88% logo on white, opaque (iOS mask rounds the corners)
  await onSolid(svgPath, ICON, 0.88, WHITE, img("icon.png"));
  // adaptive: foreground glyph inside the 66% safe zone, solid white background
  await onClear(svgPath, ICON, 0.62, img("android-icon-foreground.png"));
  await solid(ICON, WHITE, img("android-icon-background.png"));
  // splash: transparent, contain (app.json scales via imageWidth)
  await onClear(svgPath, ICON, 0.9, img("splash-icon.png"));
  // favicon
  await onSolid(svgPath, 196, 0.9, WHITE, img("favicon.png"));

  console.log(`✓ ${app.dir}`);
}
console.log("done — 5 PNGs per app (icon, adaptive fg+bg, splash, favicon). Monochrome left as-is.");

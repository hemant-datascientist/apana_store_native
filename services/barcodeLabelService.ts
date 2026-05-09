// Barcode label generator — produces SVG markup for printable EAN-13 labels.
//
// Strategy: render barcode bars + human-readable digits + product name + price into a single SVG string.
// Caller can then:
//   - render directly via react-native-svg (`<SvgXml xml={svg} />`),
//   - export to PNG via react-native-view-shot,
//   - or send to a print pipeline (PDF stitching is out of scope for V1).
//
// Why SVG: vector, scales cleanly to any printer DPI, no native dependency beyond react-native-svg
// which the project already uses for the India map and other graphics.

// =========================================================================
// EAN-13 module pattern tables.
// Each pattern is a 7-character string of "0" (white space) and "1" (black bar).
// =========================================================================

// Left-side "L" (odd parity) codes for digits 0-9.
const L_CODES = [
  "0001101","0011001","0010011","0111101","0100011",
  "0110001","0101111","0111011","0110111","0001011",
];

// Left-side "G" (even parity) codes — used for some left positions per the parity pattern.
const G_CODES = [
  "0100111","0110011","0011011","0100001","0011101",
  "0111001","0000101","0010001","0001001","0010111",
];

// Right-side "R" codes — used for all right-half digits.
const R_CODES = [
  "1110010","1100110","1101100","1000010","1011100",
  "1001110","1010000","1000100","1001000","1110100",
];

// First-digit parity selector — picks L vs G for each of the 6 left-half positions.
const PARITY_PATTERNS = [
  "LLLLLL","LLGLGG","LLGGLG","LLGGGL","LGLLGG",
  "LGGLLG","LGGGLL","LGLGLG","LGLGGL","LGGLGL",
];

// Build the full EAN-13 module string (95 modules) for a 13-digit barcode.
// Caller is responsible for ensuring the input has a valid checksum — this routine does not validate.
export function buildEan13Pattern(digits13: string): string {
  if (digits13.length !== 13 || !/^\d{13}$/.test(digits13)) {
    throw new Error(`EAN-13 pattern requires 13 digits: ${digits13}`);
  }
  const first = parseInt(digits13[0], 10);
  const left = digits13.slice(1, 7);
  const right = digits13.slice(7, 13);
  const parity = PARITY_PATTERNS[first];

  let pattern = "101"; // start guard (3 modules)
  for (let i = 0; i < 6; i++) {
    const d = parseInt(left[i], 10);
    pattern += parity[i] === "L" ? L_CODES[d] : G_CODES[d];
  }
  pattern += "01010"; // center guard (5 modules)
  for (let i = 0; i < 6; i++) {
    const d = parseInt(right[i], 10);
    pattern += R_CODES[d];
  }
  pattern += "101"; // end guard (3 modules)
  // Total: 3 + 42 + 5 + 42 + 3 = 95 modules
  return pattern;
}

// =========================================================================
// SVG renderer
// =========================================================================

// Configurable knobs for label sizing. Defaults target a ~50mm × 30mm shelf-tag print at 300dpi.
export interface LabelOptions {
  productName: string;
  pricePaise: number;
  barcode: string;       // exactly 13 digits (EAN-13)
  moduleWidth?: number;  // px per module (default 2)
  barHeight?: number;    // px (default 60)
  quietZoneModules?: number; // padding modules each side (default 10)
  showHumanDigits?: boolean; // render digits beneath bars (default true)
  showPrice?: boolean;   // render price line (default true)
  showName?: boolean;    // render product name above bars (default true)
}

// Format paise as Rs string for printing. Avoids Intl dependency (RN bundles vary).
function formatPriceInr(paise: number): string {
  const rupees = Math.floor(paise / 100);
  const p = paise % 100;
  return `Rs ${rupees}.${p.toString().padStart(2, "0")}`;
}

// Escape XML special chars for safe insertion into SVG text nodes.
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Generate a complete SVG string for a printable label.
// Output is self-contained (xmlns set), suitable for SvgXml or file export.
export function generateLabelSvg(opts: LabelOptions): string {
  const moduleWidth = opts.moduleWidth ?? 2;
  const barHeight = opts.barHeight ?? 60;
  const quiet = opts.quietZoneModules ?? 10;
  const showDigits = opts.showHumanDigits ?? true;
  const showPrice = opts.showPrice ?? true;
  const showName = opts.showName ?? true;

  const pattern = buildEan13Pattern(opts.barcode);
  const totalModules = pattern.length + quiet * 2;
  const width = totalModules * moduleWidth;

  // Vertical layout: name (top) + bars + digits + price (bottom).
  const nameH = showName ? 18 : 0;
  const digitsH = showDigits ? 14 : 0;
  const priceH = showPrice ? 18 : 0;
  const padding = 6;
  const height = padding + nameH + barHeight + digitsH + priceH + padding;

  // Build bar rects from the module pattern.
  const bars: string[] = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "1") {
      const x = (i + quiet) * moduleWidth;
      const y = padding + nameH;
      bars.push(`<rect x="${x}" y="${y}" width="${moduleWidth}" height="${barHeight}" fill="#000"/>`);
    }
  }

  // Human-readable digits: split as "1 | 6 | 6" per EAN-13 convention.
  let digitsSvg = "";
  if (showDigits) {
    const y = padding + nameH + barHeight + digitsH - 2;
    const d0 = opts.barcode[0];
    const dLeft = opts.barcode.slice(1, 7);
    const dRight = opts.barcode.slice(7, 13);
    // Position each group roughly under its bar region.
    const xFirst = quiet * moduleWidth - moduleWidth * 4;
    const xLeftCenter = (quiet + 3 + 24) * moduleWidth;   // middle of left group (after start guard + 3 digits)
    const xRightCenter = (quiet + 3 + 42 + 5 + 21) * moduleWidth; // middle of right group
    digitsSvg += `<text x="${Math.max(xFirst, 0)}" y="${y}" font-family="monospace" font-size="12" fill="#000">${d0}</text>`;
    digitsSvg += `<text x="${xLeftCenter}" y="${y}" font-family="monospace" font-size="12" fill="#000" text-anchor="middle">${dLeft}</text>`;
    digitsSvg += `<text x="${xRightCenter}" y="${y}" font-family="monospace" font-size="12" fill="#000" text-anchor="middle">${dRight}</text>`;
  }

  // Top product name (truncated with ellipsis at character count to keep SVG simple).
  let nameSvg = "";
  if (showName) {
    const safeName = xmlEscape(opts.productName.length > 36 ? opts.productName.slice(0, 33) + "..." : opts.productName);
    nameSvg = `<text x="${width / 2}" y="${padding + 14}" font-family="sans-serif" font-size="13" font-weight="600" fill="#000" text-anchor="middle">${safeName}</text>`;
  }

  // Bottom price line.
  let priceSvg = "";
  if (showPrice) {
    const y = padding + nameH + barHeight + digitsH + priceH - 4;
    priceSvg = `<text x="${width / 2}" y="${y}" font-family="sans-serif" font-size="14" font-weight="700" fill="#000" text-anchor="middle">${xmlEscape(formatPriceInr(opts.pricePaise))}</text>`;
  }

  // Compose final SVG. White background rect ensures clean print on coloured surfaces.
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#fff"/>
  ${nameSvg}
  ${bars.join("")}
  ${digitsSvg}
  ${priceSvg}
</svg>`;
}

// Convenience batch helper — generate labels for a list of products.
// Useful for "print sheet" flows (real PDF stitching is out of scope; caller can render each SVG to canvas
// and place on a page grid).
export function generateLabelBatch(items: LabelOptions[]): string[] {
  return items.map(generateLabelSvg);
}

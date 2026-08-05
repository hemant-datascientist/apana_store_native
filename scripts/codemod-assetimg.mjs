// codemod-assetimg.mjs — rewrite bundled image requires to backend URLs.
//
//   require("../../assets/images/home/banners/x.png")  ->  assetImg("home/banners/x.png")
//
// and insert `import { assetImg } from "<rel>/lib/assetImg";` with the right
// relative depth for each file. Skips commented-out requires (the codebase has
// an "// e.g. s1: require(...)" example that is not a real reference).
//
//   node scripts/codemod-assetimg.mjs [--dry]
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";

const APP = resolve(import.meta.dirname, "..");
const DRY = process.argv.includes("--dry");
const RE = /require\("[^"]*assets\/images\/([^"]+)"\)/g;

const files = [];
function scan(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) { scan(p); continue; }
    if (/\.(ts|tsx)$/.test(e.name)) files.push(p);
  }
}
for (const d of ["data", "components", "app", "lib", "hooks"]) {
  const p = join(APP, d);
  if (existsSync(p)) scan(p);
}

// import specifier from a file to lib/assetImg, POSIX-style, "./" prefixed
function importPath(file) {
  let rel = relative(dirname(file), join(APP, "lib/assetImg")).split("\\").join("/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

let changedFiles = 0, changedRefs = 0;

for (const file of files) {
  const src = readFileSync(file, "utf8");
  if (!RE.test(src)) { RE.lastIndex = 0; continue; }
  RE.lastIndex = 0;

  let hits = 0;
  const out = src.replace(RE, (whole, rel, offset) => {
    // leave commented-out examples alone — they are documentation, not refs
    const lineStart = src.lastIndexOf("\n", offset) + 1;
    const before = src.slice(lineStart, offset);
    if (/^\s*(\/\/|\*)/.test(before)) return whole;
    hits++;
    return `assetImg("${rel}")`;
  });
  if (hits === 0) continue;

  // insert the import after the last existing import (keeps import block intact)
  let final = out;
  if (!/from ["'][^"']*lib\/assetImg["']/.test(out)) {
    const imports = [...out.matchAll(/^import .*?;$/gms)];
    const stmt = `import { assetImg } from "${importPath(file)}";`;
    if (imports.length) {
      const last = imports[imports.length - 1];
      const at = last.index + last[0].length;
      final = out.slice(0, at) + "\n" + stmt + out.slice(at);
    } else {
      final = stmt + "\n" + out;
    }
  }

  changedFiles++; changedRefs += hits;
  console.log(`  ${hits.toString().padStart(3)}  ${relative(APP, file)}`);
  if (!DRY) writeFileSync(file, final);
}

console.log(`\n${DRY ? "[dry] " : ""}${changedRefs} refs in ${changedFiles} files`);

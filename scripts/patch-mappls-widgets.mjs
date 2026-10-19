// Re-apply the Mappls widget Android fixes after every install (postinstall).
//
//   node scripts/patch-mappls-widgets.mjs
//
// The three Mappls RN widgets ship build.gradle files that do not build on
// this toolchain:
//   1. `jcenter()` — removed in Gradle 9; the release build fails at
//      configuration ("Could not find method jcenter()").
//   2. Missing Material/AndroidX dependencies their native layouts use
//      (mobile_build_and_blank_screen_prevention_manual.md rule 2).
// Both had been fixed BY HAND inside node_modules and were silently lost on
// the next install — a 14-minute release build failed on it 2026-10-19. This
// script makes the fix survive installs. Idempotent: a second run changes
// nothing. Missing widget = skipped (not every install has all three).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WIDGETS = [
  "mappls-direction-widget-react-native",
  "mappls-nearby-widget-react-native",
  "mappls-search-widgets-react-native",
];
const MARKER = "// apana: material/androidx deps (scripts/patch-mappls-widgets.mjs)";
const DEPS = [
  "implementation 'com.google.android.material:material:1.9.0'",
  "implementation 'androidx.recyclerview:recyclerview:1.3.0'",
  "implementation 'androidx.coordinatorlayout:coordinatorlayout:1.2.0'",
  "implementation 'androidx.cardview:cardview:1.0.0'",
  "implementation 'androidx.constraintlayout:constraintlayout:2.1.4'",
];

let changed = 0;
for (const w of WIDGETS) {
  const f = join(ROOT, "node_modules", w, "android", "build.gradle");
  if (!existsSync(f)) { console.log(`skip  ${w} (not installed)`); continue; }
  const crlf = readFileSync(f, "utf8").includes("\r\n");
  let s = readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  const before = s;

  s = s.replace(/\bjcenter\(\)/g, "mavenCentral()");

  if (!s.includes(MARKER)) {
    // The module's own dependencies block — the one holding `implementation`
    // lines (a buildscript block above it holds `classpath` instead).
    const m = /\ndependencies\s*\{\n(?=[\s\S]*?\bimplementation\b)/.exec(s);
    if (!m) throw new Error(`${w}: no module dependencies block found — check build.gradle by hand`);
    const at = m.index + m[0].length;
    const missing = DEPS.filter((d) => !s.includes(d.split("'")[1].split(":").slice(0, 2).join(":")));
    s = s.slice(0, at) + `  ${MARKER}\n` + missing.map((d) => `  ${d}\n`).join("") + s.slice(at);
  }

  if (s !== before) {
    writeFileSync(f, crlf ? s.replace(/\n/g, "\r\n") : s);
    changed++;
    console.log(`fixed ${w}`);
  } else {
    console.log(`ok    ${w}`);
  }
}
console.log(changed ? `${changed} widget build file(s) patched` : "nothing to patch");

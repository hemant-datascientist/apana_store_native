// ============================================================
// GO BACK — self-check.
//
//   bun run lib/goBack.check.ts
//
// 🔴 THIS CHECKS THE SOURCE TREE, NOT A FUNCTION, and it is the only kind of
// test that can catch this defect.
//
// `router.back()` does NOTHING when there is no history. expo-router logs
// "The action 'GO_BACK' was not handled by any navigator" and carries on, so
// a back button that silently fails looks exactly like a working one until
// somebody lands on that screen first — from a tab, a deep link, a
// notification tap, or restored navigation state after a route was renamed.
//
// A unit test cannot find that; a grep can. Ported from the seller app's
// same-named check, which found 30 such calls across 22 screens on
// 2026-08-27 — the customer app never got the equivalent pass until now.
// ============================================================

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

let fail = 0;
function ok(label: string, cond: boolean) {
  console.log(`${cond ? "ok  " : "FAIL"}   ${label}`);
  if (!cond) fail++;
}

/**
 * `app/+not-found.tsx` is deliberately exempt: it HIDES its back button when
 * there is no history rather than offering a fallback destination, which is
 * the right behaviour for a 404 and is already guarded by `router.canGoBack()`.
 */
const EXEMPT = new Set(["app/+not-found.tsx"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

const roots = ["app", "components", "hooks"];
const offenders: string[] = [];

for (const root of roots) {
  for (const file of walk(root)) {
    const rel = file.replace(/\\/g, "/");
    if (EXEMPT.has(rel)) continue;
    const src = readFileSync(file, "utf8");
    src.split("\n").forEach((line, i) => {
      // The guarded form is fine anywhere: it has already asked.
      if (line.includes("canGoBack()")) return;
      if (/\brouter\.back\(\)/.test(line)) offenders.push(`${rel}:${i + 1}`);
    });
  }
}

ok(
  offenders.length === 0
    ? "no screen calls router.back() directly — every one goes through goBackOr()"
    : `router.back() found in ${offenders.length} place(s): ${offenders.join(", ")}`,
  offenders.length === 0,
);

// The helper itself must keep the guard. Without canGoBack the whole thing is
// just router.back() with extra steps.
const helper = readFileSync("lib/goBack.ts", "utf8");
ok("goBackOr checks canGoBack() before going back", helper.includes("canGoBack()"));
// replace, not push: arriving at the fallback means there was no stack, so
// pushing would build one whose own back button has the same problem.
ok("and REPLACES to the fallback rather than pushing", /router\.replace\(/.test(helper));
ok("with a destination, not a silent no-op", /FALLBACK/.test(helper));

console.log(fail === 0 ? "\nALL PASS" : `\n${fail} FAILED`);
process.exit(fail ? 1 : 0);

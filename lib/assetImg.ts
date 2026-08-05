// ============================================================
// assetImg — resolve a static UI image to a backend-served URL.
//
// Static art used to be bundled via require(), which put ~520 MB of images
// inside the APK. It now lives on the backend (GET /assets/images/…, WebP),
// so the app ships lean and the art swaps by data source, not by rebuild.
//
// Returns an RN ImageSource ({ uri }) rather than a bare string, because both
// consumer shapes already in the codebase then keep working unchanged:
//     source={cat.imageUrl}                                  -> { uri } ✓
//     source={typeof x === "string" ? { uri: x } : x}        -> { uri } ✓
//
// `uri` is a GETTER on purpose. Data modules are evaluated once at import, but
// the backend origin can change AFTER that — the connect-QR scan repoints the
// app at a live tunnel at runtime. Computing the URL eagerly would freeze the
// origin captured at import time and every image would 404 after a scan.
// Reading it lazily at render always uses the current origin.
// ============================================================

import { effectiveOrigin } from "./backendOverride";

export interface AssetImage { readonly uri: string }

// Every backend asset is WebP (the converter re-encodes .png/.jpg), so the
// stored extension is swapped rather than trusted.
function toWebp(path: string): string {
  return path.replace(/\.(png|jpe?g|webp)$/i, ".webp");
}

export function assetImg(path: string): AssetImage {
  const rel = toWebp(path.replace(/^\/+/, ""));
  return {
    get uri(): string {
      return `${effectiveOrigin()}/assets/images/${rel}`;
    },
  };
}

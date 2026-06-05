// ============================================================
// TextDecoder shim — utf-16le support for h3-js on Expo.
//
// h3-js's emscripten glue runs `new TextDecoder('utf-16le')` at
// module-load time. Expo SDK 55's built-in TextDecoder rejects the
// 'utf-16le' label with `RangeError: Unknown encoding` — which
// crashes the whole JS bundle the moment services/h3.ts is imported.
//
// This wraps the platform TextDecoder: utf-8 (and every label the
// platform already accepts) passes straight through; only utf-16le /
// utf-16 get a small local decoder. Imported for its side effect at
// the top of services/h3.ts, so it is installed before h3-js loads.
// ============================================================

interface AnyDecoder {
  decode(input?: ArrayBufferView | ArrayBuffer): string;
  encoding: string;
}
type DecoderCtor = new (label?: string, options?: unknown) => AnyDecoder;

const Platform = (globalThis as { TextDecoder?: DecoderCtor }).TextDecoder;

function toBytes(input?: ArrayBufferView | ArrayBuffer): Uint8Array {
  if (!input) return new Uint8Array(0);
  if (input instanceof Uint8Array) return input;
  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }
  return new Uint8Array(input);
}

// Little-endian UTF-16: each char is two bytes, low byte first.
function decodeUtf16le(input?: ArrayBufferView | ArrayBuffer): string {
  const b = toBytes(input);
  let out = "";
  for (let i = 0; i + 1 < b.length; i += 2) {
    out += String.fromCharCode((b[i] ?? 0) | ((b[i + 1] ?? 0) << 8));
  }
  return out;
}

class ShimTextDecoder {
  private readonly platform: AnyDecoder | null;
  private readonly label: string;

  constructor(label = "utf-8", options?: unknown) {
    this.label = String(label).toLowerCase().replace(/[^a-z0-9]/g, "");
    const isUtf16 =
      this.label === "utf16le" || this.label === "utf16" || this.label === "unicode";
    // utf-16 handled locally; everything else delegates to the platform.
    this.platform = isUtf16 || !Platform ? null : new Platform(label, options);
  }

  decode(input?: ArrayBufferView | ArrayBuffer): string {
    return this.platform ? this.platform.decode(input) : decodeUtf16le(input);
  }

  get encoding(): string {
    return this.platform ? this.platform.encoding : "utf-16le";
  }
}

// Install only when the platform decoder genuinely cannot do utf-16le.
let needsShim = true;
if (Platform) {
  try {
    new Platform("utf-16le");
    needsShim = false;
  } catch {
    needsShim = true;
  }
}
if (needsShim) {
  (globalThis as { TextDecoder?: DecoderCtor }).TextDecoder = ShimTextDecoder as DecoderCtor;
}

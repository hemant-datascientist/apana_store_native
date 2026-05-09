// State / Union Territory codes for user ID encoding.
// India = 28 states + 8 UTs = exactly 36 → fits perfectly in single base36 char (A-Z + 0-9).
//
// Why uppercase: improves QR-scan and human readability. Mixing with digits 0/1 stays clear.
// Why this order: alphabetical by canonical state name first, then UTs alphabetical.
// Adding a new state/UT REQUIRES format-version bump — all 36 slots are used (zero headroom).

export type StateCode = string; // single base36 char

// Canonical state name -> single base36 code char.
// DO NOT REORDER — every existing user ID depends on these exact assignments.
export const STATE_TO_CODE: Record<string, StateCode> = {
  // ---- 28 States (alphabetical) ----
  "Andhra Pradesh": "A",
  "Arunachal Pradesh": "B",
  "Assam": "C",
  "Bihar": "D",
  "Chhattisgarh": "E",
  "Goa": "F",
  "Gujarat": "G",
  "Haryana": "H",
  "Himachal Pradesh": "I",
  "Jharkhand": "J",
  "Karnataka": "K",
  "Kerala": "L",
  "Madhya Pradesh": "M",
  "Maharashtra": "N",
  "Manipur": "O",
  "Meghalaya": "P",
  "Mizoram": "Q",
  "Nagaland": "R",
  "Odisha": "S",
  "Punjab": "T",
  "Rajasthan": "U",
  "Sikkim": "V",
  "Tamil Nadu": "W",
  "Telangana": "X",
  "Tripura": "Y",
  "Uttar Pradesh": "Z",
  "Uttarakhand": "0",
  "West Bengal": "1",
  // ---- 8 Union Territories (alphabetical) ----
  "Andaman and Nicobar Islands": "2",
  "Chandigarh": "3",
  "Dadra and Nagar Haveli and Daman and Diu": "4",
  "Delhi": "5",
  "Jammu and Kashmir": "6",
  "Ladakh": "7",
  "Lakshadweep": "8",
  "Puducherry": "9",
};

// Reverse map: code char -> state name. Built once at module load for fast decode.
export const CODE_TO_STATE: Record<StateCode, string> = Object.fromEntries(
  Object.entries(STATE_TO_CODE).map(([name, code]) => [code, name])
);

// Encode a state name -> single-char code. Throws on unknown state to surface typos.
export function encodeState(name: string): StateCode {
  const code = STATE_TO_CODE[name];
  if (!code) throw new Error(`Unknown state: ${name}`);
  return code;
}

// Decode a single-char code -> canonical state name. Throws on invalid code.
export function decodeState(code: StateCode): string {
  const name = CODE_TO_STATE[code];
  if (!name) throw new Error(`Unknown state code: ${code}`);
  return name;
}

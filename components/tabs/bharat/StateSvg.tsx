// ============================================================
// STATE SVG — Apana Store (Bharat Screen)
//
// Renders a state silhouette perfectly centred in a square.
//
// Problem with SvgXml: react-native-svg doesn't reliably honour
// SVG viewBoxes whose origin ≠ (0,0), so paths with coordinates
// like (139, 567) render outside the visible box.
//
// Solution: use Svg + G + Path directly.
//   • Outer viewBox is always "0 0 100 100"
//   • A <G> carries a transform that maps the original geographic
//     coordinate space into 0–100:
//       scale(100/w, 100/h) translate(-x, -y)
//   • 5 % padding is added so shapes never touch the card edge.
// ============================================================

import React from "react";
import Svg, { G, Path } from "react-native-svg";
import { STATE_SVG_DATA } from "../../data/stateSvgData";

interface StateSvgProps {
  stateKey:  string;
  size:      number;   // rendered square width = height (px)
  fillColor: string;
}

// Padding in viewBox units (out of 100). Shrinks the shape by
// PAD% on every side so it sits neatly inside the card.
const PAD = 6;

export default function StateSvg({ stateKey, size, fillColor }: StateSvgProps) {
  const entry = STATE_SVG_DATA[stateKey];
  if (!entry) return null;

  const { x, y, w, h, path } = entry;

  // Scale factors that map [x..x+w] → [PAD..100-PAD] and same for y.
  const range = 100 - PAD * 2;
  const sx = range / w;
  const sy = range / h;

  // SVG transform string (applied right-to-left):
  //   1. translate(-x, -y)  →  moves geographic origin to (0,0)
  //   2. scale(sx, sy)       →  maps to [0..range]
  //   3. translate(PAD, PAD) →  shifts into padded area
  // Written as a single concatenated transform:
  const transform = `translate(${PAD}, ${PAD}) scale(${sx}, ${sy}) translate(${-x}, ${-y})`;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G transform={transform}>
        <Path
          d={path}
          fill={fillColor}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.3 / Math.min(sx, sy)}   // keep stroke visually thin
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

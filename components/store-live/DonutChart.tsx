// ============================================================
// DONUT CHART — Apana Store (Store Live Screen)
//
// SVG donut chart showing live store distribution.
// Each segment: colored arc with a connecting line + label.
// Center: black circle with "STORES LIVE" text.
// Labels auto-anchor left/right based on angle.
// ============================================================

import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Circle, Line, Text as SvgText, G } from "react-native-svg";
import { StoreTypeData, TOTAL_LIVE } from "../../data/storeLiveData";
import { typography } from "../../theme/typography";

const SCREEN_W  = Dimensions.get("window").width;
const SVG_W     = SCREEN_W - 32;
const SVG_H     = SVG_W * 0.95;
const CX        = SVG_W / 2;
const CY        = SVG_H / 2;
const OUTER_R   = SVG_W * 0.27;
const INNER_R   = SVG_W * 0.155;
const GAP_DEG   = 1.5;   // gap between segments

// ── Math helpers ──────────────────────────────────────────────
function toRad(deg: number) { return (deg - 90) * (Math.PI / 180); }

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = toRad(deg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(
  cx: number, cy: number,
  outerR: number, innerR: number,
  startDeg: number, endDeg: number,
): string {
  const o1 = polar(cx, cy, outerR, startDeg);
  const o2 = polar(cx, cy, outerR, endDeg);
  const i1 = polar(cx, cy, innerR, endDeg);
  const i2 = polar(cx, cy, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

// ── Component ─────────────────────────────────────────────────
interface DonutChartProps {
  data: StoreTypeData[];
  totalLive?: number;
}

export default function DonutChart({ data, totalLive }: DonutChartProps) {
  const currentTotal = totalLive || TOTAL_LIVE;
  // Build segments with start/end angles
  type Seg = StoreTypeData & { startDeg: number; endDeg: number; pct: number };
  const segments: Seg[] = [];
  let cursor = 0;

  data.forEach(item => {
    const pct      = item.liveCount / currentTotal;
    const spanDeg  = pct * 360;
    const startDeg = cursor + GAP_DEG / 2;
    const endDeg   = cursor + spanDeg - GAP_DEG / 2;
    segments.push({ ...item, startDeg, endDeg, pct });
    cursor += spanDeg;
  });

  const LINE_START_R = OUTER_R + 6;
  const LINE_END_R   = OUTER_R + 20;
  const TEXT_R       = OUTER_R + 24;

  return (
    <View style={styles.wrapper}>
      <Svg width={SVG_W} height={SVG_H}>
        {/* ── Segments ── */}
        {segments.map(seg => (
          <Path
            key={seg.key}
            d={arcPath(CX, CY, OUTER_R, INNER_R, seg.startDeg, seg.endDeg)}
            fill={seg.color}
          />
        ))}

        {/* ── Center black circle ── */}
        <Circle cx={CX} cy={CY} r={INNER_R - 4} fill="#111827" />
        <SvgText
          x={CX} y={CY - 8}
          textAnchor="middle"
          fill="#fff"
          fontSize={13}
          fontFamily={typography.fontFamily.bold}
        >
          STORES
        </SvgText>
        <SvgText
          x={CX} y={CY + 8}
          textAnchor="middle"
          fill="#fff"
          fontSize={13}
          fontFamily={typography.fontFamily.bold}
        >
          LIVE
        </SvgText>

        {/* ── Labels with connecting lines ── */}
        {segments.map(seg => {
          const midDeg    = (seg.startDeg + seg.endDeg) / 2;
          const lineStart = polar(CX, CY, LINE_START_R, midDeg);
          const lineEnd   = polar(CX, CY, LINE_END_R,   midDeg);
          const textPos   = polar(CX, CY, TEXT_R,        midDeg);
          const isRight   = textPos.x >= CX;
          const anchor    = isRight ? "start" : "end";

          // nudge text further horizontally so it doesn't overlap the line
          const textX = isRight ? textPos.x + 4 : textPos.x - 4;

          const pctStr = `${(seg.pct * 100).toFixed(1)}%`;

          return (
            <G key={`label-${seg.key}`}>
              <Line
                x1={lineStart.x} y1={lineStart.y}
                x2={lineEnd.x}   y2={lineEnd.y}
                stroke={seg.color} strokeWidth={1.5}
              />
              <SvgText
                x={textX} y={textPos.y - 3}
                textAnchor={anchor}
                fill="#1F2937"
                fontSize={9}
                fontFamily={typography.fontFamily.semiBold}
              >
                {seg.label}
              </SvgText>
              <SvgText
                x={textX} y={textPos.y + 8}
                textAnchor={anchor}
                fill={seg.color}
                fontSize={9}
                fontFamily={typography.fontFamily.bold}
              >
                {pctStr}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems:     "center",
    justifyContent: "center",
    marginVertical: 8,
  },
});

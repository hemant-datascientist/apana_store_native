// ============================================================
// PROGRESS BAR — determinate and indeterminate.
//
// DETERMINATE (`progress` given, 0..1) is the honest one: use it only when
// real progress is KNOWN — an upload's bytes-sent, step 3 of 7 in
// registration. A bar that animates on a timer while a request is in
// flight is a fabricated measurement: it will sit at 90% for a minute, or
// hit 100% before anything finished. If the number is not real, use the
// indeterminate variant, which claims only "working".
//
// INDETERMINATE loops a bar across the track. Use it for a page-top
// activity hint where a spinner would be too heavy.
//
// Both animate on the UI thread (reanimated) so they keep moving while the
// JS thread is busy — the exact moment a stuttering progress bar would
// look like the app had hung.
// ============================================================

import React, { useEffect } from "react";
import { View, StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, interpolate,
} from "react-native-reanimated";
import useTheme from "../../theme/useTheme";

const TRACK_HEIGHT = 4;
const SWEEP_MS = 1100;

interface Props {
  /**
   * 0..1. Omit for the indeterminate variant.
   * Pass a real fraction only — see the header on why a faked one is worse
   * than none.
   */
  progress?: number;
  height?: number;
  color?: string;
  /** Rounded ends. Off for a page-top hairline, on for an inline bar. */
  rounded?: boolean;
  style?: ViewStyle;
}

export default function ProgressBar({ progress, height = TRACK_HEIGHT, color, rounded = true, style }: Props) {
  const { colors } = useTheme();
  const tint = color ?? colors.primary;
  const isDeterminate = typeof progress === "number";

  // Determinate: animate to the given fraction.
  const value = useSharedValue(0);
  // Indeterminate: loop 0..1, mapped to a travelling segment below.
  const sweep = useSharedValue(0);

  useEffect(() => {
    if (isDeterminate) {
      // Clamped: a caller computing 1.2 from a bad denominator must not
      // paint a bar wider than its own track.
      const clamped = Math.max(0, Math.min(1, progress as number));
      value.value = withTiming(clamped, { duration: 260, easing: Easing.out(Easing.quad) });
    }
  }, [progress, isDeterminate, value]);

  useEffect(() => {
    if (isDeterminate) return;
    sweep.value = withRepeat(
      withTiming(1, { duration: SWEEP_MS, easing: Easing.inOut(Easing.quad) }),
      -1,
      false,
    );
  }, [isDeterminate, sweep]);

  const fillStyle = useAnimatedStyle(() => {
    if (isDeterminate) {
      return { width: `${value.value * 100}%`, left: 0 };
    }
    // A 35%-wide segment travelling from off-left to off-right.
    return {
      width: "35%",
      left: `${interpolate(sweep.value, [0, 1], [-35, 100])}%`,
    };
  });

  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: colors.border, borderRadius: rounded ? height / 2 : 0 },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={isDeterminate ? { now: Math.round((progress as number) * 100), min: 0, max: 100 } : undefined}
      accessibilityLabel={isDeterminate ? undefined : "Loading"}
    >
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: tint, borderRadius: rounded ? height / 2 : 0 },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: "100%", overflow: "hidden" },
  fill:  { position: "absolute", top: 0, bottom: 0 },
});

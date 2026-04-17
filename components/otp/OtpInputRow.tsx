// ============================================================
// OTP INPUT ROW — Apana Store (OTP Component)
//
// Six individual digit boxes that auto-advance focus on entry
// and step back on backspace.
//
// Each box:
//   Empty  → gray border + off-white background
//   Filled → primary border + light-primary background
//   Focused → primary border (first empty box)
//
// Props:
//   digits      — string[6] current digit values
//   inputRefs   — ref array for programmatic focus control
//   onChange    — (text, index) — called per digit/paste
//   onKeyPress  — (event, index) — for backspace detection
//   stepKey     — key that changes when step changes (forces re-render)
// ============================================================

import React, { RefObject } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";

const OTP_LENGTH = 6;

interface OtpInputRowProps {
  digits:     string[];
  inputRefs:  RefObject<Array<TextInput | null>>;
  onChange:   (text: string, index: number) => void;
  onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => void;
  stepKey?:   string;   // changes when register step changes — forces remount
}

export default function OtpInputRow({
  digits, inputRefs, onChange, onKeyPress, stepKey,
}: OtpInputRowProps) {
  const { colors } = useTheme();

  // ── Index of first empty box — used for focused border ──────
  const firstEmpty = digits.findIndex(d => !d);

  return (
    <View style={styles.row}>
      {digits.map((digit, i) => (
        <TextInput
          key={`${stepKey ?? "otp"}-${i}`}
          ref={ref => {
            if (inputRefs.current) inputRefs.current[i] = ref;
          }}
          style={[
            styles.box,
            {
              // ── Border: filled or focused → primary, else border ──
              borderColor: digit || i === firstEmpty
                ? colors.primary
                : colors.border,
              // ── Background: filled → light primary tint ──
              backgroundColor: digit
                ? colors.primary + "15"
                : colors.background,
              color:      colors.text,
              fontFamily: typography.fontFamily.semiBold,
              fontSize:   typography.size.xxl - 2,
            },
          ]}
          value={digit}
          onChangeText={text => onChange(text, i)}
          onKeyPress={e => onKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}   // allows paste of full OTP
          selectTextOnFocus
          textAlign="center"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap:           10,
    marginTop:     8,
    marginBottom:  4,
  },
  box: {
    width:        46,
    height:       56,
    borderRadius: 12,
    borderWidth:  1.5,
  },
});

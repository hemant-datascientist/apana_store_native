// ============================================================
// APPEARANCE MODAL — Apana Store (Customer App)
//
// Bottom-sheet modal for theme and brand color selection.
//
// Section 1 — Theme Mode (3 cards side by side):
//   System  → follows device setting  (phone icon)
//   Light   → always light mode       (sunny icon)
//   Dark    → always dark mode        (moon icon)
//
// Section 2 — Brand Color (colored circle swatches):
//   apanaBlue · green · blue · red · orange · purple · teal · pink
//
// Selections persist instantly via ThemeContext → AsyncStorage.
// ============================================================

import React from "react";
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, ScrollView, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { brandColors } from "../../theme/colors";

// ── Types ─────────────────────────────────────────────────────
type ThemeMode = "system" | "light" | "dark";
type BrandType = keyof typeof brandColors;

interface AppearanceModalProps {
  visible:  boolean;
  onClose:  () => void;
}

// ── Theme mode options ─────────────────────────────────────────
const THEME_OPTIONS: {
  key:   ThemeMode;
  label: string;
  icon:  keyof typeof Ionicons.glyphMap;
  desc:  string;
}[] = [
  { key: "system", label: "System",  icon: "phone-portrait-outline", desc: "Follow device" },
  { key: "light",  label: "Light",   icon: "sunny-outline",          desc: "Always light"  },
  { key: "dark",   label: "Dark",    icon: "moon-outline",           desc: "Always dark"   },
];

// ── Brand color options ────────────────────────────────────────
const BRAND_OPTIONS: { key: BrandType; label: string }[] = [
  { key: "apanaBlue", label: "Apana Blue" },
  { key: "green",     label: "Green"      },
  { key: "blue",      label: "Blue"       },
  { key: "red",       label: "Red"        },
  { key: "orange",    label: "Orange"     },
  { key: "purple",    label: "Purple"     },
  { key: "teal",      label: "Teal"       },
  { key: "pink",      label: "Pink"       },
];

// ── Mock theme previews ───────────────────────────────────────
function ThemePreviewCard({
  option,
  active,
  activeColor,
  cardBg,
  textColor,
  subColor,
  borderColor,
}: {
  option:      typeof THEME_OPTIONS[number];
  active:      boolean;
  activeColor: string;
  cardBg:      string;
  textColor:   string;
  subColor:    string;
  borderColor: string;
}) {
  return (
    <View style={[
      styles.themeCard,
      {
        backgroundColor: cardBg,
        borderColor:     active ? activeColor : borderColor,
        borderWidth:     active ? 2 : 1,
      },
    ]}>
      {/* Mini screen mockup */}
      <View style={[styles.mockScreen, { backgroundColor: active ? activeColor + "18" : borderColor + "40" }]}>
        <Ionicons name={option.icon} size={22} color={active ? activeColor : subColor} />
      </View>

      {/* Labels */}
      <Text style={[styles.themeLabel, { color: textColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
        {option.label}
      </Text>
      <Text style={[styles.themeDesc, { color: subColor, fontFamily: typography.fontFamily.regular, fontSize: 10 }]}>
        {option.desc}
      </Text>

      {/* Active tick */}
      {active && (
        <View style={[styles.tick, { backgroundColor: activeColor }]}>
          <Ionicons name="checkmark" size={10} color="#fff" />
        </View>
      )}
    </View>
  );
}

// ── Main modal ────────────────────────────────────────────────
export default function AppearanceModal({ visible, onClose }: AppearanceModalProps) {
  const { colors, themeMode, setThemeMode, brand, setBrand, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="rgba(0,0,0,0.5)"
      />

      {/* Scrim */}
      <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onClose} />

      {/* Sheet */}
      <View style={[
        styles.sheet,
        {
          backgroundColor:  colors.card,
          paddingBottom:    insets.bottom + 16,
        },
      ]}>

        {/* Handle bar */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
            Appearance
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={22} color={colors.subText} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

          {/* ── Theme Mode ── */}
          <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            THEME MODE
          </Text>

          <View style={styles.themeRow}>
            {THEME_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={styles.themeCardWrap}
                onPress={() => setThemeMode(opt.key)}
                activeOpacity={0.8}
              >
                <ThemePreviewCard
                  option={opt}
                  active={themeMode === opt.key}
                  activeColor={colors.primary}
                  cardBg={colors.background}
                  textColor={colors.text}
                  subColor={colors.subText}
                  borderColor={colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Brand Color ── */}
          <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs, marginTop: 24 }]}>
            BRAND COLOR
          </Text>

          <View style={styles.brandGrid}>
            {BRAND_OPTIONS.map(opt => {
              const active = brand === opt.key;
              const hex    = brandColors[opt.key];
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={styles.brandItem}
                  onPress={() => setBrand(opt.key)}
                  activeOpacity={0.8}
                >
                  {/* Color circle */}
                  <View style={[
                    styles.brandCircle,
                    { backgroundColor: hex },
                    active && styles.brandCircleActive,
                  ]}>
                    {active && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  {/* Color label */}
                  <Text style={[
                    styles.brandLabel,
                    {
                      color:      active ? colors.primary : colors.subText,
                      fontFamily: active
                        ? typography.fontFamily.semiBold
                        : typography.fontFamily.regular,
                      fontSize: 10,
                    },
                  ]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scrim: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.50)",
  },
  sheet: {
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    // Lift sheet above scrim
    marginTop: -24,
  },
  handle: {
    width:        40,
    height:        4,
    borderRadius:  2,
    alignSelf:    "center",
    marginTop:    10,
    marginBottom:  4,
  },
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 20,
    paddingVertical:   14,
    borderBottomWidth: 1,
  },
  headerTitle: {},
  body: {
    paddingHorizontal: 20,
    paddingTop:        20,
    paddingBottom:     8,
  },
  sectionLabel: {
    letterSpacing: 0.8,
    marginBottom:  12,
  },

  // ── Theme cards ──
  themeRow: {
    flexDirection: "row",
    gap:           10,
  },
  themeCardWrap: {
    flex: 1,
  },
  themeCard: {
    borderRadius:  14,
    padding:       12,
    alignItems:    "center",
    gap:           6,
    position:      "relative",
  },
  mockScreen: {
    width:          52,
    height:         52,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   2,
  },
  themeLabel: {
    textAlign: "center",
  },
  themeDesc: {
    textAlign: "center",
  },
  tick: {
    position:       "absolute",
    top:             8,
    right:           8,
    width:           18,
    height:          18,
    borderRadius:    9,
    alignItems:     "center",
    justifyContent: "center",
  },

  // ── Brand swatches ──
  brandGrid: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           16,
  },
  brandItem: {
    alignItems: "center",
    gap:         6,
    width:       56,
  },
  brandCircle: {
    width:          44,
    height:         44,
    borderRadius:   22,
    alignItems:     "center",
    justifyContent: "center",
  },
  brandCircleActive: {
    shadowColor:   "#000",
    shadowOpacity: 0.25,
    shadowRadius:  6,
    shadowOffset:  { width: 0, height: 3 },
    elevation:     6,
  },
  brandLabel: {
    textAlign: "center",
  },
});

// ============================================================
// COVERAGE MODAL — Apana Store (Customer App)
//
// Bottom-sheet picker for the Store Coverage preference. Two
// mutually-exclusive cards (Nearest / Long), explained in plain
// language straight from the §19 admin-area model:
//
//   Nearest → your sub-district  (closest, fastest)
//   Long    → your whole district (more choice, a bit farther)
//
// Selection persists instantly via CoverageContext → AsyncStorage and
// is mirrored by the CoverageToggle on the Stores map.
// ============================================================

import React from "react";
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import {
  useCoverage, COVERAGE_META, COVERAGE_ORDER,
} from "../../../context/CoverageContext";
import { useLocation } from "../../../context/LocationContext";
import CoverageMapPreview from "../../store/CoverageMapPreview";

interface CoverageModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CoverageModal({ visible, onClose }: CoverageModalProps) {
  const { colors, isDark } = useTheme();
  const { coverage, setCoverage } = useCoverage();
  const { selectedAddress } = useLocation();
  const insets = useSafeAreaInsets();

  // Centre the preview on the customer's active address when it carries
  // GPS coords; CoverageMapPreview falls back to the city default otherwise.
  const lat = selectedAddress.lat ?? undefined;
  const lng = selectedAddress.lng ?? undefined;

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
      <View style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16 }]}>

        {/* Handle bar */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              Store Coverage
            </Text>
            <Text style={[styles.headerSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              How far out we look for stores near you
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={22} color={colors.subText} />
          </TouchableOpacity>
        </View>

        {/* Option cards */}
        <View style={styles.body}>

          {/* Live H3 coverage map — repaints as you switch */}
          <CoverageMapPreview lat={lat} lng={lng} />

          {COVERAGE_ORDER.map((key) => {
            const opt    = COVERAGE_META[key];
            const active = key === coverage;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.card, {
                  backgroundColor: active ? colors.primary + "10" : colors.background,
                  borderColor:     active ? colors.primary : colors.border,
                  borderWidth:     active ? 2 : 1,
                }]}
                onPress={() => setCoverage(key)}
                activeOpacity={0.85}
              >
                {/* Icon medallion */}
                <View style={[styles.iconWrap, { backgroundColor: active ? colors.primary : colors.border + "55" }]}>
                  <Ionicons name={opt.icon as any} size={20} color={active ? "#fff" : colors.subText} />
                </View>

                {/* Text */}
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                    {opt.title}
                  </Text>
                  <Text style={[styles.cardDesc, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                    {opt.desc}
                  </Text>
                </View>

                {/* Radio tick */}
                <View style={[styles.radio, { borderColor: active ? colors.primary : colors.border }]}>
                  {active && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Cross-surface hint */}
          <View style={styles.hintRow}>
            <Ionicons name="map-outline" size={13} color={colors.subText} />
            <Text style={[styles.hint, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 11 }]}>
              You can also switch this on the Stores map.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.50)",
  },
  sheet: {
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    marginTop:           -24,
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
  headerText:  { flex: 1, gap: 2 },
  headerTitle: {},
  headerSub:   {},

  body: {
    paddingHorizontal: 20,
    paddingTop:        16,
    paddingBottom:     8,
    gap:               12,
  },
  card: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           14,
    borderRadius:  16,
    padding:       14,
  },
  iconWrap: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  cardText:  { flex: 1, gap: 3 },
  cardTitle: {},
  cardDesc:  { lineHeight: 17 },
  radio: {
    width:          22,
    height:         22,
    borderRadius:   11,
    borderWidth:    2,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  radioDot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  hintRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
    marginTop:     2,
    paddingHorizontal: 2,
  },
  hint: {},
});

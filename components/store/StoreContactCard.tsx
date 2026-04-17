// ============================================================
// STORE CONTACT CARD — Apana Store (Store Detail Component)
//
// Address row, phone row (tappable), and "Report an issue" link.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, Linking, Alert, StyleSheet,
} from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreDetail } from "../../data/storeDetailData";

interface StoreContactCardProps {
  store: StoreDetail;
}

export default function StoreContactCard({ store }: StoreContactCardProps) {
  const { colors } = useTheme();

  async function handleCall() {
    const url = `tel:${store.phone}`;
    const ok  = await Linking.canOpenURL(url);
    if (ok) Linking.openURL(url);
    else    Alert.alert("Unavailable", "Cannot open phone dialler.");
  }

  function handleReport() {
    Alert.alert("Report Issue", "Thank you — our team will review this store. (Backend integration pending.)");
  }

  return (
    <View style={[styles.card, {
      backgroundColor: colors.card,
      borderColor:     colors.border,
    }]}>
      {/* ── Header ── */}
      <View style={styles.cardHeader}>
        <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
        <Text style={[styles.cardTitle, {
          color:      colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.md,
        }]}>
          Contact Info
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Address ── */}
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + "12" }]}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
        </View>
        <Text style={[styles.rowText, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.sm,
          lineHeight: 20,
        }]}>
          {store.address}, {store.city}, {store.state} – {store.pincode}
        </Text>
      </View>

      <View style={[styles.sep, { backgroundColor: colors.border + "60" }]} />

      {/* ── Phone (tappable) ── */}
      <TouchableOpacity style={styles.row} activeOpacity={0.75} onPress={handleCall}>
        <View style={[styles.iconWrap, { backgroundColor: colors.success + "15" }]}>
          <Ionicons name="call-outline" size={16} color={colors.success} />
        </View>
        <Text style={[styles.rowText, {
          color:      colors.primary,
          fontFamily: typography.fontFamily.medium,
          fontSize:   typography.size.sm,
        }]}>
          {store.phone}
        </Text>
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Report issue ── */}
      <TouchableOpacity style={styles.reportRow} activeOpacity={0.7} onPress={handleReport}>
        <Ionicons name="flag-outline" size={14} color={colors.subText} />
        <Text style={[styles.reportText, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs,
        }]}>
          Report an issue with this store
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius:     14,
    borderWidth:      1,
    overflow:         "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    padding:       14,
    paddingBottom: 12,
  },
  cardTitle: {},
  divider:   { height: 1 },
  sep:       { height: 1, marginHorizontal: 14 },

  row: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               12,
    paddingHorizontal: 14,
    paddingVertical:   12,
  },
  iconWrap: {
    width:          30,
    height:         30,
    borderRadius:   8,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  rowText: { flex: 1 },

  reportRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 14,
    paddingVertical:   12,
    justifyContent:    "center",
  },
  reportText: {},
});

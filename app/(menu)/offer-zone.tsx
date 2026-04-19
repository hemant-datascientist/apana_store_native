// ============================================================
// OFFER ZONE SCREEN — Apana Store
//
// Aggregates all active deals and seller events in one place.
//
// Layout (top → bottom):
//   Header          — orange gradient header + back + title
//   Event Banners   — horizontal scroll of active sale events
//   Category Filter — pill chips: All / Grocery / Electronics …
//   Deals list      — filtered OfferCard list
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

import {
  OFFER_EVENTS, OFFERS,
  OfferCategory,
} from "../../data/offerZoneData";

import OfferZoneEventBanner    from "../../components/offer-zone/OfferZoneEventBanner";
import OfferZoneCategoryFilter from "../../components/offer-zone/OfferZoneCategoryFilter";
import OfferCard               from "../../components/offer-zone/OfferCard";

const ACCENT = "#F97316";

export default function OfferZoneScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── Active category filter ────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<OfferCategory>("all");

  // ── Filter offers by selected category ───────────────────
  const filteredOffers = useMemo(
    () => activeCategory === "all"
      ? OFFERS
      : OFFERS.filter(o => o.category === activeCategory),
    [activeCategory],
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              Offer Zone
            </Text>
            <Text style={[styles.headerSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {OFFERS.length} deals · {OFFER_EVENTS.length} events active
            </Text>
          </View>

          <View style={[styles.tagBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="pricetag-outline" size={16} color="#fff" />
          </View>
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Active sale events ── */}
        <View style={[styles.eventsBg, { backgroundColor: ACCENT }]}>
          <OfferZoneEventBanner events={OFFER_EVENTS} />

          {/* ── Category filter sits over the orange background ── */}
          <View style={styles.filterWrap}>
            <OfferZoneCategoryFilter active={activeCategory} onSelect={setActiveCategory} />
          </View>
        </View>

        {/* ── Deals list ── */}
        <View style={styles.dealsSection}>
          <View style={styles.dealsHeader}>
            <Text style={[styles.dealsTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {activeCategory === "all" ? "All Deals" : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Deals`}
            </Text>
            <View style={[styles.countBadge, { backgroundColor: ACCENT + "18" }]}>
              <Text style={[styles.countText, { color: ACCENT, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                {filteredOffers.length}
              </Text>
            </View>
          </View>

          {filteredOffers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pricetag-outline" size={36} color={colors.subText} />
              <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}>
                No deals in this category right now
              </Text>
            </View>
          ) : (
            filteredOffers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {},
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  backBtn: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  headerCenter: { flex: 1 },
  headerTitle:  { color: "#fff" },
  headerSub:    { color: "rgba(255,255,255,0.75)", marginTop: 2 },
  tagBadge: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },

  // Orange events section (banners + filter share one bg)
  eventsBg: {
    paddingTop:    16,
    paddingBottom: 20,
    gap:           14,
  },
  filterWrap: {},

  // Deals section
  dealsSection: {
    padding: 16,
    gap:     12,
  },
  dealsHeader: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  dealsTitle: {},
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      20,
  },
  countText: {},

  emptyState: {
    alignItems: "center",
    gap:        12,
    paddingVertical: 40,
  },
  emptyText: { textAlign: "center" },
});

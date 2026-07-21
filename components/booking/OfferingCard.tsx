// ============================================================
// OFFERING CARD — one bookable service on a store's list.
//
// Price, duration, and the at-home badge are the three things that decide
// whether a customer taps Book, so they lead. The taxonomy code stays out of
// the customer's face; it is a seller/registry concern.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { Offering } from "../../services/bookingService";

// "per_service" reads like a database column; customers read "per visit".
const UNIT_LABEL: Record<string, string> = {
  per_service: "",
  per_hour: "/hr",
  per_visit: "/visit",
  per_sqft: "/sq ft",
  per_kg: "/kg",
  per_piece: "/piece",
  per_km: "/km",
  per_day: "/day",
  per_month: "/month",
  per_plate: "/plate",
  per_event: "/event",
  per_unit: "/unit",
  consultation: " consultation",
};

interface OfferingCardProps {
  offering: Offering;
  onBook: (offering: Offering) => void;
}

function OfferingCard({ offering, onBook }: OfferingCardProps) {
  const { colors } = useTheme();
  const unit = UNIT_LABEL[offering.unit] ?? "";

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.body}>
        <Text
          numberOfLines={2}
          style={[styles.name, {
            color: colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.size.md,
          }]}
        >
          {offering.name}
        </Text>

        {offering.description != null && offering.description.length > 0 && (
          <Text
            numberOfLines={2}
            style={[styles.desc, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}
          >
            {offering.description}
          </Text>
        )}

        <View style={styles.meta}>
          <Text style={[styles.price, {
            color: colors.text,
            fontFamily: typography.fontFamily.bold,
            fontSize: typography.size.md,
          }]}>
            ₹{offering.price.toFixed(0)}
            <Text style={[styles.unit, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
              {unit}
            </Text>
          </Text>

          {offering.durationMin != null && offering.durationMin > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={colors.subText} />
              <Text style={[styles.metaText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                {offering.durationMin} min
              </Text>
            </View>
          )}

          {offering.atHome && (
            <View style={[styles.badge, { backgroundColor: colors.success + "1A" }]}>
              <Ionicons name="home-outline" size={12} color={colors.success} />
              <Text style={[styles.badgeText, { color: colors.success, fontFamily: typography.fontFamily.semiBold }]}>
                At home
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.bookBtn, { backgroundColor: colors.primary }]}
        onPress={() => onBook(offering)}
        activeOpacity={0.85}
      >
        <Text style={[styles.bookText, { color: colors.white, fontFamily: typography.fontFamily.semiBold }]}>
          Book
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  body: { flex: 1, gap: 4 },
  name: {},
  desc: { fontSize: typography.size.xs, lineHeight: 17 },
  meta: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2, flexWrap: "wrap" },
  price: {},
  unit: { fontSize: typography.size.xs },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: typography.size.xs },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: typography.size.ss },
  bookBtn: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 10 },
  bookText: { fontSize: typography.size.sm },
});

export default React.memo(OfferingCard);

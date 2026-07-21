// ============================================================
// BOOKING CARD — one of the customer's own bookings.
//
// The status is the headline, because "pending" and "confirmed" mean very
// different things to someone deciding whether to leave the house. Cancel is
// offered only while the booking can still be cancelled — the same rule the
// backend enforces, so the button never leads to a 422.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { Booking, BookingStatus } from "../../services/bookingService";

const CANCELLABLE: ReadonlySet<BookingStatus> = new Set(["pending", "confirmed"]);

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Waiting for the shop",
  confirmed: "Confirmed",
  rejected: "Shop couldn't take it",
  cancelled: "Cancelled",
  completed: "Done",
};

interface BookingCardProps {
  booking: Booking;
  onCancel: (booking: Booking) => void;
}

function BookingCard({ booking, onCancel }: BookingCardProps) {
  const { colors } = useTheme();

  const tone: Record<BookingStatus, string> = {
    pending: colors.warning,
    confirmed: colors.success,
    rejected: colors.danger,
    cancelled: colors.subText,
    completed: colors.primary,
  };
  const color = tone[booking.status];

  const slot = new Date(booking.slotStart);
  const when = slot.toLocaleString(undefined, {
    weekday: "short", day: "numeric", month: "short",
    hour: "numeric", minute: "2-digit",
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.head}>
        <Text
          numberOfLines={1}
          style={[styles.name, {
            color: colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.size.md,
          }]}
        >
          {booking.serviceName}
        </Text>
        <View style={[styles.pill, { backgroundColor: color + "1A" }]}>
          <Text style={[styles.pillText, { color, fontFamily: typography.fontFamily.semiBold }]}>
            {STATUS_LABEL[booking.status]}
          </Text>
        </View>
      </View>

      <View style={styles.line}>
        <Ionicons name="storefront-outline" size={14} color={colors.subText} />
        <Text style={[styles.lineText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          {booking.store.name} · {booking.store.city}
        </Text>
      </View>

      <View style={styles.line}>
        <Ionicons name="calendar-outline" size={14} color={colors.subText} />
        <Text style={[styles.lineText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          {when}
          {booking.durationMin != null && booking.durationMin > 0 ? ` · ${booking.durationMin} min` : ""}
        </Text>
      </View>

      {booking.atHome && booking.address != null && (
        <View style={styles.line}>
          <Ionicons name="home-outline" size={14} color={colors.subText} />
          <Text
            numberOfLines={2}
            style={[styles.lineText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}
          >
            {booking.address}
          </Text>
        </View>
      )}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.price, {
          color: colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.size.md,
        }]}>
          ₹{booking.price.toFixed(0)}
        </Text>

        {CANCELLABLE.has(booking.status) && (
          <TouchableOpacity onPress={() => onCancel(booking)} activeOpacity={0.7} style={styles.cancel}>
            <Text style={[styles.cancelText, { color: colors.danger, fontFamily: typography.fontFamily.semiBold }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 6,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { flex: 1 },
  pill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  pillText: { fontSize: typography.size.ss },
  line: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  lineText: { flex: 1, fontSize: typography.size.xs, lineHeight: 17 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 6,
    paddingVertical: 10,
  },
  price: {},
  cancel: { paddingHorizontal: 6, paddingVertical: 4 },
  cancelText: { fontSize: typography.size.sm },
});

export default React.memo(BookingCard);

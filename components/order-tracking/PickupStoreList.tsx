// ============================================================
// PICKUP STORE LIST — Apana Store (Order Tracking Screen)
//
// Customer-reorderable list of pickup stores. Each row shows:
//   • Order index pill (1, 2, 3 — reflects current sequence)
//   • Store name + items + subtotal
//   • Status:
//       Visited → green ✓ "Collected" badge
//       Pending → primary "Show QR" button
//   • Reorder controls — ↑ / ↓ arrows to swap with neighbour
//
// Reorder UX:
//   We use ↑/↓ buttons (no extra deps). Visited rows keep their
//   place but lose reorder buttons (they're done; resequencing
//   doesn't apply). Pending rows can be moved among themselves and
//   relative to visited rows above/below them — keeps it simple.
//
// When a real drag UX is desired later, swap to react-native-
// draggable-flatlist. The props interface stays the same.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreOrderResult } from "../../services/checkoutService";

interface PickupStoreListProps {
  // Stores in their current visit sequence (already ordered)
  stores:       StoreOrderResult[];
  // Set of store IDs the customer has already visited (collected)
  visitedIds:   Set<string>;
  // ID of the store whose QR is currently active (highlighted)
  activeId?:    string | null;
  // Move the store at index `from` to index `to` (swap with neighbour)
  onReorder:    (from: number, to: number) => void;
  // Open the QR screen for this store
  onShowQR:     (store: StoreOrderResult) => void;
}

export default function PickupStoreList({
  stores, visitedIds, activeId, onReorder, onShowQR,
}: PickupStoreListProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Section header ── */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Your Pickup Sequence
          </Text>
          <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            Tap ↑↓ to reorder. Show QR at each store to collect.
          </Text>
        </View>
        <View style={[styles.countPill, { backgroundColor: colors.primary + "18" }]}>
          <Text style={[styles.countText, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
            {visitedIds.size}/{stores.length}
          </Text>
        </View>
      </View>

      {/* ── Store rows ── */}
      {stores.map((store, idx) => {
        const visited   = visitedIds.has(store.storeId);
        const isActive  = activeId === store.storeId;
        const canUp     = !visited && idx > 0;
        const canDown   = !visited && idx < stores.length - 1;

        return (
          <View
            key={store.storeOrderId}
            style={[
              styles.row,
              { borderTopColor: colors.border },
              isActive && { backgroundColor: colors.primary + "08" },
            ]}
          >
            {/* Sequence index pill */}
            <View style={[
              styles.idxPill,
              visited
                ? { backgroundColor: colors.success }
                : { backgroundColor: colors.primary },
            ]}>
              {visited
                ? <Ionicons name="checkmark" size={14} color="#fff" />
                : <Text style={[styles.idxText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>{idx + 1}</Text>
              }
            </View>

            {/* Store info */}
            <View style={styles.info}>
              <Text
                numberOfLines={1}
                style={[styles.storeName, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}
              >
                {store.storeName}
              </Text>
              <Text style={[styles.metaText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                ₹{store.subtotal} · ready in {store.estimatedMins} min
              </Text>
            </View>

            {/* Reorder + status column */}
            <View style={styles.actionsCol}>

              {/* Reorder arrows — pending rows only */}
              {!visited && (
                <View style={styles.arrowGroup}>
                  <TouchableOpacity
                    style={[styles.arrowBtn, !canUp && styles.arrowBtnDisabled, { borderColor: colors.border }]}
                    onPress={() => canUp && onReorder(idx, idx - 1)}
                    disabled={!canUp}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="chevron-up" size={14} color={canUp ? colors.text : colors.subText} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.arrowBtn, !canDown && styles.arrowBtnDisabled, { borderColor: colors.border }]}
                    onPress={() => canDown && onReorder(idx, idx + 1)}
                    disabled={!canDown}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="chevron-down" size={14} color={canDown ? colors.text : colors.subText} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Status — collected badge OR Show QR button */}
              {visited ? (
                <View style={[styles.collectedBadge, { backgroundColor: colors.success + "18" }]}>
                  <Ionicons name="checkmark-circle" size={13} color={colors.success} />
                  <Text style={[styles.collectedText, { color: colors.success, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                    COLLECTED
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.qrBtn, { backgroundColor: colors.primary }]}
                  onPress={() => onShowQR(store)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="qr-code-outline" size={14} color="#fff" />
                  <Text style={[styles.qrBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                    QR
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
  },

  headerRow: {
    flexDirection:   "row",
    alignItems:      "center",
    gap:             10,
    padding:         14,
  },
  title: {},
  sub:   { marginTop: 2 },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
  },
  countText: {},

  row: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           12,
    padding:       12,
    borderTopWidth: 1,
  },

  idxPill: {
    width:          30,
    height:         30,
    borderRadius:   15,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  idxText: { color: "#fff" },

  info: { flex: 1, gap: 3 },
  storeName: {},
  metaText:  {},

  actionsCol: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },

  arrowGroup: {
    gap: 4,
  },
  arrowBtn: {
    width:          22,
    height:         22,
    borderRadius:   6,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
  },
  arrowBtnDisabled: { opacity: 0.35 },

  qrBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 12,
    paddingVertical:   8,
    borderRadius:      10,
  },
  qrBtnText: { color: "#fff" },

  collectedBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 9,
    paddingVertical:   5,
    borderRadius:      20,
  },
  collectedText: { letterSpacing: 0.5 },
});

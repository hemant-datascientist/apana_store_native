// ============================================================
// DISH CARD — one dish on a kitchen's menu, with the qty stepper.
//
// The deal price is shown as what it is: a floor that unlocks once the
// basket crosses the shop's threshold, NOT a price already in effect. Showing
// it as the live price would overstate the discount and under-charge the
// screen relative to what checkout actually bills.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { Dish } from "../../services/menuService";

const DIET_COLOR: Record<string, string> = {
  veg: "#16A34A",
  nonveg: "#DC2626",
  egg: "#D97706",
};

interface DishCardProps {
  dish: Dish;
  qty: number;
  onAdd: (dish: Dish) => void;
  onRemove: (dish: Dish) => void;
}

function DishCard({ dish, qty, onAdd, onRemove }: DishCardProps) {
  const { colors } = useTheme();
  const dietColor = dish.diet != null ? DIET_COLOR[dish.diet] : undefined;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          {dietColor != null && (
            <View style={[styles.dietBox, { borderColor: dietColor }]}>
              <View style={[styles.dietDot, { backgroundColor: dietColor }]} />
            </View>
          )}
          <Text
            numberOfLines={2}
            style={[styles.name, {
              color: colors.text,
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.size.md,
            }]}
          >
            {dish.name}
          </Text>
        </View>

        {dish.description != null && dish.description.length > 0 && (
          <Text
            numberOfLines={2}
            style={[styles.desc, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}
          >
            {dish.description}
          </Text>
        )}

        <View style={styles.meta}>
          <Text style={[styles.price, {
            color: colors.text,
            fontFamily: typography.fontFamily.bold,
            fontSize: typography.size.md,
          }]}>
            ₹{dish.price.toFixed(0)}
          </Text>

          {dish.dealPrice != null && dish.dealPrice < dish.price && (
            <Text style={[styles.deal, { color: colors.success, fontFamily: typography.fontFamily.medium }]}>
              ₹{dish.dealPrice.toFixed(0)} on bigger orders
            </Text>
          )}

          {dish.prepMinutes != null && dish.prepMinutes > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={colors.subText} />
              <Text style={[styles.metaText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                {dish.prepMinutes} min
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Stepper — "Add" until there is one in the basket */}
      {qty === 0 ? (
        <TouchableOpacity
          style={[styles.addBtn, { borderColor: colors.primary }]}
          onPress={() => onAdd(dish)}
          activeOpacity={0.85}
        >
          <Text style={[styles.addText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold }]}>
            Add
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.stepper, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => onRemove(dish)} style={styles.stepBtn} activeOpacity={0.7}>
            <Ionicons name="remove" size={16} color={colors.white} />
          </TouchableOpacity>
          <Text style={[styles.qty, { color: colors.white, fontFamily: typography.fontFamily.semiBold }]}>
            {qty}
          </Text>
          <TouchableOpacity onPress={() => onAdd(dish)} style={styles.stepBtn} activeOpacity={0.7}>
            <Ionicons name="add" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
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
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  dietBox: {
    width: 13, height: 13, borderWidth: 1.5, borderRadius: 2,
    alignItems: "center", justifyContent: "center", marginTop: 3,
  },
  dietDot: { width: 6, height: 6, borderRadius: 3 },
  name: { flex: 1 },
  desc: { fontSize: typography.size.xs, lineHeight: 17 },
  meta: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2, flexWrap: "wrap" },
  price: {},
  deal: { fontSize: typography.size.ss },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: typography.size.xs },
  addBtn: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1.2,
  },
  addText: { fontSize: typography.size.sm },
  stepper: { flexDirection: "row", alignItems: "center", borderRadius: 10, overflow: "hidden" },
  stepBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  qty: { fontSize: typography.size.sm, minWidth: 18, textAlign: "center" },
});

export default React.memo(DishCard);

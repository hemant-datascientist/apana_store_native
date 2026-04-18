// ============================================================
// CHECKOUT PAYMENT PICKER — Apana Store
//
// Bottom-sheet modal listing all saved payment methods.
// Tapping a row selects it and closes the modal.
// "Add new payment method" links to /payment-methods.
// ============================================================

import React from "react";
import {
  View, Text, Modal, TouchableOpacity, FlatList,
  StyleSheet, Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { PaymentMethod, MOCK_PAYMENT_METHODS, PAYMENT_TYPE_META } from "../../data/paymentData";

interface CheckoutPaymentPickerProps {
  visible:    boolean;
  selectedId: string;
  onSelect:   (method: PaymentMethod) => void;
  onClose:    () => void;
}

export default function CheckoutPaymentPicker({
  visible, selectedId, onSelect, onClose,
}: CheckoutPaymentPickerProps) {
  const { colors } = useTheme();
  const router     = useRouter();

  // ── Navigate to payment methods management ───────────────
  function handleAddNew() {
    onClose();
    router.push("/payment-methods");
  }

  // ── Render a single payment method row ───────────────────
  function renderRow({ item }: { item: PaymentMethod }) {
    const isSelected = item.id === selectedId;
    const typeMeta   = PAYMENT_TYPE_META[item.type];

    return (
      <TouchableOpacity
        style={[
          styles.row,
          { borderColor: isSelected ? colors.primary : colors.border },
          isSelected && { backgroundColor: colors.primary + "0A" },
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.75}
      >
        {/* Payment icon */}
        <View style={[styles.iconCircle, { backgroundColor: item.color + "18" }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>

        {/* Label + detail + type pill */}
        <View style={styles.rowText}>
          <View style={styles.rowTop}>
            <Text style={[styles.rowLabel, {
              color:      isSelected ? colors.primary : colors.text,
              fontFamily: typography.fontFamily.bold,
              fontSize:   typography.size.sm,
            }]}>
              {item.label}
            </Text>
            {/* Type badge */}
            <View style={[styles.typeBadge, { backgroundColor: colors.background }]}>
              <Text style={[styles.typeBadgeText, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}>
                {typeMeta.label}
              </Text>
            </View>
          </View>
          <Text style={[styles.rowDetail, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {item.detail}
          </Text>
        </View>

        {/* Selected indicator */}
        {isSelected
          ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
          : <View style={[styles.radioOuter, { borderColor: colors.border }]} />
        }
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* ── Backdrop ── */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* ── Bottom sheet ── */}
      <View style={[styles.sheet, { backgroundColor: colors.card }]}>

        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
            Select Payment
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={colors.subText} />
          </TouchableOpacity>
        </View>

        {/* Payment method list */}
        <FlatList
          data={MOCK_PAYMENT_METHODS}
          keyExtractor={m => m.id}
          renderItem={renderRow}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />

        {/* Manage payment methods link */}
        <TouchableOpacity
          style={[styles.manageBtn, { borderColor: colors.primary + "60" }]}
          onPress={handleAddNew}
          activeOpacity={0.8}
        >
          <Ionicons name="settings-outline" size={16} color={colors.primary} />
          <Text style={[styles.manageBtnText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
            Manage Payment Methods
          </Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingBottom:        28,
    maxHeight:            "70%",
  },

  handle: {
    width:        44,
    height:       4,
    borderRadius: 4,
    alignSelf:    "center",
    marginTop:    12,
    marginBottom: 6,
  },

  sheetHeader: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 20,
    paddingVertical:   14,
  },
  sheetTitle: {},

  list: {
    paddingHorizontal: 16,
    paddingBottom:     8,
  },

  // Row
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            12,
    padding:        14,
    borderRadius:   14,
    borderWidth:    1.5,
  },
  iconCircle: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  rowText: { flex: 1, gap: 2 },
  rowTop: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           7,
  },
  rowLabel: {},
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  typeBadgeText: {},
  rowDetail:    {},
  radioOuter: {
    width:        20,
    height:       20,
    borderRadius: 10,
    borderWidth:  2,
  },

  // Manage button
  manageBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    marginHorizontal:  16,
    marginTop:         12,
    paddingVertical:   13,
    borderRadius:      14,
    borderWidth:       1.5,
    borderStyle:       "dashed",
  },
  manageBtnText: {},
});

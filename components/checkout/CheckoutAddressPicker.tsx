// ============================================================
// CHECKOUT ADDRESS PICKER — Apana Store
//
// Bottom-sheet style modal listing all saved addresses.
// Tapping a row selects it and closes the modal.
// "Add new address" links to /address-book.
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
import { UserAddress, SAVED_ADDRESSES } from "../../data/addressData";

interface CheckoutAddressPickerProps {
  visible:    boolean;
  selectedId: string;
  onSelect:   (address: UserAddress) => void;
  onClose:    () => void;
}

export default function CheckoutAddressPicker({
  visible, selectedId, onSelect, onClose,
}: CheckoutAddressPickerProps) {
  const { colors } = useTheme();
  const router     = useRouter();

  // ── Handle adding a new address ───────────────────────────
  function handleAddNew() {
    onClose();
    router.push("/address-book");
  }

  // ── Render a single address row ───────────────────────────
  function renderRow({ item }: { item: UserAddress }) {
    const isSelected = item.id === selectedId;

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
        {/* Icon circle */}
        <View style={[
          styles.iconCircle,
          { backgroundColor: isSelected ? colors.primary + "18" : colors.background },
        ]}>
          <Ionicons
            name={item.icon as any}
            size={18}
            color={isSelected ? colors.primary : colors.subText}
          />
        </View>

        {/* Address text */}
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, {
            color:      isSelected ? colors.primary : colors.text,
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.sm,
          }]}>
            {item.label}
          </Text>
          <Text style={[styles.rowLine, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}
            numberOfLines={1}>
            {item.line1}, {item.line2}
          </Text>
          <Text style={[styles.rowLine, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {item.city} — {item.pincode}
          </Text>
        </View>

        {/* Selected checkmark */}
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
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
      {/* ── Dimmed backdrop ── */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* ── Sheet ── */}
      <View style={[styles.sheet, { backgroundColor: colors.card }]}>

        {/* Handle bar */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Sheet header */}
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
            Select Address
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={colors.subText} />
          </TouchableOpacity>
        </View>

        {/* ── Address list ── */}
        <FlatList
          data={SAVED_ADDRESSES}
          keyExtractor={a => a.id}
          renderItem={renderRow}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />

        {/* ── Add new address button ── */}
        <TouchableOpacity
          style={[styles.addBtn, { borderColor: colors.primary + "60" }]}
          onPress={handleAddNew}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
          <Text style={[styles.addBtnText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
            Add New Address
          </Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Modal backdrop
  backdrop: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  // Bottom sheet panel
  sheet: {
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingBottom:        28,
    maxHeight:            "75%",
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

  // Address list
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
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  rowText:  { flex: 1, gap: 2 },
  rowLabel: {},
  rowLine:  { lineHeight: 17 },

  // Add new button
  addBtn: {
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
  addBtnText: {},
});

// ============================================================
// SHARED LIST ADD ITEM — Apana Store
//
// Sticky input bar at the bottom of the list detail screen.
// User types item name and optional quantity, then taps Add.
// ============================================================

import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface SharedListAddItemProps {
  onAdd: (name: string, qty: string) => void;
}

export default function SharedListAddItem({ onAdd }: SharedListAddItemProps) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [qty,  setQty]  = useState("");

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, qty.trim() || "1 pc");
    setName("");
    setQty("");
  }

  return (
    <View style={[styles.bar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {/* Item name input */}
      <TextInput
        style={[styles.nameInput, {
          color:           colors.text,
          backgroundColor: colors.background,
          borderColor:     colors.border,
          fontFamily:      typography.fontFamily.regular,
          fontSize:        typography.size.sm,
        }]}
        placeholder="Add item…"
        placeholderTextColor={colors.subText}
        value={name}
        onChangeText={setName}
        returnKeyType="done"
        onSubmitEditing={handleAdd}
      />

      {/* Qty input */}
      <TextInput
        style={[styles.qtyInput, {
          color:           colors.text,
          backgroundColor: colors.background,
          borderColor:     colors.border,
          fontFamily:      typography.fontFamily.regular,
          fontSize:        typography.size.sm,
        }]}
        placeholder="Qty"
        placeholderTextColor={colors.subText}
        value={qty}
        onChangeText={setQty}
        returnKeyType="done"
        onSubmitEditing={handleAdd}
      />

      {/* Add button */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: name.trim() ? colors.primary : colors.border }]}
        onPress={handleAdd}
        activeOpacity={0.8}
        disabled={!name.trim()}
      >
        <Ionicons name="add" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    paddingHorizontal: 16,
    paddingVertical:   10,
    borderTopWidth:    1,
  },

  nameInput: {
    flex:          1,
    borderWidth:   1,
    borderRadius:  10,
    paddingHorizontal: 12,
    paddingVertical:   9,
  },
  qtyInput: {
    width:         72,
    borderWidth:   1,
    borderRadius:  10,
    paddingHorizontal: 10,
    paddingVertical:   9,
    textAlign:     "center",
  },
  addBtn: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
});

// ============================================================
// FAQ ITEM — Apana Store (Help Component)
//
// Single expandable question + answer row inside a category.
// Tapping the row toggles the answer open/closed with a
// chevron rotation indicator.
//
// Props:
//   item       — FaqItem data (id, question, answer)
//   isOpen     — whether this item is currently expanded
//   isLast     — suppresses the bottom divider on the last item
//   onToggle   — called when the row is tapped
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { FaqItem as FaqItemType } from "../../data/helpData";

interface FaqItemProps {
  item:     FaqItemType;
  isOpen:   boolean;
  isLast:   boolean;
  onToggle: (id: string) => void;
}

export default function FaqItem({ item, isOpen, isLast, onToggle }: FaqItemProps) {
  const { colors } = useTheme();

  return (
    <View>
      {/* ── Question row ── */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => onToggle(item.id)}
      >
        <Text style={[styles.question, {
          color:      isOpen ? colors.primary : colors.text,
          fontFamily: typography.fontFamily.medium,
          fontSize:   typography.size.sm,
          flex:       1,
        }]}>
          {item.question}
        </Text>

        {/* Chevron — rotates when open */}
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={isOpen ? colors.primary : colors.subText}
        />
      </TouchableOpacity>

      {/* ── Answer — visible when open ── */}
      {isOpen && (
        <Text style={[styles.answer, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.sm,
        }]}>
          {item.answer}
        </Text>
      )}

      {/* ── Divider (hidden on last item) ── */}
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   15,
    gap:               10,
  },
  question: { lineHeight: 20 },
  answer: {
    paddingHorizontal: 16,
    paddingBottom:     15,
    lineHeight:        22,
  },
  divider: {
    height:           1,
    marginHorizontal: 16,
  },
});

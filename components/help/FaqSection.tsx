// ============================================================
// FAQ SECTION — Apana Store (Help Component)
//
// A single FAQ category card — icon + category title header
// above a list of collapsible FaqItem rows.
//
// Props:
//   category  — FaqCategory (title, icon, items[])
//   openId    — id of the currently expanded item (or null)
//   onToggle  — (id) toggle open/close
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }       from "@expo/vector-icons";
import useTheme           from "../../theme/useTheme";
import { typography }     from "../../theme/typography";
import { FaqCategory }    from "../../data/helpData";
import FaqItem            from "./FaqItem";

interface FaqSectionProps {
  category: FaqCategory;
  openId:   string | null;
  onToggle: (id: string) => void;
}

export default function FaqSection({ category, openId, onToggle }: FaqSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {/* ── Category header ── */}
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + "15" }]}>
          <Ionicons name={category.icon as any} size={16} color={colors.primary} />
        </View>
        <Text style={[styles.title, {
          color:      colors.text,
          fontFamily: typography.fontFamily.semiBold,
          fontSize:   typography.size.sm,
        }]}>
          {category.title}
        </Text>
      </View>

      {/* ── FAQ item list card ── */}
      <View style={[styles.card, {
        backgroundColor: colors.card,
        borderColor:     colors.border,
      }]}>
        {category.items.map((item, i) => (
          <FaqItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            isLast={i === category.items.length - 1}
            onToggle={onToggle}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:    { gap: 8 },
  header: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    paddingLeft:   4,
  },
  iconWrap: {
    width:          26,
    height:         26,
    borderRadius:   8,
    alignItems:     "center",
    justifyContent: "center",
  },
  title: {},
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },
});

// ============================================================
// LANGUAGE ITEM — Apana Store
//
// Single row in the language selection list.
// Layout: flag emoji | native name + English subtitle | checkmark
// Selected row gets a primary-colored left accent + tinted bg.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { Language } from "../../data/languageData";

interface LanguageItemProps {
  language:   Language;
  isSelected: boolean;
  onPress:    () => void;
}

export default function LanguageItem({ language, isSelected, onPress }: LanguageItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: isSelected ? colors.primary + "10" : colors.card,
          borderColor:     isSelected ? colors.primary          : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Selected accent stripe */}
      {isSelected && (
        <View style={[styles.accent, { backgroundColor: colors.primary }]} />
      )}

      {/* Flag */}
      <Text style={styles.flag}>{language.flag}</Text>

      {/* Names */}
      <View style={styles.nameBlock}>
        <Text style={[styles.nativeName, {
          color:      colors.text,
          fontFamily: isSelected ? typography.fontFamily.bold : typography.fontFamily.semiBold,
          fontSize:   typography.size.md,
        }]}>
          {language.nativeName}
        </Text>
        <Text style={[styles.englishName, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs,
        }]}>
          {language.englishName}
        </Text>
      </View>

      {/* Checkmark when selected */}
      {isSelected ? (
        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
      ) : (
        <View style={[styles.emptyCircle, { borderColor: colors.border }]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               14,
    borderRadius:      14,
    borderWidth:       1,
    paddingVertical:   14,
    paddingHorizontal: 14,
    overflow:          "hidden",
  },

  accent: {
    position: "absolute",
    left:     0,
    top:      0,
    bottom:   0,
    width:    4,
  },

  flag:      { fontSize: 26 },

  nameBlock: { flex: 1 },
  nativeName:  { lineHeight: 22 },
  englishName: { marginTop: 1 },

  emptyCircle: {
    width:        22,
    height:       22,
    borderRadius: 11,
    borderWidth:  1.5,
  },
});

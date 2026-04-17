// ============================================================
// PLACE SUGGESTION LIST — Apana Store (Location Component)
//
// Dropdown list of Mappls autosuggest results shown below the
// search input. Each row shows placeName + placeAddress.
// Tapping a row calls onSelect with the full suggestion object.
//
// Props:
//   suggestions — PlaceSuggestion[] from mapplsService.autosuggest()
//   loading     — true while API call is in-flight
//   onSelect    — (suggestion) called on row tap
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons }         from "@expo/vector-icons";
import useTheme             from "../../theme/useTheme";
import { typography }       from "../../theme/typography";
import { PlaceSuggestion }  from "../../services/mapplsService";

interface PlaceSuggestionListProps {
  suggestions: PlaceSuggestion[];
  loading:     boolean;
  onSelect:    (s: PlaceSuggestion) => void;
}

export default function PlaceSuggestionList({
  suggestions, loading, onSelect,
}: PlaceSuggestionListProps) {
  const { colors } = useTheme();

  if (!loading && suggestions.length === 0) return null;

  return (
    <View style={[styles.list, {
      backgroundColor: colors.card,
      borderColor:     colors.border,
      shadowColor:     colors.text,
    }]}>
      {/* ── Loading state ── */}
      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      {/* ── Suggestion rows ── */}
      {!loading && suggestions.map((s, i) => (
        <TouchableOpacity
          key={s.eLoc || i}
          style={[
            styles.row,
            i < suggestions.length - 1 && [styles.rowBorder, { borderBottomColor: colors.border }],
          ]}
          activeOpacity={0.75}
          onPress={() => onSelect(s)}
        >
          {/* Pin icon */}
          <Ionicons name="location-outline" size={16} color={colors.primary} style={styles.pin} />

          {/* Text block */}
          <View style={styles.textBlock}>
            <Text style={[styles.name, {
              color:      colors.text,
              fontFamily: typography.fontFamily.semiBold,
              fontSize:   typography.size.sm,
            }]} numberOfLines={1}>
              {s.placeName}
            </Text>
            <Text style={[styles.addr, {
              color:      colors.subText,
              fontFamily: typography.fontFamily.regular,
              fontSize:   typography.size.xs,
            }]} numberOfLines={1}>
              {s.placeAddress}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius:  12,
    borderWidth:   1,
    overflow:      "hidden",
    marginTop:     4,
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius:  10,
    elevation:     4,
  },
  loadingRow: {
    paddingVertical: 16,
    alignItems:      "center",
  },
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 14,
    paddingVertical:   13,
    gap:               10,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  pin:       { flexShrink: 0 },
  textBlock: { flex: 1, gap: 2 },
  name:      {},
  addr:      {},
});

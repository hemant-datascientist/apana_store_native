// ============================================================
// STORE ACTION BUTTONS — Apana Store (Store Detail Component)
//
// 4 quick-action tiles: Directions | Book Ride | Call | Website
// "Book Ride" is the primary filled tile.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Linking, Alert,
} from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreDetail } from "../../data/storeDetailData";

interface StoreActionButtonsProps {
  store:         StoreDetail;
  onDirections:  () => void;
  onBookRide:    () => void;
}

export default function StoreActionButtons({
  store, onDirections, onBookRide,
}: StoreActionButtonsProps) {
  const { colors } = useTheme();

  async function handleCall() {
    const url = `tel:${store.phone}`;
    const ok  = await Linking.canOpenURL(url);
    if (ok) Linking.openURL(url);
    else    Alert.alert("Unavailable", "Cannot open phone dialler.");
  }

  async function handleWebsite() {
    if (!store.website) { Alert.alert("No website", "This store has no website listed."); return; }
    const ok = await Linking.canOpenURL(store.website);
    if (ok) Linking.openURL(store.website);
    else    Alert.alert("Unavailable", "Cannot open website.");
  }

  const actions = [
    {
      key:       "directions",
      label:     "Directions",
      icon:      "navigate-outline",
      primary:   false,
      onPress:   onDirections,
    },
    {
      key:       "ride",
      label:     "Book Ride",
      icon:      "car-outline",
      primary:   true,
      onPress:   onBookRide,
    },
    {
      key:       "call",
      label:     "Call",
      icon:      "call-outline",
      primary:   false,
      onPress:   handleCall,
    },
    {
      key:       "website",
      label:     "Website",
      icon:      "globe-outline",
      primary:   false,
      onPress:   handleWebsite,
    },
  ];

  return (
    <View style={styles.row}>
      {actions.map(action => (
        <TouchableOpacity
          key={action.key}
          style={[
            styles.tile,
            action.primary
              ? { backgroundColor: colors.primary, borderColor: colors.primary }
              : { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          activeOpacity={0.8}
          onPress={action.onPress}
        >
          <Ionicons
            name={action.icon as any}
            size={22}
            color={action.primary ? colors.white : colors.primary}
          />
          <Text style={[styles.label, {
            color:      action.primary ? colors.white : colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.xs,
          }]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    paddingHorizontal: 16,
    gap:               10,
  },
  tile: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    gap:            6,
    paddingVertical: 12,
    borderRadius:   14,
    borderWidth:    1,
  },
  label: { textAlign: "center" },
});

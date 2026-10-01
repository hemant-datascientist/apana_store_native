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
  /** https://<origin>/s/<id> — undefined until EXPO_PUBLIC_STORE_WEB_URL is
   *  set, or for the bundled demo store (see store-detail.tsx). */
  webUrl?:       string;
}

export default function StoreActionButtons({
  store, onDirections, onBookRide, webUrl,
}: StoreActionButtonsProps) {
  const { colors } = useTheme();

  async function handleCall() {
    const url = `tel:${store.phone}`;
    const ok  = await Linking.canOpenURL(url);
    if (ok) Linking.openURL(url);
    else    Alert.alert("Unavailable", "Cannot open phone dialler.");
  }

  // Ride mode isn't real: no booking endpoint, no customer flow, taskBridge
  // hardcodes every task as a delivery. Rather than hide the button (which
  // silently drops ride-mode's presence from the product) or wire it to a
  // dead-end (which was the earlier defect — an Alert that read as broken),
  // it stays visible with a SOON badge and says plainly what's missing —
  // same pattern as the Stock Lens tiles.
  function handleBookRide() {
    Alert.alert(
      "Ride booking — coming soon",
      "Apana doesn't have a ride system yet. This button will book a ride to this shop once one exists.",
    );
    onBookRide();
  }

  // "Website" opens the real per-seller page once one exists. webUrl is
  // undefined until EXPO_PUBLIC_STORE_WEB_URL is configured — until then this
  // stays visible with a SOON badge, same as Book Ride, instead of vanishing
  // (the earlier defect: opening a mock "https://apanastore.in" for every
  // shop that never gave one).
  async function handleWebsite() {
    if (!webUrl) {
      Alert.alert(
        "Website — coming soon",
        "This shop's page on the web isn't live yet. This button will open it once it is.",
      );
      return;
    }
    const ok = await Linking.canOpenURL(webUrl);
    if (ok) Linking.openURL(webUrl);
    else    Alert.alert("Unavailable", "Cannot open this link.");
  }

  const actions = [
    {
      key:       "directions",
      label:     "Directions",
      icon:      "navigate-outline",
      primary:   false,
      soon:      false,
      onPress:   onDirections,
    },
    {
      key:       "ride",
      label:     "Book Ride",
      icon:      "car-outline",
      primary:   false,
      soon:      true,
      onPress:   handleBookRide,
    },
    {
      key:       "call",
      label:     "Call",
      icon:      "call-outline",
      primary:   false,
      soon:      false,
      onPress:   handleCall,
    },
    {
      key:       "website",
      label:     "Website",
      icon:      "globe-outline",
      primary:   false,
      soon:      !webUrl,
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
          {action.soon && (
            <View style={[styles.soonBadge, { backgroundColor: colors.warning }]}>
              <Text style={[styles.soonText, { fontFamily: typography.fontFamily.bold }]}>SOON</Text>
            </View>
          )}
          <Ionicons
            name={action.icon as any}
            size={22}
            color={action.primary ? colors.white : (action.soon ? colors.subText : colors.primary)}
          />
          <Text style={[styles.label, {
            color:      action.primary ? colors.white : (action.soon ? colors.subText : colors.text),
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
    position:       "relative",
  },
  label: { textAlign: "center" },

  soonBadge: {
    position:          "absolute",
    top:               6,
    right:             6,
    paddingHorizontal: 5,
    paddingVertical:   1,
    borderRadius:      6,
  },
  soonText: {
    color:    "#fff",
    fontSize: 8,
    letterSpacing: 0.3,
  },
});

// ============================================================
// ADDRESS BOOK — Apana Store (Customer App)
//
// Lists all saved addresses as radio-button cards.
// Tapping a card selects it as the active delivery address
// and pops the screen — HomeHeader + AllFeed update instantly.
//
// UI:
//   • Header bar: back arrow + "Manage Address" + add icon
//   • Radio cards: icon + label + full address + edit action
//   • OR divider
//   • "+ Add New Address" dashed button → /add-address?mode=add
//
// New/edited addresses returned from add-address via router
// params (`newAddressJson`) are merged into local addresses state
// so the list updates without a backend round-trip.
//
// Backend: GET /api/customer/addresses  (swap SAVED_ADDRESSES)
//          PUT /api/customer/active-address  (swap setSelectedAddress)
// ============================================================

import React, { useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  StatusBar, Alert,
} from "react-native";
import { SafeAreaView }  from "react-native-safe-area-context";
import { Ionicons }      from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import useTheme         from "../../theme/useTheme";
import { typography }    from "../../theme/typography";
import { useLocation }   from "../../context/LocationContext";
import { SAVED_ADDRESSES, UserAddress } from "../../data/addressData";

// Deliberate dark-navy header — brand chrome, not body text
const BRAND_BLUE = "#0F4C81";

export default function AddressBookScreen() {
  const router                               = useRouter();
  const { colors }                           = useTheme();
  const { selectedAddress, setSelectedAddress } = useLocation();

  // ── Local address list (starts from mock, updated on add/edit) ──
  const [addresses, setAddresses] = useState<UserAddress[]>(SAVED_ADDRESSES);

  // ── Pick up new/edited address returned from add-address screen ──
  // expo-router passes params on router.setParams before back().
  // useFocusEffect fires each time this screen comes back into focus.
  const { newAddressJson } = useLocalSearchParams<{ newAddressJson?: string }>();

  useFocusEffect(
    useCallback(() => {
      if (!newAddressJson) return;
      try {
        const incoming: UserAddress = JSON.parse(newAddressJson);
        setAddresses(prev => {
          const exists = prev.findIndex(a => a.id === incoming.id);
          if (exists >= 0) {
            // Edit — replace in-place
            const next = [...prev];
            next[exists] = incoming;
            return next;
          }
          // Add — append
          return [...prev, incoming];
        });
      } catch { /* malformed param — ignore */ }
    }, [newAddressJson]),
  );

  function handleSelect(addr: UserAddress) {
    setSelectedAddress(addr);
    router.back();
  }

  function handleDelete(addr: UserAddress) {
    Alert.alert(
      "Delete Address",
      `Remove "${addr.label}" address?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text:    "Delete",
          style:   "destructive",
          onPress: () => setAddresses(prev => prev.filter(a => a.id !== addr.id)),
        },
      ],
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          Manage Address
        </Text>

        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.75}
          onPress={() => router.push("/add-address?mode=add" as any)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Saved address cards ── */}
        {addresses.map(addr => {
          const isSelected = selectedAddress.id === addr.id;

          return (
            <TouchableOpacity
              key={addr.id}
              // Card surface + selected border from theme so dark mode flips correctly
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: isSelected ? BRAND_BLUE : colors.border },
              ]}
              activeOpacity={0.8}
              onPress={() => handleSelect(addr)}
            >
              {/* Icon — selected uses brand fill, idle uses muted surface (border token) */}
              <View style={[styles.iconWrap, { backgroundColor: isSelected ? BRAND_BLUE : colors.border }]}>
                <Ionicons
                  name={addr.icon as any}
                  size={20}
                  color={isSelected ? "#fff" : colors.subText}
                />
              </View>

              {/* Text */}
              <View style={styles.cardBody}>
                <Text style={[styles.addrLabel, {
                  fontFamily: typography.fontFamily.bold,
                  color:      isSelected ? BRAND_BLUE : colors.text,
                }]}>
                  {addr.label}
                </Text>

                <Text
                  numberOfLines={1}
                  style={[styles.addrLine, { fontFamily: typography.fontFamily.regular, color: colors.subText }]}
                >
                  {addr.line1}, {addr.line2}
                </Text>

                <Text
                  numberOfLines={1}
                  style={[styles.addrCity, { fontFamily: typography.fontFamily.medium, color: colors.text }]}
                >
                  {addr.city}, {addr.state} – {addr.pincode}
                </Text>
              </View>

              {/* Actions column */}
              <View style={styles.actions}>
                {/* Edit */}
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => router.push(`/add-address?mode=edit&id=${addr.id}` as any)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={17} color={colors.subText} />
                </TouchableOpacity>

                {/* Delete — danger token survives dark mode */}
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(addr)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={17} color={colors.danger} />
                </TouchableOpacity>
              </View>

              {/* Radio dot */}
              <View style={[styles.radio, { borderColor: isSelected ? BRAND_BLUE : colors.border }]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ── OR divider ── */}
        <View style={styles.orRow}>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.orText, { fontFamily: typography.fontFamily.medium, color: colors.subText }]}>OR</Text>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        </View>

        {/* ── Add New Address ── */}
        {/* primaryLight gives a faint brand wash that adapts to theme */}
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primaryLight, borderColor: BRAND_BLUE + "55" }]}
          activeOpacity={0.82}
          onPress={() => router.push("/add-address?mode=add" as any)}
        >
          <Ionicons name="add-circle-outline" size={20} color={BRAND_BLUE} />
          <Text style={[styles.addText, { fontFamily: typography.fontFamily.semiBold }]}>
            Add New Address
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // backgroundColor set inline from theme
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    backgroundColor:   BRAND_BLUE,
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
    paddingBottom:     14,
    gap:               4,
  },
  headerBtn: {
    width:          44,
    height:         44,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex:     1,
    fontSize: 17,
    color:    "#fff",
    textAlign: "center",
  },

  // ── Scroll ──────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop:        20,
    paddingBottom:     40,
    gap:               12,
  },

  // ── Address cards ───────────────────────────────────────────
  card: {
    flexDirection:   "row",
    alignItems:      "center",
    // backgroundColor + borderColor set inline from theme
    borderRadius:    14,
    padding:         14,
    borderWidth:     1.5,
    gap:             12,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
    elevation:       2,
  },

  iconWrap: {
    width:          40,
    height:         40,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
    // backgroundColor set inline from theme
  },

  cardBody: {
    flex: 1,
    gap:  2,
  },
  addrLabel: { fontSize: 14 },
  addrLine:  { fontSize: 12 }, // color set inline from theme
  addrCity:  { fontSize: 12 }, // color set inline from theme

  // Edit + Delete
  actions: { gap: 4, flexShrink: 0 },
  actionBtn: {
    width:          28,
    height:         28,
    alignItems:     "center",
    justifyContent: "center",
  },

  // Radio button
  radio: {
    width:          20,
    height:         20,
    borderRadius:   10,
    borderWidth:    2,
    // borderColor set inline from theme
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  radioInner: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: BRAND_BLUE,
  },

  // ── OR divider ───────────────────────────────────────────────
  orRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
    marginVertical: 4,
  },
  orLine: { flex: 1, height: 1 }, // backgroundColor inline from theme
  orText: { fontSize: 12 },        // color inline from theme

  // ── Add button ───────────────────────────────────────────────
  addBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             8,
    // backgroundColor + borderColor set inline from theme
    borderRadius:    14,
    paddingVertical: 16,
    borderWidth:     1.5,
    borderStyle:     "dashed",
  },
  addText: {
    fontSize: 14,
    color:    BRAND_BLUE,
  },
});

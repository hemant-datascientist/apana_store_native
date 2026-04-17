// ============================================================
// PROFILE SCREEN — Apana Store (Customer App)
//
// Sections (top → bottom):
//   ProfileHeader        — avatar, name, phone, edit button
//   ProfileStats         — Orders · Fav Stores · Rides counts
//   FavouriteStores      — horizontal scroll of saved stores
//   PartnerCard (x2)     — My Delivery Boy · My Rider
//   ProfileSettingSection — Account / Preferences / Support
//   Logout button
//
// Data: GET /customer/profile — replace mocks from profileData.ts
// ============================================================

import React, { useState } from "react";
import {
  View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import {
  MOCK_USER,
  PROFILE_STATS,
  FAVOURITE_STORES,
  MOCK_DELIVERY_BOY,
  MOCK_RIDER,
  SETTING_GROUPS,
} from "../../data/profileData";
import ProfileHeader         from "../../components/profile/ProfileHeader";
import ProfileStats          from "../../components/profile/ProfileStats";
import FavouriteStores       from "../../components/profile/FavouriteStores";
import PartnerCard           from "../../components/profile/PartnerCard";
import ProfileSettingSection from "../../components/profile/ProfileSettingSection";
import AppearanceModal       from "../../components/profile/AppearanceModal";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router     = useRouter();
  const [appearanceVisible, setAppearanceVisible] = useState(false);

  function handleSetting(key: string) {
    if (key === "appearance") {
      setAppearanceVisible(true);
      return;
    }
    Alert.alert("Coming Soon", `"${key}" feature is on the way.`);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ── Header: avatar + name + edit ── */}
        <ProfileHeader
          user={MOCK_USER}
          onEdit={() => Alert.alert("Edit Profile", "Profile editor coming soon.")}
        />

        {/* ── Stats row ── */}
        <ProfileStats stats={PROFILE_STATS} />

        {/* ── Favourite Stores — View All → Favourite screen (Stores tab) ── */}
        <FavouriteStores
          stores={FAVOURITE_STORES}
          onViewAll={() => router.push("/favourite?tab=stores")}
          onPress={store => Alert.alert(store.name, `${store.category} · ${store.area}`)}
        />

        {/* ── My Delivery Boy — tapping card section links to Delivery tab ── */}
        <PartnerCard
          partner={MOCK_DELIVERY_BOY}
          onViewFavourites={() => router.push("/favourite?tab=delivery")}
        />

        {/* ── My Rider — tapping card section links to Riders tab ── */}
        <PartnerCard
          partner={MOCK_RIDER}
          onViewFavourites={() => router.push("/favourite?tab=riders")}
        />

        {/* ── Settings sections ── */}
        {SETTING_GROUPS.map(group => (
          <ProfileSettingSection
            key={group.title}
            group={group}
            onPress={handleSetting}
          />
        ))}

        {/* ── Appearance modal ── */}
        <AppearanceModal
          visible={appearanceVisible}
          onClose={() => setAppearanceVisible(false)}
        />

        {/* ── Logout ── */}
        <View style={styles.logoutWrap}>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: colors.danger }]}
            onPress={() => Alert.alert("Log Out", "Are you sure you want to log out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out", style: "destructive", onPress: () => {} },
            ])}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={[styles.logoutLabel, { color: colors.danger, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              Log Out
            </Text>
          </TouchableOpacity>

          <Text style={[styles.version, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            Apana Store v1.0.0
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  content: { paddingBottom: 32 },

  logoutWrap: {
    alignItems:        "center",
    gap:               14,
    marginTop:         24,
    paddingHorizontal: 16,
  },
  logoutBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    width:             "100%",
    justifyContent:    "center",
    paddingVertical:   14,
    borderRadius:      14,
    borderWidth:       1,
  },
  logoutLabel: {},
  version: {
    letterSpacing: 0.3,
  },
});

// ============================================================
// PROFILE SCREEN — Apana Store (Customer App)
//
// Sections (top → bottom):
//   ProfileHeader        — avatar, name, phone, edit button
//   ProfileStats         — Orders · Fav Stores · Rides counts
//   FavouriteStores      — horizontal scroll of saved stores
//   ProfileSettingSection — Account / Preferences / Support
//   Logout button
//
// Data: GET /customer/profile — replace mocks from profileData.ts
// ============================================================

import React, { useEffect, useState } from "react";
import {
  View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useAuth } from "../../context/AuthContext";
import {
  profileStats,
  SETTING_GROUPS,
} from "../../data/profileData";
import { useFollowedStores } from "../../hooks/useFollow";
import { fetchOrderHistory } from "../../services/orderHistoryService";
import { useCustomerProfile, displayName } from "../../hooks/useCustomerProfile";
import { useCoverage } from "../../context/CoverageContext";
import { isSoundEnabled, playSound, setSoundEnabled } from "../../lib/sound";
import ProfileHeader         from "../../components/tabs/profile/ProfileHeader";
import ProfileStats          from "../../components/tabs/profile/ProfileStats";
import FavouriteStores       from "../../components/tabs/profile/FavouriteStores";
import ProfileSettingSection from "../../components/tabs/profile/ProfileSettingSection";
import AppearanceModal       from "../../components/tabs/profile/AppearanceModal";
import CoverageModal         from "../../components/tabs/profile/CoverageModal";

export default function ProfileScreen() {
  const { colors }  = useTheme();
  const router      = useRouter();
  const { logout, user }  = useAuth();
  const { meta: coverageMeta } = useCoverage();
  const [appearanceVisible, setAppearanceVisible] = useState(false);
  const [coverageVisible,   setCoverageVisible]   = useState(false);
  const followedStores = useFollowedStores();

  // THIS person, not MOCK_USER ("Hemant Sharma" on every phone). Name and email
  // come from customer_db via /customer/me; the phone is the verified identity.
  const { profile } = useCustomerProfile();

  // Real order count. fetchOrderHistory returns [] when signed out or off
  // backend, so a new customer sees 0 — which is true — instead of the "24"
  // this screen used to show everybody.
  const [orderCount, setOrderCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const orders = await fetchOrderHistory(user?.phone ?? "");
        if (!cancelled) setOrderCount(orders.length);
      } catch {
        // Leave it at 0. A network blip must not invent a purchase history.
      }
    })();
    return () => { cancelled = true; };
  }, [user?.phone]);

  // Surface the live coverage choice as the row's badge so the current
  // scope is readable without opening the modal.
  // Scan beep + order-status chime (lib/sound.ts). Read from the in-memory
  // flag initSound() populated at app start rather than re-reading storage.
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  // Surface the live coverage choice as the row's badge so the current
  // scope is readable without opening the modal. Sounds does the same with
  // its On/Off state, so the row shows what it is set to without a tap.
  const settingGroups = SETTING_GROUPS.map(group => ({
    ...group,
    items: group.items.map(item => {
      if (item.key === "coverage") return { ...item, badge: coverageMeta.label };
      if (item.key === "sounds")   return { ...item, badge: soundOn ? "On" : "Off" };
      return item;
    }),
  }));

  function handleSetting(key: string) {
    if (key === "sounds") {
      const next = !soundOn;
      setSoundOn(next);
      void setSoundEnabled(next);
      // Play it when switching ON so the shopper hears what they enabled —
      // and learns whether their phone volume is actually up.
      if (next) playSound("status");
      return;
    }
    if (key === "coverage")     { setCoverageVisible(true);           return; }
    if (key === "appearance")   { setAppearanceVisible(true);          return; }
    if (key === "addresses")    { router.push("/address-book");        return; }
    if (key === "about")        { router.push("/about-us");            return; }
    if (key === "edit_profile") { router.push("/edit-profile");        return; }
    if (key === "notifications"){ router.push("/notifications");       return; }
    if (key === "language")     { router.push("/language");            return; }
    if (key === "rate")         { router.push("/rate-us");             return; }
    if (key === "help")         { router.push("/help-support");        return; }
    if (key === "orders_hist") { router.push("/order-history");       return; }
    if (key === "payments")    { router.push("/payment-methods");     return; }
    if (key === "connect")     { router.push("/connect");             return; }
    Alert.alert(key, `"${key}" is not built yet.`);
  }

  function handleLogout() {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel",  style: "cancel" },
        {
          text:  "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/get-started");
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ── Header: avatar + name + edit ── */}
        <ProfileHeader
          user={{
            name: displayName(profile, user?.phone),
            phone: profile?.phone ?? user?.phone ?? "",
            // Null, not a stand-in address. Someone who has not given an email
            // should see that they have not, rather than another person's.
            email: profile?.email ?? "",
            avatar: null,
          }}
          onEdit={() => router.push("/edit-profile")}
        />

        {/* ── Stats row ── */}
        <ProfileStats stats={profileStats(orderCount, followedStores.length)} />

        {/* ── Stores You Follow — §30, the single store relationship.
             View All → Favourite hub (Stores tab), same as the partner
             rows below — one consistent destination for saved things ── */}
        <FavouriteStores
          stores={followedStores}
          onViewAll={() => router.push("/favourite?tab=stores")}
          onPress={store => router.push(`/store-detail?id=${store.id}`)}
        />

        {/* The "My Delivery Boy" and "My Rider" cards are gone. They rendered a
            rider and a driver — names, phone numbers, ratings — permanently
            "assigned" to every customer. Nobody has a permanent partner: an
            order gets one when it is claimed, and the numbers belonged to
            nobody (§19.8). Favourites remain reachable from the menu. */}

        {/* ── Settings sections ── */}
        {settingGroups.map(group => (
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

        {/* ── Store coverage modal — Nearest vs Long (§19) ── */}
        <CoverageModal
          visible={coverageVisible}
          onClose={() => setCoverageVisible(false)}
        />

        {/* ── Logout ── */}
        <View style={styles.logoutWrap}>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: colors.danger }]}
            onPress={handleLogout}
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

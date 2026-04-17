// ============================================================
// FAVOURITE — Apana Store (Customer App)
//
// 4-tab screen showing saved favourites:
//   Products  — saved products (empty until backend)
//   Stores    — saved local stores (uses FAVOURITE_STORES)
//   Riders    — saved auto/cab riders (uses FAVOURITE_RIDERS)
//   Delivery  — saved delivery partners (uses FAVOURITE_DELIVERIES)
//
// Navigation:
//   router.push("/favourite?tab=stores")   → opens Stores tab
//   router.push("/favourite?tab=riders")   → opens Riders tab
//   router.push("/favourite?tab=delivery") → opens Delivery tab
//
// Backend API:
//   GET  /api/customer/favourites/stores    → FavouriteStore[]
//   GET  /api/customer/favourites/riders    → FavouriteRider[]
//   GET  /api/customer/favourites/delivery  → FavouriteDelivery[]
//   POST /api/customer/favourites/{type}    { id } → 201
//   DELETE /api/customer/favourites/{type}/:id     → 204
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, Dimensions, Alert,
} from "react-native";
import { SafeAreaView }      from "react-native-safe-area-context";
import { Ionicons }          from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { typography }        from "../../theme/typography";
import { FAVOURITE_STORES }  from "../../data/profileData";
import {
  FAVOURITE_RIDERS,   FavouriteRider,
  FAVOURITE_DELIVERIES, FavouriteDelivery,
} from "../../data/favouriteData";

const BRAND_BLUE  = "#0F4C81";
const { width: SW } = Dimensions.get("window");

// ── Tab config ────────────────────────────────────────────────
type FavTab = "products" | "stores" | "riders" | "delivery";

interface TabConfig {
  key:   FavTab;
  label: string;
  icon:  string;
}

const TABS: TabConfig[] = [
  { key: "products", label: "Products", icon: "bag-outline"       },
  { key: "stores",   label: "Stores",   icon: "storefront-outline" },
  { key: "riders",   label: "Riders",   icon: "car-outline"        },
  { key: "delivery", label: "Delivery", icon: "bicycle-outline"    },
];

const TAB_GAP   = 8;
const TAB_H_PAD = 16;
const TAB_W     = Math.floor((SW - TAB_H_PAD * 2 - TAB_GAP * (TABS.length - 1)) / TABS.length);

// ── Initials avatar helper ─────────────────────────────────────
function Initials({ name, bg }: { name: string; bg: string }) {
  const letters = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <View style={[styles.avatar, { backgroundColor: bg }]}>
      <Text style={[styles.avatarText, { fontFamily: typography.fontFamily.bold }]}>{letters}</Text>
    </View>
  );
}

// ── Store card ────────────────────────────────────────────────
function StoreCard({ store }: { store: typeof FAVOURITE_STORES[0] }) {
  return (
    <TouchableOpacity
      style={styles.listCard}
      activeOpacity={0.8}
      onPress={() => Alert.alert(store.name, `${store.category} · ${store.area}`)}
    >
      <View style={[styles.storeIconWrap, { backgroundColor: BRAND_BLUE + "15" }]}>
        <Ionicons name={store.icon as any} size={24} color={BRAND_BLUE} />
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardName, { fontFamily: typography.fontFamily.semiBold }]}>
          {store.name}
        </Text>
        <Text style={[styles.cardSub, { fontFamily: typography.fontFamily.regular }]}>
          {store.category} · {store.area}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={[styles.metaText, { fontFamily: typography.fontFamily.medium }]}>
            {store.rating}
          </Text>
          <View style={[styles.openBadge, { backgroundColor: store.open ? "#DCFCE7" : "#F3F4F6" }]}>
            <Text style={[styles.openText, {
              fontFamily: typography.fontFamily.semiBold,
              color: store.open ? "#15803D" : "#6B7280",
            }]}>
              {store.open ? "Open" : "Closed"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeFavBtn}
        onPress={() => Alert.alert("Remove", `Remove ${store.name} from favourites?`)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="heart" size={20} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Rider card ────────────────────────────────────────────────
function RiderCard({ rider }: { rider: FavouriteRider }) {
  return (
    <TouchableOpacity
      style={styles.listCard}
      activeOpacity={0.8}
      onPress={() => Alert.alert(rider.name, `${rider.vehicle} · ${rider.vehicleNo}`)}
    >
      <Initials name={rider.name} bg={rider.avatarBg} />

      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={[styles.cardName, { fontFamily: typography.fontFamily.semiBold }]}>
            {rider.name}
          </Text>
          <View style={[styles.badge, { backgroundColor: rider.badgeBg }]}>
            <Text style={[styles.badgeText, { color: rider.badgeColor, fontFamily: typography.fontFamily.bold }]}>
              {rider.badge}
            </Text>
          </View>
        </View>
        <Text style={[styles.cardSub, { fontFamily: typography.fontFamily.regular }]}>
          {rider.vehicle} · {rider.vehicleNo}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={[styles.metaText, { fontFamily: typography.fontFamily.medium }]}>
            {rider.rating.toFixed(1)}
          </Text>
          <Text style={[styles.metaDot, { fontFamily: typography.fontFamily.regular }]}>·</Text>
          <Text style={[styles.metaText, { fontFamily: typography.fontFamily.regular }]}>
            {rider.totalRides} rides
          </Text>
          <View style={[styles.availBadge, {
            backgroundColor: rider.available ? "#DCFCE7" : "#F3F4F6",
          }]}>
            <Text style={[styles.availText, {
              fontFamily: typography.fontFamily.semiBold,
              color: rider.available ? "#15803D" : "#9CA3AF",
            }]}>
              {rider.available ? "Available" : "Busy"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Alert.alert("Call", `Calling ${rider.name} at ${rider.phone}`)}
          activeOpacity={0.8}
        >
          <Ionicons name="call-outline" size={16} color={BRAND_BLUE} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Alert.alert("Remove", `Remove ${rider.name} from favourites?`)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="heart" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── Delivery card ─────────────────────────────────────────────
function DeliveryCard({ partner }: { partner: FavouriteDelivery }) {
  return (
    <TouchableOpacity
      style={styles.listCard}
      activeOpacity={0.8}
      onPress={() => Alert.alert(partner.name, `${partner.vehicle} · ${partner.vehicleNo}`)}
    >
      <Initials name={partner.name} bg={partner.avatarBg} />

      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={[styles.cardName, { fontFamily: typography.fontFamily.semiBold }]}>
            {partner.name}
          </Text>
          <View style={[styles.badge, { backgroundColor: partner.badgeBg }]}>
            <Text style={[styles.badgeText, { color: partner.badgeColor, fontFamily: typography.fontFamily.bold }]}>
              {partner.badge}
            </Text>
          </View>
        </View>
        <Text style={[styles.cardSub, { fontFamily: typography.fontFamily.regular }]}>
          {partner.vehicle} · {partner.vehicleNo}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={[styles.metaText, { fontFamily: typography.fontFamily.medium }]}>
            {partner.rating.toFixed(1)}
          </Text>
          <Text style={[styles.metaDot, { fontFamily: typography.fontFamily.regular }]}>·</Text>
          <Ionicons name="time-outline" size={11} color="#9CA3AF" />
          <Text style={[styles.metaText, { fontFamily: typography.fontFamily.regular }]}>
            avg {partner.avgDeliveryTime}
          </Text>
          <View style={[styles.availBadge, {
            backgroundColor: partner.available ? "#DCFCE7" : "#F3F4F6",
          }]}>
            <Text style={[styles.availText, {
              fontFamily: typography.fontFamily.semiBold,
              color: partner.available ? "#15803D" : "#9CA3AF",
            }]}>
              {partner.available ? "Available" : "Busy"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Alert.alert("Call", `Calling ${partner.name} at ${partner.phone}`)}
          activeOpacity={0.8}
        >
          <Ionicons name="call-outline" size={16} color={BRAND_BLUE} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Alert.alert("Remove", `Remove ${partner.name} from favourites?`)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="heart" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ icon, title, sub, cta, onCta }: {
  icon: string; title: string; sub: string; cta: string; onCta: () => void;
}) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyCircle}>
        <Ionicons name={icon as any} size={52} color="#fff" />
      </View>
      <Text style={[styles.emptyTitle, { fontFamily: typography.fontFamily.semiBold }]}>
        {title}
      </Text>
      <Text style={[styles.emptySub, { fontFamily: typography.fontFamily.regular }]}>
        {sub}
      </Text>
      <TouchableOpacity style={styles.browseBtn} activeOpacity={0.85} onPress={onCta}>
        <Text style={[styles.browseBtnText, { fontFamily: typography.fontFamily.semiBold }]}>
          {cta}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────
export default function FavouriteScreen() {
  const router           = useRouter();
  const params           = useLocalSearchParams<{ tab?: string }>();
  const initialTab       = (params.tab as FavTab) ?? "products";
  const [activeTab, setActiveTab] = useState<FavTab>(initialTab);

  function renderContent() {
    switch (activeTab) {

      case "stores":
        return (
          <View style={styles.list}>
            <Text style={[styles.countLabel, { fontFamily: typography.fontFamily.regular }]}>
              {FAVOURITE_STORES.length} saved stores
            </Text>
            {FAVOURITE_STORES.map(s => <StoreCard key={s.id} store={s} />)}
          </View>
        );

      case "riders":
        return (
          <View style={styles.list}>
            <Text style={[styles.countLabel, { fontFamily: typography.fontFamily.regular }]}>
              {FAVOURITE_RIDERS.length} saved riders
            </Text>
            {FAVOURITE_RIDERS.map(r => <RiderCard key={r.id} rider={r} />)}
          </View>
        );

      case "delivery":
        return (
          <View style={styles.list}>
            <Text style={[styles.countLabel, { fontFamily: typography.fontFamily.regular }]}>
              {FAVOURITE_DELIVERIES.length} saved delivery partners
            </Text>
            {FAVOURITE_DELIVERIES.map(d => <DeliveryCard key={d.id} partner={d} />)}
          </View>
        );

      case "products":
      default:
        return (
          <EmptyState
            icon="heart-outline"
            title="No favourite products yet"
            sub="Tap the heart on any product to save it here for quick access."
            cta="Browse Products"
            onCta={() => router.back()}
          />
        );
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.75}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
            Favourite
          </Text>
          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.75}
            onPress={() => Alert.alert("Help", "Favourites help coming soon.")}
          >
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Tab pills ── */}
        <View style={styles.tabRow}>
          {TABS.map(t => {
            const isActive = t.key === activeTab;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, { width: TAB_W }, isActive && styles.tabActive]}
                activeOpacity={0.8}
                onPress={() => setActiveTab(t.key)}
              >
                <Ionicons
                  name={t.icon as any}
                  size={14}
                  color={isActive ? BRAND_BLUE : "rgba(255,255,255,0.70)"}
                />
                <Text style={[
                  styles.tabLabel,
                  { fontFamily: isActive ? typography.fontFamily.bold : typography.fontFamily.medium },
                  isActive && styles.tabLabelActive,
                ]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      {/* ── Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          activeTab === "products" && styles.scrollCentered,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },

  // ── Header ──────────────────────────────────────────────────
  header: {
    backgroundColor: BRAND_BLUE,
    paddingBottom:   16,
  },
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
  },
  headerBtn: {
    width: 44, height: 44,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: {
    flex: 1, fontSize: 17, color: "#fff", textAlign: "center",
  },

  // ── Tabs ────────────────────────────────────────────────────
  tabRow: {
    flexDirection:     "row",
    gap:               TAB_GAP,
    paddingHorizontal: TAB_H_PAD,
    marginTop:         12,
  },
  tab: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             5,
    paddingVertical: 9,
    borderRadius:    24,
    borderWidth:     1.5,
    borderColor:     "rgba(255,255,255,0.30)",
  },
  tabActive: {
    backgroundColor: "#fff",
    borderColor:     "#fff",
  },
  tabLabel:       { fontSize: 11, color: "rgba(255,255,255,0.70)" },
  tabLabelActive: { color: BRAND_BLUE },

  // ── Scroll ──────────────────────────────────────────────────
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  scrollCentered:{
    flexGrow: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 32,
  },

  // ── List ────────────────────────────────────────────────────
  list: { gap: 10 },
  countLabel: {
    fontSize: 12, color: "#9CA3AF", marginBottom: 4,
  },

  // ── List card (shared) ───────────────────────────────────────
  listCard: {
    flexDirection:   "row",
    alignItems:      "center",
    backgroundColor: "#fff",
    borderRadius:    14,
    padding:         14,
    gap:             12,
    borderWidth:     1,
    borderColor:     "#E5E7EB",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
    elevation:       2,
  },

  // Store icon
  storeIconWrap: {
    width: 48, height: 48,
    borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },

  // Initials avatar
  avatar: {
    width: 48, height: 48,
    borderRadius: 24,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 16, color: "#374151" },

  // Card body
  cardBody: { flex: 1, gap: 3 },
  nameRow: {
    flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap",
  },
  cardName: { fontSize: 14, color: "#111827" },
  cardSub:  { fontSize: 12, color: "#6B7280" },
  metaRow:  { flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap", marginTop: 2 },
  metaText: { fontSize: 11.5, color: "#6B7280" },
  metaDot:  { fontSize: 11, color: "#D1D5DB" },

  // Badges
  badge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { fontSize: 10 },
  openBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 6, marginLeft: 4,
  },
  openText: { fontSize: 10 },
  availBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 6, marginLeft: 2,
  },
  availText: { fontSize: 10 },

  // Card right-side actions
  cardActions: { gap: 10, alignItems: "center" },
  callBtn: {
    width: 34, height: 34,
    borderRadius: 17,
    backgroundColor: BRAND_BLUE + "15",
    alignItems: "center", justifyContent: "center",
  },
  removeFavBtn: { padding: 4 },

  // ── Empty state ─────────────────────────────────────────────
  emptyWrap:   { alignItems: "center", gap: 16 },
  emptyCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: BRAND_BLUE,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, color: "#111827", textAlign: "center" },
  emptySub: {
    fontSize: 13, color: "#6B7280", textAlign: "center", lineHeight: 20,
  },
  browseBtn: {
    backgroundColor: BRAND_BLUE, borderRadius: 24,
    paddingHorizontal: 22, paddingVertical: 12, marginTop: 8,
  },
  browseBtnText: { color: "#fff", fontSize: 13.5 },
});

// ============================================================
// NEW LAUNCHES SCREEN — Apana Store (Customer App)
//
// What is genuinely new near the customer:
//   New shops     — sellers who joined in the last 30 days (real `joined_at`)
//   New on shelves — the most recently listed products in the k-ring
//
// 🔴 This screen used to run on data/newLaunchersData.ts: eight invented
// businesses shown to every customer in every city, complete with "90-day
// warranty" and "certified technicians" claims, and storeIds that resolved to
// nothing. Its "Coming Soon" section is DELETED rather than rebuilt — nobody
// announces a future opening to Apana, so there is no source for it.
//
// Empty is empty (§19.8): a city with no new shops says so.
// ============================================================

import React from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useLocation } from "../../context/LocationContext";
import { useNewOnApana, joinedLabel } from "../../hooks/useNewOnApana";
import StateView from "../../components/ui/StateView";
import { SkeletonList } from "../../components/ui/Skeleton";
import NewShopRow from "../../components/new-launchers/NewShopRow";
import NewProductRow from "../../components/new-launchers/NewProductRow";

const ACCENT = "#7C3AED";

export default function NewLaunchersScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { deviceCity, selectedAddress } = useLocation();
  const city = deviceCity ?? selectedAddress.city;

  const { shops, products, loading, error, isEmpty, reload } = useNewOnApana();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />

      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              New on Apana
            </Text>
            {/* No city yet = no subtitle. "Freshest in undefined" was the old
                shape of this line before the city fallback was added. */}
            {city ? (
              <Text style={[styles.headerSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                Near you in {city}
              </Text>
            ) : null}
          </View>

          <View style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="sparkles-outline" size={18} color="#fff" />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* A skeleton is a claim data is coming — paired with the error branch
            below so a failed request can never leave it pulsing forever. */}
        {loading ? (
          <View style={styles.section}>
            <SkeletonList count={4} />
          </View>
        ) : error ? (
          <StateView
            variant="error"
            title="Couldn't load what's new"
            message={error}
            actionLabel="Try again"
            onAction={reload}
          />
        ) : isEmpty ? (
          <StateView
            variant="empty"
            title="Nothing new yet"
            message={
              city
                ? `No shop near you in ${city} has joined Apana in the last month, and nothing new has been listed.`
                : "No shop near you has joined Apana in the last month, and nothing new has been listed."
            }
          />
        ) : (
          <>
            {shops.length > 0 && (
              <View style={styles.section}>
                <SectionTitle
                  icon="storefront-outline"
                  label="New shops near you"
                  count={shops.length}
                  color={colors.text}
                />
                {shops.map((s) => (
                  <NewShopRow
                    key={s.id}
                    shop={s}
                    // Derived from the real timestamp; null when it cannot be
                    // described, in which case the row shows no age at all.
                    ageLabel={joinedLabel(s.joined_at)}
                    onPress={() => router.push(`/store-detail?id=${s.id}` as never)}
                  />
                ))}
              </View>
            )}

            {products.length > 0 && (
              <View style={styles.section}>
                <SectionTitle
                  icon="pricetag-outline"
                  label="Just listed nearby"
                  count={products.length}
                  color={colors.text}
                />
                {products.map((p) => (
                  <NewProductRow
                    key={p.id}
                    product={p}
                    onPress={() => router.push(`/live-product-detail?id=${p.id}` as never)}
                  />
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function SectionTitle({
  icon,
  label,
  count,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  count: number;
  color: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color={ACCENT} />
      <Text style={[styles.sectionTitle, { color, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
        {label}
      </Text>
      <View style={[styles.countPill, { backgroundColor: ACCENT + "20" }]}>
        <Text style={[styles.countText, { color: ACCENT, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
          {count}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: "#fff" },
  headerSub: { color: "rgba(255,255,255,0.75)", marginTop: 2 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { gap: 20, paddingVertical: 20 },

  section: { paddingHorizontal: 16, gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: {},
  countPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  countText: {},
});

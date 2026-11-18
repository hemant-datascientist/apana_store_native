// ============================================================
// ONDC NETWORK — shops on other ONDC seller apps, near the customer.
//
// A separate screen from Apana's own shops on purpose: their answers arrive
// over ~30 seconds from other companies' servers, and Apana's feed must never
// wait on that. "Order from this shop" opens ondc-order, where the shop's own
// app quotes the price and the final bill before anything is paid.
// ============================================================

import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { goBackOr } from "../../lib/goBack";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useNetworkShops } from "../../hooks/useNetworkShops";
import StateView from "../../components/ui/StateView";
import { SkeletonList } from "../../components/ui/Skeleton";
import NetworkShopCard from "../../components/ondc-network/NetworkShopCard";

export default function OndcNetworkScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { shops, searching, error, retry, txn } = useNetworkShops();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={["top"]} style={[styles.header, { borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => goBackOr()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>ONDC Network</Text>
          <Text style={[styles.sub, { color: colors.subText }]}>Shops near you on other ONDC apps</Text>
        </View>
        <TouchableOpacity onPress={() => void retry()} disabled={searching} style={styles.back}>
          <Ionicons name="refresh" size={20} color={searching ? colors.subText : colors.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.note, { color: colors.subText }]}>
          Prices and stock are as these shops publish them; the shop's app confirms the final bill before you pay.
        </Text>
        {shops.map((s) => (
          <NetworkShopCard
            key={`${s.bpp_id}|${s.provider_id}`}
            shop={s}
            onOrder={txn ? () => router.push({ pathname: "/ondc-order", params: { txn, bpp_id: s.bpp_id, provider_id: s.provider_id } }) : undefined}
          />
        ))}
        {searching ? (
          <>
            <Text style={[styles.note, { color: colors.subText }]}>Asking shops on the ONDC network…</Text>
            {shops.length === 0 ? <SkeletonList count={3} /> : null}
          </>
        ) : null}
        {error ? (
          <StateView variant="error" title="Could not search the ONDC network" message={error} actionLabel="Try again" onAction={() => void retry()} />
        ) : null}
        {!searching && !error && shops.length === 0 ? (
          <StateView variant="empty" title="No ONDC shops answered" message="No shop on the ONDC network serves your location right now." />
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingBottom: 10, borderBottomWidth: 1 },
  back: { padding: 8 },
  title: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl },
  sub: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs },
  body: { padding: 16, gap: 12 },
  note: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs },
});

// ============================================================
// FOLLOWING SCREEN — stores the customer follows (§30). The customer side of
// seller "Fans": follow a shop → see it here → get its updates (gated by
// notification prefs / mute, P4b). Resolves only KNOWN stores (no s1 fallback);
// ids from scanned external QRs we have no data for are skipped.
// Backend: GET /customer/following → StoreSummary[]
// ============================================================

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useFollowedIds } from "../../hooks/useFollow";
import { toggleFollow } from "../../lib/followStore";
import { MOCK_STORES, StoreDetail } from "../../data/storeDetailData";

export default function FollowingScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const ids = useFollowedIds();
  // Resolve to known stores only — unknown ids (scanned external) have no data.
  const stores = ids
    .map((id) => MOCK_STORES[id])
    .filter((s): s is StoreDetail => Boolean(s));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.background }]}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
            Following {stores.length > 0 ? `(${stores.length})` : ""}
          </Text>
          <View style={styles.backBtn} />
        </View>
      </SafeAreaView>

      {stores.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="heart-outline" size={36} color={colors.subText} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            Not following any stores yet
          </Text>
          <Text style={[styles.emptySub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            Follow your local shops to see them here and get their offers & new-stock updates.
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {stores.map((store) => (
            <FollowedRow
              key={store.id}
              store={store}
              colors={colors}
              onOpen={() => router.push(`/store-detail?id=${store.id}`)}
              onUnfollow={() => toggleFollow(store.id)}
            />
          ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </View>
  );
}

interface FollowedRowProps {
  store: StoreDetail;
  colors: ReturnType<typeof useTheme>["colors"];
  onOpen: () => void;
  onUnfollow: () => void;
}

function FollowedRow({ store, colors, onOpen, onUnfollow }: FollowedRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onOpen}
      activeOpacity={0.8}
    >
      <View style={[styles.iconCircle, { backgroundColor: store.heroBg }]}>
        <Ionicons name={store.icon as keyof typeof Ionicons.glyphMap} size={22} color="#fff" />
      </View>

      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={[styles.rowSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]} numberOfLines={1}>
          {store.category} · ★ {store.rating}
        </Text>
      </View>

      <TouchableOpacity onPress={onUnfollow} hitSlop={8} activeOpacity={0.7} style={styles.followingPill}>
        <Ionicons name="heart" size={16} color="#EF4444" />
        <Text style={[styles.followingText, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
          Following
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center" },

  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 32 },
  emptyIcon: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  emptyTitle: { textAlign: "center" },
  emptySub: { textAlign: "center", lineHeight: 20 },

  scroll: { gap: 10, padding: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  iconCircle: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  rowContent: { flex: 1, gap: 3 },
  rowTitle: {},
  rowSub: {},
  followingPill: { flexDirection: "row", alignItems: "center", gap: 5 },
  followingText: {},

  bottomSpacer: { height: 20 },
});

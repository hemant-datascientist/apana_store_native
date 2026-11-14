// ============================================================
// SCAN LOOKUP — what the server says about a scanned code.
//
// Loading → product + authenticity + shops, or an honest "not on Apana".
// A failed request is an ERROR with retry, never shown as "not found":
// a dead connection must not tell a shopper a real product does not exist.
// Authenticity wording is a signal, not a verdict — a wrong "fake" accuses
// a real shop.
// ============================================================

import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { ScanResolve } from "../../services/scanResolveService";

const MAX_STORES = 5;

interface Props {
  state: { status: "loading" } | { status: "error" } | { status: "done"; data: ScanResolve };
  onRetry: () => void;
  onOpenStore: (storeId: string) => void;
}

function rupees(cents: number): string {
  return `₹${(cents / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function ScanLookup({ state, onRetry, onOpenStore }: Props) {
  const { colors } = useTheme();
  const text = (size: number, family: string, color: string) => ({ fontSize: size, fontFamily: family, color });

  if (state.status === "loading") {
    return (
      <View style={styles.row}>
        <ActivityIndicator color={colors.primary} />
        <Text style={text(typography.size.sm, typography.fontFamily.regular, colors.subText)}>Looking it up…</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.block}>
        <Text style={text(typography.size.sm, typography.fontFamily.medium, colors.danger)}>
          Could not reach Apana to look this up.
        </Text>
        <TouchableOpacity onPress={onRetry} style={[styles.retry, { borderColor: colors.border }]} activeOpacity={0.75}>
          <Ionicons name="refresh" size={14} color={colors.text} />
          <Text style={text(typography.size.xs, typography.fontFamily.semiBold, colors.text)}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const d = state.data;
  const warn =
    d.authenticity === "not_issued" || d.authenticity === "possible_copy" || d.status === "suspended";
  const banner = d.authenticity_notice ?? d.notice ?? null;
  const shops = d.stores.slice(0, MAX_STORES);

  return (
    <View style={styles.block}>
      {d.authenticity === "genuine" && (
        <View style={[styles.banner, { backgroundColor: colors.success + "1A" }]}>
          <Ionicons name="shield-checkmark" size={16} color={colors.success} />
          <Text style={text(typography.size.xs, typography.fontFamily.semiBold, colors.success)}>
            The brand issued this pack serial
          </Text>
        </View>
      )}
      {warn && banner && (
        <View style={[styles.banner, { backgroundColor: colors.danger + "1A" }]}>
          <Ionicons name="warning" size={16} color={colors.danger} />
          <Text style={[{ flex: 1 }, text(typography.size.xs, typography.fontFamily.medium, colors.danger)]}>{banner}</Text>
        </View>
      )}

      {d.product?.name ? (
        <View>
          <Text style={text(typography.size.md, typography.fontFamily.bold, colors.text)} numberOfLines={2}>
            {d.product.name}
          </Text>
          {d.product.brand ? (
            <Text style={text(typography.size.xs, typography.fontFamily.regular, colors.subText)}>{d.product.brand}</Text>
          ) : null}
        </View>
      ) : d.authenticity === "not_issued" ? null : (
        <Text style={text(typography.size.sm, typography.fontFamily.medium, colors.subText)}>
          {d.found ? "Known code, no product name yet." : "This code is not on Apana yet."}
        </Text>
      )}

      {d.found && d.product && shops.length === 0 && (
        <Text style={text(typography.size.xs, typography.fontFamily.regular, colors.subText)}>
          No Apana shop has it in stock right now.
        </Text>
      )}

      {shops.map((s) => (
        <TouchableOpacity
          key={s.seller_product_id}
          style={[styles.shop, { borderColor: colors.border }]}
          activeOpacity={0.75}
          onPress={() => onOpenStore(s.store_id)}
        >
          <Ionicons name="storefront-outline" size={16} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={text(typography.size.sm, typography.fontFamily.semiBold, colors.text)} numberOfLines={1}>
              {s.store_name}
            </Text>
            <Text style={text(typography.size.xs, typography.fontFamily.regular, colors.subText)}>{s.city}</Text>
          </View>
          <Text style={text(typography.size.sm, typography.fontFamily.bold, colors.text)}>{rupees(s.price_cents)}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.subText} />
        </TouchableOpacity>
      ))}
      {d.stores.length > MAX_STORES && (
        <Text style={text(typography.size.xs, typography.fontFamily.regular, colors.subText)}>
          +{d.stores.length - MAX_STORES} more shops
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  block: { gap: 8, marginBottom: 16 },
  banner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 10 },
  retry: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  shop: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
});

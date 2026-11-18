// One shop from another ONDC seller app: name, measured distance, its items as sent.
import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { NetworkShop } from "../../services/ondcNetworkService";

const rupees = (p: number) => `₹${(p / 100).toFixed(p % 100 ? 2 : 0)}`;
const distance = (m: number | null) => (m == null ? null : m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`);

export default function NetworkShopCard({ shop }: { shop: NetworkShop }) {
  const { colors } = useTheme();
  const away = distance(shop.distance_m);
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.head}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{shop.name}</Text>
        {away ? <Text style={[styles.meta, { color: colors.subText }]}>{away} away</Text> : null}
      </View>
      <Text style={[styles.meta, { color: colors.subText }]}>On ONDC · {shop.bpp_id}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail} contentContainerStyle={{ gap: 10 }}>
        {shop.items.map((i) => (
          <View key={i.id} style={[styles.item, { borderColor: colors.border, opacity: i.in_stock ? 1 : 0.5 }]}>
            {i.image ? <Image source={{ uri: i.image }} style={styles.img} resizeMode="cover" /> : <View style={[styles.img, { backgroundColor: colors.border }]} />}
            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{i.name}</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: colors.text }]}>{rupees(i.price_paise)}</Text>
              {i.mrp_paise ? <Text style={[styles.mrp, { color: colors.subText }]}>{rupees(i.mrp_paise)}</Text> : null}
            </View>
            {!i.in_stock ? <Text style={[styles.meta, { color: colors.danger }]}>Out of stock</Text> : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 4 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  name: { flex: 1, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md },
  meta: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs },
  rail: { marginTop: 8 },
  item: { width: 120, borderWidth: 1, borderRadius: 10, padding: 8, gap: 4 },
  img: { width: "100%", height: 80, borderRadius: 8 },
  itemName: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, minHeight: 32 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  price: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm },
  mrp: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, textDecorationLine: "line-through" },
});

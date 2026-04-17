// ============================================================
// GROCERY PRODUCT GRID — Apana Store
//
// Section header + 3-column product grid.
// Each card: image placeholder (icon on colored bg) + name + price.
// Replace icon/bg with <Image source={{ uri: product.imageUrl }}
// when backend delivers real product images.
//
// Uses explicit row chunking (groups of 3) instead of flexWrap
// to guarantee exactly 3 cards per row on all screen sizes.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import { GroceryProduct, GrocerySection } from "../../../data/groceryData";

interface GroceryProductGridProps {
  section: GrocerySection;
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;
const COL_GAP       = 8;
const COLS          = 3;
// Floor to whole pixel — avoids sub-pixel overflow that breaks 3-col layout
const CARD_W        = Math.floor((SW - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS);
const IMG_H         = CARD_W;   // square image area

// Split array into chunks of N
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function GroceryProductGrid({ section }: GroceryProductGridProps) {
  const rows = chunk(section.products, COLS);

  return (
    <View style={styles.root}>

      {/* ── Section header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name={section.icon as any} size={17} color={section.iconColor} />
          <Text style={[styles.headerTitle, { color: "#111827", fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
            {section.title}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert(section.title, "Full list coming soon.")}>
          <Text style={[styles.seeAll, { color: section.iconColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Rows of 3 ── */}
      <View style={styles.grid}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                accentColor={section.iconColor}
              />
            ))}
            {/* Ghost cards to keep alignment when last row is incomplete */}
            {row.length < COLS &&
              Array(COLS - row.length).fill(null).map((_, i) => (
                <View key={`ghost-${i}`} style={[styles.card, styles.cardGhost, { width: CARD_W }]} />
              ))
            }
          </View>
        ))}
      </View>

    </View>
  );
}

// ── Individual product card ───────────────────────────────────

interface ProductCardProps {
  product:     GroceryProduct;
  accentColor: string;
}

function ProductCard({ product, accentColor }: ProductCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_W }]}
      activeOpacity={0.8}
      onPress={() => Alert.alert(product.name, `${product.price} — Product detail coming soon.`)}
    >
      {/* Image placeholder */}
      <View style={[styles.imgArea, { backgroundColor: product.bg, height: IMG_H }]}>
        <Ionicons name={product.icon as any} size={42} color="rgba(0,0,0,0.22)" />

        {/* Badge */}
        {product.badge && (
          <View style={[styles.badge, { backgroundColor: accentColor }]}>
            <Text style={[styles.badgeText, { fontFamily: typography.fontFamily.bold, fontSize: 8 }]}>
              {product.badge}
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text
          numberOfLines={2}
          style={[styles.name, { color: "#111827", fontFamily: typography.fontFamily.semiBold, fontSize: 11.5 }]}
        >
          {product.name}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.price, { color: accentColor, fontFamily: typography.fontFamily.bold, fontSize: 11 }]}
        >
          {product.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop:         20,
    paddingHorizontal: H_PAD,
  },

  // Section header
  header: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    marginBottom:   12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  headerTitle: {},
  seeAll:      {},

  // Grid (outer container)
  grid: {
    gap: COL_GAP,
  },

  // Each row of 3
  row: {
    flexDirection: "row",
    gap:           COL_GAP,
  },

  // Product card
  card: {
    borderRadius:    10,
    overflow:        "hidden",
    backgroundColor: "#fff",
    borderWidth:     1,
    borderColor:     "#F3F4F6",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
    elevation:       2,
  },
  cardGhost: {
    // Invisible — just holds space in incomplete last row
    backgroundColor: "transparent",
    borderColor:     "transparent",
    elevation:       0,
  },

  imgArea: {
    width:          "100%",
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
  },

  badge: {
    position:          "absolute",
    top:               6,
    left:              6,
    paddingHorizontal: 5,
    paddingVertical:   2,
    borderRadius:      4,
  },
  badgeText: {
    color:         "#fff",
    letterSpacing: 0.2,
  },

  info: {
    padding: 7,
    gap:     3,
  },
  name:  { lineHeight: 15 },
  price: {},
});

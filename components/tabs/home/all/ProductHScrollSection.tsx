// ============================================================
// PRODUCT HORIZONTAL SCROLL SECTION — Apana Store
//
// Section header + horizontally scrolling product cards.
// Used for: Daily Essentials, New Arrivals, etc.
// Card: icon placeholder + name + unit + price + "+" add button.
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography }  from "../../../../theme/typography";
import SectionHeader   from "./SectionHeader";
import { HomeProduct } from "../../../../data/allFeedData";

interface ProductHScrollSectionProps {
  icon:        string;
  title:       string;
  accentColor: string;
  products:    HomeProduct[];
}

const CARD_W = 115;
const IMG_H  = 100;

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ProductHScrollSection({
  icon, title, accentColor, products,
}: ProductHScrollSectionProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SectionHeader icon={icon} title={title} accentColor={accentColor} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {products.map(p => (
          <View key={p.id} style={styles.card}>

            {/* Image placeholder */}
            <TouchableOpacity
              style={[styles.imgArea, { backgroundColor: p.bg }]}
              activeOpacity={0.85}
              onPress={() => Alert.alert(p.name, `${p.unit} · ${fmt(p.price)}`)}
            >
              <Ionicons name={p.icon as any} size={36} color="rgba(0,0,0,0.20)" />
              {p.badge && (
                <View style={[styles.badge, { backgroundColor: accentColor }]}>
                  <Text style={[styles.badgeText, { fontFamily: typography.fontFamily.bold }]}>
                    {p.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Info */}
            <View style={styles.info}>
              <Text numberOfLines={2} style={[styles.name, { fontFamily: typography.fontFamily.semiBold }]}>
                {p.name}
              </Text>
              <Text numberOfLines={1} style={[styles.unit, { fontFamily: typography.fontFamily.regular }]}>
                {p.unit}
              </Text>

              {/* Price row + Add button */}
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: accentColor, fontFamily: typography.fontFamily.bold }]}>
                  {fmt(p.price)}
                </Text>
                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: accentColor }]}
                  activeOpacity={0.8}
                  onPress={() => Alert.alert("Added", `${p.name} added to cart.`)}
                >
                  <Ionicons name="add" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: 20 },

  header: { paddingHorizontal: 16 },

  scroll: {
    paddingHorizontal: 16,
    gap:               8,
    paddingBottom:     4,
  },

  card: {
    width:           CARD_W,
    borderRadius:    10,
    overflow:        "hidden",
    backgroundColor: "#fff",
    borderWidth:     1,
    borderColor:     "#F3F4F6",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    3,
    elevation:       2,
  },

  imgArea: {
    width:          "100%",
    height:         IMG_H,
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
  },

  badge: {
    position:          "absolute",
    top:               5,
    left:              5,
    paddingHorizontal: 5,
    paddingVertical:   2,
    borderRadius:      4,
  },
  badgeText: { color: "#fff", fontSize: 8 },

  info: {
    padding:    7,
    paddingTop: 6,
    gap:        2,
  },
  name: {
    fontSize:   11,
    color:      "#111827",
    lineHeight: 14,
  },
  unit: {
    fontSize: 9.5,
    color:    "#9CA3AF",
  },

  priceRow: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    marginTop:      4,
  },
  price: { fontSize: 12 },

  addBtn: {
    width:          24,
    height:         24,
    borderRadius:   6,
    alignItems:     "center",
    justifyContent: "center",
  },
});

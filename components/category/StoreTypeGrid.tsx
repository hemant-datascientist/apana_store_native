// ============================================================
// STORE TYPE GRID — Apana Store (Customer App)
//
// 2-column flex-wrap grid of StoreTypeCards.
// Rendered inside the Category screen's ScrollView when
// discovery mode = "stores".
// ============================================================

import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { StoreType } from "../../data/categoryData";
import StoreTypeCard from "./StoreTypeCard";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING    = 12;
const GAP          = 10;
const CARD_WIDTH   = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - GAP) / 2);

interface StoreTypeGridProps {
  stores:  StoreType[];
  onPress: (item: StoreType) => void;
}

export default function StoreTypeGrid({ stores, onPress }: StoreTypeGridProps) {
  return (
    <View style={styles.grid}>
      {stores.map(store => (
        <StoreTypeCard
          key={store.key}
          item={store}
          width={CARD_WIDTH}
          onPress={onPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection:     "row",
    flexWrap:          "wrap",
    gap:               GAP,
    paddingHorizontal: H_PADDING,
    paddingVertical:   12,
  },
});

// ============================================================
// ASC STORE CARD — the original Stores-mode card, now fed by ASC.
//
// Same shape as the old StoreTypeCard: full-width coloured image zone on
// top, name + short descriptor below. The photo shows when the store type
// has one (data/ascStoreImages.ts); otherwise the class emoji sits in its
// place, so a type without art still reads as itself.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

export interface AscStoreItem {
  code: string;
  label: string;
  sub: string;
  emoji: string;
  color: string;
  imageUrl: number | null;
}

interface AscStoreCardProps {
  item: AscStoreItem;
  width: number;
  onPress: (code: string) => void;
}

function AscStoreCard({ item, width, onPress }: AscStoreCardProps) {
  const { colors } = useTheme();
  const imgHeight = width * 0.68;

  return (
    <TouchableOpacity
      style={[styles.card, { width, backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(item.code)}
      activeOpacity={0.8}
    >
      {/* Image zone — emoji underlay, photo on top when present */}
      <View style={[styles.imgArea, { backgroundColor: item.color, height: imgHeight }]}>
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.center}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
        </View>

        {item.imageUrl != null && (
          <Image
            source={item.imageUrl}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
            recyclingKey={item.code}
            cachePolicy="memory-disk"
          />
        )}
      </View>

      {/* Text */}
      <View style={styles.textArea}>
        <Text
          numberOfLines={1}
          style={[styles.label, {
            color: colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.size.sm,
          }]}
        >
          {item.label}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.sub, {
            color: colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.size.xs,
          }]}
        >
          {item.sub}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  imgArea: { width: "100%", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 46 },
  textArea: { paddingHorizontal: 10, paddingVertical: 9, gap: 2 },
  label: {},
  sub: {},
});

export default React.memo(AscStoreCard);

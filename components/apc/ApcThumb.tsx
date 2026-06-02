// ============================================================
// ApcThumb — Apana Store
//
// Square thumbnail for an APC node: the real loose-catalog PNG (bridged
// grocery nodes carry image_url) via expo-image, else an emoji on a tinted
// tile. Keeps the emoji/image fallback logic in one place for cards + rows.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import useTheme from "../../theme/useTheme";
import { nodeImage, nodeEmoji, type ApcTreeNode } from "../../services/apc";

interface ApcThumbProps {
  node: ApcTreeNode;
  size?: number;
  radius?: number;
  emojiSize?: number;
}

export default function ApcThumb({ node, size = 40, radius = 12, emojiSize = 22 }: ApcThumbProps) {
  const { colors } = useTheme();
  const uri = nodeImage(node);
  const box = { width: size, height: size, borderRadius: radius };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[box, { backgroundColor: colors.primaryLight }]}
        contentFit="cover"
        transition={150}
        cachePolicy="memory-disk"
      />
    );
  }

  return (
    <View style={[box, styles.center, { backgroundColor: colors.primaryLight }]}>
      <Text style={{ fontSize: emojiSize, lineHeight: emojiSize + 4 }}>{nodeEmoji(node)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
});

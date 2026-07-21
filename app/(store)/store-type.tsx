// ============================================================
// STORE TYPE DETAIL — one §16 ASC store type.
//
// Shows what the taxonomy actually says about this kind of shop: its class,
// the categories it may sell, and any statutory requirement. Read from the
// same cached ASC fetch the browser uses.
//
// Backend: GET /api/asc/types
// ============================================================

import React from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useAscType } from "../../hooks/useAscBrowser";

export default function StoreTypeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();
  const { type, cls, loading } = useAscType(code);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}
        >
          {type?.name ?? "Store type"}
        </Text>
        <View style={styles.back} />
      </View>

      {loading && !type ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      ) : !type ? (
        <View style={styles.center}>
          <Ionicons name="storefront-outline" size={44} color={colors.subText} />
          <Text style={[styles.empty, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
            Store type not found.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Identity */}
          <View style={styles.hero}>
            <Text style={styles.icon}>{cls?.icon ?? "🏪"}</Text>
            <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {type.name}
            </Text>
            {cls && (
              <View style={[styles.chip, { backgroundColor: colors.primary + "18" }]}>
                <Text style={[styles.chipText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold }]}>
                  {cls.name}
                </Text>
              </View>
            )}
            <Text style={[styles.code, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
              {type.code}
            </Text>
            {cls && (
              <Text style={[styles.tagline, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                {cls.tagline}
              </Text>
            )}
          </View>

          {/* What it sells */}
          {type.subcategories.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                What this shop sells
              </Text>
              <View style={styles.tags}>
                {type.subcategories.map((s) => (
                  <Text
                    key={s}
                    style={[styles.tag, {
                      color: colors.text,
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      fontFamily: typography.fontFamily.regular,
                    }]}
                  >
                    {s}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Statutory requirement */}
          {type.compliance && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                Required to operate
              </Text>
              <Text style={[styles.body, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                {type.compliance}
              </Text>
            </View>
          )}

          {type.note && (
            <Text style={[styles.note, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
              {type.note}
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: typography.size.md },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 40 },
  empty: { fontSize: typography.size.md },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  hero: { alignItems: "center", gap: 6, paddingVertical: 14 },
  icon: { fontSize: 44 },
  name: { fontSize: typography.size.xl, textAlign: "center" },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 2 },
  chipText: { fontSize: typography.size.xs },
  code: { fontSize: typography.size.xs, letterSpacing: 0.5 },
  tagline: { fontSize: typography.size.sm, textAlign: "center", lineHeight: 20, marginTop: 4 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, marginTop: 14, gap: 10 },
  cardTitle: { fontSize: typography.size.md },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    fontSize: typography.size.xs,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  body: { fontSize: typography.size.sm, lineHeight: 20 },
  note: { fontSize: typography.size.xs, lineHeight: 18, marginTop: 14, fontStyle: "italic" },
});

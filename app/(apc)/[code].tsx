// ============================================================
// APC NODE — Apana Store (Customer App)
//
// A single node in the §27 taxonomy: breadcrumb trail, header
// (code / name / Hindi / path / Apana badge) and its sub-categories.
// Leaf nodes show a "products classify here" note instead of children.
//
// Data: GET /api/apc/tree/node/:code (node + children + ancestors).
// ============================================================

import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, StatusBar, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { getTreeNode, type ApcNodeContext } from "../../services/apc";
import ApcBreadcrumb from "../../components/apc/ApcBreadcrumb";
import ApcNodeRow from "../../components/apc/ApcNodeRow";

const ACCENT = "#0F4C81";

export default function ApcNodeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();

  const [ctx, setCtx] = useState<ApcNodeContext | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!code) return;
    setFailed(false);
    setCtx(null);
    getTreeNode(String(code)).then(setCtx).catch(() => setFailed(true));
  }, [code]);

  const node = ctx?.node;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />

      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md }]} numberOfLines={1}>
            {node?.name ?? "Category"}
          </Text>
        </View>
      </SafeAreaView>

      {failed ? (
        <View style={styles.center}>
          <Text style={[styles.note, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}>
            Couldn't load this category.
          </Text>
        </View>
      ) : !ctx || !node ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <ApcBreadcrumb ancestors={ctx.ancestors} current={node.name} />

          {/* ── Node header ── */}
          <View style={styles.titleBlock}>
            <View style={styles.codeRow}>
              <Text style={[styles.code, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
                {node.code}
              </Text>
              {node.source === "apana" && (
                <View style={[styles.badge, { borderColor: colors.primary }]}>
                  <Text style={[styles.badgeText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>APANA</Text>
                </View>
              )}
            </View>
            <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xxl }]}>
              {node.name}
            </Text>
            {node.name_hi ? (
              <Text style={[styles.hi, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.md }]}>{node.name_hi}</Text>
            ) : null}
            <Text style={[styles.path, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>{node.path}</Text>
          </View>

          {/* ── Children / leaf note ── */}
          {ctx.children.length > 0 ? (
            <>
              <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                {ctx.children.length} SUB-CATEGOR{ctx.children.length === 1 ? "Y" : "IES"}
              </Text>
              <View style={styles.childList}>
                {ctx.children.map((c) => <ApcNodeRow key={c.code} node={c} />)}
              </View>
            </>
          ) : (
            <View style={[styles.leafCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.leafText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
                Leaf category — products classify directly here under{" "}
                <Text style={{ color: colors.primary, fontFamily: typography.fontFamily.semiBold }}>{node.code}</Text>.
              </Text>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {},
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  headerTitle: { color: "#fff", flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  note: { textAlign: "center" },
  body: { padding: 16 },
  titleBlock: { marginTop: 14, gap: 4 },
  codeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  code: { letterSpacing: 0.5 },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 },
  badgeText: { letterSpacing: 0.5 },
  title: { marginTop: 2 },
  hi: {},
  path: { marginTop: 4 },
  sectionLabel: { letterSpacing: 0.5, marginTop: 22, marginBottom: 10 },
  childList: { gap: 10 },
  leafCard: { marginTop: 20, borderWidth: 1, borderRadius: 14, padding: 16 },
  leafText: { lineHeight: 21 },
});

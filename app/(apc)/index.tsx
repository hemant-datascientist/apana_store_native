// ============================================================
// APC BROWSER — Apana Store (Customer App)
//
// Top of the §27 cross-retail taxonomy. Lands on the segment grid
// (grocery → electronics → apparel → pooja …). A search box queries
// the whole tree by name and swaps the grid for matched rows.
//
// Data: GET /api/apc/tree/roots + /api/apc/tree/search (live BE).
// No phantom data — empty stays empty; failure shows a retry note.
// ============================================================

import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, StatusBar, ActivityIndicator, TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { getTreeRoots, searchTree, type ApcTreeNode } from "../../services/apc";
import ApcSegmentCard from "../../components/apc/ApcSegmentCard";
import ApcNodeRow from "../../components/apc/ApcNodeRow";

const ACCENT = "#0F4C81";

export default function ApcBrowserScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [roots, setRoots] = useState<ApcTreeNode[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApcTreeNode[]>([]);

  const load = () => {
    setFailed(false);
    setRoots(null);
    getTreeRoots().then(setRoots).catch(() => setFailed(true));
  };
  useEffect(load, []);

  // Debounced tree search — only fires at ≥2 chars (BE rejects shorter).
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setResults([]); return; }
    const t = setTimeout(() => { searchTree(q).then(setResults).catch(() => setResults([])); }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const searching = query.trim().length >= 2;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              All Categories
            </Text>
            <Text style={[styles.headerSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Apana Product Classification
            </Text>
          </View>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.8)" />
          <TextInput
            style={[styles.searchInput, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
            placeholder="Search categories…"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* ── Body ── */}
      {failed ? (
        <View style={styles.center}>
          <Text style={[styles.note, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}>
            Couldn't load categories. Is the API running?
          </Text>
          <TouchableOpacity onPress={load} style={[styles.retry, { borderColor: colors.primary }]} activeOpacity={0.7}>
            <Text style={{ color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : roots === null ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      ) : searching ? (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {results.length === 0 ? (
            <Text style={[styles.note, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
              No categories match "{query.trim()}".
            </Text>
          ) : (
            results.map((n) => <ApcNodeRow key={n.code} node={n} />)
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {Array.from({ length: Math.ceil(roots.length / 2) }, (_, r) => {
            const left = roots[r * 2];
            const right = roots[r * 2 + 1];
            return (
              <View key={r} style={styles.gridRow}>
                <ApcSegmentCard node={left} />
                {right ? <ApcSegmentCard node={right} /> : <View style={{ flex: 1 }} />}
              </View>
            );
          })}
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
  headerCenter: { flex: 1 },
  headerTitle: { color: "#fff" },
  headerSub: { color: "rgba(255,255,255,0.75)", marginTop: 2 },
  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginHorizontal: 16, marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, paddingHorizontal: 12, height: 44,
  },
  searchInput: { flex: 1, color: "#fff", padding: 0 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 24 },
  note: { textAlign: "center" },
  retry: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 9 },
  grid: { padding: 16, gap: 12 },
  gridRow: { flexDirection: "row", gap: 12 },
  list: { padding: 16, gap: 10 },
});

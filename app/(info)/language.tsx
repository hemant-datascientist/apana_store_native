// ============================================================
// LANGUAGE SCREEN — Apana Store
//
// Customer selects their preferred language for the app UI.
// Currently English is the active locale; other languages are
// placeholder slots for future i18n implementation.
//
// Layout:
//   Header          — back + title
//   Current card    — highlights the active language
//   Search bar      — filter list by typing
//   Language list   — scrollable LanguageItem rows
//   Apply button    — sticky CTA at bottom
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, StatusBar, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

import { LANGUAGES, DEFAULT_LANGUAGE_CODE, Language } from "../../data/languageData";
import LanguageItem from "../../components/language/LanguageItem";

export default function LanguageScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── Selected language (persisted to AsyncStorage in prod) ─
  const [selected, setSelected] = useState<string>(DEFAULT_LANGUAGE_CODE);
  const [query,    setQuery]    = useState("");

  // ── Filter list as user types ─────────────────────────────
  const filtered = useMemo(() => {
    if (!query.trim()) return LANGUAGES;
    const q = query.toLowerCase();
    return LANGUAGES.filter(
      l => l.nativeName.toLowerCase().includes(q) ||
           l.englishName.toLowerCase().includes(q),
    );
  }, [query]);

  const currentLang = LANGUAGES.find(l => l.code === selected)!;

  // ── Apply language ────────────────────────────────────────
  // Backend: PUT /user/preferences { language: selected }
  function handleApply() {
    if (selected === DEFAULT_LANGUAGE_CODE) {
      router.back();
      return;
    }
    Alert.alert(
      "Language Updated",
      `App language set to ${currentLang.nativeName}. Full translation coming soon — UI will update in the next app version.`,
      [{ text: "Got It", onPress: () => router.back() }],
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.primary }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              Language
            </Text>
            <Text style={[styles.headerSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {LANGUAGES.length} languages available
            </Text>
          </View>
          <View style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="language-outline" size={18} color="#fff" />
          </View>
        </View>
      </SafeAreaView>

      {/* ── Current language card ── */}
      <View style={[styles.currentCard, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "40" }]}>
        <View style={[styles.currentIconCircle, { backgroundColor: colors.primary + "20" }]}>
          <Text style={styles.currentFlag}>{currentLang.flag}</Text>
        </View>
        <View>
          <Text style={[styles.currentLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            Currently selected
          </Text>
          <Text style={[styles.currentName, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            {currentLang.nativeName}
          </Text>
        </View>
        <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={{ marginLeft: "auto" }} />
      </View>

      {/* ── Search bar ── */}
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={17} color={colors.subText} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
          placeholder="Search language…"
          placeholderTextColor={colors.subText}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={17} color={colors.subText} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Language list ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="language-outline" size={36} color={colors.subText} />
            <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}>
              No language found
            </Text>
          </View>
        ) : (
          filtered.map(lang => (
            <LanguageItem
              key={lang.code}
              language={lang}
              isSelected={selected === lang.code}
              onPress={() => setSelected(lang.code)}
            />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky Apply button ── */}
      <SafeAreaView
        style={[styles.applyBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
        edges={["bottom"]}
      >
        <TouchableOpacity
          style={[styles.applyBtn, { backgroundColor: colors.primary }]}
          onPress={handleApply}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
          <Text style={[styles.applyText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            Apply — {currentLang.nativeName}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {},
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  backBtn: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  headerCenter:  { flex: 1 },
  headerTitle:   { color: "#fff" },
  headerSub:     { color: "rgba(255,255,255,0.75)", marginTop: 2 },
  iconBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },

  // Current card
  currentCard: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    marginHorizontal:  16,
    marginTop:         14,
    marginBottom:      6,
    padding:           14,
    borderRadius:      14,
    borderWidth:       1,
  },
  currentIconCircle: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  currentFlag:  { fontSize: 24 },
  currentLabel: {},
  currentName:  {},

  // Search bar
  searchBar: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    marginHorizontal:  16,
    marginVertical:    10,
    paddingHorizontal: 14,
    paddingVertical:   11,
    borderRadius:      12,
    borderWidth:       1,
  },
  searchInput: { flex: 1 },

  // List
  list: {
    paddingHorizontal: 16,
    gap:               8,
  },

  // Empty
  emptyState: {
    alignItems:      "center",
    gap:             10,
    paddingVertical: 48,
  },
  emptyText: {},

  // Apply CTA
  applyBar: {
    position:       "absolute",
    bottom:         0,
    left:           0,
    right:          0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop:     12,
  },
  applyBtn: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
    paddingVertical: 14,
    borderRadius:   14,
  },
  applyText: { color: "#fff" },
});

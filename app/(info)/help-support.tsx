// ============================================================
// HELP & SUPPORT SCREEN — Apana Store (Customer App)
//
// Sections (top → bottom):
//   AuthHeader            — "Help & Support" title + back
//   HelpSearchBar         — real-time FAQ filter
//   QuickContactCard      — WhatsApp / Call / Email tiles
//   FaqSection (×N)       — collapsible categories; single-open
//   "Still need help?"    — footer CTA card → email support
//
// State:
//   query   — search text (filters across all FAQ items)
//   openId  — id of the currently expanded FAQ item (or null)
//
// Data: helpData.ts → QUICK_ACTIONS, FAQ_CATEGORIES
// Backend: GET /app/faqs — replace FAQ_CATEGORIES with live data
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, Alert, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter }    from "expo-router";
import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";
import {
  QUICK_ACTIONS,
  FAQ_CATEGORIES,
  FaqCategory,
} from "../../data/helpData";
import HelpSearchBar    from "../../components/help/HelpSearchBar";
import QuickContactCard from "../../components/help/QuickContactCard";
import FaqSection       from "../../components/help/FaqSection";

export default function HelpSupportScreen() {
  const { colors } = useTheme();
  const router     = useRouter();

  const [query,  setQuery]  = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  // ── Single-open accordion toggle ─────────────────────────────
  function handleToggle(id: string) {
    setOpenId(prev => (prev === id ? null : id));
  }

  // ── Real-time FAQ filter ──────────────────────────────────────
  // When query is non-empty: flatten all categories to one virtual
  // "Results" category whose items match question OR answer text.
  const displayCategories: FaqCategory[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_CATEGORIES;

    const matched = FAQ_CATEGORIES.flatMap(cat =>
      cat.items.filter(
        item =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q),
      ),
    );

    if (!matched.length) return [];

    return [{
      key:   "_search",
      title: `Results for "${query.trim()}"`,
      icon:  "search-outline",
      items: matched,
    }];
  }, [query]);

  // ── "Still need help?" footer email CTA ──────────────────────
  async function handleEmailCta() {
    const url = "mailto:support@apanastore.in?subject=Help%20Request";
    const ok  = await Linking.canOpenURL(url);
    if (ok) Linking.openURL(url);
    else    Alert.alert("Unavailable", "No email app found on this device.");
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>

      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, {
          color:      colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.lg,
        }]}>
          Help & Support
        </Text>

        {/* Spacer keeps title centred */}
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >

        {/* ── Search bar ── */}
        <HelpSearchBar
          value={query}
          onChange={text => { setQuery(text); setOpenId(null); }}
          onClear={() => { setQuery(""); setOpenId(null); }}
        />

        {/* ── Quick contact tiles ── */}
        {!query && (
          <>
            <Text style={[styles.sectionLabel, {
              color:      colors.subText,
              fontFamily: typography.fontFamily.semiBold,
              fontSize:   typography.size.xs,
            }]}>
              CONTACT US
            </Text>
            <QuickContactCard actions={QUICK_ACTIONS} />
          </>
        )}

        {/* ── FAQ section label ── */}
        <Text style={[styles.sectionLabel, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.semiBold,
          fontSize:   typography.size.xs,
          marginTop:  query ? 0 : undefined,
        }]}>
          {query ? "FAQ RESULTS" : "FREQUENTLY ASKED QUESTIONS"}
        </Text>

        {/* ── FAQ categories / search results ── */}
        {displayCategories.length > 0
          ? displayCategories.map(cat => (
              <FaqSection
                key={cat.key}
                category={cat}
                openId={openId}
                onToggle={handleToggle}
              />
            ))
          : (
            // ── Empty state when search yields no results ──
            <View style={[styles.emptyWrap, {
              backgroundColor: colors.card,
              borderColor:     colors.border,
            }]}>
              <Ionicons name="search-outline" size={32} color={colors.subText} />
              <Text style={[styles.emptyTitle, {
                color:      colors.text,
                fontFamily: typography.fontFamily.semiBold,
                fontSize:   typography.size.sm,
              }]}>
                No results found
              </Text>
              <Text style={[styles.emptySub, {
                color:      colors.subText,
                fontFamily: typography.fontFamily.regular,
                fontSize:   typography.size.xs,
              }]}>
                Try a different keyword or contact us directly.
              </Text>
            </View>
          )
        }

        {/* ── "Still need help?" footer CTA ── */}
        <TouchableOpacity
          style={[styles.ctaCard, {
            backgroundColor: colors.primary + "12",
            borderColor:     colors.primary + "30",
          }]}
          activeOpacity={0.8}
          onPress={handleEmailCta}
        >
          <View style={[styles.ctaIconWrap, { backgroundColor: colors.primary + "20" }]}>
            <Ionicons name="headset-outline" size={24} color={colors.primary} />
          </View>

          <View style={styles.ctaText}>
            <Text style={[styles.ctaTitle, {
              color:      colors.text,
              fontFamily: typography.fontFamily.semiBold,
              fontSize:   typography.size.sm,
            }]}>
              Still need help?
            </Text>
            <Text style={[styles.ctaSub, {
              color:      colors.subText,
              fontFamily: typography.fontFamily.regular,
              fontSize:   typography.size.xs,
            }]}>
              Email us and we'll get back within 24 hours.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Header ──
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   14,
    borderBottomWidth: 1,
  },
  backBtn:     { width: 36 },
  headerTitle: { textAlign: "center" },

  // ── Scroll content ──
  content: {
    paddingHorizontal: 16,
    paddingTop:        20,
    paddingBottom:     40,
    gap:               16,
  },

  // ── Section labels (CONTACT US / FAQ) ──
  sectionLabel: {
    letterSpacing: 0.6,
    marginBottom:  -4,    // tighten gap above first card
  },

  // ── Empty search state ──
  emptyWrap: {
    alignItems:    "center",
    gap:           10,
    padding:       28,
    borderRadius:  14,
    borderWidth:   1,
  },
  emptyTitle: {},
  emptySub:   { textAlign: "center", lineHeight: 18 },

  // ── Footer CTA card ──
  ctaCard: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            12,
    padding:        16,
    borderRadius:   14,
    borderWidth:    1,
    marginTop:      4,
  },
  ctaIconWrap: {
    width:          46,
    height:         46,
    borderRadius:   13,
    alignItems:     "center",
    justifyContent: "center",
  },
  ctaText:  { flex: 1 },
  ctaTitle: {},
  ctaSub:   { lineHeight: 18, marginTop: 2 },
});

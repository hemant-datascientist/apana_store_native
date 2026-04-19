// ============================================================
// NET BANKING FORM — Apana Store
//
// Two-section layout:
//   1. Popular banks — 6 chips for quick selection
//   2. Search + scrollable full list of 18 banks
//
// Tapping any bank (chip or list row) selects it and enables
// the "Add Net Banking" button.
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { BANKS, Bank } from "../../data/addPaymentData";

interface NetBankingFormProps {
  onAdd: (label: string, detail: string) => Promise<void>;
}

export default function NetBankingForm({ onAdd }: NetBankingFormProps) {
  const { colors } = useTheme();

  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [query,        setQuery]        = useState("");
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState("");

  // ── Filter full list by search query ─────────────────────
  const filteredBanks = useMemo(() => {
    const q = query.toLowerCase().trim();
    return BANKS.filter(b =>
      b.name.toLowerCase().includes(q) || b.abbr.toLowerCase().includes(q)
    );
  }, [query]);

  const popularBanks = useMemo(() => BANKS.filter(b => b.popular), []);

  function handleSelectBank(bank: Bank) {
    setSelectedBank(bank);
    setError("");
  }

  async function handleAdd() {
    if (!selectedBank) {
      setError("Please select a bank to continue");
      return;
    }
    setSaving(true);
    try {
      await onAdd(selectedBank.name, `Net Banking — ${selectedBank.abbr}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>

      {/* ── Popular banks chips ── */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
        Popular Banks
      </Text>

      <View style={styles.popularGrid}>
        {popularBanks.map(bank => {
          const active = selectedBank?.id === bank.id;
          return (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.bankChip,
                {
                  backgroundColor: active ? bank.color + "18" : colors.background,
                  borderColor:     active ? bank.color        : colors.border,
                },
              ]}
              onPress={() => handleSelectBank(bank)}
              activeOpacity={0.8}
            >
              {/* Color swatch */}
              <View style={[styles.bankDot, { backgroundColor: bank.color }]}>
                <Text style={[styles.bankDotText, { fontFamily: typography.fontFamily.bold, fontSize: 8 }]}>
                  {bank.abbr.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <Text
                style={[styles.chipLabel, {
                  color:      active ? bank.color : colors.text,
                  fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                  fontSize:   typography.size.xs,
                }]}
                numberOfLines={1}
              >
                {bank.abbr}
              </Text>
              {active && (
                <Ionicons name="checkmark-circle" size={13} color={bank.color} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Search all banks ── */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
        All Banks
      </Text>

      <View style={[styles.searchWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
        <Ionicons name="search-outline" size={16} color={colors.subText} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
          placeholder="Search your bank…"
          placeholderTextColor={colors.subText}
          value={query}
          onChangeText={t => { setQuery(t); setError(""); }}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={16} color={colors.subText} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Bank list ── */}
      <View style={[styles.listWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
        {filteredBanks.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={28} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
              No banks match "{query}"
            </Text>
          </View>
        ) : (
          filteredBanks.map((bank, i) => {
            const active = selectedBank?.id === bank.id;
            const isLast = i === filteredBanks.length - 1;
            return (
              <TouchableOpacity
                key={bank.id}
                style={[
                  styles.listRow,
                  { borderBottomColor: colors.border },
                  isLast && styles.listRowLast,
                  active && { backgroundColor: bank.color + "0D" },
                ]}
                onPress={() => handleSelectBank(bank)}
                activeOpacity={0.75}
              >
                {/* Bank color indicator */}
                <View style={[styles.rowDot, { backgroundColor: bank.color }]}>
                  <Text style={[styles.rowDotText, { fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
                    {bank.abbr.slice(0, 2).toUpperCase()}
                  </Text>
                </View>

                <Text style={[styles.rowName, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, flex: 1 }]}>
                  {bank.name}
                </Text>

                {active
                  ? <Ionicons name="checkmark-circle" size={18} color={bank.color} />
                  : <Ionicons name="chevron-forward-outline" size={15} color={colors.border} />
                }
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* ── Error ── */}
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
          <Text style={[styles.errorText, { color: "#EF4444", fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {error}
          </Text>
        </View>
      )}

      {/* ── Selected bank confirmation strip ── */}
      {selectedBank && (
        <View style={[styles.selectedStrip, { backgroundColor: selectedBank.color + "12", borderColor: selectedBank.color + "30" }]}>
          <View style={[styles.stripDot, { backgroundColor: selectedBank.color }]}>
            <Text style={[styles.stripDotText, { fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
              {selectedBank.abbr.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stripName, { color: selectedBank.color, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              {selectedBank.name}
            </Text>
            <Text style={[styles.stripSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Selected for Net Banking
            </Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color={selectedBank.color} />
        </View>
      )}

      {/* ── Add button ── */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: selectedBank ? colors.primary : colors.border }]}
        onPress={handleAdd}
        disabled={!selectedBank || saving}
        activeOpacity={0.85}
      >
        {saving
          ? <ActivityIndicator size="small" color="#fff" />
          : <Ionicons name="globe-outline" size={18} color="#fff" />
        }
        <Text style={[styles.addBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          {saving ? "Adding…" : "Add Net Banking"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  sectionLabel: {},

  // Popular chips
  popularGrid: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           8,
  },
  bankChip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 12,
    paddingVertical:   9,
    borderRadius:      12,
    borderWidth:       1.5,
    minWidth:          "30%",
    flex:              1,
  },
  bankDot: {
    width:          26,
    height:         18,
    borderRadius:   4,
    alignItems:     "center",
    justifyContent: "center",
  },
  bankDotText: { color: "#fff" },
  chipLabel:   { flex: 1 },

  // Search
  searchWrap: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    borderWidth:       1.5,
    borderRadius:      12,
    paddingHorizontal: 14,
    paddingVertical:   11,
  },
  searchInput: { flex: 1 },

  // List
  listWrap: {
    borderRadius: 12,
    borderWidth:  1,
    overflow:     "hidden",
    maxHeight:    260,
  },
  listRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    paddingHorizontal: 14,
    paddingVertical:   12,
    borderBottomWidth: 1,
  },
  listRowLast: { borderBottomWidth: 0 },
  rowDot: {
    width:          30,
    height:         20,
    borderRadius:   5,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  rowDotText: { color: "#fff" },
  rowName: {},

  emptyWrap: { padding: 28, alignItems: "center", gap: 10 },
  emptyText: {},

  // Error
  errorRow:  { flexDirection: "row", alignItems: "center", gap: 5 },
  errorText: {},

  // Selected strip
  selectedStrip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    padding:           12,
    borderRadius:      12,
    borderWidth:       1,
  },
  stripDot: {
    width:          36,
    height:         24,
    borderRadius:   6,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  stripDotText: { color: "#fff" },
  stripName:    {},
  stripSub:     { marginTop: 1 },

  // Add button
  addBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             8,
    paddingVertical: 15,
    borderRadius:    14,
    marginTop:       4,
  },
  addBtnText: { color: "#fff" },
});

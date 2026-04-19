// ============================================================
// SHARED LIST DETAIL SCREEN — Apana Store
//
// Shows one shared shopping list in full. The active shopper
// (assignee) checks off items as they shop. The creator sees
// the same view with real-time progress.
//
// Params: id — SharedList.id from the overview screen
//
// QR image sharing:
//   QRGenerator (hidden, in this parent View) writes the QR PNG
//   to cache on mount and calls onReady(filePath).
//   filePath is passed to SharedListQrModal, which renders
//   QRShareButton — sharing is fully handled in that button.
//
// Text sharing:
//   "Share Items as Text" button lives on THIS screen (not inside
//   the modal) because Share.share() can fail inside a Modal on
//   Android (different native window).
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";

import { MOCK_SHARED_LISTS, ShoppingItem } from "../../data/sharedListData";

import SharedListAssigneeCard from "../../components/shared-list/SharedListAssigneeCard";
import SharedListItemRow      from "../../components/shared-list/SharedListItemRow";
import SharedListAddItem      from "../../components/shared-list/SharedListAddItem";
import SharedListQrModal      from "../../components/shared-list/SharedListQrModal";
import QRGenerator            from "../../components/qr/QRGenerator";

export default function SharedListDetailScreen() {
  const { colors } = useTheme();
  const router     = useRouter();
  const { id }     = useLocalSearchParams<{ id?: string }>();

  const baseList = MOCK_SHARED_LISTS.find(l => l.id === id) ?? MOCK_SHARED_LISTS[0];

  const [items,      setItems]      = useState<ShoppingItem[]>(baseList.items);
  const [qrVisible,  setQrVisible]  = useState(false);
  // ── filePath is null until QRGenerator finishes writing the PNG ──
  const [qrFilePath, setQrFilePath] = useState<string | null>(null);

  const checkedCount = useMemo(() => items.filter(i => i.checked).length, [items]);
  const totalCount   = items.length;
  const progress     = totalCount > 0 ? checkedCount / totalCount : 0;
  const isCompleted  = totalCount > 0 && checkedCount === totalCount;

  // ── QR payload ────────────────────────────────────────────
  const qrValue = JSON.stringify({
    type:      "apana_shared_list",
    listId:    baseList.id,
    listName:  baseList.name,
    invitedBy: "Apana Store User",
  });

  function toggleItem(itemId: string) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i));
  }

  function handleAddItem(name: string, qty: string) {
    setItems(prev => [...prev, {
      id: `item_${Date.now()}`, name, qty, checked: false, addedBy: "You",
    }]);
  }

  // ── Share item list as plain text ─────────────────────────
  // Kept on the main screen (NOT inside the modal) because
  // Share.share() fails inside a Modal on Android.
  async function handleShareText() {
    const lines = items
      .map(i => `${i.checked ? "✅" : "⬜"} ${i.name} (${i.qty})`)
      .join("\n");
    await Share.share({
      title:   `${baseList.name} — Apana Store`,
      message: `Shopping list: ${baseList.name}\n\n${lines}\n\nShared via Apana Store`,
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── QRGenerator — hidden PNG builder ─────────────────
           Must be a direct child of the root View (same native
           window as the rest of the screen), NOT inside a Modal.
           QRGenerator positions itself at zIndex:-1 behind header. */}
      <QRGenerator
        value={qrValue}
        cacheKey={`shared-list-${baseList.id}`}
        label={baseList.name}
        sublabel={`Apana Store · Shared Shopping List`}
        onReady={(path) => setQrFilePath(path)}
        onError={(msg)  => console.warn("[SharedListDetail] QR gen error:", msg)}
      />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.primary }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]} numberOfLines={1}>
              {baseList.name}
            </Text>
            <Text style={[styles.headerSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {checkedCount}/{totalCount} done{isCompleted ? " · All done! 🎉" : ""}
            </Text>
          </View>

          {/* Text share button — always visible in header */}
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={handleShareText}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={18} color="#fff" />
          </TouchableOpacity>

          {/* QR button — opens QR modal (image sharing only) */}
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={() => setQrVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="qr-code-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <SharedListAssigneeCard
          contact={baseList.contact}
          createdByMe={baseList.createdByMe}
          status={isCompleted ? "completed" : baseList.status}
          locationHint={baseList.locationHint}
        />

        {/* ── Progress card ── */}
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressTopRow}>
            <Text style={[styles.progressLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {isCompleted ? "Shopping complete! 🎉" : "Progress"}
            </Text>
            <Text style={[styles.progressCount, { color: isCompleted ? "#22C55E" : colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {checkedCount}/{totalCount}
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, {
              backgroundColor: isCompleted ? "#22C55E" : colors.primary,
              width: `${Math.round(progress * 100)}%` as any,
            }]} />
          </View>
          <Text style={[styles.progressSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {totalCount - checkedCount} item{totalCount - checkedCount !== 1 ? "s" : ""} remaining
          </Text>
        </View>

        {/* ── Items list ── */}
        <View style={[styles.itemsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.itemsHeader}>
            <Ionicons name="list-outline" size={15} color={colors.primary} />
            <Text style={[styles.itemsTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Items
            </Text>
            <Text style={[styles.itemsCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {totalCount} total
            </Text>
          </View>
          <View style={[styles.itemsDivider, { backgroundColor: colors.border }]} />

          {items.length === 0 ? (
            <View style={styles.emptyItems}>
              <Text style={[styles.emptyItemsText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
                No items yet — add some below
              </Text>
            </View>
          ) : (
            items.map((item, idx) => (
              <SharedListItemRow
                key={item.id}
                item={item}
                onToggle={() => toggleItem(item.id)}
                isLast={idx === items.length - 1}
              />
            ))
          )}
        </View>

        {/* ── Share items as text — lives here (not in modal) so
             Share.share() is called from the main window, not a
             Modal, which fixes the Android share-sheet failure.   */}
        <TouchableOpacity
          style={[styles.shareTextBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleShareText}
          activeOpacity={0.8}
        >
          <View style={[styles.shareTextIcon, { backgroundColor: colors.primary + "15" }]}>
            <Ionicons name="share-social-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.shareTextBody}>
            <Text style={[styles.shareTextTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Share Items as Text
            </Text>
            <Text style={[styles.shareTextSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Send the shopping list via WhatsApp, SMS, or any app
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.subText} />
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>

      <SafeAreaView style={{ backgroundColor: colors.card }} edges={["bottom"]}>
        <SharedListAddItem onAdd={handleAddItem} />
      </SafeAreaView>

      {/* ── QR modal — QR image + text share buttons ── */}
      <SharedListQrModal
        visible={qrVisible}
        list={baseList}
        onClose={() => setQrVisible(false)}
        qrFilePath={qrFilePath}
        onShareText={handleShareText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

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
  headerCenter: { flex: 1 },
  headerTitle:  { color: "#fff" },
  headerSub:    { color: "rgba(255,255,255,0.75)", marginTop: 2 },
  headerBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },

  scroll: { padding: 16, gap: 14 },

  progressCard:   { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  progressTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progressLabel:  {},
  progressCount:  {},
  progressTrack:  { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill:   { height: 8, borderRadius: 4 },
  progressSub:    {},

  itemsCard:    { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  itemsHeader:  { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 14, paddingVertical: 12 },
  itemsTitle:   {},
  itemsCount:   { marginLeft: 2 },
  itemsDivider: { height: 1 },

  emptyItems:     { paddingVertical: 24, alignItems: "center" },
  emptyItemsText: {},

  // Share text button card
  shareTextBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    padding:           14,
    borderRadius:      14,
    borderWidth:       1,
  },
  shareTextIcon: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  shareTextBody:  { flex: 1 },
  shareTextTitle: {},
  shareTextSub:   { marginTop: 2 },
});

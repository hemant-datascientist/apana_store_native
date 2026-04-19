// ============================================================
// SHARED LIST DETAIL SCREEN — Apana Store
//
// Shows one shared shopping list in full. The active shopper
// (assignee) checks off items as they shop. The creator sees
// the same view with real-time progress.
//
// Params: id — SharedList.id from the overview screen
//
// QR sharing architecture:
//   A hidden ViewShot+QRCode is rendered OFF-SCREEN in this parent
//   view (not inside the Modal). captureRef / ViewShot.capture()
//   cannot cross the Modal window boundary on Android, so the capture
//   must happen here. handleShareQrImage is passed down to the modal.
// ============================================================

import React, { useState, useMemo, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Share, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import ViewShot         from "react-native-view-shot";
import QRCode           from "react-native-qrcode-svg";
import * as Sharing     from "expo-sharing";
import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";

import {
  MOCK_SHARED_LISTS, ShoppingItem,
} from "../../data/sharedListData";

import SharedListAssigneeCard from "../../components/shared-list/SharedListAssigneeCard";
import SharedListItemRow      from "../../components/shared-list/SharedListItemRow";
import SharedListAddItem      from "../../components/shared-list/SharedListAddItem";
import SharedListQrModal      from "../../components/shared-list/SharedListQrModal";

const QR_HIDDEN_SIZE = 260;

export default function SharedListDetailScreen() {
  const { colors } = useTheme();
  const router     = useRouter();
  const { id }     = useLocalSearchParams<{ id?: string }>();

  // ── Find the list — fallback to first list ────────────────
  const baseList = MOCK_SHARED_LISTS.find(l => l.id === id) ?? MOCK_SHARED_LISTS[0];

  // ── Local mutable items state ─────────────────────────────
  const [items,     setItems]     = useState<ShoppingItem[]>(baseList.items);
  const [qrVisible, setQrVisible] = useState(false);

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

  // ── Hidden ViewShot ref — outside the Modal ───────────────
  // ViewShot.capture() fails inside a Modal on Android because
  // Modals render in a separate native window. The QR card is
  // rendered off-screen here so capture() works on both platforms.
  const qrShotRef = useRef<any>(null);

  // ── Capture the hidden QR card and open the share sheet ───
  async function handleShareQrImage() {
    try {
      const uri = await qrShotRef.current.capture();
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Not supported", "Sharing is not available on this device.");
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType:    "image/png",
        dialogTitle: `Share QR for "${baseList.name}"`,
      });
    } catch {
      Alert.alert("Error", "Could not share QR code. Please try again.");
    }
  }

  // ── Toggle item checked state ─────────────────────────────
  function toggleItem(itemId: string) {
    setItems(prev =>
      prev.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i),
    );
  }

  // ── Add a new item ────────────────────────────────────────
  function handleAddItem(name: string, qty: string) {
    const newItem: ShoppingItem = {
      id:      `item_${Date.now()}`,
      name,
      qty,
      checked: false,
      addedBy: "You",
    };
    setItems(prev => [...prev, newItem]);
  }

  // ── Share list as text ────────────────────────────────────
  async function handleShare() {
    await Share.share({
      title:   `${baseList.name} — Apana Store`,
      message: `Shopping list shared via Apana Store:\n\n${items.map(i => `${i.checked ? "✅" : "⬜"} ${i.name} (${i.qty})`).join("\n")}`,
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Hidden QR card for capture — rendered off-screen ──
           position:absolute + left:-9999 keeps it off-screen but
           still mounted so ViewShot can capture it correctly.     */}
      <ViewShot
        ref={qrShotRef}
        options={{ format: "png", quality: 1, result: "tmpfile" }}
        style={styles.hiddenShot}
      >
        <View style={styles.hiddenQrCard} collapsable={false}>
          <QRCode
            value={qrValue}
            size={QR_HIDDEN_SIZE}
            color="#111827"
            backgroundColor="#FFFFFF"
          />
          <Text style={styles.hiddenQrLabel}>{baseList.name}</Text>
          <Text style={styles.hiddenQrSub}>Apana Store · Shared List</Text>
        </View>
      </ViewShot>

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
              {checkedCount}/{totalCount} done
              {isCompleted ? " · All done! 🎉" : ""}
            </Text>
          </View>

          {/* QR code button */}
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={() => setQrVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="qr-code-outline" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Text share button */}
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Assignee info card ── */}
        <SharedListAssigneeCard
          contact={baseList.contact}
          createdByMe={baseList.createdByMe}
          status={isCompleted ? "completed" : baseList.status}
          locationHint={baseList.locationHint}
        />

        {/* ── Progress card ── */}
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressTopRow}>
            <Text style={[styles.progressLabel, {
              color:      colors.text,
              fontFamily: typography.fontFamily.bold,
              fontSize:   typography.size.sm,
            }]}>
              {isCompleted ? "Shopping complete! 🎉" : "Progress"}
            </Text>
            <Text style={[styles.progressCount, {
              color:      isCompleted ? "#22C55E" : colors.primary,
              fontFamily: typography.fontFamily.bold,
              fontSize:   typography.size.sm,
            }]}>
              {checkedCount}/{totalCount}
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, {
              backgroundColor: isCompleted ? "#22C55E" : colors.primary,
              width: `${Math.round(progress * 100)}%` as any,
            }]} />
          </View>
          <Text style={[styles.progressSub, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]}>
            {totalCount - checkedCount} item{totalCount - checkedCount !== 1 ? "s" : ""} remaining
          </Text>
        </View>

        {/* ── Items list ── */}
        <View style={[styles.itemsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.itemsHeader}>
            <Ionicons name="list-outline" size={15} color={colors.primary} />
            <Text style={[styles.itemsTitle, {
              color:      colors.text,
              fontFamily: typography.fontFamily.bold,
              fontSize:   typography.size.sm,
            }]}>
              Items
            </Text>
            <Text style={[styles.itemsCount, {
              color:      colors.subText,
              fontFamily: typography.fontFamily.regular,
              fontSize:   typography.size.xs,
            }]}>
              {totalCount} total
            </Text>
          </View>
          <View style={[styles.itemsDivider, { backgroundColor: colors.border }]} />

          {items.length === 0 ? (
            <View style={styles.emptyItems}>
              <Text style={[styles.emptyItemsText, {
                color:      colors.subText,
                fontFamily: typography.fontFamily.regular,
                fontSize:   typography.size.sm,
              }]}>
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

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── Sticky add item bar ── */}
      <SafeAreaView style={{ backgroundColor: colors.card }} edges={["bottom"]}>
        <SharedListAddItem onAdd={handleAddItem} />
      </SafeAreaView>

      {/* ── QR share modal ── */}
      <SharedListQrModal
        visible={qrVisible}
        list={baseList}
        onShareQr={handleShareQrImage}
        onClose={() => setQrVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Hidden QR card ──────────────────────────────────────────
  // Rendered off-screen so ViewShot can capture it without the
  // Modal window-boundary limitation on Android.
  hiddenShot: {
    position: "absolute",
    left:     -9999,
    top:      100,
  },
  hiddenQrCard: {
    backgroundColor: "#FFFFFF",
    padding:         24,
    alignItems:      "center",
    gap:             10,
  },
  hiddenQrLabel: {
    color:      "#111827",
    fontSize:   16,
    fontFamily: "Poppins_700Bold",
  },
  hiddenQrSub: {
    color:      "#6B7280",
    fontSize:   12,
    fontFamily: "Poppins_400Regular",
  },

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

  progressCard: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          8,
  },
  progressTopRow: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
  },
  progressLabel: {},
  progressCount: {},
  progressTrack: {
    height:       8,
    borderRadius: 4,
    overflow:     "hidden",
  },
  progressFill: {
    height:       8,
    borderRadius: 4,
  },
  progressSub: {},

  itemsCard: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },
  itemsHeader: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 14,
    paddingVertical:   12,
  },
  itemsTitle: {},
  itemsCount: { marginLeft: 2 },
  itemsDivider: { height: 1 },

  emptyItems:     { paddingVertical: 24, alignItems: "center" },
  emptyItemsText: {},
});

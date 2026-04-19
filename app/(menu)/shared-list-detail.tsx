// ============================================================
// SHARED LIST DETAIL SCREEN — Apana Store
//
// QR share flow:
//   On mount → wait 600ms for SVG to render → toDataURL() → write
//   PNG to FileSystem.cacheDirectory → setQrReady(true).
//   Share button shares the already-written PNG instantly.
//   On unmount → delete the cached PNG file.
// ============================================================

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Share, Alert,
} from "react-native";
import { SafeAreaView }   from "react-native-safe-area-context";
import { Ionicons }       from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import QRCode             from "react-native-qrcode-svg";
import * as FileSystem    from "expo-file-system/legacy";
import * as Sharing       from "expo-sharing";
import useTheme           from "../../theme/useTheme";
import { typography }     from "../../theme/typography";

import { MOCK_SHARED_LISTS, ShoppingItem } from "../../data/sharedListData";

import SharedListAssigneeCard from "../../components/shared-list/SharedListAssigneeCard";
import SharedListItemRow      from "../../components/shared-list/SharedListItemRow";
import SharedListAddItem      from "../../components/shared-list/SharedListAddItem";
import SharedListQrModal      from "../../components/shared-list/SharedListQrModal";

export default function SharedListDetailScreen() {
  const { colors } = useTheme();
  const router     = useRouter();
  const { id }     = useLocalSearchParams<{ id?: string }>();

  const baseList = MOCK_SHARED_LISTS.find(l => l.id === id) ?? MOCK_SHARED_LISTS[0];

  const [items,     setItems]     = useState<ShoppingItem[]>(baseList.items);
  const [qrVisible, setQrVisible] = useState(false);
  const [sharing,   setSharing]   = useState(false);
  const [qrReady,   setQrReady]   = useState(false);

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

  // ── Refs ──────────────────────────────────────────────────
  // svgRef — underlying react-native-svg Svg element (via getRef)
  // cachedPngPath — persists the file path across renders for cleanup
  const svgRef        = useRef<any>(null);
  const cachedPngPath = useRef<string | null>(null);

  // ── Generate QR PNG on mount, cache it, delete on unmount ─
  // Generating on mount (not on button press) means the file is
  // ready the moment the user opens the modal. No race conditions.
  useEffect(() => {
    let cancelled = false;

    async function generateQrPng() {
      // Give the hidden SVG time to fully rasterize before toDataURL
      await new Promise(r => setTimeout(r, 700));
      if (cancelled || !svgRef.current) return;

      svgRef.current.toDataURL(async (data: string) => {
        if (cancelled || !data || data.length < 100) return;
        try {
          const base64   = data.includes(",") ? data.split(",")[1] : data;
          const filePath = `${FileSystem.cacheDirectory}apana-qr-${baseList.id}.png`;

          await FileSystem.writeAsStringAsync(filePath, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          cachedPngPath.current = filePath;
          if (!cancelled) setQrReady(true);
        } catch (e) {
          console.warn("[QR] PNG write failed:", e);
        }
      });
    }

    generateQrPng();

    // Cleanup: delete the cached PNG when navigating away
    return () => {
      cancelled = true;
      if (cachedPngPath.current) {
        FileSystem.deleteAsync(cachedPngPath.current, { idempotent: true })
          .catch(() => {});
      }
    };
  }, []);

  // ── Share the pre-generated PNG from cache ─────────────────
  async function handleShareQrImage() {
    if (!qrReady || !cachedPngPath.current) {
      Alert.alert("Not ready", "QR image is still being prepared. Please try again in a moment.");
      return;
    }
    setSharing(true);
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Not supported", "Sharing is not available on this device.");
        return;
      }
      await Sharing.shareAsync(cachedPngPath.current, {
        mimeType:    "image/png",
        dialogTitle: `Share QR for "${baseList.name}"`,
        UTI:         "public.png",
      });
    } catch (err: any) {
      Alert.alert("Share failed", err?.message ?? "Could not share QR code.");
    } finally {
      setSharing(false);
    }
  }

  function toggleItem(itemId: string) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i));
  }

  function handleAddItem(name: string, qty: string) {
    setItems(prev => [...prev, {
      id: `item_${Date.now()}`, name, qty, checked: false, addedBy: "You",
    }]);
  }

  async function handleShare() {
    await Share.share({
      title:   `${baseList.name} — Apana Store`,
      message: `Shopping list shared via Apana Store:\n\n${items.map(i => `${i.checked ? "✅" : "⬜"} ${i.name} (${i.qty})`).join("\n")}`,
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Hidden QR — off-screen, used only for toDataURL capture ──
           Must be in the PARENT screen (not Modal). Pushed off-screen
           with negative left — opacity:0 causes Android to skip SVG
           rasterization, which silently breaks toDataURL.              */}
      <View style={styles.hiddenQr} pointerEvents="none">
        <QRCode
          value={qrValue}
          size={280}
          color="#111827"
          backgroundColor="#FFFFFF"
          getRef={(ref) => { svgRef.current = ref; }}
        />
      </View>

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
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={() => setQrVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="qr-code-outline" size={18} color="#fff" />
          </TouchableOpacity>
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

        <View style={{ height: 90 }} />
      </ScrollView>

      <SafeAreaView style={{ backgroundColor: colors.card }} edges={["bottom"]}>
        <SharedListAddItem onAdd={handleAddItem} />
      </SafeAreaView>

      <SharedListQrModal
        visible={qrVisible}
        list={baseList}
        sharing={sharing}
        qrReady={qrReady}
        onShareQr={handleShareQrImage}
        onClose={() => setQrVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Off-screen, not opacity:0 — Android skips SVG rasterization on opacity:0
  hiddenQr: {
    position: "absolute",
    left:     -9999,
    top:      200,
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

  progressCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  progressTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progressLabel: {},
  progressCount: {},
  progressTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill:  { height: 8, borderRadius: 4 },
  progressSub:   {},

  itemsCard:   { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  itemsHeader: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 14, paddingVertical: 12 },
  itemsTitle:  {},
  itemsCount:  { marginLeft: 2 },
  itemsDivider:{ height: 1 },

  emptyItems:     { paddingVertical: 24, alignItems: "center" },
  emptyItemsText: {},
});

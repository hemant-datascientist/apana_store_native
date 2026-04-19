// ============================================================
// SHARED LIST SCREEN — Apana Store
//
// Collaborative Tasking: overview of all shared shopping lists.
//
// Two tabs:
//   My Lists    — lists I created and sent to others
//   Assigned Me — lists others sent me to shop for
//
// FAB (+) at bottom-right opens CreateListModal.
// Tapping a card → shared-list-detail?id=...
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

import {
  MOCK_SHARED_LISTS, SharedList, Contact,
} from "../../data/sharedListData";

import SharedListCard  from "../../components/shared-list/SharedListCard";
import CreateListModal from "../../components/shared-list/CreateListModal";

type Tab = "mine" | "assigned";

export default function SharedListScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── Tab + list state ──────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState<Tab>("mine");
  const [lists,        setLists]        = useState<SharedList[]>(MOCK_SHARED_LISTS);
  const [createVisible, setCreateVisible] = useState(false);

  const myLists       = useMemo(() => lists.filter(l => l.createdByMe),  [lists]);
  const assignedLists = useMemo(() => lists.filter(l => !l.createdByMe), [lists]);
  const displayLists  = activeTab === "mine" ? myLists : assignedLists;

  // ── Create new list ───────────────────────────────────────
  // Backend: POST /lists { name, assigneeId, items: [] }
  function handleCreate(name: string, contact: Contact) {
    const newList: SharedList = {
      id:          `sl${Date.now()}`,
      name,
      createdByMe: true,
      contact,
      items:       [],
      createdAt:   "Just now",
      status:      "active",
    };
    setLists(prev => [newList, ...prev]);
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
              Shared Lists
            </Text>
            <Text style={[styles.headerSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Collaborative shopping
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={() => setCreateVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Tabs ── */}
        <View style={styles.tabs}>
          {([
            { key: "mine",     label: "My Lists",     count: myLists.length       },
            { key: "assigned", label: "Assigned to Me",count: assignedLists.length },
          ] as { key: Tab; label: string; count: number }[]).map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, {
                fontFamily: activeTab === tab.key ? typography.fontFamily.bold : typography.fontFamily.medium,
                fontSize:   typography.size.xs,
                color:      activeTab === tab.key ? "#fff" : "rgba(255,255,255,0.65)",
              }]}>
                {tab.label}
              </Text>
              <View style={[styles.tabCount, {
                backgroundColor: activeTab === tab.key ? "#fff" : "rgba(255,255,255,0.25)",
              }]}>
                <Text style={[styles.tabCountText, {
                  color:      activeTab === tab.key ? colors.primary : "#fff",
                  fontFamily: typography.fontFamily.bold,
                  fontSize:   typography.size.ss,
                }]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      {/* ── List ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {displayLists.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="list-outline" size={48} color={colors.subText} />
            <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
              {activeTab === "mine" ? "No lists created yet" : "No tasks assigned"}
            </Text>
            <Text style={[styles.emptySub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
              {activeTab === "mine"
                ? "Tap + to create a shared shopping list"
                : "When someone shares a list with you, it appears here"}
            </Text>
            {activeTab === "mine" && (
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
                onPress={() => setCreateVisible(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                <Text style={[styles.emptyBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                  Create First List
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          displayLists.map(list => (
            <SharedListCard
              key={list.id}
              list={list}
              onPress={() => router.push(`/shared-list-detail?id=${list.id}`)}
            />
          ))
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── Floating Action Button ── */}
      {displayLists.length > 0 && (
        <SafeAreaView style={styles.fabWrap} edges={["bottom"]} pointerEvents="box-none">
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary }]}
            onPress={() => setCreateVisible(true)}
            activeOpacity={0.88}
          >
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {/* ── Create modal ── */}
      <CreateListModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreate={handleCreate}
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
  createBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },

  // Tabs
  tabs: {
    flexDirection:     "row",
    paddingHorizontal: 16,
    paddingBottom:     12,
    gap:               8,
  },
  tab: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 14,
    paddingVertical:   8,
    borderRadius:      20,
  },
  tabActive:     { backgroundColor: "rgba(255,255,255,0.18)" },
  tabText:       {},
  tabCount: {
    paddingHorizontal: 6,
    paddingVertical:   1,
    borderRadius:      10,
    minWidth:          20,
    alignItems:        "center",
  },
  tabCountText: {},

  // Scroll
  scroll: {
    padding: 16,
    gap:     12,
  },

  // Empty state
  emptyState: {
    alignItems:      "center",
    gap:             12,
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: { textAlign: "center" },
  emptySub:   { textAlign: "center", lineHeight: 22 },
  emptyBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 20,
    paddingVertical:   12,
    borderRadius:      12,
    marginTop:         4,
  },
  emptyBtnText: { color: "#fff" },

  // FAB
  fabWrap: {
    position: "absolute",
    bottom:   0,
    right:    0,
    left:     0,
    alignItems: "flex-end",
    paddingRight: 20,
    paddingBottom: 16,
    pointerEvents: "box-none",
  },
  fab: {
    width:          56,
    height:         56,
    borderRadius:   28,
    alignItems:     "center",
    justifyContent: "center",
    shadowColor:    "#000",
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.2,
    shadowRadius:   8,
    elevation:      6,
  },
});

// ============================================================
// ORDER CHAT — the customer and the shop, about one order.
//
// The seller half shipped first: a shopkeeper could ask "500 g instead of
// 1 kg?" and there was no screen on this side to answer on. The message
// existed, reached the customer's notification inbox, and led nowhere.
//
// 🔴 SCOPED TO AN ORDER, which is why this screen needs an order id. A
// person-scoped thread has no subject — the same defect the seller's orders
// screen had, where its call button dialled whichever order was first in the
// list.
//
// ⚠ NO PUSH EXISTS IN THIS SYSTEM. A message cannot ring the shop's phone; it
// lands in the inbox their app polls. This screen polls too, so an open
// conversation feels close to live — but there is no presence, no typing
// indicator and no delivery tick beyond "they opened it", because each of
// those is a promise about delivery this stack cannot keep.
//
// Deliberately kept parallel to the seller's app/order-chat.tsx, the same way
// lib/sound.ts and lib/session.ts are: two screens of one conversation that
// drift apart are two different products.
// ============================================================

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import useTheme from "../theme/useTheme";
import { typography } from "../theme/typography";
import { useAuth } from "../context/AuthContext";
import {
  CHAT_IS_LIVE,
  fetchThread,
  sendMessage,
  type ChatMessage,
} from "../services/chatService";

// Matches the seller screen. Faster would drain a phone for a conversation
// that is usually two messages long.
const POLL_MS = 10_000;

export default function OrderChatScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const customerId = user?.phone ?? "";
  const { orderId, invoice, store } = useLocalSearchParams<{
    orderId?: string;
    invoice?: string;
    store?: string;
  }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const load = useCallback(async () => {
    if (!orderId || !customerId || !CHAT_IS_LIVE) {
      setLoading(false);
      return;
    }
    try {
      const t = await fetchThread(orderId, customerId);
      setMessages(t.messages);
      setError(null);
    } catch {
      // ⚠ An empty thread and an unreachable server are different facts, and
      // this screen must never show the first when it means the second.
      setError("Could not load this conversation.");
    } finally {
      setLoading(false);
    }
  }, [orderId, customerId]);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const send = async () => {
    const body = draft.trim();
    if (!body || !orderId || !customerId || sending) return;
    setSending(true);
    // Cleared immediately — nobody should retype a message because the network
    // was slow. Restored below if it did not land.
    setDraft("");
    try {
      const m = await sendMessage(orderId, customerId, body);
      setMessages((prev) => [...prev, m]);
      setError(null);
    } catch {
      // 🔴 The draft comes BACK. A message that vanished and was never sent is
      // the worst outcome here: the customer believes the shop was told, and
      // waits for an answer to a question nobody saw.
      setDraft(body);
      setError("Not sent. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  // ⚠ router.back() does nothing when there is no history — expo-router only
  // logs it. This screen is reachable from a notification tap, which can make
  // it the first route in the stack.
  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace("/(orders)/order-history");

  const blocked = !orderId
    ? "No order to open a conversation about."
    : !customerId
      ? "Sign in to message the shop about this order."
      : !CHAT_IS_LIVE
        ? "Messaging needs a live connection to Apana."
        : null;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={goBack} style={styles.back} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.size.md,
              color: colors.text,
            }}
            numberOfLines={1}
          >
            {store || "Shop"}
          </Text>
          {/* The order is the subject — shown, so a customer with two live
              orders knows which shop they are talking to. */}
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.size.xs,
              color: colors.subText,
            }}
          >
            {invoice ? `Order ${invoice}` : "Order chat"}
          </Text>
        </View>
      </View>

      {blocked ? (
        <View style={styles.center}>
          <Ionicons name="chatbubbles-outline" size={40} color={colors.subText} />
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.size.sm,
              color: colors.subText,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            {blocked}
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(m) => m.id}
              contentContainerStyle={styles.list}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
              ListEmptyComponent={
                <View style={styles.center}>
                  <Ionicons name="chatbubbles-outline" size={40} color={colors.subText} />
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.regular,
                      fontSize: typography.size.sm,
                      color: colors.subText,
                      marginTop: 10,
                      textAlign: "center",
                    }}
                  >
                    No messages yet. Ask about a substitution, a delivery note,
                    or anything the shop should know.
                  </Text>
                </View>
              }
              renderItem={({ item }) => <Bubble message={item} />}
            />
          )}

          {error ? (
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: typography.size.xs,
                color: colors.danger,
                paddingHorizontal: 16,
                paddingBottom: 4,
              }}
            >
              {error}
            </Text>
          ) : null}

          <View
            style={[
              styles.composer,
              { borderTopColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Message the shop"
              placeholderTextColor={colors.subText}
              multiline
              maxLength={2000}
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  fontFamily: typography.fontFamily.regular,
                  fontSize: typography.size.sm,
                },
              ]}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                { backgroundColor: colors.primary, opacity: draft.trim() && !sending ? 1 : 0.5 },
              ]}
              onPress={send}
              disabled={!draft.trim() || sending}
              accessibilityLabel="Send"
            >
              {sending ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Ionicons name="send" size={18} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const { colors } = useTheme();
  const mine = message.mine;
  const at = new Date(message.created_at);
  const time = `${String(at.getHours()).padStart(2, "0")}:${String(at.getMinutes()).padStart(2, "0")}`;

  return (
    <View style={[styles.row, { justifyContent: mine ? "flex-end" : "flex-start" }]}>
      <View
        style={[
          styles.bubble,
          mine
            ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
            : {
                backgroundColor: colors.card,
                borderBottomLeftRadius: 4,
                borderWidth: 1,
                borderColor: colors.border,
              },
        ]}
      >
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.size.sm,
            color: mine ? colors.white : colors.text,
          }}
        >
          {message.body}
        </Text>
        <View style={styles.meta}>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.size.ss,
              color: mine ? "rgba(255,255,255,0.75)" : colors.subText,
            }}
          >
            {time}
          </Text>
          {/* ⚠ Only on MY messages, and it means "the shop opened the thread" —
              not "delivered". There is no delivery receipt in this stack, and a
              tick implying one would be a promise nothing backs. */}
          {mine && message.read_at ? (
            <Ionicons name="checkmark-done" size={13} color="rgba(255,255,255,0.9)" />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingBottom: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  back: { padding: 4 },
  list: { padding: 14, flexGrow: 1 },
  row: { flexDirection: "row", marginBottom: 8 },
  bubble: { maxWidth: "78%", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  meta: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-end", marginTop: 2 },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    maxHeight: 110,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});

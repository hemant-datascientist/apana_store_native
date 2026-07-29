// ============================================================
// DetailReviews — real ratings & reviews for a product (§ buyer-gated).
//
// Shows the REAL aggregate (avg + count) and the review list — honest-empty
// ("No ratings yet") when nobody has reviewed, never a fabricated star (§19.8).
// A customer can rate 1–5★ + leave a comment; the BE accepts it only from a
// verified buyer (a delivered order containing the product), so the star count
// can't be gamed. Theme + typography tokens only.
// ============================================================

import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchProductReviews, submitProductReview, ProductReviews,
} from "../../../services/liveCatalogService";

interface Props {
  productId: string;
  initialRating: number;
  initialCount: number;
}

function Stars({ value, size = 13, color }: { value: number; size?: number; color: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons key={n} name={n <= Math.round(value) ? "star" : "star-outline"} size={size} color={color} />
      ))}
    </View>
  );
}

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const days = Math.floor((Date.now() - d) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export default function DetailReviews({ productId, initialRating, initialCount }: Props) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const customerId = user?.phone ?? user?.id ?? "";

  const [data, setData] = useState<ProductReviews>({ rating: initialRating, reviewCount: initialCount, items: [] });
  const [sheet, setSheet] = useState(false);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetchProductReviews(productId).then(setData).catch(() => {});
  };
  useEffect(load, [productId]);

  async function submit() {
    if (star < 1) { Alert.alert("Pick a rating", "Tap the stars to rate 1 to 5."); return; }
    if (!customerId) {
      Alert.alert("Sign in to review", "You can rate a product after a delivered order.");
      return;
    }
    setBusy(true);
    try {
      await submitProductReview(productId, { customerId, rating: star, comment: comment.trim(), authorName: user?.name ?? undefined });
      setSheet(false); setStar(0); setComment("");
      load();
    } catch (e: any) {
      Alert.alert("Couldn't post review", e?.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.head}>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>Ratings & Reviews</Text>
        <TouchableOpacity onPress={() => setSheet(true)} style={[styles.rateBtn, { borderColor: colors.primary }]}>
          <Ionicons name="star-outline" size={13} color={colors.primary} />
          <Text style={[styles.rateBtnTxt, { color: colors.primary, fontFamily: typography.fontFamily.semiBold }]}>Rate</Text>
        </TouchableOpacity>
      </View>

      {data.reviewCount > 0 ? (
        <View style={styles.agg}>
          <Text style={[styles.avg, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>{data.rating.toFixed(1)}</Text>
          <View>
            <Stars value={data.rating} size={15} color="#F59E0B" />
            <Text style={[styles.count, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
              {data.reviewCount} {data.reviewCount === 1 ? "review" : "reviews"}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={[styles.empty, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          No ratings yet — be the first to review after your order.
        </Text>
      )}

      {data.items.map((r) => (
        <View key={r.id} style={[styles.review, { borderTopColor: colors.border }]}>
          <View style={styles.reviewHead}>
            <Stars value={r.rating} color="#F59E0B" />
            <Text style={[styles.author, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]} numberOfLines={1}>
              {r.authorName ?? "Verified buyer"}
            </Text>
            <Text style={[styles.date, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>{timeAgo(r.createdAt)}</Text>
          </View>
          {r.comment ? (
            <Text style={[styles.comment, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>{r.comment}</Text>
          ) : null}
        </View>
      ))}

      {/* Rate sheet */}
      <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setSheet(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <Text style={[styles.sheetTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>Rate this product</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setStar(n)} hitSlop={6}>
                <Ionicons name={n <= star ? "star" : "star-outline"} size={34} color="#F59E0B" />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience (optional)"
            placeholderTextColor={colors.subText}
            multiline
            style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
          />
          <TouchableOpacity onPress={submit} disabled={busy} style={[styles.submit, { backgroundColor: colors.primary, opacity: busy ? 0.7 : 1 }]}>
            {busy ? <ActivityIndicator color="#fff" /> : (
              <Text style={[styles.submitTxt, { fontFamily: typography.fontFamily.bold }]}>Post Review</Text>
            )}
          </TouchableOpacity>
          <Text style={[styles.gateNote, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
            Only a delivered order lets you review — keeps ratings honest.
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginTop: 14, borderWidth: 1, borderRadius: 14, padding: 14 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: typography.size.sm },
  rateBtn: { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  rateBtnTxt: { fontSize: typography.size.xs },
  agg: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 },
  avg: { fontSize: typography.size.xxl },
  count: { fontSize: typography.size.xs, marginTop: 3 },
  empty: { fontSize: typography.size.sm, marginTop: 12, lineHeight: 19 },
  review: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, marginTop: 12, gap: 5 },
  reviewHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  author: { fontSize: typography.size.xs, flex: 1 },
  date: { fontSize: typography.size.ss },
  comment: { fontSize: typography.size.xs, lineHeight: 18 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32, gap: 14 },
  sheetTitle: { fontSize: typography.size.lg },
  starRow: { flexDirection: "row", justifyContent: "center", gap: 8 },
  input: { minHeight: 72, borderWidth: 1, borderRadius: 12, padding: 12, fontSize: typography.size.sm, textAlignVertical: "top" },
  submit: { height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  submitTxt: { color: "#fff", fontSize: typography.size.md },
  gateNote: { fontSize: typography.size.ss, textAlign: "center" },
});

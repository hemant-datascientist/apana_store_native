// ============================================================
// RATE STORE SHEET — Apana Store (Customer App)
//
// Bottom modal to rate a store after a delivered order: 5 tappable stars +
// an optional comment. Submit is disabled until a star is picked. The parent
// owns the network call (services/reviewService) so this stays presentational.
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Modal, Pressable,
  ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

const STAR_COUNT = 5;
const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

interface RateStoreSheetProps {
  visible:    boolean;
  storeName:  string;
  submitting: boolean;
  onClose:    () => void;
  onSubmit:   (rating: number, comment: string) => void;
}

export default function RateStoreSheet({
  visible, storeName, submitting, onClose, onSubmit,
}: RateStoreSheetProps) {
  const { colors } = useTheme();
  const [rating,  setRating]  = useState(0);
  const [comment, setComment] = useState("");

  // Reset local state whenever the sheet is dismissed.
  function close() {
    setRating(0);
    setComment("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.dock}
      >
        <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.grip, { backgroundColor: colors.border }]} />

          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
            Rate {storeName}
          </Text>
          <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            How was your order? Only buyers can rate.
          </Text>

          {/* Stars */}
          <View style={styles.stars}>
            {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.7} hitSlop={6}>
                <Ionicons
                  name={n <= rating ? "star" : "star-outline"}
                  size={38}
                  color={n <= rating ? "#F59E0B" : colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={[styles.ratingLabel, { color: "#B45309", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              {STAR_LABELS[rating]}
            </Text>
          )}

          {/* Comment */}
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Add a comment (optional)…"
            placeholderTextColor={colors.subText}
            multiline
            maxLength={500}
            style={[styles.input, {
              color: colors.text, borderColor: colors.border,
              backgroundColor: colors.background, fontFamily: typography.fontFamily.regular,
            }]}
          />

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submit, { backgroundColor: rating > 0 ? colors.primary : colors.border }]}
            activeOpacity={0.85}
            disabled={rating === 0 || submitting}
            onPress={() => onSubmit(rating, comment.trim())}
          >
            {submitting
              ? <ActivityIndicator color={colors.white} />
              : <Text style={[styles.submitText, { color: colors.white, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
                  Submit Rating
                </Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.45)" },
  dock: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 1,
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28, gap: 10,
  },
  grip: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, marginBottom: 6 },
  title: {},
  sub: { marginTop: -4 },
  stars: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 8 },
  ratingLabel: { textAlign: "center", marginTop: -4 },
  input: {
    minHeight: 72, borderWidth: 1, borderRadius: 12, padding: 12,
    fontSize: typography.size.sm, textAlignVertical: "top", marginTop: 4,
  },
  submit: { borderRadius: 12, alignItems: "center", justifyContent: "center", paddingVertical: 14, marginTop: 4 },
  submitText: {},
});

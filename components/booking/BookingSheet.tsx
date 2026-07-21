// ============================================================
// BOOKING SHEET — pick a slot and request the booking.
//
// The request lands as `pending`; the shop confirms or rejects it (§16.11
// status machine). The copy says so plainly rather than implying the slot is
// already held — an unconfirmed booking presented as confirmed is the kind of
// promise that loses a customer at the door.
//
// Name and phone default from the signed-in profile but stay editable (people
// book for a parent, a spouse). Phone is required: it is the only identity a
// booking carries, so without it the customer could never find it again.
// ============================================================

import React, { useMemo, useState } from "react";
import {
  View, Text, Modal, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { buildSlotDays, formatSlotTime } from "../../lib/slots";
import { createBooking, type Offering } from "../../services/bookingService";

interface BookingSheetProps {
  visible: boolean;
  offering: Offering | null;
  storeName: string;
  defaultName: string;
  defaultPhone: string;
  onClose: () => void;
  onBooked: () => void;
}

export default function BookingSheet({
  visible, offering, storeName, defaultName, defaultPhone, onClose, onBooked,
}: BookingSheetProps) {
  const { colors } = useTheme();

  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<Date | null>(null);
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const days = useMemo(
    () => buildSlotDays(offering?.durationMin ?? null),
    [offering?.durationMin],
  );
  const day = days[dayIdx];

  async function handleConfirm() {
    if (!offering) return;
    if (!slot) { Alert.alert("Pick a time", "Choose a slot before booking."); return; }
    if (name.trim().length === 0) { Alert.alert("Name needed", "Who is this booking for?"); return; }
    if (phone.trim().length < 6) {
      Alert.alert("Phone needed", "The shop needs a number to confirm your booking.");
      return;
    }
    if (offering.atHome && address.trim().length === 0) {
      Alert.alert("Address needed", "This service comes to you — add the address.");
      return;
    }

    setSaving(true);
    try {
      await createBooking({
        offeringId: offering.id,
        slotStart: slot.toISOString(),
        customerName: name.trim(),
        customerPhone: phone.trim(),
        address: address.trim() || null,
        note: note.trim() || null,
      });
      setSaving(false);
      setSlot(null);
      onBooked();
    } catch (e: unknown) {
      setSaving(false);
      // Show the server's reason verbatim — "that slot is in the past",
      // "not accepting bookings" — never a generic failure.
      Alert.alert("Couldn't book", e instanceof Error ? e.message : "Please try again.");
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.kav}
        >
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headText}>
                <Text numberOfLines={1} style={[styles.title, {
                  color: colors.text, fontFamily: typography.fontFamily.bold,
                }]}>
                  {offering?.name ?? "Book"}
                </Text>
                <Text numberOfLines={1} style={[styles.sub, {
                  color: colors.subText, fontFamily: typography.fontFamily.regular,
                }]}>
                  {storeName} · ₹{offering?.price.toFixed(0)}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.close} activeOpacity={0.7}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              {/* Day picker */}
              <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                Day
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
                <View style={styles.chips}>
                  {days.map((d, i) => {
                    const on = i === dayIdx;
                    return (
                      <TouchableOpacity
                        key={d.label}
                        onPress={() => { setDayIdx(i); setSlot(null); }}
                        activeOpacity={0.8}
                        style={[styles.chip, {
                          backgroundColor: on ? colors.primary : colors.card,
                          borderColor: on ? colors.primary : colors.border,
                        }]}
                      >
                        <Text style={[styles.chipText, {
                          color: on ? colors.white : colors.text,
                          fontFamily: typography.fontFamily.medium,
                        }]}>
                          {d.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Slot picker */}
              <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                Time
              </Text>
              <View style={styles.slotGrid}>
                {(day?.slots ?? []).map((s) => {
                  const on = slot?.getTime() === s.getTime();
                  return (
                    <TouchableOpacity
                      key={s.toISOString()}
                      onPress={() => setSlot(s)}
                      activeOpacity={0.8}
                      style={[styles.slot, {
                        backgroundColor: on ? colors.primary : colors.card,
                        borderColor: on ? colors.primary : colors.border,
                      }]}
                    >
                      <Text style={[styles.slotText, {
                        color: on ? colors.white : colors.text,
                        fontFamily: typography.fontFamily.medium,
                      }]}>
                        {formatSlotTime(s)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Who */}
              <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                Your details
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
              />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone"
                keyboardType="phone-pad"
                placeholderTextColor={colors.subText}
                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
              />
              {offering?.atHome && (
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Address (this service comes to you)"
                  multiline
                  placeholderTextColor={colors.subText}
                  style={[styles.input, styles.multi, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                />
              )}
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Anything the shop should know (optional)"
                multiline
                placeholderTextColor={colors.subText}
                style={[styles.input, styles.multi, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
              />

              <Text style={[styles.disclaimer, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                This sends a request. {storeName} confirms the slot — you'll see it under My Bookings.
              </Text>
            </ScrollView>

            {/* Confirm */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.cta, { backgroundColor: slot ? colors.primary : colors.border }]}
                onPress={handleConfirm}
                disabled={saving || !slot}
                activeOpacity={0.85}
              >
                {saving
                  ? <ActivityIndicator color={colors.white} />
                  : <Text style={[styles.ctaText, { color: colors.white, fontFamily: typography.fontFamily.semiBold }]}>
                      {slot ? `Request ${formatSlotTime(slot)}` : "Pick a time"}
                    </Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  kav: { maxHeight: "92%" },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden" },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headText: { flex: 1 },
  title: { fontSize: typography.size.lg },
  sub: { fontSize: typography.size.xs, marginTop: 2 },
  close: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 16, paddingBottom: 20, gap: 10 },
  label: { fontSize: typography.size.sm, marginTop: 8 },
  row: { flexGrow: 0 },
  chips: { flexDirection: "row", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth },
  chipText: { fontSize: typography.size.xs },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth },
  slotText: { fontSize: typography.size.xs },
  input: {
    borderRadius: 12, borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: typography.size.sm,
  },
  multi: { minHeight: 64, textAlignVertical: "top" },
  disclaimer: { fontSize: typography.size.xs, lineHeight: 18, marginTop: 6 },
  footer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, borderTopWidth: StyleSheet.hairlineWidth },
  cta: { borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  ctaText: { fontSize: typography.size.md },
});

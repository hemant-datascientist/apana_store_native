// ============================================================
// ADD / EDIT ADDRESS SCREEN — Apana Store (Customer App)
//
// Route: /add-address?mode=add           → blank form
//        /add-address?mode=edit&id=addr1 → pre-filled form
//
// On submit the new/updated address is passed back to
// address-book via router.back() + expo-router params
// (address-book reads `newAddressJson` from local search params
//  after navigating back). No backend required — local state only.
//
// Fields:
//   Label (Home / Work / Other — pill picker)
//   Recipient name
//   House / Flat / Building  (line1)
//   Street / Area            (line2)
//   City · State · Pincode
//
// Backend: POST /api/customer/addresses   (add)
//          PUT  /api/customer/addresses/:id (edit)
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { SafeAreaView }  from "react-native-safe-area-context";
import { Ionicons }      from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { typography }    from "../../theme/typography";
import { SAVED_ADDRESSES, UserAddress } from "../../data/addressData";

const BRAND_BLUE = "#0F4C81";

// ── Label options ─────────────────────────────────────────────
const LABEL_OPTIONS: { label: string; icon: string }[] = [
  { label: "Home",   icon: "home-outline"     },
  { label: "Work",   icon: "business-outline" },
  { label: "Other",  icon: "location-outline" },
];

// ── Field component ───────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, keyboardType, maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "phone-pad";
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.field, focused && styles.fieldFocused]}>
      <Text style={[styles.fieldLabel, { fontFamily: typography.fontFamily.regular }]}>
        {label}
      </Text>
      <TextInput
        style={[styles.fieldInput, { fontFamily: typography.fontFamily.regular }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? label}
        placeholderTextColor="#9CA3AF"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={keyboardType ?? "default"}
        maxLength={maxLength}
        returnKeyType="next"
      />
    </View>
  );
}

export default function AddAddressScreen() {
  const router = useRouter();

  const { mode = "add", id } = useLocalSearchParams<{
    mode?: "add" | "edit";
    id?:   string;
  }>();

  // Pre-fill when editing an existing address
  const existing = mode === "edit" && id
    ? SAVED_ADDRESSES.find(a => a.id === id)
    : undefined;

  const [selectedLabel, setSelectedLabel] = useState(
    existing?.label ?? "Home",
  );
  const [name,    setName]    = useState(existing?.name    ?? "");
  const [line1,   setLine1]   = useState(existing?.line1   ?? "");
  const [line2,   setLine2]   = useState(existing?.line2   ?? "");
  const [city,    setCity]    = useState(existing?.city    ?? "");
  const [state,   setState]   = useState(existing?.state   ?? "");
  const [pincode, setPincode] = useState(existing?.pincode ?? "");

  function validate() {
    if (!line1.trim()) { Alert.alert("Missing", "Enter house / flat / building.");  return false; }
    if (!line2.trim()) { Alert.alert("Missing", "Enter street / area.");             return false; }
    if (!city.trim())  { Alert.alert("Missing", "Enter city.");                      return false; }
    if (!state.trim()) { Alert.alert("Missing", "Enter state.");                     return false; }
    if (pincode.length !== 6) { Alert.alert("Invalid", "Pincode must be 6 digits."); return false; }
    return true;
  }

  function handleSave() {
    if (!validate()) return;

    const iconEntry = LABEL_OPTIONS.find(o => o.label === selectedLabel);
    const address: UserAddress = {
      id:      existing?.id ?? `addr_${Date.now()}`,
      label:   selectedLabel,
      icon:    iconEntry?.icon ?? "location-outline",
      name:    name.trim() || undefined,
      line1:   line1.trim(),
      line2:   line2.trim(),
      city:    city.trim(),
      state:   state.trim(),
      pincode: pincode.trim(),
    };

    // Pass the saved address back to address-book via search params
    router.back();
    // NOTE: address-book listens to `useLocalSearchParams` for `newAddressJson`
    // (expo-router passes params back when using router.push with result pattern).
    // Since expo-router v3 doesn't have a formal "result" API, the address-book
    // re-reads on focus and we encode the new address in the URL before going back.
    router.setParams({ newAddressJson: JSON.stringify(address) });
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          {mode === "edit" ? "Edit Address" : "Add New Address"}
        </Text>
        <View style={styles.headerBtn} />
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Label picker ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: typography.fontFamily.semiBold }]}>
            Address Type
          </Text>
          <View style={styles.labelRow}>
            {LABEL_OPTIONS.map(opt => {
              const active = selectedLabel === opt.label;
              return (
                <TouchableOpacity
                  key={opt.label}
                  style={[
                    styles.labelPill,
                    active && { backgroundColor: BRAND_BLUE, borderColor: BRAND_BLUE },
                  ]}
                  onPress={() => setSelectedLabel(opt.label)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={opt.icon as any}
                    size={16}
                    color={active ? "#fff" : "#6B7280"}
                  />
                  <Text style={[styles.labelPillText, {
                    fontFamily: typography.fontFamily.semiBold,
                    color:      active ? "#fff" : "#374151",
                  }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Form fields ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: typography.fontFamily.semiBold }]}>
            Address Details
          </Text>

          <Field
            label="Recipient Name (optional)"
            value={name}
            onChange={setName}
            placeholder="e.g. Hemant Lokhande"
          />
          <Field
            label="House / Flat / Building *"
            value={line1}
            onChange={setLine1}
            placeholder="e.g. Flat 203, Sai Residency"
          />
          <Field
            label="Street / Area *"
            value={line2}
            onChange={setLine2}
            placeholder="e.g. Kothrud"
          />
          <Field
            label="City *"
            value={city}
            onChange={setCity}
            placeholder="e.g. Pune"
          />
          <Field
            label="State *"
            value={state}
            onChange={setState}
            placeholder="e.g. Maharashtra"
          />
          <Field
            label="Pincode *"
            value={pincode}
            onChange={setPincode}
            placeholder="6-digit pincode"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>

        {/* ── Save button ── */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={[styles.saveBtnText, { fontFamily: typography.fontFamily.bold }]}>
            {mode === "edit" ? "Update Address" : "Save Address"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: "#F8FAFC",
  },

  // ── Header ──
  header: {
    backgroundColor:   BRAND_BLUE,
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
    paddingBottom:     14,
    gap:               4,
  },
  headerBtn: {
    width:          44,
    height:         44,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex:      1,
    fontSize:  17,
    color:     "#fff",
    textAlign: "center",
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop:        20,
    paddingBottom:     48,
    gap:               20,
  },

  // ── Section ──
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 13,
    color:    "#374151",
    marginBottom: 2,
  },

  // ── Label pills ──
  labelRow: {
    flexDirection: "row",
    gap:           10,
  },
  labelPill: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               6,
    paddingVertical:   10,
    borderRadius:      12,
    borderWidth:       1.5,
    borderColor:       "#E5E7EB",
    backgroundColor:   "#fff",
  },
  labelPillText: {
    fontSize: 13,
  },

  // ── Form field ──
  field: {
    backgroundColor:   "#fff",
    borderRadius:      12,
    borderWidth:       1,
    borderColor:       "#E5E7EB",
    paddingHorizontal: 14,
    paddingTop:        10,
    paddingBottom:     10,
    gap:               3,
  },
  fieldFocused: { borderColor: BRAND_BLUE },
  fieldLabel: {
    fontSize: 11,
    color:    "#9CA3AF",
  },
  fieldInput: {
    fontSize: 14,
    color:    "#111827",
    padding:  0,
  },

  // ── Save button ──
  saveBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             10,
    backgroundColor: BRAND_BLUE,
    borderRadius:    14,
    paddingVertical: 16,
    marginTop:       4,
  },
  saveBtnText: {
    fontSize: 15,
    color:    "#fff",
  },
});

// ============================================================
// CARD FORM — Apana Store
//
// Add debit / credit card with:
//   Auto-formatted card number (XXXX XXXX XXXX XXXX)
//   Live card brand detection (Visa / Mastercard / RuPay / Amex)
//   MM/YY expiry formatter
//   CVV (length 3 or 4 based on brand)
//   Cardholder name
//   "Save this card" toggle
// ============================================================

import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Switch, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import {
  formatCardNumber, formatExpiry,
  detectCardBrand, CARD_BRAND_META,
} from "../../data/addPaymentData";

interface CardFormProps {
  onAdd: (label: string, detail: string) => Promise<void>;
}

export default function CardForm({ onAdd }: CardFormProps) {
  const { colors } = useTheme();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry,     setExpiry]     = useState("");
  const [cvv,        setCvv]        = useState("");
  const [name,       setName]       = useState("");
  const [saveCard,   setSaveCard]   = useState(true);
  const [cvvVisible, setCvvVisible] = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const expiryRef = useRef<TextInput>(null);
  const cvvRef    = useRef<TextInput>(null);
  const nameRef   = useRef<TextInput>(null);

  const brand    = detectCardBrand(cardNumber);
  const brandMeta= CARD_BRAND_META[brand];
  const cvvLen   = brandMeta.cvvLen;
  const cleanNum = cardNumber.replace(/\s/g, "");

  // ── Field handlers ────────────────────────────────────────
  function handleCardNumber(raw: string) {
    const formatted = formatCardNumber(raw);
    setCardNumber(formatted);
    setErrors(e => ({ ...e, cardNumber: "" }));
    // Auto-advance to expiry when 16 digits entered
    if (formatted.replace(/\s/g, "").length === 16) expiryRef.current?.focus();
  }

  function handleExpiry(raw: string) {
    const prev    = expiry;
    // Allow backspace through the slash
    const cleaned = raw.replace(/[^0-9/]/g, "");
    const formatted = formatExpiry(cleaned);
    setExpiry(formatted);
    setErrors(e => ({ ...e, expiry: "" }));
    if (formatted.length === 5) cvvRef.current?.focus();
  }

  function handleCvv(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, cvvLen);
    setCvv(digits);
    setErrors(e => ({ ...e, cvv: "" }));
    if (digits.length === cvvLen) nameRef.current?.focus();
  }

  // ── Validation ────────────────────────────────────────────
  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (cleanNum.length < 16)              errs.cardNumber = "Enter a valid 16-digit card number";
    const [mm, yy] = expiry.split("/");
    const now = new Date();
    if (!mm || !yy || expiry.length < 5)   errs.expiry = "Enter expiry as MM/YY";
    else if (parseInt(mm) < 1 || parseInt(mm) > 12) errs.expiry = "Invalid month";
    else if (parseInt(yy) + 2000 < now.getFullYear()) errs.expiry = "Card has expired";
    if (cvv.length < cvvLen)               errs.cvv = `CVV must be ${cvvLen} digits`;
    if (name.trim().length < 2)            errs.name = "Enter the name on your card";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleAdd() {
    if (!validate()) return;
    setSaving(true);
    try {
      const last4  = cleanNum.slice(-4);
      const label  = brandMeta.label ? `${brandMeta.label} Card` : "Debit / Credit Card";
      const detail = `•••• •••• •••• ${last4}`;
      await onAdd(label, detail);
    } finally {
      setSaving(false);
    }
  }

  // ── Card preview strip ────────────────────────────────────
  const previewNum = cardNumber || "•••• •••• •••• ••••";
  const hasNum     = cleanNum.length > 0;

  return (
    <View style={styles.container}>

      {/* ── Card preview ── */}
      <View style={[styles.cardPreview, { backgroundColor: brand !== "unknown" ? brandMeta.color : colors.primary }]}>
        <View style={styles.previewTop}>
          <View style={[styles.chip, { backgroundColor: "#FFD700" }]} />
          {brand !== "unknown" && (
            <View style={[styles.brandBadge, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
              <Text style={[styles.brandLabel, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                {brandMeta.label}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.previewNum, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md, opacity: hasNum ? 1 : 0.5 }]}>
          {previewNum}
        </Text>
        <View style={styles.previewBottom}>
          <View>
            <Text style={[styles.previewSmall, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              CARD HOLDER
            </Text>
            <Text style={[styles.previewValue, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs, opacity: name ? 1 : 0.5 }]}>
              {name.toUpperCase() || "YOUR NAME"}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.previewSmall, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              EXPIRES
            </Text>
            <Text style={[styles.previewValue, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs, opacity: expiry ? 1 : 0.5 }]}>
              {expiry || "MM/YY"}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Card number ── */}
      <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          Card Number
        </Text>
        <View style={[styles.inputRow, { borderColor: errors.cardNumber ? "#EF4444" : colors.border, backgroundColor: colors.background }]}>
          <Ionicons name="card-outline" size={18} color={colors.subText} />
          <TextInput
            style={[styles.input, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={colors.subText}
            value={cardNumber}
            onChangeText={handleCardNumber}
            keyboardType="number-pad"
            maxLength={19}
            returnKeyType="next"
          />
          {brand !== "unknown" && (
            <View style={[styles.brandDot, { backgroundColor: brandMeta.color }]}>
              <Text style={[styles.brandDotText, { fontFamily: typography.fontFamily.bold, fontSize: 8 }]}>
                {brandMeta.label.slice(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        {!!errors.cardNumber && <Text style={[styles.errorText, { color: "#EF4444" }]}>{errors.cardNumber}</Text>}
      </View>

      {/* ── Expiry + CVV row ── */}
      <View style={styles.halfRow}>
        {/* Expiry */}
        <View style={[styles.fieldWrap, { flex: 1 }]}>
          <Text style={[styles.fieldLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            Expiry (MM/YY)
          </Text>
          <View style={[styles.inputRow, { borderColor: errors.expiry ? "#EF4444" : colors.border, backgroundColor: colors.background }]}>
            <Ionicons name="calendar-outline" size={16} color={colors.subText} />
            <TextInput
              ref={expiryRef}
              style={[styles.input, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
              placeholder="MM/YY"
              placeholderTextColor={colors.subText}
              value={expiry}
              onChangeText={handleExpiry}
              keyboardType="number-pad"
              maxLength={5}
              returnKeyType="next"
            />
          </View>
          {!!errors.expiry && <Text style={[styles.errorText, { color: "#EF4444" }]}>{errors.expiry}</Text>}
        </View>

        {/* CVV */}
        <View style={[styles.fieldWrap, { flex: 1 }]}>
          <Text style={[styles.fieldLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            CVV
          </Text>
          <View style={[styles.inputRow, { borderColor: errors.cvv ? "#EF4444" : colors.border, backgroundColor: colors.background }]}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.subText} />
            <TextInput
              ref={cvvRef}
              style={[styles.input, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
              placeholder={"•".repeat(cvvLen)}
              placeholderTextColor={colors.subText}
              value={cvv}
              onChangeText={handleCvv}
              keyboardType="number-pad"
              maxLength={cvvLen}
              secureTextEntry={!cvvVisible}
              returnKeyType="next"
            />
            <TouchableOpacity onPress={() => setCvvVisible(v => !v)}>
              <Ionicons name={cvvVisible ? "eye-off-outline" : "eye-outline"} size={16} color={colors.subText} />
            </TouchableOpacity>
          </View>
          {!!errors.cvv && <Text style={[styles.errorText, { color: "#EF4444" }]}>{errors.cvv}</Text>}
        </View>
      </View>

      {/* ── Cardholder name ── */}
      <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          Name on Card
        </Text>
        <View style={[styles.inputRow, { borderColor: errors.name ? "#EF4444" : colors.border, backgroundColor: colors.background }]}>
          <Ionicons name="person-outline" size={17} color={colors.subText} />
          <TextInput
            ref={nameRef}
            style={[styles.input, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
            placeholder="As printed on card"
            placeholderTextColor={colors.subText}
            value={name}
            onChangeText={t => { setName(t); setErrors(e => ({ ...e, name: "" })); }}
            autoCapitalize="characters"
            returnKeyType="done"
          />
        </View>
        {!!errors.name && <Text style={[styles.errorText, { color: "#EF4444" }]}>{errors.name}</Text>}
      </View>

      {/* ── Save card toggle ── */}
      <View style={[styles.saveRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.saveLeft}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
          <View style={styles.saveText}>
            <Text style={[styles.saveTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              Save this card
            </Text>
            <Text style={[styles.saveSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Securely saved for future payments
            </Text>
          </View>
        </View>
        <Switch
          value={saveCard}
          onValueChange={setSaveCard}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor="#fff"
        />
      </View>

      {/* ── CVV hint ── */}
      <View style={[styles.cvvHint, { backgroundColor: colors.primary + "0C", borderColor: colors.primary + "25" }]}>
        <Ionicons name="information-circle-outline" size={14} color={colors.primary} />
        <Text style={[styles.cvvHintText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          CVV is the {cvvLen}-digit code on the {brand === "amex" ? "front" : "back"} of your card. We never store it.
        </Text>
      </View>

      {/* ── Add button ── */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.primary }]}
        onPress={handleAdd}
        disabled={saving}
        activeOpacity={0.85}
      >
        {saving
          ? <ActivityIndicator size="small" color="#fff" />
          : <Ionicons name="card-outline" size={18} color="#fff" />
        }
        <Text style={[styles.addBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          {saving ? "Adding Card…" : "Add Card"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },

  // Card preview
  cardPreview: {
    borderRadius: 16,
    padding:      20,
    gap:          16,
    minHeight:    170,
    justifyContent: "space-between",
  },
  previewTop: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
  },
  chip: {
    width:        36,
    height:       26,
    borderRadius: 5,
  },
  brandBadge: {
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      8,
  },
  brandLabel: { color: "#fff" },
  previewNum: {
    color:         "#fff",
    letterSpacing: 3,
  },
  previewBottom: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "flex-end",
  },
  previewSmall: { color: "rgba(255,255,255,0.6)", letterSpacing: 1 },
  previewValue: { color: "#fff", marginTop: 2 },

  // Fields
  fieldWrap: { gap: 6 },
  fieldLabel: {},
  inputRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    borderWidth:       1.5,
    borderRadius:      12,
    paddingHorizontal: 14,
    paddingVertical:   13,
  },
  input:     { flex: 1 },
  errorText: { fontSize: 11, marginTop: -2, fontFamily: "System" },

  brandDot: {
    width:          28,
    height:         18,
    borderRadius:   4,
    alignItems:     "center",
    justifyContent: "center",
  },
  brandDotText: { color: "#fff" },

  halfRow: { flexDirection: "row", gap: 12 },

  // Save toggle
  saveRow: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    padding:           14,
    borderRadius:      12,
    borderWidth:       1,
  },
  saveLeft:  { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  saveText:  { gap: 2, flex: 1 },
  saveTitle: {},
  saveSub:   {},

  // CVV hint
  cvvHint: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               8,
    padding:           12,
    borderRadius:      10,
    borderWidth:       1,
  },
  cvvHintText: { flex: 1, lineHeight: 17 },

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

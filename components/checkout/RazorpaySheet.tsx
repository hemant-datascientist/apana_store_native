// ============================================================
// RAZORPAY SHEET — the real payment, inside a WebView.
//
// Razorpay's own Standard Checkout (checkout.razorpay.com), loaded in a WebView
// — UPI apps, cards, netbanking, wallets, all Razorpay's screens. No native SDK,
// so nothing to rebuild beyond the APK that ships this file.
//
// The sheet only RELAYS what Razorpay hands back (payment id + signature). The
// order is paid only when the server verifies that signature against its
// secret (POST /payments/verify) — or when Razorpay's webhook says so.
// ============================================================

import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { PaymentIntent } from "../../services/paymentsService";

export interface RazorpayResult {
  provider_order_id: string;
  provider_payment_id: string;
  signature: string;
}

interface Props {
  intent: PaymentIntent | null;
  /** The customer's phone, prefilled so they are not asked twice. */
  contact?: string;
  onPaid: (r: RazorpayResult) => void;
  /** Closed, or Razorpay reported a failure. `reason` is shown to the customer. */
  onCancel: (reason: string) => void;
}

// Values go in as JSON, never string-pasted into script source.
function page(intent: PaymentIntent, contact: string): string {
  const opts = JSON.stringify({
    key: intent.public_key,
    order_id: intent.provider_order_id,
    amount: intent.amount_cents,
    currency: intent.currency,
    name: "Apana",
    prefill: contact ? { contact } : {},
  });
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#fff">
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
  var send = function (m) { window.ReactNativeWebView.postMessage(JSON.stringify(m)); };
  var o = ${opts};
  o.handler = function (r) {
    send({ type: "paid", provider_order_id: r.razorpay_order_id, provider_payment_id: r.razorpay_payment_id, signature: r.razorpay_signature });
  };
  o.modal = { ondismiss: function () { send({ type: "cancel", reason: "Payment was closed before it finished." }); } };
  if (!window.Razorpay) { send({ type: "cancel", reason: "Could not load the payment page. Check your connection." }); }
  else {
    var rz = new Razorpay(o);
    rz.on("payment.failed", function (e) { send({ type: "cancel", reason: (e && e.error && e.error.description) || "The payment failed." }); });
    rz.open();
  }
</script></body></html>`;
}

export default function RazorpaySheet({ intent, contact = "", onPaid, onCancel }: Props) {
  const { colors } = useTheme();

  const onMessage = (e: WebViewMessageEvent) => {
    let m: { type?: string; reason?: string } & Partial<RazorpayResult>;
    try { m = JSON.parse(e.nativeEvent.data); } catch { return; }
    if (m.type === "paid" && m.provider_order_id && m.provider_payment_id && m.signature) {
      onPaid({ provider_order_id: m.provider_order_id, provider_payment_id: m.provider_payment_id, signature: m.signature });
    } else if (m.type === "cancel") {
      onCancel(m.reason ?? "Payment was not completed.");
    }
  };

  return (
    <Modal visible={intent != null} animationType="slide" onRequestClose={() => onCancel("Payment was closed before it finished.")}>
      <View style={[styles.bar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={{ color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md }}>
          Pay securely
        </Text>
        <TouchableOpacity onPress={() => onCancel("Payment was closed before it finished.")} hitSlop={12}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      {intent && (
        <WebView
          originWhitelist={["*"]}
          source={{ html: page(intent, contact), baseUrl: "https://checkout.razorpay.com" }}
          onMessage={onMessage}
          javaScriptEnabled
          setSupportMultipleWindows={false}
          // UPI intent links (upi://, tez://, phonepe://, paytmmp://) belong to the
          // customer's UPI app, not the WebView — hand them to the phone.
          onShouldStartLoadWithRequest={(req) => {
            if (/^https?:|^about:|^data:/.test(req.url)) return true;
            void Linking.openURL(req.url).catch(() => onCancel("No UPI app on this phone could open the payment."));
            return false;
          }}
          startInLoadingState
          renderLoading={() => <ActivityIndicator style={styles.loading} color={colors.primary} />}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 48, paddingBottom: 14, borderBottomWidth: 1 },
  loading: { position: "absolute", top: "45%", alignSelf: "center" },
});

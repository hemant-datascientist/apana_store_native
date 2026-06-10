// ============================================================
// STORE SHARE SHEET — lets a customer share a storefront (QR + link). A friend
// who scans/taps lands on the store and can follow it in one tap. §30 growth
// loop (demand-side: customers pull more customers at ~₹0 CAC).
// QR sits on a forced-white box so it scans in light AND dark theme.
// ============================================================

import {
  View,
  Text,
  Modal,
  Share,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { buildStoreShare } from "../../lib/storeShare";

interface Props {
  visible: boolean;
  storeId: string;
  storeName: string;
  onClose: () => void;
}

export default function StoreShareSheet({ visible, storeId, storeName, onClose }: Props) {
  const { colors } = useTheme();
  const share = buildStoreShare(storeId, storeName);

  async function handleWhatsApp() {
    const text = encodeURIComponent(share.message);
    const native = `whatsapp://send?text=${text}`;
    const web = `https://wa.me/?text=${text}`;
    const canNative = await Linking.canOpenURL(native).catch(() => false);
    Linking.openURL(canNative ? native : web).catch(() => {});
  }

  function handleShare() {
    Share.share({ message: share.message }).catch(() => {});
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, { backgroundColor: colors.card }]}>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />

              <Text style={[styles.title, { color: colors.text }]}>Share this store</Text>
              <Text style={[styles.subtitle, { color: colors.subText }]} numberOfLines={1}>
                {share.name}
              </Text>

              <View style={styles.qrBox}>
                <QRCode value={share.url} size={188} color="#111" backgroundColor="#fff" />
              </View>

              <Text style={[styles.caption, { color: colors.text }]}>Scan to open on Apana</Text>
              <Text style={[styles.captionHi, { color: colors.subText }]}>
                Apana पर खोलने के लिए स्कैन करें
              </Text>

              <View style={styles.actions}>
                <Action icon="logo-whatsapp" label="WhatsApp" tint="#25D366" onPress={handleWhatsApp} />
                <Action icon="share-social-outline" label="Share" tint={colors.primary} onPress={handleShare} />
                <Action icon="close" label="Close" tint={colors.subText} onPress={onClose} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

interface ActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tint: string;
  onPress: () => void;
}

function Action({ icon, label, tint, onPress }: ActionProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.action} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.actionIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Ionicons name={icon} size={22} color={tint} />
      </View>
      <Text style={[styles.actionLabel, { color: colors.subText }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
    alignItems: "center",
  },
  handle: { width: 36, height: 4, borderRadius: 2, marginBottom: 18 },
  title: { fontSize: typography.size.lg, fontFamily: typography.fontFamily.semiBold },
  subtitle: { marginTop: 2, fontSize: typography.size.sm, fontFamily: typography.fontFamily.regular },
  qrBox: { marginTop: 20, backgroundColor: "#fff", padding: 16, borderRadius: 16 },
  caption: { marginTop: 14, fontSize: typography.size.sm, fontFamily: typography.fontFamily.semiBold },
  captionHi: { marginTop: 2, fontSize: typography.size.xs, fontFamily: typography.fontFamily.regular },
  actions: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 24 },
  action: { alignItems: "center", gap: 7 },
  actionIcon: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  actionLabel: { fontSize: typography.size.xs, fontFamily: typography.fontFamily.medium },
});

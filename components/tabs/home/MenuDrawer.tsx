// ============================================================
// MENU DRAWER — Apana Store (Customer App)
//
// Centered card modal (not a side drawer): a branded primary header band
// over a 2-column grid of menu tiles. Scales + fades in. Fully themed via
// tokens so it reads well in light and dark.
//
// Menu items:
//   Offer Zone · Shop by Brands · New Launches · Product Finder · Store QR
//   Favourite · Sell on ONDC · Address Book · Auto Riders · About
// ============================================================

import React, { useEffect, useRef } from "react";
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, StatusBar, ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_W    = Math.min(SCREEN_W * 0.9, 440);
const CARD_PAD  = 16;
const GRID_GAP  = 12;
const TILE_W    = (CARD_W - CARD_PAD * 2 - GRID_GAP) / 2;

// ── Menu items ────────────────────────────────────────────────
interface MenuItem {
  key:   string;
  label: string;
  icon:  keyof typeof Ionicons.glyphMap | "brand_b";
}

const MENU_ITEMS: MenuItem[] = [
  { key: "offer_zone",    label: "Offer Zone",      icon: "pricetag-outline"           },
  { key: "shop_brands",   label: "Shop by Brands",  icon: "brand_b"                    },
  { key: "new_launches",  label: "New Launches",    icon: "sparkles-outline"           },
  { key: "product_finder",label: "Product Finder",  icon: "search-outline"             },
  { key: "store_qr",      label: "Store QR",        icon: "qr-code-outline"            },
  { key: "favourite",     label: "Favourite",       icon: "heart-outline"              },
  { key: "sell_ondc",     label: "Sell on ONDC",    icon: "bag-handle-outline"         },
  { key: "address_book",  label: "Address Book",    icon: "location-outline"           },
  { key: "auto_riders",   label: "Auto Riders",     icon: "car-outline"                },
  { key: "about_us",      label: "About Us",        icon: "information-circle-outline" },
];

// ── Brand "B" icon (custom) ────────────────────────────────────
function BrandIcon({ color }: { color: string }) {
  return (
    <View style={[styles.brandIcon, { borderColor: color }]}>
      <Text style={[styles.brandLetter, { color }]}>B</Text>
    </View>
  );
}

// ── Single menu tile ───────────────────────────────────────────
function MenuTile({
  item, onPress, tint, chipBg, surface, border, textColor,
}: {
  item:      MenuItem;
  onPress:   () => void;
  tint:      string;
  chipBg:    string;
  surface:   string;
  border:    string;
  textColor: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.tile, { width: TILE_W, backgroundColor: surface, borderColor: border }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <View style={[styles.chip, { backgroundColor: chipBg }]}>
        {item.icon === "brand_b" ? (
          <BrandIcon color={tint} />
        ) : (
          <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={22} color={tint} />
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[styles.tileLabel, { color: textColor, fontFamily: typography.fontFamily.semiBold }]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

// ── Drawer ─────────────────────────────────────────────────────
interface MenuDrawerProps {
  visible:  boolean;
  onClose:  () => void;
  onSelect: (key: string) => void;
}

export default function MenuDrawer({ visible, onClose, onSelect }: MenuDrawerProps) {
  const { colors } = useTheme();
  const insets     = useSafeAreaInsets();
  const scaleAnim  = useRef(new Animated.Value(0.92)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 8, tension: 80 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.92, duration: 160, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,    duration: 160, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, scaleAnim, fadeAnim]);

  // Soft primary tint for the icon chips; theme-derived so it tracks the app's
  // accent without hardcoding a palette.
  const chipBg  = colors.primary + "1A"; // ~10% primary
  const surface = colors.background;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.55)" />

      {/* Scrim — tap anywhere outside the card to close */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      <View style={styles.center} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            {
              width:           CARD_W,
              backgroundColor: colors.card,
              opacity:         fadeAnim,
              transform:       [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* ── Header band ── */}
          <View style={[styles.header, { backgroundColor: colors.primary }]}>
            <View style={styles.logoRow}>
              <View style={styles.logoCircle}>
                <Ionicons name="storefront" size={18} color={colors.primary} />
              </View>
              <View style={styles.logoText}>
                <Text style={[styles.logoName, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
                  Apana Store
                </Text>
                <Text style={[styles.logoTagline, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  Shop Local · Shop Smart
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* ── Tile grid ── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: SCREEN_H * 0.56 }}
            contentContainerStyle={styles.grid}
          >
            {MENU_ITEMS.map(item => (
              <MenuTile
                key={item.key}
                item={item}
                tint={colors.primary}
                chipBg={chipBg}
                surface={surface}
                border={colors.border}
                textColor={colors.text}
                onPress={() => {
                  onSelect(item.key);
                  onClose();
                }}
              />
            ))}
          </ScrollView>

          <View style={{ height: insets.bottom ? insets.bottom / 2 : 6 }} />
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  center: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    borderRadius:  24,
    overflow:      "hidden",
    // Depth — floats over the scrim
    shadowColor:   "#000",
    shadowOffset:  { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius:  28,
    elevation:     16,
  },

  // Header band
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 18,
    paddingVertical:   16,
  },
  logoRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           11,
    flex:          1,
  },
  logoCircle: {
    width:          40,
    height:         40,
    borderRadius:   20,
    backgroundColor:"#FFD700",
    alignItems:     "center",
    justifyContent: "center",
  },
  logoText:    { flexShrink: 1 },
  logoName:    { color: "#fff",                   lineHeight: 22 },
  logoTagline: { color: "rgba(255,255,255,0.72)", lineHeight: 16 },
  closeBtn: {
    width:           34,
    height:          34,
    borderRadius:    17,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems:      "center",
    justifyContent:  "center",
    marginLeft:      8,
  },

  // Tile grid
  grid: {
    flexDirection:     "row",
    flexWrap:          "wrap",
    gap:               GRID_GAP,
    padding:           CARD_PAD,
    justifyContent:    "flex-start",
  },
  tile: {
    borderRadius:    16,
    borderWidth:     1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems:      "center",
    gap:             10,
  },
  chip: {
    width:          46,
    height:         46,
    borderRadius:   23,
    alignItems:     "center",
    justifyContent: "center",
  },
  tileLabel: {
    fontSize:  typography.size.xs,
    textAlign: "center",
  },

  // Brand "B" custom icon
  brandIcon: {
    width:         22,
    height:        22,
    borderWidth:   1.5,
    borderRadius:  4,
    alignItems:    "center",
    justifyContent:"center",
  },
  brandLetter: {
    fontSize:   13,
    fontFamily: "Poppins_700Bold",
    lineHeight: 16,
  },
});

// ============================================================
// MENU DRAWER — Apana Store (Customer App)
//
// Slides in from the left when the hamburger button is pressed.
// Dark navy background matching the hero header.
//
// Menu items:
//   Offer Zone · Shop by Brands · New Launches · Product Finder
//   Favourite · Bookmark · Sell on ONDC · Address Book
//   Auto Riders - ONDC · About Us
// ============================================================

import React, { useEffect, useRef } from "react";
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, StatusBar, ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { typography } from "../../../theme/typography";
import { HEADER_BG } from "../../../data/homeData";

const { width: SCREEN_W } = Dimensions.get("window");
const DRAWER_W = SCREEN_W * 0.78;

// ── Menu items ────────────────────────────────────────────────
interface MenuItem {
  key:      string;
  label:    string;
  icon:     keyof typeof Ionicons.glyphMap | "brand_b";
  dividerAfter?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { key: "offer_zone",    label: "Offer Zone",        icon: "pricetag-outline"              },
  { key: "shop_brands",   label: "Shop by Brands",    icon: "brand_b"                       },
  { key: "new_launches",  label: "New Launches",      icon: "sparkles-outline"              },
  { key: "product_finder",label: "Product Finder",    icon: "search-outline"                },
  { key: "shared_list",   label: "Shared Shopping",   icon: "people-outline", dividerAfter: true  },
  { key: "store_qr",      label: "Store QR",          icon: "qr-code-outline", dividerAfter: true },
  { key: "favourite",     label: "Favourite",         icon: "heart-outline"                 },
  { key: "bookmark",      label: "Bookmark",          icon: "bookmark-outline", dividerAfter: true },
  { key: "sell_ondc",     label: "Sell on ONDC",      icon: "bag-handle-outline"            },
  { key: "address_book",  label: "Address Book",      icon: "location-outline"              },
  { key: "auto_riders",   label: "Auto Riders – ONDC",icon: "car-outline",   dividerAfter: true },
  { key: "about_us",      label: "About Us",          icon: "information-circle-outline"    },
];

// ── Brand "B" icon (custom) ────────────────────────────────────
function BrandIcon() {
  return (
    <View style={styles.brandIcon}>
      <Text style={styles.brandLetter}>B</Text>
    </View>
  );
}

// ── Single menu row ────────────────────────────────────────────
function MenuRow({
  item,
  onPress,
}: {
  item: MenuItem;
  onPress: () => void;
}) {
  return (
    <>
      <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.65}>
        <View style={styles.iconWrap}>
          {item.icon === "brand_b" ? (
            <BrandIcon />
          ) : (
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color="#fff" />
          )}
        </View>
        <Text style={[styles.rowLabel, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md }]}>
          {item.label}
        </Text>
      </TouchableOpacity>
      {item.dividerAfter && <View style={styles.divider} />}
    </>
  );
}

// ── Drawer ─────────────────────────────────────────────────────
interface MenuDrawerProps {
  visible:  boolean;
  onClose:  () => void;
  onSelect: (key: string) => void;
}

export default function MenuDrawer({ visible, onClose, onSelect }: MenuDrawerProps) {
  const insets    = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_W)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0,          duration: 280, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 1,          duration: 280, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_W,  duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,          duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />

      <View style={styles.overlay}>
        {/* Scrim — tap to close */}
        <Animated.View style={[styles.scrim, { opacity: fadeAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View
          style={[
            styles.drawer,
            {
              width:           DRAWER_W,
              paddingTop:      insets.top + 8,
              paddingBottom:   insets.bottom + 16,
              backgroundColor: HEADER_BG,
              transform:       [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header: logo + close */}
          <View style={styles.drawerHeader}>
            <View style={styles.logoRow}>
              <View style={styles.logoCircle}>
                <Ionicons name="storefront" size={18} color={HEADER_BG} />
              </View>
              <View>
                <Text style={[styles.logoName, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
                  Apana Store
                </Text>
                <Text style={[styles.logoTagline, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  Shop Local · Shop Smart
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color="rgba(255,255,255,0.75)" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerDivider} />

          {/* Menu list */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            {MENU_ITEMS.map(item => (
              <MenuRow
                key={item.key}
                item={item}
                onPress={() => {
                  onSelect(item.key);
                  onClose();
                }}
              />
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex:      1,
    flexDirection: "row",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  drawer: {
    position: "absolute",
    left:      0,
    top:       0,
    bottom:    0,
  },

  // Header
  drawerHeader: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 20,
    paddingBottom:     14,
  },
  logoRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },
  logoCircle: {
    width:          40,
    height:         40,
    borderRadius:   20,
    backgroundColor:"#FFD700",
    alignItems:     "center",
    justifyContent: "center",
  },
  logoName:    { color: "#fff",                  lineHeight: 22 },
  logoTagline: { color: "rgba(255,255,255,0.60)", lineHeight: 17 },
  headerDivider: {
    height:          1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginHorizontal:20,
    marginBottom:    8,
  },

  // Menu list
  list: {
    paddingHorizontal: 12,
    paddingTop:         8,
  },
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            14,
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius:   10,
  },
  iconWrap: {
    width:          28,
    alignItems:     "center",
    justifyContent: "center",
  },
  rowLabel: {
    color: "#fff",
    flex:  1,
  },
  divider: {
    height:          1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginVertical:  4,
    marginHorizontal:10,
  },

  // Brand "B" custom icon
  brandIcon: {
    width:        22,
    height:       22,
    borderWidth:   1.5,
    borderColor:  "#fff",
    borderRadius:  4,
    alignItems:   "center",
    justifyContent:"center",
  },
  brandLetter: {
    color:      "#fff",
    fontSize:   13,
    fontFamily: "Poppins_700Bold",
    lineHeight: 16,
  },
});

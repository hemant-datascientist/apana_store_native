// ============================================================
// STORE HERO BANNER — Apana Store (Store Detail Component)
//
// Full-width colored hero with store icon, LIVE badge,
// rating chip, and store category label.
// Replaces a real photo until backend serves image URLs.
// ============================================================

import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, Modal, TouchableOpacity, Pressable } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { StoreDetail } from "../../data/storeDetailData";
import useTheme from "../../theme/useTheme";

const { width: SW, height: SH } = Dimensions.get("window");
const HERO_H        = 220;

interface StoreHeroBannerProps {
  store: StoreDetail;
}

export default function StoreHeroBanner({ store }: StoreHeroBannerProps) {
  const { colors } = useTheme();
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { backgroundColor: store.heroBg }]}>

        {/* ── LIVE badge ── */}
        {store.isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={[styles.liveLabel, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
              LIVE
            </Text>
          </View>
        )}

        {/* ── Rating chip ── */}
        <View style={styles.ratingChip}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={[styles.ratingLabel, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {store.rating.toFixed(1)}
          </Text>
          <Text style={[styles.reviewLabel, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            ({store.reviewCount})
          </Text>
        </View>

        {/* ── Center icon ── */}
        <View style={styles.center}>
          <View style={styles.iconCircle}>
            <Ionicons name={store.icon as any} size={52} color={store.heroBg} />
          </View>
          <Text style={[styles.category, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {store.category.toUpperCase()}
          </Text>
        </View>

        {/* ── Bottom scrim for seamless blend ── */}
        <View style={styles.scrim} />
      </View>

      {/* ── Owner Profile Photo (Overlapping) ── */}
      <TouchableOpacity 
        style={styles.ownerWrapper}
        onPress={() => setShowOwnerModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: store.ownerPhoto }}
            style={styles.ownerPhoto}
          />
        </View>
      </TouchableOpacity>

      {/* ── Custom Owner Modal ── */}
      <Modal
        visible={showOwnerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOwnerModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowOwnerModal(false)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {/* Close button */}
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setShowOwnerModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>

            {/* Large Owner Photo */}
            <View style={[styles.modalPhotoRing, { borderColor: store.heroBg + "44" }]}>
              <Image source={{ uri: store.ownerPhoto }} style={styles.modalPhoto} />
            </View>

            {/* Owner Details */}
            <Text style={[styles.modalName, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {store.ownerName}
            </Text>
            <Text style={[styles.modalSub, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
              Store Owner
            </Text>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Owner Message */}
            <View style={styles.messageBox}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={store.heroBg} style={styles.quoteIcon} />
              <Text style={[styles.modalMessage, { color: colors.text, fontFamily: typography.fontFamily.regular }]}>
                "{store.ownerMessage}"
              </Text>
            </View>

            {/* Footer */}
            <TouchableOpacity 
              style={[styles.modalAction, { backgroundColor: store.heroBg }]}
              onPress={() => setShowOwnerModal(false)}
            >
              <Text style={[styles.actionText, { fontFamily: typography.fontFamily.semiBold }]}>
                Great to know!
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // No margin-bottom here to keep elements close for overlap
  },
  hero: {
    width:          SW,
    height:         HERO_H,
    justifyContent: "center",
    alignItems:     "center",
    overflow:       "visible", 
  },

  liveBadge: {
    position:          "absolute",
    top:               14,
    left:              14,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    backgroundColor:   "rgba(0,0,0,0.40)",
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
    zIndex:            2,
  },
  liveDot: {
    width:           7,
    height:          7,
    borderRadius:    4,
    backgroundColor: "#4ADE80",
  },
  liveLabel: { color: "#fff", letterSpacing: 0.5 },

  ratingChip: {
    position:          "absolute",
    top:               14,
    right:             14,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               3,
    backgroundColor:   "rgba(0,0,0,0.40)",
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
    zIndex:            2,
  },
  ratingLabel: { color: "#fff" },
  reviewLabel: { color: "rgba(255,255,255,0.75)" },

  center: {
    alignItems: "center",
    gap:        10,
  },
  iconCircle: {
    width:           90,
    height:          90,
    borderRadius:    45,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems:      "center",
    justifyContent:  "center",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.18,
    shadowRadius:    8,
    elevation:       6,
  },
  category: {
    color:         "rgba(255,255,255,0.85)",
    letterSpacing: 1.5,
  },

  // Owner Profile Overlap
  ownerWrapper: {
    position:       "absolute",
    bottom:         -43, // half of 86
    right:          20,
    zIndex:         10,
  },
  photoContainer: {
    borderWidth:  4,
    borderColor:  "#fff",
    borderRadius: 45, // half of 90
    shadowColor:  "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius:  8,
    elevation:     10,
  },
  ownerPhoto: {
    width:        86,
    height:       86,
    borderRadius: 43,
  },

  scrim: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    height:          40,
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: SW * 0.85,
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },
  modalPhotoRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    padding: 4,
    marginBottom: 16,
    marginTop: 8,
  },
  modalPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  modalName: {
    fontSize: 20,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    marginBottom: 20,
  },
  messageBox: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    position: "relative",
  },
  quoteIcon: {
    marginBottom: 8,
    opacity: 0.8,
  },
  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    fontStyle: "italic",
  },
  modalAction: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 15,
  },
});

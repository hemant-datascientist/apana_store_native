// ============================================================
// STORE HERO BANNER — Apana Store (Store Detail Component)
//
// Full-width colored hero with store icon, LIVE badge,
// rating chip, and store category label.
// Replaces a real photo until backend serves image URLs.
//
// 🔴 The owner photo + quote modal was removed here (2026-09). It rendered
// a randomuser.me stock photo of a random stranger, an invented name, and
// an invented first-person quote in quote marks — for EVERY real shop,
// because no backend field for owner name/photo/message exists at all.
// That's not a placeholder, it's attributing a fake photo and fake words
// to a real identifiable business. Restore only once a seller can actually
// set their own name/photo/message.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { StoreDetail } from "../../data/storeDetailData";
import { getStoreGallery } from "../../data/storeGallery";
import StoreCoverCarousel from "./StoreCoverCarousel";

const { width: SW } = Dimensions.get("window");
const HERO_H        = 220;

interface StoreHeroBannerProps {
  store: StoreDetail;
}

export default function StoreHeroBanner({ store }: StoreHeroBannerProps) {
  // All of the store's photos — cover + front/exterior/interior/surrounding
  // (the Nearby banner shows the cover; here the customer can swipe them all).
  const photos = getStoreGallery(store.id);
  const hasPhotos = photos.length > 0;

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { backgroundColor: store.heroBg }]}>

        {/* ── Swipeable cover (falls back to heroBg colour + icon) ── */}
        <StoreCoverCarousel
          photos={photos}
          heroBg={store.heroBg}
          icon={store.icon}
          category={store.category}
          height={HERO_H}
        />
        {/* Scrim keeps the badges + rating legible over photos. pointerEvents
            none so horizontal swipes reach the carousel underneath. */}
        {hasPhotos && (
          <View style={[StyleSheet.absoluteFill, styles.imageOverlay]} pointerEvents="none" />
        )}

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

        {/* ── Bottom scrim for seamless blend ── */}
        <View style={styles.scrim} />
      </View>
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
  imageOverlay: {
    backgroundColor: "rgba(0,0,0,0.40)",
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

  scrim: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    height:          40,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
});

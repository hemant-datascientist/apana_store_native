// ============================================================
// LIVE BANNERS — Apana Store (Customer App)
//
// The Home banner carousel, fed by what admin publishes in the admin panel
// (Content → Customer app) for the customer's state/city. Nothing published
// = nothing rendered: the bundled sample BANNERS are never shown (§19.8).
// A tap opens the banner's link — an in-app route or an https page.
// ============================================================

import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../../theme/useTheme";
import { useLocation } from "../../../context/LocationContext";
import { fetchLiveBanners, type LiveBanner } from "../../../services/liveCatalogService";
import type { Banner } from "../../../data/homeData";
import BannerCarousel from "./BannerCarousel";

export default function LiveBanners() {
  const { colors } = useTheme();
  const router = useRouter();
  const { selectedAddress, deviceCity } = useLocation();
  const state = selectedAddress.state || null;
  const city = deviceCity || selectedAddress.city || null;
  const [items, setItems] = useState<LiveBanner[]>([]);

  useEffect(() => {
    let alive = true;
    // A failed fetch just shows no banners — banners are never worth an error.
    fetchLiveBanners(state, city).then((b) => { if (alive) setItems(b); }).catch(() => {});
    return () => { alive = false; };
  }, [state, city]);

  if (items.length === 0) return null;

  const banners: Banner[] = items.map((i) => ({
    id: i.id,
    title: i.title,
    subtitle: i.body ?? "",
    tag: i.sponsored ? "Sponsored" : undefined,
    bg: colors.primary,
    accent: "#FFD700",
    icon: i.kind === "promotion" ? "pricetag-outline" : "megaphone-outline",
    imageUrl: i.image ? { uri: i.image } : undefined,
  }));

  function open(b: Banner) {
    const link = items.find((i) => i.id === b.id)?.link;
    if (!link) return;
    if (link.startsWith("/")) router.push(link as never);
    else if (link.startsWith("https://")) Linking.openURL(link).catch(() => {});
  }

  return <BannerCarousel banners={banners} onPress={open} />;
}

// ============================================================
// LIVE BANNERS — Apana Store (Customer App)
//
// The banner carousel, fed by what admin publishes in the admin panel
// (Content → Customer app) for this screen (placement) and the customer's
// state/city. Nothing published = nothing rendered: the bundled sample
// BANNERS are never shown (§19.8). A tap opens the banner's link — an in-app
// route or an https page. Shown banners count a view; taps count a click.
// ============================================================

import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../../theme/useTheme";
import { useLocation } from "../../../context/LocationContext";
import {
  fetchLiveBanners, recordBannerEvent, type BannerPlacement, type LiveBanner,
} from "../../../services/liveCatalogService";
import type { Banner } from "../../../data/homeData";
import BannerCarousel from "./BannerCarousel";

interface Props {
  placement?: BannerPlacement;
  category?: string | null;
  storeId?: string | null;
}

export default function LiveBanners({ placement = "home", category = null, storeId = null }: Props) {
  const { colors } = useTheme();
  const router = useRouter();
  const { selectedAddress, deviceCity, deviceCoords } = useLocation();
  const state = selectedAddress.state || null;
  const city = deviceCity || selectedAddress.city || null;
  // Where the shopper is, for banners aimed at picked areas: the address they
  // are shopping for, else this phone. Rounded to ~110 m — enough to find the
  // area, not an exact position on every request.
  const pin = Number.isFinite(selectedAddress.lat) && Number.isFinite(selectedAddress.lng)
    ? { lat: selectedAddress.lat as number, lng: selectedAddress.lng as number }
    : deviceCoords;
  const lat = pin ? Math.round(pin.lat * 1000) / 1000 : null;
  const lng = pin ? Math.round(pin.lng * 1000) / 1000 : null;
  const [items, setItems] = useState<LiveBanner[]>([]);

  useEffect(() => {
    let alive = true;
    // A failed fetch just shows no banners — banners are never worth an error.
    fetchLiveBanners({ state, city, lat, lng, placement, category, storeId })
      .then((b) => {
        if (!alive) return;
        setItems(b);
        b.forEach((i) => recordBannerEvent(i.id, "view"));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [state, city, lat, lng, placement, category, storeId]);

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
    recordBannerEvent(b.id, "click");
    const link = items.find((i) => i.id === b.id)?.link;
    if (!link) return;
    if (link.startsWith("/")) router.push(link as never);
    else if (link.startsWith("https://")) Linking.openURL(link).catch(() => {});
  }

  return <BannerCarousel banners={banners} onPress={open} />;
}

// ============================================================
// ELECTRONICS FEED — Apana Store (Home, Products > Electronics)
//
// Layout: promo banner → "Computer Electronics" section grid
//         → stores near you.
// Sub-cats: Laptops, Desktops, Printer, DSLR Camera's,
//           Headphones, Webcam, Monitors, Pendrive,
//           RAM, CPU, GPU, WiFi & Routers,
//           Keyboard & Mouse, Hard Disks & SSD,
//           Games & Software's, Skins & Mousepad
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#5F75B1";

const COMPUTER_CATS: SubCat[] = [
  { key: "laptops",    label: "Laptops",            icon: "laptop-outline",           bg: "#DBEAFE" },
  { key: "desktops",   label: "Desktops",           icon: "desktop-outline",          bg: "#EDE9FE" },
  { key: "printer",    label: "Printer",            icon: "print-outline",            bg: "#DCFCE7" },
  { key: "dslr",       label: "DSLR Camera's",      icon: "camera-outline",           bg: "#FEF3C7" },
  { key: "headphones", label: "Headphones",         icon: "headset-outline",          bg: "#FFEDD5" },
  { key: "webcam",     label: "Webcam",             icon: "videocam-outline",         bg: "#FCE7F3" },
  { key: "monitors",   label: "Monitors",           icon: "tv-outline",               bg: "#E0F2FE" },
  { key: "pendrive",   label: "Pendrive",           icon: "hardware-chip-outline",    bg: "#F3F4F6" },
  { key: "ram",        label: "RAM",                icon: "layers-outline",           bg: "#DBEAFE" },
  { key: "cpu",        label: "CPU",                icon: "hardware-chip-outline",    bg: "#FEE2E2" },
  { key: "gpu",        label: "GPU",                icon: "game-controller-outline",  bg: "#DCFCE7" },
  { key: "wifi",       label: "WiFi & Routers",     icon: "wifi-outline",             bg: "#FEF3C7" },
  { key: "keyboard",   label: "Keyboard & Mouse",   icon: "keypad-outline",           bg: "#EDE9FE" },
  { key: "storage",    label: "Hard Disks & SSD",   icon: "server-outline",           bg: "#FFEDD5" },
  { key: "games",      label: "Games & Software's", icon: "game-controller-outline",  bg: "#FCE7F3" },
  { key: "skins",      label: "Skins & Mousepad",   icon: "color-palette-outline",    bg: "#E0F2FE" },
];

export default function ElectronicsFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.electronics.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid
        title="Computer Electronics"
        subCats={COMPUTER_CATS}
        accent={ACCENT}
      />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.electronics.items}
        title={CATEGORY_FEEDS.electronics.sectionTitle}
        icon={CATEGORY_FEEDS.electronics.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}

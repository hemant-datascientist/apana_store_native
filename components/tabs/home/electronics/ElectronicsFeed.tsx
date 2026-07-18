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
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";

const ACCENT = "#5F75B1";

const COMPUTER_CATS: SubCat[] = [
  { key: "laptops",    label: "Laptops",            icon: "laptop-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_laptops.webp") },
  { key: "desktops",   label: "Desktops",           icon: "desktop-outline",          bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_desktop.webp") },
  { key: "printer",    label: "Printer",            icon: "print-outline",            bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_printer.webp") },
  { key: "dslr",       label: "DSLR Camera's",      icon: "camera-outline",           bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_dslr.webp") },
  { key: "headphones", label: "Headphones",         icon: "headset-outline",          bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_headphones.webp") },
  { key: "webcam",     label: "Webcam",             icon: "videocam-outline",         bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_webcam.webp") },
  { key: "monitors",   label: "Monitors",           icon: "tv-outline",               bg: "#E0F2FE", imageUrl: require("../../../../assets/images/category/products/home_monitors.webp") },
  { key: "pendrive",   label: "Pendrive",           icon: "hardware-chip-outline",    bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_pendrive.webp") },
  { key: "ram",        label: "RAM",                icon: "layers-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_ram.webp") },
  { key: "cpu",        label: "CPU",                icon: "hardware-chip-outline",    bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_cpu.webp") },
  { key: "gpu",        label: "GPU",                icon: "game-controller-outline",  bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_gpu.webp") },
  { key: "wifi",       label: "WiFi & Routers",     icon: "wifi-outline",             bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_wifi.webp") },
  { key: "keyboard",   label: "Keyboard & Mouse",   icon: "keypad-outline",           bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_keyboard.webp") },
  { key: "storage",    label: "Hard Disks & SSD",   icon: "server-outline",           bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_storage.webp") },
  { key: "games",      label: "Games & Software's", icon: "game-controller-outline",  bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_games.webp") },
  { key: "skins",      label: "Skins & Mousepad",   icon: "color-palette-outline",    bg: "#E0F2FE", imageUrl: require("../../../../assets/images/category/products/home_skins.webp") },
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
      <CategoryLiveProducts categoryKey="electronics" accentColor={ACCENT} />
    </View>
  );
}

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
  { key: "laptops",    label: "Laptops",            icon: "laptop-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_laptops.png") },
  { key: "desktops",   label: "Desktops",           icon: "desktop-outline",          bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_desktop.png") },
  { key: "printer",    label: "Printer",            icon: "print-outline",            bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_printer.png") },
  { key: "dslr",       label: "DSLR Camera's",      icon: "camera-outline",           bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_dslr.png") },
  { key: "headphones", label: "Headphones",         icon: "headset-outline",          bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_headphones.png") },
  { key: "webcam",     label: "Webcam",             icon: "videocam-outline",         bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_webcam.png") },
  { key: "monitors",   label: "Monitors",           icon: "tv-outline",               bg: "#E0F2FE", imageUrl: require("../../../../assets/images/category/products/home_monitors.png") },
  { key: "pendrive",   label: "Pendrive",           icon: "hardware-chip-outline",    bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_pendrive.png") },
  { key: "ram",        label: "RAM",                icon: "layers-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_ram.png") },
  { key: "cpu",        label: "CPU",                icon: "hardware-chip-outline",    bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_cpu.png") },
  { key: "gpu",        label: "GPU",                icon: "game-controller-outline",  bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_gpu.png") },
  { key: "wifi",       label: "WiFi & Routers",     icon: "wifi-outline",             bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_wifi.png") },
  { key: "keyboard",   label: "Keyboard & Mouse",   icon: "keypad-outline",           bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_keyboard.png") },
  { key: "storage",    label: "Hard Disks & SSD",   icon: "server-outline",           bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_storage.png") },
  { key: "games",      label: "Games & Software's", icon: "game-controller-outline",  bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_games.png") },
  { key: "skins",      label: "Skins & Mousepad",   icon: "color-palette-outline",    bg: "#E0F2FE", imageUrl: require("../../../../assets/images/category/products/home_skins.png") },
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

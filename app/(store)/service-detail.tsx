// ============================================================
// SERVICE DETAIL SCREEN — Apana Store (Customer App)
//
// Detailed view for a Service Provider.
// Uses shared components for UI consistency.
//
// Navigation:
//   router.push("/service-detail?id=sv1")
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { SERVICE_STORES } from "../../data/serviceStoresData";
import { StoreDetail } from "../../data/storeDetailData";

import StoreHeroBanner from "../../components/store/StoreHeroBanner";
import StoreInfoHeader from "../../components/store/StoreInfoHeader";
import StoreActionButtons from "../../components/store/StoreActionButtons";
import StoreHoursCard from "../../components/store/StoreHoursCard";
import StoreContactCard from "../../components/store/StoreContactCard";

export default function ServiceDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();

  const serviceStore = SERVICE_STORES.find(s => s.id === id) || SERVICE_STORES[0];

  // Map ServiceStore to StoreDetail format for component compatibility
  const mappedStore: StoreDetail = {
    id: serviceStore.id,
    name: serviceStore.name,
    tagline: serviceStore.ownerMessage,
    category: "Service Provider",
    icon: serviceStore.icon,
    heroBg: serviceStore.bgColor,
    address: "Sector 48, Near Metro Station",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411048",
    phone: serviceStore.phone,
    rating: serviceStore.rating,
    reviewCount: serviceStore.reviews,
    isOpen: true,
    closesAt: "9:00 PM",
    opensAt: "9:00 AM",
    isLive: true,
    lat: 18.5204,
    lng: 73.8567,
    hours: [
      { day: "Monday",    open: "9:00 AM", close: "9:00 PM" },
      { day: "Tuesday",   open: "9:00 AM", close: "9:00 PM" },
      { day: "Wednesday", open: "9:00 AM", close: "9:00 PM" },
      { day: "Thursday",  open: "9:00 AM", close: "9:00 PM" },
      { day: "Friday",    open: "9:00 AM", close: "9:00 PM" },
      { day: "Saturday",  open: "10:00 AM", close: "8:00 PM" },
      { day: "Sunday",    open: "10:00 AM", close: "2:00 PM" },
    ],
    categories: [],
    ownerName: serviceStore.ownerName,
    ownerPhoto: serviceStore.ownerPhoto,
    ownerMessage: serviceStore.ownerMessage,
    representativeTitle: "Store Owner",
  };

  const mockServices = [
    { id: "srv1", name: "Basic Consultation", price: "₹299", duration: "30 mins", icon: "clipboard-outline" },
    { id: "srv2", name: "Standard Service", price: "₹499", duration: "1 hr", icon: "construct-outline" },
    { id: "srv3", name: "Premium Package", price: "₹999", duration: "2 hrs", icon: "star-outline" },
  ];

  function handleDirection() {
    Alert.alert("Direction", "Opening maps...");
  }

  function handleBook(serviceName: string) {
    Alert.alert("Book Service", `Booking ${serviceName} at ${serviceStore.name}`);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Back button floating over hero (Exact same as store-detail) ── */}
        <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 16), backgroundColor: mappedStore.heroBg }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, {
            color:      "#fff",
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.md,
          }]}
            numberOfLines={1}
          >
            {mappedStore.name}
          </Text>

          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}
            activeOpacity={0.8}
            onPress={() => Alert.alert("Share", "Share store link coming soon.")}
          >
            <Ionicons name="share-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Hero banner ── */}
        <StoreHeroBanner store={mappedStore} />

        {/* ── Store info ── */}
        <StoreInfoHeader store={mappedStore} />

        {/* ── Action buttons ── */}
        <StoreActionButtons
          store={mappedStore}
          onDirections={handleDirection}
          onBookRide={() => {}}
        />

        {/* ── Available Services ── */}
        <View style={styles.servicesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            Available Services
          </Text>
          
          {mockServices.map((service) => (
            <View key={service.id} style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.serviceIconWrap, { backgroundColor: mappedStore.heroBg + "15" }]}>
                <Ionicons name={service.icon as any} size={24} color={mappedStore.heroBg} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceName, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                  {service.name}
                </Text>
                <Text style={[styles.serviceDuration, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                  {service.duration}
                </Text>
              </View>
              <View style={styles.serviceAction}>
                <Text style={[styles.servicePrice, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
                  {service.price}
                </Text>
                <TouchableOpacity style={[styles.bookBtn, { backgroundColor: colors.primary }]} onPress={() => handleBook(service.name)}>
                  <Text style={[styles.bookBtnText, { fontFamily: typography.fontFamily.semiBold }]}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* ── Opening hours ── */}
        <StoreHoursCard hours={mappedStore.hours} />

        {/* ── Contact info ── */}
        <StoreContactCard store={mappedStore} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerBar: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 14,
    paddingTop:        12,
    paddingBottom:     8,
  },
  backBtn: {
    width:          36,
    height:         36,
    borderRadius:   18,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex:      1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  content: {
    paddingBottom: 40,
    gap:           16,
  },
  servicesSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize:     18,
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems:    "center",
    padding:       16,
    borderRadius:  16,
    borderWidth:   1,
    marginBottom:  12,
  },
  serviceIconWrap: {
    width:          48,
    height:         48,
    borderRadius:   24,
    alignItems:     "center",
    justifyContent: "center",
    marginRight:    16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize:     16,
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 13,
  },
  serviceAction: {
    alignItems: "flex-end",
    gap:         8,
  },
  servicePrice: {
    fontSize: 16,
  },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical:   6,
    borderRadius:      8,
  },
  bookBtnText: {
    color:    "#fff",
    fontSize: 13,
  },
});

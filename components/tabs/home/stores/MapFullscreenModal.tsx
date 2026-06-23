// ============================================================
// MAP FULLSCREEN MODAL — Apana Store (Map View)
//
// Full-screen store-discovery map. Same data as the inline MapViewFeed
// (markers, pins, category filter, search) — the parent owns that state so
// both views stay in sync. Search + filter chips sit above the map; tapping
// a pin floats the store card over the bottom with a "Visit" action.
// ============================================================

import React, { useState, useRef, useCallback } from "react";
import {
  Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../../theme/useTheme";
import { typography } from "../../../../theme/typography";
import { StoreMapPin, MapCategoryFilter } from "../../../../data/nearbyMapData";
import MapplsWebView, { MapMarker, MapplsWebViewHandle } from "../../../map/MapplsWebView";
import MapSearchBar from "./MapSearchBar";

interface MapFullscreenModalProps {
  visible:       boolean;
  onClose:       () => void;
  center:        { lat: number; lng: number };
  zoom:          number;
  markers:       MapMarker[];
  pins:          StoreMapPin[];     // visible (already filtered) pins for selection lookup
  filters:       MapCategoryFilter[];
  activeCat:     string;
  onCatChange:   (key: string) => void;
  query:         string;
  onQueryChange: (q: string) => void;
  onVisit:       (id: string) => void;
}

export default function MapFullscreenModal(props: MapFullscreenModalProps) {
  const { colors, isDark } = useTheme();
  const mapRef = useRef<MapplsWebViewHandle>(null);
  const [mapH, setMapH] = useState(0);
  const [selected, setSelected] = useState<StoreMapPin | null>(null);

  const handleMarkerPress = useCallback((id: string) => {
    const pin = props.pins.find((p) => p.id === id) ?? null;
    setSelected(pin);
    if (pin) mapRef.current?.panTo(pin.lat, pin.lng);
  }, [props.pins]);

  return (
    <Modal visible={props.visible} animationType="slide" statusBarTranslucent onRequestClose={props.onClose}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>

        {/* Header: close + search */}
        <View style={styles.header}>
          <TouchableOpacity onPress={props.onClose} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <MapSearchBar value={props.query} onChangeText={props.onQueryChange} autoFocus />
        </View>

        {/* Category filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContent}>
          {props.filters.map((cf) => {
            const active = cf.key === props.activeCat;
            return (
              <TouchableOpacity
                key={cf.key}
                style={[styles.chip, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}
                onPress={() => { props.onCatChange(cf.key); setSelected(null); }}
                activeOpacity={0.8}
              >
                <Ionicons name={cf.icon as any} size={12} color={active ? "#fff" : colors.subText} />
                <Text style={[styles.chipLabel, { color: active ? "#fff" : colors.subText, fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  {cf.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Map fills the rest; info card floats over the bottom */}
        <View style={styles.mapArea} onLayout={(e) => setMapH(e.nativeEvent.layout.height)}>
          {mapH > 0 && (
            <MapplsWebView
              ref={mapRef}
              height={mapH}
              center={props.center}
              zoom={props.zoom}
              markers={props.markers}
              showUserDot
              onMarkerPress={handleMarkerPress}
              onMapPress={() => setSelected(null)}
              isDark={isDark}
            />
          )}

          {props.markers.length === 0 && (
            <View style={styles.empty} pointerEvents="none">
              <View style={[styles.emptyPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="search-outline" size={14} color={colors.subText} />
                <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  No stores match
                </Text>
              </View>
            </View>
          )}

          {selected && (
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.infoThumb, { backgroundColor: selected.iconBg }]}>
                <Ionicons name={selected.icon as any} size={24} color={selected.accentColor} />
              </View>
              <View style={styles.infoBody}>
                <Text numberOfLines={1} style={[styles.infoName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                  {selected.name}
                </Text>
                <View style={styles.infoMeta}>
                  <Ionicons name="star" size={11} color="#F59E0B" />
                  <Text style={[styles.infoMetaText, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>{selected.rating}</Text>
                  <Text style={[styles.infoMetaText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>· {selected.distanceKm} km</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.visitBtn, { backgroundColor: colors.primary }]} onPress={() => props.onVisit(selected.id)} activeOpacity={0.85}>
                <Text style={[styles.visitText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>Visit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 10 },
  iconBtn: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  chipsScroll: { flexGrow: 0 },
  chipsContent: { flexDirection: "row", gap: 8, paddingHorizontal: 14, paddingBottom: 10 },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipLabel: {},

  mapArea: { flex: 1, position: "relative" },

  empty: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  emptyPill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  emptyText: {},

  infoCard: {
    position: "absolute", left: 14, right: 14, bottom: 16,
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 12, borderRadius: 16, borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  infoThumb: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  infoBody: { flex: 1, gap: 3 },
  infoName: {},
  infoMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  infoMetaText: {},
  visitBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  visitText: { color: "#fff" },
});

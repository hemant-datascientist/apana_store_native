// ============================================================
// MAPPLS WEB VIEW — Apana Store
//
// Reusable real map component powered by MapMyIndia (Mappls)
// Map JS SDK v3, rendered inside react-native-webview.
//
// Why WebView:
//   The Mappls React Native SDK requires bare-workflow native
//   modules. react-native-webview (already installed) lets us
//   embed the Mappls Map JS SDK without any native code changes,
//   keeping the project in Expo managed workflow.
//
// Architecture:
//   • This component generates an HTML string that loads the
//     Mappls Map JS SDK from their CDN.
//   • Markers, centre, and zoom are passed as JSON into the page
//     via injectedJavaScriptBeforeContentLoaded.
//   • RN → WebView: injectJavaScript() for live marker updates.
//   • WebView → RN: window.ReactNativeWebView.postMessage() for
//     tap events (marker press, map press).
//
// TODO (when Mappls React Native SDK is production-ready):
//   Replace this component with @mappls/map-react-native-sdk.
//   The props interface (MapMarker, MapplsWebViewProps) stays
//   the same — only the render implementation changes.
//
// Props:
//   markers       — store / partner pins to show on the map
//   center        — initial lat/lng focus
//   zoom          — initial zoom level (1–18)
//   height        — pixel height of the map container
//   showUserDot   — pulse ring on the "You are here" marker
//   userLocation  — lat/lng of the device's GPS fix
//   routeLine     — [origin, destination] to draw a route arc
//   onMarkerPress — fired when a store pin is tapped
//   onMapPress    — fired when the bare map canvas is tapped
//   onMapReady    — fired once the Mappls SDK finishes loading
//   isDark        — pass isDark from useTheme() for map style
// ============================================================

import React, { useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import {
  MAPPLS_MAP_SDK_JS,
  MAPPLS_MAP_SDK_CSS,
  DEFAULT_LAT,
  DEFAULT_LNG,
  DEFAULT_ZOOM,
} from "../../config/mapplsConfig";

// ── Types ─────────────────────────────────────────────────────

export interface MapMarker {
  id:       string;
  lat:      number;
  lng:      number;
  title:    string;          // shown in popup
  subtitle?: string;         // second line in popup
  color?:   string;          // hex — tints the default pin
  icon?:    "store" | "partner" | "customer" | "pin";
  isLive?:  boolean;         // pulse animation on pin
  isOpen?:  boolean;         // closed stores get greyed pin
}

export interface MapplsWebViewHandle {
  // Imperatively update markers without re-mounting the WebView
  setMarkers: (markers: MapMarker[]) => void;
  // Smoothly pan the map to a new centre
  panTo: (lat: number, lng: number, zoom?: number) => void;
}

interface MapplsWebViewProps {
  markers?:       MapMarker[];
  center?:        { lat: number; lng: number };
  zoom?:          number;
  height:         number;
  showUserDot?:   boolean;
  userLocation?:  { lat: number; lng: number };
  routeLine?:     [{ lat: number; lng: number }, { lat: number; lng: number }];
  onMarkerPress?: (id: string) => void;
  onMapPress?:    () => void;
  onMapReady?:    () => void;
  isDark?:        boolean;
  style?:         StyleProp<ViewStyle>;
}

// ── HTML builder ──────────────────────────────────────────────
// Generates the full HTML page injected into the WebView.
// Called once on mount — subsequent updates go via injectJavaScript.

function buildMapHTML(opts: {
  sdkJsUrl:     string;
  sdkCssUrl:    string;
  centerLat:    number;
  centerLng:    number;
  zoom:         number;
  markers:      MapMarker[];
  showUserDot:  boolean;
  userLat?:     number;
  userLng?:     number;
  routeLine?:   [{ lat: number; lng: number }, { lat: number; lng: number }];
  isDark:       boolean;
}): string {
  const markersJson  = JSON.stringify(opts.markers);
  const routeJson    = opts.routeLine ? JSON.stringify(opts.routeLine) : "null";
  const mapBg        = opts.isDark ? "#0D1F35" : "#E8F4FD";
  const markerColors: Record<string, string> = {
    store:    "#0F4C81",
    partner:  "#3B82F6",
    customer: "#16A34A",
    pin:      "#EF4444",
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
  <link rel="stylesheet" href="${opts.sdkCssUrl}"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body,#map { width:100%; height:100%; background:${mapBg}; }
    /* Custom popup style */
    .mp-popup { font-family: sans-serif; min-width: 140px; }
    .mp-popup-title { font-weight:700; font-size:13px; color:#111; margin-bottom:2px; }
    .mp-popup-sub   { font-size:11px; color:#555; }
    /* Live pulse ring */
    @keyframes pulse {
      0%   { transform: scale(1);   opacity: 0.8; }
      100% { transform: scale(2.2); opacity: 0;   }
    }
    .live-ring {
      position:absolute; border-radius:50%;
      animation: pulse 1.4s ease-out infinite;
    }
  </style>
  <script src="${opts.sdkJsUrl}"></script>
</head>
<body>
  <div id="map"></div>

  <script>
    var map, userMarker, routeLayer;
    var markerMap = {};   // id → mappls.Marker instance

    // ── Colour helper ──────────────────────────────────────────
    var COLORS = ${JSON.stringify(markerColors)};

    function iconFor(m) {
      var c = COLORS[m.icon || 'pin'] || m.color || '#0F4C81';
      // Build an SVG pin as a data-URI so we don't need external images
      var svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">',
        '<circle cx="16" cy="14" r="13" fill="' + c + '" opacity="' + (m.isOpen === false ? '0.45' : '1') + '"/>',
        '<polygon points="16,40 6,22 26,22" fill="' + c + '" opacity="' + (m.isOpen === false ? '0.45' : '1') + '"/>',
        '<circle cx="16" cy="14" r="7" fill="white" opacity="0.35"/>',
        '</svg>'
      ].join('');
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    // ── Add / update markers ───────────────────────────────────
    function renderMarkers(markers) {
      // Remove old markers not in the new list
      var newIds = markers.map(function(m){ return m.id; });
      Object.keys(markerMap).forEach(function(id) {
        if (newIds.indexOf(id) === -1) {
          markerMap[id].remove();
          delete markerMap[id];
        }
      });

      markers.forEach(function(m) {
        if (!m.lat || !m.lng) return;
        var pos = { lat: m.lat, lng: m.lng };

        if (markerMap[m.id]) {
          // Update existing marker position
          markerMap[m.id].setPosition(pos);
          return;
        }

        var marker = new mappls.Marker({
          map:       map,
          position:  pos,
          fitbounds: false,
          icon: {
            url:    iconFor(m),
            width:  32,
            height: 40,
          },
          popupHtml: [
            '<div class="mp-popup">',
            '<div class="mp-popup-title">' + (m.title || '') + '</div>',
            m.subtitle ? '<div class="mp-popup-sub">' + m.subtitle + '</div>' : '',
            '</div>'
          ].join(''),
          popupOptions: { openPopup: false },
        });

        // Marker click → send id back to React Native
        marker.addListener('click', function() {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'markerPress', id: m.id })
            );
          }
        });

        markerMap[m.id] = marker;
      });
    }

    // ── Draw route line ────────────────────────────────────────
    function drawRoute(routeLine) {
      if (!routeLine) return;
      if (routeLayer) { routeLayer.remove(); routeLayer = null; }
      routeLayer = new mappls.Polyline({
        map:    map,
        path:   routeLine,
        strokeColor:   '#3B82F6',
        strokeOpacity: 0.85,
        strokeWeight:  4,
      });
    }

    // ── Add user location dot ──────────────────────────────────
    function addUserDot(lat, lng) {
      if (!lat || !lng) return;
      if (userMarker) userMarker.remove();
      userMarker = new mappls.Marker({
        map:      map,
        position: { lat: lat, lng: lng },
        fitbounds: false,
        icon: {
          url: (function(){
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">'
              + '<circle cx="12" cy="12" r="10" fill="#0F4C81" opacity="0.2"/>'
              + '<circle cx="12" cy="12" r="6"  fill="#0F4C81"/>'
              + '<circle cx="12" cy="12" r="3"  fill="white"/>'
              + '</svg>';
            return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
          })(),
          width: 24,
          height: 24,
        },
        popupHtml: '<div class="mp-popup"><div class="mp-popup-title">You are here</div></div>',
        popupOptions: { openPopup: false },
      });
    }

    // ── Listen for messages from React Native ─────────────────
    // RN calls injectJavaScript() to update the map after mount.
    document.addEventListener('message', handleRNMessage);
    window.addEventListener('message', handleRNMessage);
    function handleRNMessage(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'setMarkers') {
          renderMarkers(msg.markers);
        } else if (msg.type === 'panTo') {
          map.setCenter({ lat: msg.lat, lng: msg.lng });
          if (msg.zoom) map.setZoom(msg.zoom);
        } else if (msg.type === 'setUserLocation') {
          addUserDot(msg.lat, msg.lng);
        } else if (msg.type === 'drawRoute') {
          drawRoute(msg.route);
        }
      } catch(err) {}
    }

    // ── Map tap → notify RN ───────────────────────────────────
    function onMapClick() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapPress' }));
      }
    }

    // ── Initialise ────────────────────────────────────────────
    mappls.ready(function() {
      map = new mappls.Map('map', {
        center: { lat: ${opts.centerLat}, lng: ${opts.centerLng} },
        zoom:   ${opts.zoom},
        zoomControl: true,
        location: false,
      });

      map.addListener('load', function() {
        // Render initial markers
        renderMarkers(${markersJson});

        // User location dot
        ${opts.showUserDot && opts.userLat ? `addUserDot(${opts.userLat}, ${opts.userLng});` : ''}

        // Route line
        ${opts.routeLine ? `drawRoute(${routeJson});` : ''}

        // Map canvas click
        map.addListener('click', onMapClick);

        // Tell React Native the map is ready
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
        }
      });
    });
  </script>
</body>
</html>`;
}

// ── Component ─────────────────────────────────────────────────

const MapplsWebView = forwardRef<MapplsWebViewHandle, MapplsWebViewProps>(
  function MapplsWebView(
    {
      markers      = [],
      center,
      zoom         = DEFAULT_ZOOM,
      height,
      showUserDot  = false,
      userLocation,
      routeLine,
      onMarkerPress,
      onMapPress,
      onMapReady,
      isDark       = false,
      style,
    },
    ref,
  ) {
    const webViewRef = useRef<WebView>(null);

    const centerLat = center?.lat ?? DEFAULT_LAT;
    const centerLng = center?.lng ?? DEFAULT_LNG;

    // ── Imperative API exposed to parent ──────────────────────
    useImperativeHandle(ref, () => ({
      setMarkers(newMarkers: MapMarker[]) {
        webViewRef.current?.injectJavaScript(
          `handleRNMessage({ data: JSON.stringify({ type: 'setMarkers', markers: ${JSON.stringify(newMarkers)} }) }); true;`,
        );
      },
      panTo(lat: number, lng: number, z?: number) {
        webViewRef.current?.injectJavaScript(
          `handleRNMessage({ data: JSON.stringify({ type: 'panTo', lat: ${lat}, lng: ${lng}, zoom: ${z ?? zoom} }) }); true;`,
        );
      },
    }));

    // ── Handle messages from the WebView ──────────────────────
    const handleMessage = useCallback((e: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(e.nativeEvent.data);
        if (msg.type === "markerPress") onMarkerPress?.(msg.id);
        if (msg.type === "mapPress")    onMapPress?.();
        if (msg.type === "mapReady")    onMapReady?.();
      } catch {}
    }, [onMarkerPress, onMapPress, onMapReady]);

    // ── Build HTML once on mount ──────────────────────────────
    const html = buildMapHTML({
      sdkJsUrl:    MAPPLS_MAP_SDK_JS,
      sdkCssUrl:   MAPPLS_MAP_SDK_CSS,
      centerLat,
      centerLng,
      zoom,
      markers,
      showUserDot,
      userLat:     userLocation?.lat,
      userLng:     userLocation?.lng,
      routeLine,
      isDark,
    });

    return (
      <View style={[{ height, overflow: "hidden" }, style]}>
        <WebView
          ref={webViewRef}
          source={{ html }}
          style={StyleSheet.absoluteFill}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={[StyleSheet.absoluteFill, styles.loader]}>
              <ActivityIndicator size="large" color="#0F4C81" />
            </View>
          )}
          // Allow loading Mappls CDN resources
          mixedContentMode="always"
          allowsInlineMediaPlayback
          // Prevent the WebView itself from scrolling — the map handles pan
          scrollEnabled={false}
          bounces={false}
        />
      </View>
    );
  },
);

export default MapplsWebView;

const styles = StyleSheet.create({
  loader: {
    alignItems:     "center",
    justifyContent: "center",
    backgroundColor: "#E8F4FD",
  },
});

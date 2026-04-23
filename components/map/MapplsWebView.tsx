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
//   • Initial markers, centre, and zoom are baked into the HTML.
//   • RN → WebView: injectJavaScript() syncs marker / route /
//     user-location prop changes after mount (so parents can
//     update them reactively instead of imperatively).
//   • WebView → RN: window.ReactNativeWebView.postMessage() for
//     tap events (markerPress, mapPress), ready / error events.
//
// Robustness:
//   • SDK-load error handler (network / bad key / CDN down).
//   • 12 s in-page init timeout — fires mapError if Mappls never
//     finishes booting (e.g. invalid REST key).
//   • 15 s RN-side timeout — parent notified via onMapError.
//   • Pending-action queue inside the page — any RN → WebView
//     messages that arrive before the map is ready are buffered
//     and replayed once `mappls.ready` fires.
//   • Guarded render functions — no crash if `map` is undefined.
//
// TODO (when Mappls React Native SDK is production-ready):
//   Replace this component with @mappls/map-react-native-sdk.
//   The props interface (MapMarker, MapplsWebViewProps) stays
//   the same — only the render implementation changes.
//
// Props:
//   markers       — store / partner pins (auto-syncs on change)
//   center        — initial lat/lng focus (only applied on mount;
//                   use panTo() imperatively for runtime changes)
//   zoom          — initial zoom level (1–18)
//   height        — pixel height of the map container
//   showUserDot   — render the "You are here" marker
//   userLocation  — lat/lng of the device's GPS fix
//   routeLine     — [origin, destination] route (auto-syncs)
//   onMarkerPress — fired when a store pin is tapped
//   onMapPress    — fired when the bare map canvas is tapped
//   onMapReady    — fired once the Mappls SDK finishes loading
//   onMapError    — fired if the SDK fails to load in time
//   isDark        — pass isDark from useTheme() for map style
// ============================================================

import React, {
  useRef, useState, useCallback, useEffect,
  useMemo, forwardRef, useImperativeHandle,
} from "react";
import {
  View, StyleSheet, ActivityIndicator,
  StyleProp, ViewStyle,
} from "react-native";
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
  id:        string;
  lat:       number;
  lng:       number;
  title:     string;          // shown in popup
  subtitle?: string;          // second line in popup
  color?:    string;          // hex — tints the default pin
  icon?:     "store" | "partner" | "customer" | "pin";
  isLive?:   boolean;         // reserved for future pulse animation
  isOpen?:   boolean;         // closed stores get a greyed pin
}

export interface MapplsWebViewHandle {
  // Imperatively update markers without re-mounting the WebView
  setMarkers: (markers: MapMarker[]) => void;
  // Smoothly pan the map to a new centre
  panTo:      (lat: number, lng: number, zoom?: number) => void;
  // Draw / redraw a route line between two coords
  drawRoute:  (route: Array<{ lat: number; lng: number }>) => void;
}

interface MapplsWebViewProps {
  markers?:       MapMarker[];
  center?:        { lat: number; lng: number };
  zoom?:          number;
  height:         number;
  showUserDot?:   boolean;
  userLocation?:  { lat: number; lng: number };
  routeLine?:     Array<{ lat: number; lng: number }>;
  onMarkerPress?: (id: string) => void;
  onMapPress?:    () => void;
  onMapReady?:    () => void;
  onMapError?:    (reason: string) => void;
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
  routeLine?:   Array<{ lat: number; lng: number }>;
  isDark:       boolean;
}): string {
  const markersJson = JSON.stringify(opts.markers || []);
  const routeJson   = opts.routeLine ? JSON.stringify(opts.routeLine) : "null";
  const mapBg       = opts.isDark ? "#0D1F35" : "#E8F4FD";
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
    /* Popup style */
    .mp-popup { font-family: sans-serif; min-width: 140px; }
    .mp-popup-title { font-weight:700; font-size:13px; color:#111; margin-bottom:2px; }
    .mp-popup-sub   { font-size:11px; color:#555; }
  </style>

  <!-- Preamble: set up global error handler BEFORE SDK loads so
       the <script onerror> hook below can call it. -->
  <script>
    (function(){
      window._mapplsErrored = false;
      window.handleSdkError = function(reason) {
        if (window._mapplsErrored) return;
        window._mapplsErrored = true;
        if (window.ReactNativeWebView) {
          try {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'mapError', reason: reason || 'sdk_error' })
            );
          } catch(e) {}
        }
      };
    })();
  </script>

  <!-- Mappls Map JS SDK (CDN). onerror fires if the CDN is down
       or the REST key is invalid. -->
  <script src="${opts.sdkJsUrl}" onerror="handleSdkError('cdn_load_failed')"></script>
</head>
<body>
  <div id="map"></div>

  <script>
    // ── State ────────────────────────────────────────────────
    var map             = null;
    var userMarker      = null;
    var routeLayer      = null;
    var markerMap       = {};            // id → mappls.Marker
    var mapInitialized  = false;         // set once 'load' fires or fallback runs
    var pendingActions  = [];            // RN → WebView messages queued before init
    var COLORS          = ${JSON.stringify(markerColors)};

    // ── Helpers ──────────────────────────────────────────────
    function postToRN(msg) {
      if (window.ReactNativeWebView) {
        try { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); } catch(e) {}
      }
    }

    function iconFor(m) {
      var c   = COLORS[m.icon || 'pin'] || m.color || '#0F4C81';
      var dim = (m.isOpen === false) ? '0.45' : '1';
      var svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">',
          '<circle cx="16" cy="14" r="13" fill="' + c + '" opacity="' + dim + '"/>',
          '<polygon points="16,40 6,22 26,22" fill="' + c + '" opacity="' + dim + '"/>',
          '<circle cx="16" cy="14" r="7" fill="white" opacity="0.35"/>',
        '</svg>'
      ].join('');
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    // ── Marker rendering ─────────────────────────────────────
    function renderMarkers(markers) {
      if (!map || !markers) return;

      // Remove stale markers
      var keep = {};
      markers.forEach(function(m){ if (m && m.id) keep[m.id] = true; });
      Object.keys(markerMap).forEach(function(id) {
        if (!keep[id]) {
          try { markerMap[id].remove && markerMap[id].remove(); } catch(e) {}
          delete markerMap[id];
        }
      });

      // Add / update
      markers.forEach(function(m) {
        if (!m || !m.lat || !m.lng) return;
        var pos = { lat: m.lat, lng: m.lng };

        if (markerMap[m.id]) {
          try { markerMap[m.id].setPosition && markerMap[m.id].setPosition(pos); } catch(e) {}
          return;
        }

        try {
          var marker = new mappls.Marker({
            map:       map,
            position:  pos,
            fitbounds: false,
            icon: { url: iconFor(m), width: 32, height: 40 },
            popupHtml: [
              '<div class="mp-popup">',
                '<div class="mp-popup-title">' + (m.title || '') + '</div>',
                m.subtitle ? '<div class="mp-popup-sub">' + m.subtitle + '</div>' : '',
              '</div>'
            ].join(''),
            popupOptions: { openPopup: false },
          });

          if (marker && marker.addListener) {
            marker.addListener('click', function() {
              postToRN({ type: 'markerPress', id: m.id });
            });
          }

          markerMap[m.id] = marker;
        } catch(e) {}
      });
    }

    // ── Route line ───────────────────────────────────────────
    function drawRoute(routeLine) {
      if (!map || !routeLine || !routeLine.length) return;

      if (routeLayer) {
        try { routeLayer.remove && routeLayer.remove(); } catch(e) {}
        routeLayer = null;
      }

      // Accept both [{lat,lng}] and [[lat,lng]] formats
      var path = routeLine.map(function(p) {
        return Array.isArray(p) ? { lat: p[0], lng: p[1] } : p;
      });

      try {
        routeLayer = new mappls.Polyline({
          map:           map,
          paths:         path,
          strokeColor:   '#3B82F6',
          strokeOpacity: 0.85,
          strokeWeight:  4,
        });
      } catch(e) {}
    }

    // ── User location dot ────────────────────────────────────
    function addUserDot(lat, lng) {
      if (!map || !lat || !lng) return;
      if (userMarker) {
        try { userMarker.remove && userMarker.remove(); } catch(e) {}
      }
      try {
        userMarker = new mappls.Marker({
          map:       map,
          position:  { lat: lat, lng: lng },
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
            width:  24,
            height: 24,
          },
          popupHtml:    '<div class="mp-popup"><div class="mp-popup-title">You are here</div></div>',
          popupOptions: { openPopup: false },
        });
      } catch(e) {}
    }

    // ── Action dispatcher ────────────────────────────────────
    function executeAction(msg) {
      if (!msg || !map) return;
      if (msg.type === 'setMarkers')      renderMarkers(msg.markers);
      else if (msg.type === 'panTo') {
        try {
          map.setCenter({ lat: msg.lat, lng: msg.lng });
          if (msg.zoom) map.setZoom(msg.zoom);
        } catch(e) {}
      }
      else if (msg.type === 'setUserLocation') addUserDot(msg.lat, msg.lng);
      else if (msg.type === 'drawRoute')       drawRoute(msg.route);
    }

    // Called from RN via injectJavaScript. If the map isn't ready
    // yet, queue the message and replay when initialisation finishes.
    function handleRNMessage(e) {
      try {
        var msg = JSON.parse(e.data);
        if (!mapInitialized) { pendingActions.push(msg); return; }
        executeAction(msg);
      } catch(err) {}
    }
    window.handleRNMessage = handleRNMessage;

    // ── Map canvas tap → notify RN ───────────────────────────
    function onMapClick() {
      postToRN({ type: 'mapPress' });
    }

    // ── Init sequence ────────────────────────────────────────
    function finishInit() {
      if (mapInitialized) return;
      mapInitialized = true;

      // Initial markers baked into the HTML on mount
      renderMarkers(${markersJson});

      // User dot (if provided at mount)
      ${opts.showUserDot && opts.userLat && opts.userLng
        ? `addUserDot(${opts.userLat}, ${opts.userLng});`
        : ''}

      // Route line (if provided at mount)
      ${opts.routeLine ? `drawRoute(${routeJson});` : ''}

      // Map tap listener
      try { map.addListener('click', onMapClick); } catch(e) {}

      // Replay any RN messages that arrived before init
      var queued = pendingActions.slice();
      pendingActions = [];
      queued.forEach(executeAction);

      postToRN({ type: 'mapReady' });
    }

    // Mappls' SDK bootstrap defines window.mappls asynchronously
    // (it fetches sub-modules after the first script runs), so we
    // poll for it instead of failing immediately.
    function waitForMappls(cb, attempts) {
      attempts = attempts || 0;
      if (typeof mappls !== 'undefined' && typeof mappls.Map === 'function') {
        cb();
        return;
      }
      if (attempts > 150) {           // 150 × 100 ms = 15 s
        handleSdkError('mappls_undefined');
        return;
      }
      setTimeout(function(){ waitForMappls(cb, attempts + 1); }, 100);
    }

    function buildMap() {
      try {
        map = new mappls.Map('map', {
          center:      { lat: ${opts.centerLat}, lng: ${opts.centerLng} },
          zoom:        ${opts.zoom},
          zoomControl: true,
          location:    false,
        });

        // 'load' isn't reliably fired across all Mappls SDK
        // versions, so set a short fallback timer too.
        var loadFallback = setTimeout(finishInit, 1500);
        try {
          map.addListener('load', function() {
            clearTimeout(loadFallback);
            finishInit();
          });
        } catch(e) { /* rely on fallback */ }
      } catch(e) {
        handleSdkError('map_construct_failed: ' + (e && e.message ? e.message : ''));
      }
    }

    function initMap() {
      waitForMappls(function() {
        // mappls.ready is the canonical "SDK is fully usable" hook.
        // Some SDK versions fire it synchronously, others after a tick.
        try {
          if (typeof mappls.ready === 'function') {
            mappls.ready(buildMap);
          } else {
            buildMap();
          }
        } catch(e) {
          handleSdkError('ready_failed: ' + (e && e.message ? e.message : ''));
        }
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMap);
    } else {
      initMap();
    }

    // In-page init timeout — notifies RN if the map never finishes
    // booting (invalid REST key, rate-limited, silent failure).
    // Generous because waitForMappls itself can take up to 15 s.
    setTimeout(function() {
      if (!mapInitialized) handleSdkError('init_timeout');
    }, 25000);
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
      onMapError,
      isDark       = false,
      style,
    },
    ref,
  ) {
    const webViewRef          = useRef<WebView>(null);
    const [mapReady, setReady] = useState(false);
    const [hasErrored, setErr] = useState(false);

    const centerLat = center?.lat ?? DEFAULT_LAT;
    const centerLng = center?.lng ?? DEFAULT_LNG;

    // ── Imperative API exposed to parent ──────────────────────
    // Kept for backward compatibility — but the prop-driven
    // auto-sync below means callers usually don't need this.
    useImperativeHandle(ref, () => ({
      setMarkers(newMarkers: MapMarker[]) {
        webViewRef.current?.injectJavaScript(
          `window.handleRNMessage({ data: JSON.stringify({ type: 'setMarkers', markers: ${JSON.stringify(newMarkers)} }) }); true;`,
        );
      },
      panTo(lat: number, lng: number, z?: number) {
        webViewRef.current?.injectJavaScript(
          `window.handleRNMessage({ data: JSON.stringify({ type: 'panTo', lat: ${lat}, lng: ${lng}, zoom: ${z ?? zoom} }) }); true;`,
        );
      },
      drawRoute(route: Array<{ lat: number; lng: number }>) {
        webViewRef.current?.injectJavaScript(
          `window.handleRNMessage({ data: JSON.stringify({ type: 'drawRoute', route: ${JSON.stringify(route)} }) }); true;`,
        );
      },
    }), [zoom]);

    // ── Messages from the WebView ─────────────────────────────
    const handleMessage = useCallback((e: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(e.nativeEvent.data);
        if (msg.type === "markerPress") onMarkerPress?.(msg.id);
        else if (msg.type === "mapPress")  onMapPress?.();
        else if (msg.type === "mapReady")  { setReady(true); onMapReady?.(); }
        else if (msg.type === "mapError")  {
          setErr(true);
          onMapError?.(msg.reason || "Map could not be loaded.");
        }
      } catch {}
    }, [onMarkerPress, onMapPress, onMapReady, onMapError]);

    // ── Auto-sync markers prop → map ──────────────────────────
    // Stringify as a key so React re-runs only on meaningful changes.
    const markersKey = useMemo(() => JSON.stringify(markers), [markers]);
    useEffect(() => {
      if (!mapReady) return;
      webViewRef.current?.injectJavaScript(
        `window.handleRNMessage({ data: JSON.stringify({ type: 'setMarkers', markers: ${markersKey} }) }); true;`,
      );
    }, [markersKey, mapReady]);

    // ── Auto-sync routeLine prop → map ────────────────────────
    const routeKey = useMemo(() => JSON.stringify(routeLine ?? null), [routeLine]);
    useEffect(() => {
      if (!mapReady || !routeLine) return;
      webViewRef.current?.injectJavaScript(
        `window.handleRNMessage({ data: JSON.stringify({ type: 'drawRoute', route: ${routeKey} }) }); true;`,
      );
    }, [routeKey, mapReady, routeLine]);

    // ── Auto-sync userLocation prop → map ─────────────────────
    useEffect(() => {
      if (!mapReady || !showUserDot || !userLocation) return;
      webViewRef.current?.injectJavaScript(
        `window.handleRNMessage({ data: JSON.stringify({ type: 'setUserLocation', lat: ${userLocation.lat}, lng: ${userLocation.lng} }) }); true;`,
      );
    }, [userLocation?.lat, userLocation?.lng, showUserDot, mapReady]);

    // ── RN-side hard timeout ──────────────────────────────────
    // Belt-and-braces: if in-page init timeout never fires (e.g.
    // the WebView itself froze), notify the parent after 15 s.
    useEffect(() => {
      if (mapReady || hasErrored) return;
      const t = setTimeout(() => {
        if (!mapReady && !hasErrored) {
          setErr(true);
          onMapError?.("Map is taking too long to load — check your connection.");
        }
      }, 28000);
      return () => clearTimeout(t);
    }, [mapReady, hasErrored, onMapError]);

    // ── Build HTML once on mount ──────────────────────────────
    const html = useMemo(
      () => buildMapHTML({
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
      }),
      // NOTE: HTML is intentionally built once per mount. Changes
      // to markers / routeLine / userLocation flow through the
      // auto-sync useEffects above, not by rebuilding the HTML.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    return (
      <View style={[{ height, overflow: "hidden" }, style]}>
        <WebView
          ref={webViewRef}
          source={{ html }}
          style={StyleSheet.absoluteFill}
          onMessage={handleMessage}
          // WebView-level failure (network, blank page, SSL etc.)
          onError={(e) => {
            setErr(true);
            onMapError?.("WebView error: " + (e.nativeEvent?.description || "unknown"));
          }}
          onHttpError={(e) => {
            setErr(true);
            onMapError?.("HTTP error " + (e.nativeEvent?.statusCode || "?"));
          }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={[StyleSheet.absoluteFill, styles.loader]}>
              <ActivityIndicator size="large" color="#0F4C81" />
            </View>
          )}
          // Allow loading Mappls CDN resources over mixed content
          mixedContentMode="always"
          allowsInlineMediaPlayback
          // Prevent the WebView itself from scrolling — the map handles pan
          scrollEnabled={false}
          bounces={false}
          // Android: improve touch responsiveness for Mappls interactions
          androidLayerType="hardware"
        />
      </View>
    );
  },
);

export default MapplsWebView;

const styles = StyleSheet.create({
  loader: {
    alignItems:      "center",
    justifyContent:  "center",
    backgroundColor: "#E8F4FD",
  },
});

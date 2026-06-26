// ============================================================
// deviceMeta — auto-captured signup analytics.
//
// Platform/OS/app/device are NEVER asked of the user. The OS reports the
// platform; expo-device reports brand/model/os-version; expo-application
// reports the app version. State is resolved separately from the GPS area
// chain (location_db), and the §30 referrer is attached at the call site —
// neither belongs to the device, so neither lives here.
//
// Every field is null-safe: simulator / web / missing values return null
// instead of throwing. This payload is ANALYTICS ONLY — it is client-reported
// and therefore must NEVER be treated by the server as an auth or trust
// signal (§19.8 honest data).
// ============================================================

import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Application from "expo-application";

export interface DeviceMeta {
  signup_platform: string; // "android" | "ios" | "web"
  signup_os_version: string | null; // "14"
  signup_app_version: string | null; // "1.0.0"
  signup_brand: string | null; // "samsung"
  signup_model: string | null; // "SM-G991B"
}

// Snapshot the device/app context once, at signup. Pure read, no side effects.
export function getDeviceMeta(): DeviceMeta {
  return {
    signup_platform: Platform.OS,
    signup_os_version: Device.osVersion ?? null,
    signup_app_version: Application.nativeApplicationVersion ?? null,
    signup_brand: Device.brand ?? null,
    signup_model: Device.modelName ?? null,
  };
}

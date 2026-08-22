// ============================================================
// TOAST — a brief message that does not block what the user is doing.
//
// WHY THIS EXISTS: OPTIMISTIC UI NEEDS A VISIBLE ROLLBACK
// ------------------------------------------------------
// Optimistic updates apply instantly and reconcile later. When the server
// refuses, the UI silently snaps back — the user sees a flicker and is
// told nothing. That is the same silent-failure class as a swallowed
// catch: the app knew the action failed and chose not to say so.
//
// An Alert is the wrong tool for it — it is modal, it interrupts, and a
// rolled-back "mark as read" does not deserve a dialog. A toast states
// what happened and gets out of the way.
//
// Use Alert (not this) when the user MUST acknowledge — money, deletion,
// anything they would need to retry deliberately.
// ============================================================

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from "react-native-reanimated";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export type ToastTone = "info" | "success" | "error";

interface ToastOptions {
  tone?: ToastTone;
  /** Milliseconds on screen. Errors default longer — they need reading. */
  duration?: number;
  /** An optional single action, e.g. "Undo" / "Retry". */
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  show: (message: string, options?: ToastOptions) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ActiveToast extends ToastOptions {
  message: string;
  /** Distinguishes two identical messages in a row, so the second re-animates. */
  id: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const translateY = useSharedValue(120);
  const opacity = useSharedValue(0);

  const clearTimer = useCallback(() => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
  }, []);

  const hide = useCallback(() => {
    clearTimer();
    opacity.value = withTiming(0, { duration: 160 });
    translateY.value = withTiming(120, { duration: 200, easing: Easing.in(Easing.quad) }, (done) => {
      // Unmount only AFTER the exit animation, or the toast vanishes
      // instantly and the animation is never seen.
      if (done) runOnJS(setToast)(null);
    });
  }, [clearTimer, opacity, translateY]);

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    clearTimer();
    nextId.current += 1;
    setToast({ message, id: nextId.current, ...options });
    translateY.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.quad) });
    opacity.value = withTiming(1, { duration: 180 });
    // Errors sit longer: "couldn't save" needs to be read, "saved" does not.
    const ms = options.duration ?? (options.tone === "error" ? 4500 : 2600);
    timer.current = setTimeout(() => hide(), ms);
  }, [clearTimer, hide, opacity, translateY]);

  useEffect(() => clearTimer, [clearTimer]);

  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const tone = toast?.tone ?? "info";
  const accent =
    tone === "success" ? colors.success
    : tone === "error" ? colors.danger
    : colors.primary;
  const icon: keyof typeof Ionicons.glyphMap =
    tone === "success" ? "checkmark-circle"
    : tone === "error" ? "alert-circle"
    : "information-circle";

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {toast && (
        <Animated.View
          style={[styles.wrap, animated]}
          pointerEvents="box-none"
          accessibilityLiveRegion="polite"
        >
          <View style={[styles.toast, { backgroundColor: colors.card, borderColor: accent + "55" }]}>
            <Ionicons name={icon} size={18} color={accent} />
            <Text style={[styles.message, { color: colors.text }]} numberOfLines={3}>
              {toast.message}
            </Text>
            {toast.actionLabel && toast.onAction && (
              <TouchableOpacity
                onPress={() => { toast.onAction?.(); hide(); }}
                hitSlop={8}
              >
                <Text style={[styles.action, { color: accent }]}>{toast.actionLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

/**
 * Never throws when the provider is missing — a toast is feedback, and a
 * missing provider must not crash the screen that was only trying to
 * explain itself. It degrades to a no-op.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx) return ctx;
  return { show: () => {}, hide: () => {} };
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    // Above the tab bar so it never covers the thing the user is about to
    // tap next.
    bottom: 92,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    width: "100%",
    // Readable over any content underneath.
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  message: { flex: 1, fontSize: typography.size.sm, fontFamily: typography.fontFamily.medium, lineHeight: 19 },
  action:  { fontSize: typography.size.sm, fontFamily: typography.fontFamily.bold },
});

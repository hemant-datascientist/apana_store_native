// ============================================================
// GET STARTED — Apana Store (Customer App)
//
// First screen new users see. Shows app branding + onboarding slides.
//
// Actions:
//   "Get Started"        → /login
//   "Skip, browse guest" → main tabs as guest
//
// Components: HeroSection, OnboardingSlide, DotIndicators, BottomActions
// Data:       ONBOARDING_SLIDES from data/onboardingData.ts
// ============================================================

import React, { useRef, useState } from "react";
import {
  View, ScrollView, StyleSheet, StatusBar, Dimensions,
} from "react-native";
import { useRouter }          from "expo-router";
import useTheme               from "../../theme/useTheme";
import { useAuth }            from "../../context/AuthContext";
import { useLocation }        from "../../context/LocationContext";
import { ONBOARDING_SLIDES }  from "../../data/onboardingData";
import HeroSection            from "../../components/onboarding/HeroSection";
import OnboardingSlide        from "../../components/onboarding/OnboardingSlide";
import DotIndicators          from "../../components/onboarding/DotIndicators";
import BottomActions          from "../../components/onboarding/BottomActions";

const { width: SW } = Dimensions.get("window");

export default function GetStartedScreen() {
  const router          = useRouter();
  const { colors }        = useTheme();
  const { locationReady } = useLocation();

  const [slideIdx, setSlideIdx] = useState(0);
  const scrollRef               = useRef<ScrollView>(null);

  // ── Sync active dot with scroll position ──────────────────────
  function handleSlideChange(e: any) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    setSlideIdx(idx);
  }

  // Skips the ONBOARDING SLIDES, not the account. It used to call
  // skipAsGuest() and drop straight into the app with no session — which is
  // how a home screen appeared without anyone logging in, and why Profile had
  // no name or number to show.
  function handleSkip() {
    router.replace("/(auth)/login");
  }

  function handleGetStarted() {
    router.push("/login");
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.card }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Dark-blue hero (logo + skip) ── */}
      <HeroSection onSkip={handleSkip} />

      {/* ── Paging slides ── */}
      <View style={styles.slides}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSlideChange}
        >
          {ONBOARDING_SLIDES.map((slide, i) => (
            <OnboardingSlide key={i} slide={slide} width={SW} />
          ))}
        </ScrollView>

        {/* ── Dot page indicators ── */}
        <DotIndicators total={ONBOARDING_SLIDES.length} activeIdx={slideIdx} />
      </View>

      {/* ── CTA buttons + terms ── */}
      <BottomActions onGetStarted={handleGetStarted} onSkip={handleSkip} />
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  slides: { flex: 1 },
});

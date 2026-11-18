// ============================================================
// DetailFAQ — Brand FAQ section
//
// Matches Amazon "Customer Questions & Answers" / Flipkart Product FAQ:
// - Expandable accordion items with smooth chevron indicators
// - Shows ONLY the FAQs the brand entered; none entered = section hidden
// ============================================================

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import { brandFAQs } from "./brandContent";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  badge?: string;
}

interface DetailFAQProps {
  attributes?: Record<string, unknown>;
}

export default function DetailFAQ({
  attributes,
}: DetailFAQProps) {
  const { colors, isDark } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs = brandFAQs(attributes);
  if (!faqs || faqs.length === 0) return null;

  function toggleExpand(id: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Ionicons name="chatbubbles-outline" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            Frequently Asked Questions
          </Text>
        </View>
        <View style={[styles.badgePill, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }]}>
          <Text style={[styles.badgeText, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
            From the brand
          </Text>
        </View>
      </View>

      {/* Accordion List */}
      <View style={styles.list}>
        {faqs.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <View
              key={item.id}
              style={[
                styles.faqCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isExpanded ? colors.primary : colors.border,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.questionRow}
                onPress={() => toggleExpand(item.id)}
              >
                <View style={styles.qTextWrap}>
                  <Text style={[styles.qIcon, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
                    Q.
                  </Text>
                  <Text
                    style={[
                      styles.questionText,
                      { color: colors.text, fontFamily: typography.fontFamily.semiBold },
                    ]}
                  >
                    {item.question}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.subText}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={[styles.answerWrap, { borderTopColor: colors.border }]}>
                  <View style={styles.aTextWrap}>
                    <Text style={[styles.aIcon, { color: colors.success, fontFamily: typography.fontFamily.bold }]}>
                      A.
                    </Text>
                    <Text
                      style={[
                        styles.answerText,
                        { color: colors.text, fontFamily: typography.fontFamily.regular },
                      ]}
                    >
                      {item.answer}
                    </Text>
                  </View>
                  {item.badge && (
                    <View style={styles.tagWrap}>
                      <Text style={[styles.tagText, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
                        Tag: {item.badge}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10.5,
  },
  list: {
    gap: 10,
  },
  faqCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    gap: 10,
  },
  qTextWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
  },
  qIcon: {
    fontSize: 14,
    lineHeight: 20,
  },
  questionText: {
    fontSize: typography.size.sm,
    lineHeight: 20,
    flex: 1,
  },
  answerWrap: {
    borderTopWidth: 1,
    padding: 14,
    backgroundColor: "transparent",
  },
  aTextWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  aIcon: {
    fontSize: 14,
    lineHeight: 20,
  },
  answerText: {
    fontSize: typography.size.sm,
    lineHeight: 20,
    flex: 1,
  },
  tagWrap: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  tagText: {
    fontSize: 10,
  },
});

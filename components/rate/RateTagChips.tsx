// ============================================================
// RATE TAG CHIPS — Apana Store
//
// Quick-select feedback chips shown below the star rating.
// Customer can pick multiple tags. Selected chips get a
// primary-colored filled background.
// Tags adapt to the star rating: positive tags for 4-5 stars,
// mixed/negative tags shown for 1-3 stars.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface Tag {
  key:   string;
  label: string;
}

// ── Positive tags (4–5 stars) ─────────────────────────────
const POSITIVE_TAGS: Tag[] = [
  { key: "fast",      label: "⚡ Fast & Smooth"    },
  { key: "easy",      label: "🛒 Easy to Use"       },
  { key: "deals",     label: "💰 Great Deals"        },
  { key: "local",     label: "🏪 Great Local Stores" },
  { key: "trust",     label: "🤝 Trustworthy"        },
  { key: "delivery",  label: "📦 Quick Delivery"     },
  { key: "design",    label: "🎨 Beautiful Design"   },
  { key: "recommend", label: "👍 Would Recommend"    },
];

// ── Constructive tags (1–3 stars) ─────────────────────────
const CONSTRUCTIVE_TAGS: Tag[] = [
  { key: "slow",      label: "🐢 Feels Slow"         },
  { key: "bugs",      label: "🐛 Found Bugs"          },
  { key: "confusing", label: "😕 Confusing UI"        },
  { key: "fewstores", label: "🏪 Need More Stores"    },
  { key: "delivery",  label: "📦 Slow Delivery"       },
  { key: "payment",   label: "💳 Payment Issues"      },
  { key: "crash",     label: "💥 App Crashes"         },
  { key: "improve",   label: "🔧 Needs Improvement"   },
];

interface RateTagChipsProps {
  rating:   number;
  selected: string[];
  onToggle: (key: string) => void;
}

export default function RateTagChips({ rating, selected, onToggle }: RateTagChipsProps) {
  const { colors } = useTheme();

  // ── Choose tag set based on sentiment ────────────────────
  const tags = rating >= 4 ? POSITIVE_TAGS : CONSTRUCTIVE_TAGS;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
        {rating >= 4 ? "What do you love? (optional)" : "What can we improve? (optional)"}
      </Text>

      <View style={styles.chips}>
        {tags.map(tag => {
          const isSelected = selected.includes(tag.key);
          return (
            <TouchableOpacity
              key={tag.key}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary          : colors.card,
                  borderColor:     isSelected ? colors.primary          : colors.border,
                },
              ]}
              onPress={() => onToggle(tag.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, {
                color:      isSelected ? "#fff" : colors.text,
                fontFamily: isSelected ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                fontSize:   typography.size.xs,
              }]}>
                {tag.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:  { gap: 10 },
  label: {},

  chips: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical:   7,
    borderRadius:      20,
    borderWidth:       1,
  },
  chipText: {},
});

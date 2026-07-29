// ============================================================
// DetailClassification — the product's Apana Product Classification (§27).
//
// Shows the human class/family names + the raw APC codes so a customer (or a
// third-party scanner) can see exactly how the item is classified. Resolves the
// names from the live taxonomy (getClasses / getFamilies); if a name can't be
// resolved it still shows the code — never a blank. Renders nothing when the
// listing carries no class (honest, §19.8). Theme + typography tokens only.
// ============================================================

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import { getClasses, getFamilies } from "../../../services/apc";

interface Props {
  classCode: string | null;
  familyCode: string | null;
  varietyCode: string | null;
}

// "APC-10-FASH-FOOTWEAR" → "FOOTWEAR" — a readable leaf when no name resolves.
function tailLabel(code: string): string {
  const tail = code.split("-").pop() ?? code;
  return tail.charAt(0) + tail.slice(1).toLowerCase();
}

export default function DetailClassification({ classCode, familyCode, varietyCode }: Props) {
  const { colors } = useTheme();
  const [className, setClassName] = useState<string | null>(null);
  const [classEmoji, setClassEmoji] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!classCode) return;
    getClasses()
      .then((cs) => {
        if (!alive) return;
        const c = cs.find((x) => x.code === classCode);
        setClassName(c?.name ?? null);
        setClassEmoji(c?.icon_emoji ?? null);
      })
      .catch(() => {});
    if (familyCode) {
      getFamilies(classCode)
        .then((fs) => { if (alive) setFamilyName(fs.find((f) => f.code === familyCode)?.name ?? null); })
        .catch(() => {});
    }
    return () => { alive = false; };
  }, [classCode, familyCode]);

  if (!classCode) return null;

  const rows: { label: string; name: string; code: string }[] = [
    { label: "Class", name: className ?? tailLabel(classCode), code: classCode },
  ];
  if (familyCode) rows.push({ label: "Family", name: familyName ?? tailLabel(familyCode), code: familyCode });
  if (varietyCode) rows.push({ label: "Type", name: tailLabel(varietyCode), code: varietyCode });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.head}>
        <Ionicons name="pricetags-outline" size={15} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
          Apana Classification
        </Text>
        {classEmoji ? <Text style={styles.emoji}>{classEmoji}</Text> : null}
      </View>

      {rows.map((r, i) => (
        <View
          key={r.code}
          style={[styles.row, i < rows.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
        >
          <Text style={[styles.rLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>{r.label}</Text>
          <View style={styles.rRight}>
            <Text style={[styles.rName, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]} numberOfLines={1}>{r.name}</Text>
            <View style={[styles.codePill, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.code, { color: colors.primary, fontFamily: typography.fontFamily.medium }]}>{r.code}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginTop: 14, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4 },
  head: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10 },
  title: { fontSize: typography.size.sm, flex: 1 },
  emoji: { fontSize: typography.size.md },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, paddingVertical: 10 },
  rLabel: { fontSize: typography.size.xs },
  rRight: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 },
  rName: { fontSize: typography.size.xs, flexShrink: 1 },
  codePill: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  code: { fontSize: typography.size.ss, letterSpacing: 0.3 },
});

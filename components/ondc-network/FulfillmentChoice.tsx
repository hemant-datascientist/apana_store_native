// How the order reaches the customer: the legs the shop's app offered in on_select —
// delivery (maybe in a time slot) or pickup at the shop. Shown only when there is a choice.
// The chosen leg's id goes with the final-bill request (init).
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { NetworkOrder } from "../../services/ondcNetworkService";

export type OrderLeg = NetworkOrder["fulfillments"][number];

/** The legs a customer can order on (delivery or pickup), in the shop's order. */
export function orderableLegs(order: NetworkOrder): OrderLeg[] {
  return order.fulfillments.filter((f) => f.id && (f.type === "Delivery" || f.type === "Self-Pickup"));
}

/** The chosen leg, or the shop's first delivery, or (pickup-only shop) its pickup. */
export function chosenLeg(order: NetworkOrder, id: string | null): OrderLeg | null {
  const legs = orderableLegs(order);
  return legs.find((f) => f.id === id) ?? legs.find((f) => f.type === "Delivery") ?? legs[0] ?? null;
}

/** ISO 8601 duration as words (PT15M -> "15 min", P2D -> "2 days"); null when unreadable. */
function durationText(iso: string | null): string | null {
  const m = iso ? /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(iso) : null;
  if (!m) return null;
  const [d, h, min] = [m[1], m[2], m[3]].map(Number);
  if (d) return `${d} day${d > 1 ? "s" : ""}`;
  if (h) return `${h} hr`;
  return min ? `${min} min` : null;
}

const time = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

function legLabel(f: OrderLeg): { title: string; sub: string | null } {
  if (f.type === "Self-Pickup") return { title: "Pick up at the shop", sub: durationText(f.tat) };
  if (f.slot) return { title: `Deliver ${time(f.slot.start)} – ${time(f.slot.end)}`, sub: new Date(f.slot.start).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) };
  return { title: f.category ?? "Deliver to me", sub: durationText(f.tat) };
}

interface FulfillmentChoiceProps { order: NetworkOrder; chosenId: string | null; onChange: (id: string) => void }

export default function FulfillmentChoice({ order, chosenId, onChange }: FulfillmentChoiceProps) {
  const { colors } = useTheme();
  const legs = orderableLegs(order);
  if (legs.length < 2) return null;
  const current = chosenLeg(order, chosenId);
  return (
    <View style={styles.wrap}>
      {legs.map((f) => {
        const on = f.id === current?.id;
        const { title, sub } = legLabel(f);
        return (
          <TouchableOpacity key={f.id!} onPress={() => onChange(f.id!)} style={[styles.chip, { borderColor: on ? colors.primary : colors.border }]}>
            <Text style={[styles.label, { color: on ? colors.primary : colors.text }]}>{title}</Text>
            {sub ? <Text style={[styles.sub, { color: colors.subText }]}>{sub}</Text> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { flexGrow: 1, flexBasis: "45%", borderWidth: 1, borderRadius: 12, padding: 10, alignItems: "center" },
  label: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm },
  sub: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs },
});

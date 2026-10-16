// ============================================================
// NOTIFICATION TARGET — where a tapped notification goes.
//
// Admin broadcasts carry data.link (an in-app route or an https page); order
// notices carry data.order_id. Anything else opens nothing — the row is only
// marked read. Links are re-checked here even though admin validates them: an
// inbox row is data, and "javascript:" or "//host" must never be followed.
// ============================================================

export type NotifTarget =
  | { kind: "route"; path: string }
  | { kind: "url"; url: string }
  | null;

export function notifTarget(type: string, data: Record<string, unknown> | null | undefined): NotifTarget {
  const link = typeof data?.link === "string" ? data.link.trim() : "";
  if (link.startsWith("/") && !link.startsWith("//")) return { kind: "route", path: link };
  if (link.startsWith("https://")) return { kind: "url", url: link };

  const orderId = typeof data?.order_id === "string" ? data.order_id : "";
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return null;
  if (type === "order_message") {
    const invoice = typeof data?.invoice_display === "string" ? data.invoice_display : "";
    return { kind: "route", path: `/order-chat?orderId=${orderId}&invoice=${encodeURIComponent(invoice)}` };
  }
  // Tracking needs the basket the checkout built; history can open any order.
  return { kind: "route", path: "/order-history" };
}

// ============================================================
// RIDERS SERVICE — Apana Store (Customer App, Auto Riders)
//
// 🔴 THIS INVENTED DRIVERS AND PLACED THEM AROUND THE REAL CUSTOMER.
//
// It returned `mockRidersAround(lat, lng)` in EVERY mode — a deterministic
// fleet of named people with vehicle registration numbers ("Ramesh Pawar,
// MH 12 AB 4821, 4.8★, 2140 rides") positioned a few hundred metres from
// wherever the customer actually was, drawn on a real map. The old comment
// called the mock "the only honest source" while no endpoint existed. That
// is backwards: no source means show nothing (§19.8). A customer could
// reasonably have gone outside looking for that auto.
//
// Apana has no ride system at all — no booking endpoint, no ride tasks
// (taskBridge hardcodes `type: "delivery"`), and no partner location feed
// for Ride-mode partners. So there are no riders to return.
//
// Backend contract, for when one exists (§19.4 heartbeats feed it):
//   GET {API_BASE_URL}/riders/nearby?lat=&lng=&k=2
//   → { riders: [{ id, name, vehicle_class, vehicle_no, rating,
//                  rides_done, lat, lng }] }
// Implement fetchLive below and the screen needs no change.
// ============================================================

import type { Rider } from "../data/ridersData";

export interface FetchRidersParams {
  lat: number;
  lng: number;
}

/** True once a real /riders/nearby exists. The screen reads this to explain
 *  an empty list as "Apana runs no rides" rather than "none nearby". */
export const RIDES_LIVE = false;

export async function fetchNearbyRiders(_p: FetchRidersParams): Promise<Rider[]> {
  // Empty, not a mock fleet. An invented driver on a real map is the one
  // thing this file must never produce again.
  return [];
}

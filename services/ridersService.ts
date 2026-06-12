// ============================================================
// RIDERS SERVICE — Apana Store (Customer App, Auto Riders)
//
// Live riders near the customer, all three Partner Ride classes.
//
// Backend contract (swap target — §19.4 partner heartbeats feed it):
//   GET {API_BASE_URL}/riders/nearby?lat=&lng=&k=2
//   → { riders: [{ id, name, vehicle_class, vehicle_no, rating,
//                  rides_done, lat, lng }] }
//   Server resolves the customer's H3 hot cell → K-ring → online Ride-mode
//   partners in those cells (§19.6 pattern, same as nearby stores).
//
// V1 is frontend-first MOCK in every mode (same precedent as §19.5
// useMockPartnerFix): the partner-location pipeline (WS /ws/tracking)
// doesn't exist yet, so there is no honest live source. The mock fleet
// is deterministic around the customer position — stable, not random.
// Swapping = implement fetchLive + flip MOCK_ONLY.
// ============================================================

import { Rider, mockRidersAround } from "../data/ridersData";

const MOCK_ONLY = true; // flip when GET /riders/nearby exists (§19.4/§8)

export interface FetchRidersParams {
  lat: number;
  lng: number;
}

function fetchMock(p: FetchRidersParams): Rider[] {
  return mockRidersAround(p.lat, p.lng);
}

export async function fetchNearbyRiders(p: FetchRidersParams): Promise<Rider[]> {
  if (MOCK_ONLY) return fetchMock(p);
  // fetchLive lands with the §8 partner pipeline; until then the mock is
  // the only honest source (no endpoint to call).
  return fetchMock(p);
}

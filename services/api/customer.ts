// ============================================================
// CUSTOMER API — typed wrappers around openapi-fetch client
//
// One thin function per endpoint. Returns typed { data, error }
// already destructured from openapi-fetch's response.
//
// All wrappers are AUTO-AUTHED by the middleware in ./client.ts —
// no need to pass headers manually.
//
// Pattern:
//   const { data, error } = await getAddresses();
//   if (error) handleError(error);
//   else use(data);
// ============================================================

import { api } from "./client";
import type { components } from "../../types/api";

// Convenience type aliases for screens (avoid deep `components["schemas"]…` paths)
export type AddressOut    = components["schemas"]["AddressOut"];
export type AddressCreate = components["schemas"]["AddressCreate"];
export type AddressUpdate = components["schemas"]["AddressUpdate"];
export type CartOut       = components["schemas"]["CartOut"];
export type CartItemAdd   = components["schemas"]["CartItemAdd"];
export type OrderOut      = components["schemas"]["OrderOut"];
export type OrderListOut  = components["schemas"]["OrderListOut"];
export type LoginRequest  = components["schemas"]["LoginRequest"];
export type LoginResponse = components["schemas"]["LoginResponse"];

// ────────────────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────────────────

export async function login(body: LoginRequest) {
  return api.POST("/auth/login", { body });
}

// ────────────────────────────────────────────────────────────
// Addresses
// ────────────────────────────────────────────────────────────

export async function getAddresses() {
  return api.GET("/addresses");
}

export async function createAddress(body: AddressCreate) {
  return api.POST("/addresses", { body });
}

export async function updateAddress(addressId: string, body: AddressUpdate) {
  return api.PUT("/addresses/{address_id}", {
    params: { path: { address_id: addressId } },
    body,
  });
}

export async function deleteAddress(addressId: string) {
  return api.DELETE("/addresses/{address_id}", {
    params: { path: { address_id: addressId } },
  });
}

export async function setDefaultAddress(addressId: string) {
  return api.POST("/addresses/{address_id}/default", {
    params: { path: { address_id: addressId } },
  });
}

// ────────────────────────────────────────────────────────────
// Cart
// ────────────────────────────────────────────────────────────

export async function getCart() {
  return api.GET("/cart");
}

export async function addCartItem(body: CartItemAdd) {
  return api.POST("/cart/items", { body });
}

export async function clearCart() {
  return api.DELETE("/cart");
}

// ────────────────────────────────────────────────────────────
// Orders
// ────────────────────────────────────────────────────────────

export async function listMyOrders(query?: { status?: string; page?: number; limit?: number }) {
  return api.GET("/orders", { params: { query: query ?? {} } });
}

export async function getMyOrder(orderId: string) {
  return api.GET("/orders/{order_id}", {
    params: { path: { order_id: orderId } },
  });
}

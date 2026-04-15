import { http, authHeaders } from "./http";

export async function updateRestaurantSettings(ownerToken, payload) {
  const { data } = await http.put("/ownerauth/restaurant-settings", payload, {
    headers: authHeaders(ownerToken),
  });
  return data;
}

export async function fetchOwnerSalesSummary(ownerToken) {
  const { data } = await http.get("/orders/summary", {
    headers: authHeaders(ownerToken),
  });
  return data;
}

import { http } from "./http";

function adminHeaders(key) {
  return {
    "Content-Type": "application/json",
    "x-admin-key": key,
  };
}

export async function adminListCoupons(adminKey) {
  const { data } = await http.get("/api/admin/coupons", { headers: adminHeaders(adminKey) });
  return data;
}

export async function adminCreateCoupon(adminKey, payload) {
  const { data } = await http.post("/api/admin/coupons", payload, {
    headers: adminHeaders(adminKey),
  });
  return data;
}

export async function adminUpdateCoupon(adminKey, id, payload) {
  const { data } = await http.put(`/api/admin/coupons/${id}`, payload, {
    headers: adminHeaders(adminKey),
  });
  return data;
}

export async function adminDeleteCoupon(adminKey, id) {
  const { data } = await http.delete(`/api/admin/coupons/${id}`, {
    headers: adminHeaders(adminKey),
  });
  return data;
}

export async function adminListRestaurants(adminKey) {
  const { data } = await http.get("/api/admin/restaurants", {
    headers: adminHeaders(adminKey),
  });
  return data;
}

export async function adminSetRestaurantActive(adminKey, id, isActive) {
  const { data } = await http.patch(
    `/api/admin/restaurants/${id}`,
    { isActive },
    { headers: adminHeaders(adminKey) }
  );
  return data;
}

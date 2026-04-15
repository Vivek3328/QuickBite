import { http } from "./http";

export async function validateCouponApi({ code, subtotal }) {
  const { data } = await http.post("/api/coupons/validate", { code, subtotal });
  return data;
}

import { http, authHeaders } from "./http";

export async function getRazorpayKey() {
  const { data } = await http.get("/getkey");
  return data;
}

export async function checkoutOrder(userToken, body) {
  const { data } = await http.post("/orders/checkout", body, {
    headers: authHeaders(userToken),
  });
  return data;
}

export async function fetchUserOrders(userToken) {
  const { data } = await http.get("/orders/userorders", {
    headers: authHeaders(userToken),
  });
  return data;
}

export async function fetchRestaurantOrders(ownerToken) {
  const { data } = await http.get("/orders/myorders", {
    headers: authHeaders(ownerToken),
  });
  return data;
}

export async function updateOrderStatus(ownerToken, orderId, payload) {
  const { data } = await http.put(`/orders/updateorder/${orderId}`, payload, {
    headers: authHeaders(ownerToken),
  });
  return data;
}

import { http, authHeaders } from "./http";

export async function fetchAddresses(userToken) {
  const { data } = await http.get("/api/addresses", {
    headers: authHeaders(userToken),
  });
  return data;
}

export async function createAddress(userToken, payload) {
  const { data } = await http.post("/api/addresses", payload, {
    headers: authHeaders(userToken),
  });
  return data;
}

export async function updateAddress(userToken, id, payload) {
  const { data } = await http.put(`/api/addresses/${id}`, payload, {
    headers: authHeaders(userToken),
  });
  return data;
}

export async function deleteAddress(userToken, id) {
  const { data } = await http.delete(`/api/addresses/${id}`, {
    headers: authHeaders(userToken),
  });
  return data;
}

import { http, authHeaders } from "./http";

export async function fetchCurrentUser(userToken) {
  const { data } = await http.get("/userauth/me", {
    headers: authHeaders(userToken),
  });
  return data;
}

export async function updateUserProfile(userToken, payload) {
  const { data } = await http.put("/userauth/me", payload, {
    headers: authHeaders(userToken),
  });
  return data;
}

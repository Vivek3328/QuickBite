import { http, authHeaders } from "./http";

export async function fetchFavorites(userToken) {
  const { data } = await http.get("/api/favorites", {
    headers: authHeaders(userToken),
  });
  return data;
}

export async function addFavorite(userToken, ownerId) {
  const { data } = await http.post(
    "/api/favorites",
    { ownerId },
    { headers: authHeaders(userToken) }
  );
  return data;
}

export async function removeFavorite(userToken, ownerId) {
  const { data } = await http.delete(`/api/favorites/${ownerId}`, {
    headers: authHeaders(userToken),
  });
  return data;
}

export async function checkFavorite(userToken, ownerId) {
  const { data } = await http.get(`/api/favorites/${ownerId}/check`, {
    headers: authHeaders(userToken),
  });
  return data;
}

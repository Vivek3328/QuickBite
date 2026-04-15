import { http } from "./http";

/**
 * Public discovery (no auth). Supports search, diet, cuisine, sort, pagination.
 */
export async function getRestaurants(params = {}) {
  const { data } = await http.get("/api/restaurants", { params });
  return data;
}

export async function getRestaurant(id) {
  const { data } = await http.get(`/api/restaurants/${id}`);
  return data;
}

export async function getRestaurantReviews(ownerId, params = {}) {
  const { data } = await http.get(`/api/restaurants/${ownerId}/reviews`, { params });
  return data;
}

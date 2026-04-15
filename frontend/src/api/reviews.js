import { http, authHeaders } from "./http";

export async function createReview(userToken, payload) {
  const { data } = await http.post("/api/reviews", payload, {
    headers: authHeaders(userToken),
  });
  return data;
}

import { http } from "./http";

export async function registerUser(payload) {
  const { data } = await http.post("/userauth/registeruser", payload);
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await http.post("/userauth/loginuser", { email, password });
  return data;
}

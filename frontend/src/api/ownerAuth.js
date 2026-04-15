import { http } from "./http";

export async function fetchAllOwners() {
  const { data } = await http.get("/ownerauth/fetchallowner");
  return data;
}

export async function loginOwner({ email, password }) {
  const { data } = await http.post("/ownerauth/loginowner", { email, password });
  return data;
}

export async function registerOwner(payload) {
  const { data } = await http.post("/ownerauth/registerowner", payload);
  return data;
}

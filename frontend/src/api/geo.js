import axios from "axios";

const BASE = "https://countriesnow.space/api/v0.1";

export async function fetchIndiaStates() {
  const { data } = await axios.post(`${BASE}/countries/states`, {
    country: "India",
  });
  return data?.data?.states ?? [];
}

export async function fetchStateCities(stateName) {
  const { data } = await axios.post(`${BASE}/countries/state/cities`, {
    country: "India",
    state: stateName,
  });
  return data?.data ?? [];
}

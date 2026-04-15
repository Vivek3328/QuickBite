import axios from "axios";
import { apiBaseUrl } from "@/config/env";

export const http = axios.create({
  baseURL: apiBaseUrl,
});

export function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { "auth-token": token } : {}),
  };
}

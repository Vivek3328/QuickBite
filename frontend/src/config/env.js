/** Trim so accidental spaces in .env don't break axios baseURL. */
export const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL ?? "").trim();

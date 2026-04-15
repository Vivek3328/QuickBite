/** Deterministic display helpers when the API has no ETA/rating fields yet. */

export function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function stableRating(id) {
  const h = hashString(String(id));
  return (4 + (h % 10) / 10).toFixed(1);
}

export function etaRange(id) {
  const h = hashString(String(id));
  const start = 18 + (h % 22);
  return { label: `${start}–${start + 8} min`, start };
}

export function distanceKm(id) {
  const h = hashString(String(id));
  return ((h % 45) / 10 + 0.3).toFixed(1);
}

export function priceHint(id) {
  const h = hashString(String(id));
  const tier = h % 3;
  if (tier === 0) return "₹200 for two";
  if (tier === 1) return "₹400 for two";
  return "₹600 for two";
}

export function showPromo(id) {
  return hashString(String(id)) % 4 === 0;
}

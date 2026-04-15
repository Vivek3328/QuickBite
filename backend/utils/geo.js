/** Earth radius in km */
const R = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine distance between two WGS84 points in kilometers.
 */
function distanceKm(lat1, lng1, lat2, lng2) {
  if (
    [lat1, lng1, lat2, lng2].some(
      (x) => typeof x !== "number" || Number.isNaN(x)
    )
  ) {
    return null;
  }
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = { distanceKm };

import { useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiMapPin } from "react-icons/fi";
import { ROUTES } from "@/constants/routes";
import {
  distanceKm,
  etaRange,
  priceHint,
  showPromo,
  stableRating,
} from "@/utils/restaurantDisplay";

const vegBadge = {
  veg: { label: "Pure veg", className: "bg-emerald-600" },
  "non-veg": { label: "Non-veg", className: "bg-rose-600" },
};

export function RestaurantCard({ id, image, name, foodtype, restaurantType }) {
  const [imgOk, setImgOk] = useState(true);
  const rating = stableRating(id);
  const eta = etaRange(id);
  const km = distanceKm(id);
  const price = priceHint(id);
  const promo = showPromo(id);
  const typeKey = restaurantType === "veg" ? "veg" : "non-veg";
  const badge = vegBadge[typeKey] ?? vegBadge["non-veg"];

  return (
    <Link
      to={ROUTES.restaurant(id)}
      className="group surface-card flex overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      <div className="relative h-36 w-32 shrink-0 overflow-hidden sm:h-40 sm:w-36">
        {imgOk && image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-200 via-brand-100 to-ink-200"
            aria-hidden
          >
            <span className="font-display text-2xl font-bold text-brand-800/40">
              {name?.slice(0, 1) ?? "?"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent opacity-80" />
        {promo && (
          <span className="absolute left-2 top-2 rounded-md bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            Offer
          </span>
        )}
        <span
          className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-snug text-ink-900 line-clamp-2 group-hover:text-brand-700 sm:text-lg">
              {name}
            </h3>
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 ring-1 ring-amber-100">
              {rating}
              <span className="text-amber-600" aria-hidden>
                ★
              </span>
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-ink-500">{foodtype}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-600">
          <span className="inline-flex items-center gap-1">
            <FiClock className="h-3.5 w-3.5 text-brand-600" aria-hidden />
            {eta.label}
          </span>
          <span className="inline-flex items-center gap-1">
            <FiMapPin className="h-3.5 w-3.5 text-brand-600" aria-hidden />
            {km} km
          </span>
          <span className="font-medium text-ink-700">{price}</span>
        </div>
      </div>
    </Link>
  );
}

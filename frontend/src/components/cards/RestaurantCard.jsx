import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function RestaurantCard({ id, image, name, foodtype, rating, avgPrice }) {
  return (
    <article className="group surface-card overflow-hidden transition hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink-800 shadow-sm backdrop-blur">
          {rating || "4.5"} ★
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-ink-900 transition group-hover:text-brand-700">
          {name}
        </h3>
        <p className="mt-1 text-sm text-ink-500">{foodtype}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <Link to={ROUTES.restaurant(id)} className="btn-primary !py-2.5 !text-sm">
            View menu
          </Link>
          <p className="text-right text-sm font-medium text-ink-600">
            From ₹{avgPrice || "—"}
          </p>
        </div>
      </div>
    </article>
  );
}

import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = (props) => {
  return (
    <article className="group surface-card overflow-hidden transition hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={props.image}
          alt={props.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink-800 shadow-sm backdrop-blur">
          {props.rating || "4.5"} ★
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-ink-900 transition group-hover:text-brand-700">
          {props.name}
        </h3>
        <p className="mt-1 text-sm text-ink-500">{props.foodtype}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <Link
            to={`/restaurant/${props.id}`}
            className="btn-primary !py-2.5 !text-sm"
          >
            View menu
          </Link>
          <p className="text-right text-sm font-medium text-ink-600">
            From ₹{props.avgPrice || "—"}
          </p>
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import { setTotalItems } from "@/store/cartSlice";
import { STORAGE_KEYS } from "@/constants/storage";

function itemInCart(cart, id) {
  return cart.some((c) => c._id === id);
}

function formatPrice(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

export function ItemCard({
  image,
  name,
  price,
  description,
  item,
  ownerId,
  isOutOfStock,
  isVeg,
  prepTimeMin,
}) {
  const dispatch = useDispatch();
  const totalItems = useSelector((state) => state.cart.totalItems);
  const [imgOk, setImgOk] = useState(true);

  const addToCart = (newItem, oid) => {
    if (isOutOfStock) {
      toast.error("This item is out of stock");
      return;
    }
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cartItems)) || [];

    if (cart.length === 0) {
      cart.push({ ...newItem, owner: oid });
      dispatch(setTotalItems(totalItems + 1));
      toast.success("Added to cart");
    } else {
      const existingOwnerId = cart[0].owner;

      if (existingOwnerId !== oid) {
        cart = [{ ...newItem, owner: oid }];
        dispatch(setTotalItems(1));
        toast.success("Cart updated for this restaurant");
      } else if (itemInCart(cart, newItem._id)) {
        toast.error("Already in cart");
        return;
      } else {
        cart.push({ ...newItem, owner: oid });
        dispatch(setTotalItems(totalItems + 1));
        toast.success("Added to cart");
      }
    }
    localStorage.setItem(STORAGE_KEYS.cartItems, JSON.stringify(cart));
  };

  return (
    <article className="surface-card flex gap-4 overflow-hidden p-4 transition hover:border-brand-200/80 hover:shadow-md sm:gap-5 sm:p-5">
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-ink-900 sm:text-lg">
            {name}
          </h3>
          {isVeg !== false ? (
            <span className="rounded border border-emerald-600 px-1 text-[10px] font-bold leading-none text-emerald-700">
              Veg
            </span>
          ) : (
            <span className="rounded border border-rose-600 px-1 text-[10px] font-bold leading-none text-rose-700">
              Non-veg
            </span>
          )}
          {prepTimeMin != null ? (
            <span className="inline-flex items-center gap-0.5 text-xs text-ink-500">
              <FiClock className="h-3.5 w-3.5" aria-hidden />
              ~{prepTimeMin} min
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {description}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-bold tabular-nums text-ink-900 sm:text-xl">
            {formatPrice(price)}
          </p>
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => addToCart(item, ownerId)}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand-600 bg-white px-5 py-2 text-sm font-bold text-brand-700 shadow-sm transition hover:bg-brand-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-ink-200 disabled:bg-ink-100 disabled:text-ink-400"
            aria-label={isOutOfStock ? `${name} unavailable` : `Add ${name} to cart`}
          >
            <FiPlus className="h-4 w-4" aria-hidden />
            {isOutOfStock ? "Out of stock" : "Add"}
          </button>
        </div>
      </div>

      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-ink-100 sm:h-32 sm:w-32">
        {imgOk && image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 via-ink-100 to-brand-50"
            aria-hidden
          >
            <span className="font-display text-3xl font-bold text-brand-700/35">
              {name?.slice(0, 1) ?? "?"}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

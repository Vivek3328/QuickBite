import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiMapPin,
  FiSearch,
  FiSliders,
} from "react-icons/fi";
import { getRestaurant } from "@/api/restaurants";
import { fetchRestoMenu } from "@/api/menu";
import { useAuth } from "@/context/AuthContext";
import { ItemCard } from "@/components/cards/ItemCard";
import {
  MenuItemRowSkeleton,
  MenuPageHeroSkeleton,
} from "@/components/ui/Skeleton";
import { ROUTES } from "@/constants/routes";
import { distanceKm, etaRange } from "@/utils/restaurantDisplay";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const { userToken } = useAuth();
  const [owner, setOwner] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recommended");
  const [menuDiet, setMenuDiet] = useState("all");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [menuData, detail] = await Promise.all([
          fetchRestoMenu(id, userToken),
          getRestaurant(id),
        ]);
        if (cancelled) return;
        setMenuItems(menuData);
        setOwner(detail.restaurant ?? null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, userToken]);

  const filteredItems = useMemo(() => {
    let list = [...menuItems];
    if (menuDiet === "veg") {
      list = list.filter((i) => i.isVeg !== false);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((i) => {
        const name = (i.itemname || "").toLowerCase();
        const desc = (i.description || "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name":
        return list.sort((a, b) =>
          (a.itemname || "").localeCompare(b.itemname || "", undefined, {
            sensitivity: "base",
          })
        );
      default:
        return list;
    }
  }, [menuItems, search, sort, menuDiet]);

  const eta = owner ? etaRange(owner._id) : null;
  const km = owner ? distanceKm(owner._id) : null;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="surface-card border-red-100 bg-red-50 p-8 text-red-800">
          <p className="font-semibold">Could not load this menu</p>
          <p className="mt-2 text-sm">{error}</p>
          <Link to={ROUTES.home} className="btn-primary mt-6 inline-flex">
            Back to restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(251,146,60,0.12),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 pt-4 sm:px-6 lg:max-w-4xl lg:px-8">
        <Link
          to={ROUTES.home}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-brand-700"
        >
          <FiArrowLeft className="h-4 w-4" aria-hidden />
          All restaurants
        </Link>

        {loading ? (
          <MenuPageHeroSkeleton />
        ) : (
          <header className="overflow-hidden rounded-3xl border border-ink-100/80 bg-ink-900 shadow-card">
            <div className="relative aspect-[21/9] min-h-[140px] sm:aspect-[3/1] sm:min-h-[180px]">
              {owner?.image ? (
                <img
                  src={owner.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-amber-600"
                  aria-hidden
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/50 to-ink-900/20" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {owner?.name ?? "Restaurant"}
                </h1>
                {owner?.foodtype ? (
                  <p className="mt-1 text-sm font-medium text-brand-100 sm:text-base">
                    {owner.foodtype}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-200 sm:text-sm">
                  {owner?.address ? (
                    <span className="inline-flex max-w-full items-start gap-1.5">
                      <FiMapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-300"
                        aria-hidden
                      />
                      <span className="leading-snug">{owner.address}</span>
                    </span>
                  ) : null}
                  {eta && km ? (
                    <span className="inline-flex items-center gap-1.5">
                      <FiClock className="h-4 w-4 text-brand-300" aria-hidden />
                      {eta.label}
                      <span className="text-ink-400">·</span>
                      {km} km
                    </span>
                  ) : null}
                </div>
                {owner?.restaurantType ? (
                  <span
                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${
                      owner.restaurantType === "veg"
                        ? "bg-emerald-600/90"
                        : "bg-rose-600/90"
                    }`}
                  >
                    {owner.restaurantType === "veg" ? "Pure veg kitchen" : "Non-veg kitchen"}
                  </span>
                ) : null}
              </div>
            </div>
          </header>
        )}

        <div className="sticky top-[4.25rem] z-30 -mx-4 mt-8 border-b border-ink-100/80 bg-ink-50/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto max-w-3xl lg:max-w-4xl">
            <div className="relative">
              <FiSearch
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes…"
                className="input-field w-full rounded-2xl border-ink-200/80 py-3 pl-11 pr-4 text-base shadow-sm"
                autoComplete="off"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Dish type">
                {[
                  { id: "all", label: "All dishes" },
                  { id: "veg", label: "Veg only" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMenuDiet(f.id)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                      menuDiet === f.id
                        ? "bg-ink-900 text-white shadow-sm"
                        : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-brand-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-600">
                {!loading && (
                  <>
                    <span className="font-semibold text-ink-800">{filteredItems.length}</span>
                    {filteredItems.length === 1 ? " dish" : " dishes"}
                    {search.trim() ? " match" : ""}
                  </>
                )}
              </p>
              <div className="relative">
                <FiSliders
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                  aria-hidden
                />
                <label htmlFor="menu-sort" className="sr-only">
                  Sort menu
                </label>
                <select
                  id="menu-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-field appearance-none rounded-xl py-2 pl-9 pr-8 text-sm font-medium"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name: A–Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-3xl space-y-3 lg:max-w-4xl">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <MenuItemRowSkeleton key={index} />
              ))
            : filteredItems.map((item) => (
                <ItemCard
                  key={item._id}
                  image={item.image}
                  name={item.itemname}
                  price={item.price}
                  description={item.description}
                  item={item}
                  ownerId={id}
                  isOutOfStock={Boolean(item.isOutOfStock)}
                  isVeg={item.isVeg !== false}
                  prepTimeMin={item.prepTimeMin}
                />
              ))}
        </div>

        {!loading && menuItems.length === 0 && (
          <div className="surface-card mt-8 border-dashed border-ink-200 px-6 py-14 text-center">
            <p className="font-display text-lg font-semibold text-ink-900">No dishes yet</p>
            <p className="mt-2 text-sm text-ink-600">
              This restaurant hasn&apos;t added items to the menu.
            </p>
            <Link to={ROUTES.home} className="btn-secondary mt-6 inline-flex">
              Pick another place
            </Link>
          </div>
        )}

        {!loading && menuItems.length > 0 && filteredItems.length === 0 && (
          <div className="surface-card mt-8 border-dashed border-ink-200 px-6 py-12 text-center">
            <p className="font-semibold text-ink-900">No dishes match your search</p>
            <p className="mt-2 text-sm text-ink-600">Try a different name or clear the search box.</p>
            <button type="button" onClick={() => setSearch("")} className="btn-secondary mt-6">
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

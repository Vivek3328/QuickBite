import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiSliders } from "react-icons/fi";
import { fetchAllOwners } from "@/api/ownerAuth";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { RestaurantCardSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { stableRating } from "@/utils/restaurantDisplay";
import backgroundImage from "@/assets/home.jpg";

const DIET_FILTERS = [
  { id: "all", label: "All" },
  { id: "veg", label: "Veg" },
  { id: "non-veg", label: "Non-veg" },
];

function extractCuisineTags(foodtype) {
  if (!foodtype || typeof foodtype !== "string") return [];
  return foodtype
    .split(/[,/&]| and /i)
    .map((s) => s.trim())
    .filter(Boolean);
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { userToken } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState("all");
  const [cuisine, setCuisine] = useState(null);
  const [sort, setSort] = useState("recommended");

  const isLoggedIn = Boolean(userToken);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAllOwners();
        if (!cancelled) setRestaurants(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const cuisineOptions = useMemo(() => {
    const set = new Set();
    for (const r of restaurants) {
      for (const tag of extractCuisineTags(r.foodtype)) {
        set.add(tag);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b)).slice(0, 14);
  }, [restaurants]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = restaurants.filter((r) => {
      if (diet === "veg" && r.restaurantType !== "veg") return false;
      if (diet === "non-veg" && r.restaurantType !== "non-veg") return false;
      if (cuisine) {
        const tags = extractCuisineTags(r.foodtype).map((t) => t.toLowerCase());
        if (!tags.some((t) => t.includes(cuisine.toLowerCase()))) return false;
      }
      if (!q) return true;
      const hay = [
        r.name,
        r.foodtype,
        r.address,
        String(r.pincode ?? ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    if (sort === "rating") {
      list = [...list].sort(
        (a, b) => Number(stableRating(b._id)) - Number(stableRating(a._id))
      );
    }

    return list;
  }, [restaurants, search, diet, cuisine, sort]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="surface-card border-red-100 bg-red-50 p-8 text-red-800">
          <p className="font-semibold">Could not load restaurants</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isLoggedIn ? (
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,146,60,0.15),transparent)]"
            aria-hidden
          />
          <section
            id="restaurants"
            className="relative mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8"
          >
            <header className="animate-fade-up">
              <p className="text-sm font-medium text-brand-700">
                {greeting()} — what are we eating?
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Restaurants
              </h1>
              <p className="mt-2 max-w-xl text-ink-600">
                Search by name or cuisine, filter by diet, and open a menu in one tap.
              </p>
            </header>

            <div className="sticky top-[4.25rem] z-30 -mx-4 border-b border-ink-100/80 bg-ink-50/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="relative">
                <FiSearch
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400"
                  aria-hidden
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search restaurants, cuisines, area…"
                  className="input-field w-full rounded-2xl border-ink-200/80 py-3 pl-11 pr-4 text-base shadow-sm"
                  autoComplete="off"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Diet">
                  {DIET_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setDiet(f.id)}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                        diet === f.id
                          ? "bg-ink-900 text-white shadow-sm"
                          : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-brand-50"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <label className="sr-only" htmlFor="sort-restaurants">
                    Sort order
                  </label>
                  <div className="relative">
                    <FiSliders
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                      aria-hidden
                    />
                    <select
                      id="sort-restaurants"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="input-field appearance-none rounded-xl py-2 pl-9 pr-8 text-sm font-medium"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="rating">Rating: high to low</option>
                    </select>
                  </div>
                </div>
              </div>

              {cuisineOptions.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => setCuisine(null)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                      cuisine === null
                        ? "bg-brand-600 text-white shadow-sm"
                        : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-brand-50"
                    }`}
                  >
                    All cuisines
                  </button>
                  {cuisineOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCuisine((prev) => (prev === c ? null : c))}
                      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                        cuisine === c
                          ? "bg-brand-600 text-white shadow-sm"
                          : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-brand-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-6 text-sm text-ink-500">
              {!loading && (
                <>
                  <span className="font-semibold text-ink-800">{filtered.length}</span>
                  {filtered.length === 1 ? " place" : " places"}
                  {search.trim() || diet !== "all" || cuisine
                    ? " match your filters"
                    : " to explore"}
                </>
              )}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <RestaurantCardSkeleton key={index} />
                  ))
                : filtered.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant._id}
                      id={restaurant._id}
                      image={restaurant.image}
                      name={restaurant.name}
                      foodtype={restaurant.foodtype}
                      restaurantType={restaurant.restaurantType}
                    />
                  ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="surface-card border-dashed border-ink-200 bg-white/80 px-6 py-14 text-center">
                <p className="font-display text-lg font-semibold text-ink-900">
                  No restaurants match
                </p>
                <p className="mt-2 text-sm text-ink-600">
                  Try a different search, clear cuisine, or switch the diet filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDiet("all");
                    setCuisine(null);
                  }}
                  className="btn-secondary mt-6"
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900/85 via-ink-900/70 to-brand-900/60" />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
            <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.2em] text-brand-200">
              Food delivery, simplified
            </p>
            <h1 className="animate-fade-up mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Order from great restaurants in a few taps
            </h1>
            <p className="animate-fade-up mt-6 max-w-xl text-lg text-ink-200">
              Sign in to explore menus, build your cart, and pay securely. Restaurant
              partners can list a kitchen in minutes.
            </p>
            <div className="animate-fade-up mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to={ROUTES.login}
                className="btn-primary min-w-[200px] px-8 py-3 text-base shadow-lg shadow-brand-900/30"
              >
                Sign in to order
              </Link>
              <Link
                to={ROUTES.addRestaurant}
                className="btn-secondary min-w-[200px] border-white/30 bg-white/10 px-8 py-3 text-base text-white backdrop-blur hover:bg-white/20"
              >
                Restaurant login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

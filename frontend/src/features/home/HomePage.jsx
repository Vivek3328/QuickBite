import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiSearch, FiSliders } from "react-icons/fi";
import { toast } from "react-toastify";
import { getRestaurants } from "@/api/restaurants";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { RestaurantCardSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
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

function mapSort(v) {
  switch (v) {
    case "recommended":
      return "rating";
    case "rating":
      return "rating";
    case "newest":
      return "newest";
    case "costLow":
      return "costLow";
    case "costHigh":
      return "costHigh";
    case "distance":
      return "distance";
    case "name":
      return "name";
    default:
      return "rating";
  }
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
  const [maxCost, setMaxCost] = useState("");
  const [minRating, setMinRating] = useState("");
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [tagSource, setTagSource] = useState([]);

  const isLoggedIn = Boolean(userToken);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getRestaurants({ limit: 200, sort: "rating" });
        if (!cancelled) setTagSource(data.restaurants ?? []);
      } catch {
        if (!cancelled) setTagSource([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cuisineOptions = useMemo(() => {
    const set = new Set();
    for (const r of tagSource) {
      for (const tag of extractCuisineTags(r.foodtype)) {
        set.add(tag);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b)).slice(0, 14);
  }, [tagSource]);

  const queryParams = useMemo(() => {
    let sortKey = mapSort(sort);
    if (sort === "distance" && (userLat == null || userLng == null)) {
      sortKey = "rating";
    }
    return {
      limit: 48,
      sort: sortKey,
      q: search.trim() || undefined,
      cuisine: cuisine || undefined,
      restaurantType: diet === "all" ? undefined : diet,
      maxCostForTwo: maxCost ? Number(maxCost) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      lat: userLat ?? undefined,
      lng: userLng ?? undefined,
    };
  }, [search, diet, cuisine, sort, maxCost, minRating, userLat, userLng]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getRestaurants(queryParams);
        if (!cancelled) {
          setRestaurants(data.restaurants ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queryParams]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location not supported in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setSort("distance");
        toast.success("Location set — sorting by distance");
      },
      () => toast.error("Could not read location"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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
      {!isLoggedIn && (
        <div className="relative flex min-h-[min(52vh,420px)] shrink-0 flex-col overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900/85 via-ink-900/70 to-brand-900/60" />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
            <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.2em] text-brand-200">
              Food delivery, simplified
            </p>
            <h1 className="animate-fade-up mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Order from great restaurants in a few taps
            </h1>
            <p className="animate-fade-up mt-4 max-w-xl text-base text-ink-200 sm:text-lg">
              Browse menus below, sign in to build your cart and pay. Restaurant partners can list a
              kitchen in minutes.
            </p>
            <div className="animate-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
              {isLoggedIn ? `${greeting()} — what are we eating?` : "Browse near you"}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Restaurants
            </h1>
            <p className="mt-2 max-w-xl text-ink-600">
              Search and filter on the server — price, rating, diet, and distance when you share
              location.
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

              <button
                type="button"
                onClick={requestLocation}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50"
              >
                <FiMapPin className="h-4 w-4" aria-hidden />
                Near me
              </button>

              <div className="ml-auto flex flex-wrap items-center gap-2">
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
                    <option value="newest">Newest</option>
                    <option value="costLow">Price: low to high</option>
                    <option value="costHigh">Price: high to low</option>
                    <option value="name">Name: A–Z</option>
                    <option value="distance">Distance (needs location)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor="max-cost" className="block text-xs font-semibold text-ink-500">
                  Max ₹ for two
                </label>
                <input
                  id="max-cost"
                  type="number"
                  min={0}
                  placeholder="e.g. 500"
                  value={maxCost}
                  onChange={(e) => setMaxCost(e.target.value)}
                  className="input-field mt-1 w-32 rounded-xl py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="min-rating" className="block text-xs font-semibold text-ink-500">
                  Min rating
                </label>
                <input
                  id="min-rating"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  placeholder="e.g. 4"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="input-field mt-1 w-28 rounded-xl py-2 text-sm"
                />
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
                <span className="font-semibold text-ink-800">{restaurants.length}</span>
                {restaurants.length === 1 ? " place" : " places"}
                {search.trim() || diet !== "all" || cuisine || maxCost || minRating
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
              : restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    id={restaurant._id}
                    image={restaurant.image}
                    name={restaurant.name}
                    foodtype={restaurant.foodtype}
                    restaurantType={restaurant.restaurantType}
                    avgRating={restaurant.avgRating}
                    reviewCount={restaurant.reviewCount}
                    deliveryEtaMin={restaurant.deliveryEtaMin}
                    costForTwo={restaurant.costForTwo}
                    distanceKm={restaurant.distanceKm}
                  />
                ))}
          </div>

          {!loading && restaurants.length === 0 && (
            <div className="surface-card border-dashed border-ink-200 bg-white/80 px-6 py-14 text-center">
              <p className="font-display text-lg font-semibold text-ink-900">No restaurants match</p>
              <p className="mt-2 text-sm text-ink-600">
                Try a different search, clear cuisine, or relax price and rating filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDiet("all");
                  setCuisine(null);
                  setMaxCost("");
                  setMinRating("");
                }}
                className="btn-secondary mt-6"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-100 bg-ink-900 text-ink-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-bold text-white">
              <span className="text-brand-400">Quick</span>Bite
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-400">
              Order from curated restaurants with a fast, simple flow—from browse to
              checkout in minutes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="/#restaurants" className="transition hover:text-brand-400">
                  Restaurants
                </a>
              </li>
              <li>
                <Link to={ROUTES.login} className="transition hover:text-brand-400">
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.addRestaurant}
                  className="transition hover:text-brand-400"
                >
                  Partner with us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Account
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to={ROUTES.userOrders} className="transition hover:text-brand-400">
                  My orders
                </Link>
              </li>
              <li>
                <Link to={ROUTES.cart} className="transition hover:text-brand-400">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Stay in the loop
            </h3>
            <p className="mt-3 text-sm text-ink-400">
              Deals and new spots near you—no spam.
            </p>
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="input-field flex-1 border-ink-700 bg-ink-800 text-white placeholder:text-ink-500"
              />
              <button type="submit" className="btn-primary shrink-0 sm:mt-0">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-800 pt-8 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} QuickBite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

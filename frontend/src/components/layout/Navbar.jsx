import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { ROUTES } from "@/constants/routes";

export function Navbar() {
  const navigate = useNavigate();
  const totalItems = useSelector((state) => state.cart.totalItems);
  const { isLoggedIn, isOwner, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-brand-50 hover:text-brand-800";
  const linkActiveMobile =
    "block w-full text-center rounded-xl py-3 text-sm font-medium";

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-ink-100/80 bg-white/90 shadow-nav backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.home}
          className="font-display text-xl font-bold tracking-tight text-ink-900"
        >
          <span className="text-brand-600">Quick</span>Bite
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 text-ink-700 hover:bg-brand-50 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {isLoggedIn ? (
            isOwner ? (
              <>
                <Link to={ROUTES.restaurantMenu} className={linkClass}>
                  Dashboard
                </Link>
                <Link to={ROUTES.restaurantOrders} className={linkClass}>
                  Orders
                </Link>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={linkClass}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.cart}
                  className="relative inline-flex items-center rounded-lg px-3 py-2 text-ink-700 transition hover:bg-brand-50"
                >
                  <FiShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link to={ROUTES.profile} className={linkClass}>
                  Account
                </Link>
                <Link to={ROUTES.userOrders} className={linkClass}>
                  My orders
                </Link>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={linkClass}
                >
                  Logout
                </button>
              </>
            )
          ) : (
            <>
              <Link to={ROUTES.login} className={linkClass}>
                Sign in
              </Link>
              <Link to={ROUTES.addRestaurant} className="btn-primary !py-2 !text-sm">
                List your restaurant
              </Link>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-ink-100 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {isLoggedIn ? (
              isOwner ? (
                <>
                  <Link
                    to={ROUTES.restaurantMenu}
                    className={`${linkActiveMobile} text-ink-800 hover:bg-brand-50`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={ROUTES.restaurantOrders}
                    className={`${linkActiveMobile} text-ink-800 hover:bg-brand-50`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className={`${linkActiveMobile} text-ink-800 hover:bg-brand-50`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.cart}
                    className={`relative flex items-center justify-center gap-2 ${linkActiveMobile} text-ink-800 hover:bg-brand-50`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiShoppingCart className="h-5 w-5" />
                    Cart
                    {totalItems > 0 && (
                      <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <Link
                    to={ROUTES.profile}
                    className={`${linkActiveMobile} text-ink-800 hover:bg-brand-50`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <Link
                    to={ROUTES.userOrders}
                    className={`${linkActiveMobile} text-ink-800 hover:bg-brand-50`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className={`${linkActiveMobile} text-ink-800 hover:bg-brand-50`}
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link
                  to={ROUTES.login}
                  className={`${linkActiveMobile} text-ink-800 hover:bg-brand-50`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to={ROUTES.addRestaurant}
                  className={`${linkActiveMobile} bg-brand-600 text-white hover:bg-brand-700`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  List your restaurant
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sign out?"
        message="You will need to sign in again to order or manage your restaurant."
        onConfirm={handleLogout}
        onCancel={() => setIsModalOpen(false)}
      />
    </nav>
  );
}

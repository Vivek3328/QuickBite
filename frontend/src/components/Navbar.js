import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const totalItems = useSelector((state) => state.cart.totalItems);
  const isLoggedIn =
    localStorage.getItem("userToken") !== null ||
    localStorage.getItem("ownerToken") !== null;
  const isRestaurantOwner = localStorage.getItem("role") === "owner";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-[rgb(239,79,95)] p-3 fixed top-0 w-full z-10 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-lg md:text-xl font-bold tracking-wider"
        >
          QuickBite
        </Link>

        {/* Menu Icon for Mobile */}
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>

        {/* Links for Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            isRestaurantOwner ? (
              <>
                <Link
                  to="/restaurant-menu"
                  className="text-white hover:bg-[rgb(219,59,75)] py-2 px-4 rounded-lg transition duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/Restaurant-orders"
                  className="text-white hover:bg-[rgb(219,59,75)] py-2 px-4 rounded-lg transition duration-300"
                >
                  Orders
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-white hover:bg-[rgb(219,59,75)] py-2 px-4 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  className="relative text-white py-2 px-4 rounded-lg transition duration-300"
                >
                  <FiShoppingCart className="inline-block size-6" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-1 bg-gray-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link
                  to="/user-orders"
                  className="text-white py-2 px-4 rounded-lg transition duration-300"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-white  py-2 px-4 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-pink-200 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/add-restaurant"
                className="bg-white hover:bg-pink-200 text-[rgb(239,79,95)] font-semibold text-sm py-2 px-4 rounded-full transition duration-300"
              >
                Add Restaurant
              </Link>
            </>
          )}
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Logout Confirmation"
            message="Are you sure you want to log out?"
            onConfirm={handleLogout}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[rgb(239,79,95)] p-4 space-y-4 text-center shadow-lg z-20">
          {isLoggedIn ? (
            isRestaurantOwner ? (
              <>
                <Link
                  to="/restaurant-menu"
                  className="block text-white hover:bg-[rgb(219,59,75)] py-2 rounded-lg transition duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/Restaurant-orders"
                  className="block text-white hover:bg-[rgb(219,59,75)] py-2 rounded-lg transition duration-300"
                >
                  Orders
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="block text-white hover:bg-[rgb(219,59,75)] py-2 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  className="block text-white hover:bg-[rgb(219,59,75)] py-2 rounded-lg transition duration-300"
                >
                  <FiShoppingCart className="inline-block" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link
                  to="/user-orders"
                  className="block text-white hover:bg-[rgb(219,59,75)] py-2 rounded-lg transition duration-300"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="block text-white hover:bg-[rgb(219,59,75)] py-2 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="block text-white hover:text-pink-200 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/add-restaurant"
                className="block bg-white hover:bg-pink-200 text-[rgb(239,79,95)] font-semibold py-2 rounded-lg transition duration-300"
              >
                Add Restaurant
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

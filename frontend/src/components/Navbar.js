import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi"; // Added FiMenu and FiX for hamburger menu
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const totalItems = useSelector((state) => state.cart.totalItems);

  // Check if the user is logged in and if they are a restaurant owner
  const isLoggedIn =
    localStorage.getItem("userToken") !== null ||
    localStorage.getItem("ownerToken") !== null;
  const isRestaurantOwner = localStorage.getItem("role") === "owner"; // Check if it's a restaurant owner login
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For toggling mobile menu

  const handleLogout = () => {
    // Remove the auth token and role flag from localStorage
    localStorage.removeItem("userToken");
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("role");
    // Navigate to the login page after logout
    navigate("/login");
  };

  return (
    <nav className="bg-[rgb(239,79,95)] p-4 fixed top-0 w-full z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Logo or Brand Name */}
        <div className="text-white text-xl md:text-2xl font-extrabold tracking-wider">
          <Link to="/" className="hover:text-pink-200 transition duration-300">
            QuickBite
          </Link>
        </div>

        {/* Hamburger Menu (mobile view) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" /> // Close icon when menu is open
            ) : (
              <FiMenu className="w-6 h-6" /> // Hamburger icon when menu is closed
            )}
          </button>
        </div>

        {/* Right Side: Navigation Links (desktop view) */}
        <div className="hidden md:flex space-x-4 md:space-x-6">
          {isLoggedIn ? (
            <>
              {isRestaurantOwner ? (
                <>
                  {/* Restaurant Owner's Navigation */}
                  <Link
                    to="/restaurant-menu"
                    className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/Restaurant-orders"
                    className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* User's Navigation */}
                  <div className="relative inline-block">
                    <Link
                      to="/cart"
                      className="text-white bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                    >
                      <FiShoppingCart className="inline-block text-lg size-8" />
                      {/* Cart Icon */}
                      {totalItems > 0 && (
                        <span className="absolute top-0 right-1 bg-gray-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </div>
                  <Link
                    to="/user-orders"
                    className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                  >
                    Logout
                  </button>
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
            </>
          ) : (
            <>
              {/* If not logged in */}
              <Link
                to="/login"
                className="text-white hover:text-pink-200 transition duration-300 text-sm md:text-base"
              >
                Login
              </Link>
              <Link
                to="/add-restaurant"
                className="bg-white hover:bg-pink-200 text-[rgb(239,79,95)] font-bold py-2 px-4 md:px-6 rounded-full transition-all duration-300 text-sm md:text-base"
              >
                Add Restaurant
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu (visible on small screens) */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-[rgb(239,79,95)] z-20">
            <div className="flex flex-col items-center space-y-4 py-4">
              {isLoggedIn ? (
                <>
                  {isRestaurantOwner ? (
                    <>
                      <Link
                        to="/restaurant-menu"
                        className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/Restaurant-orders"
                        className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="relative inline-block">
                        <Link
                          to="/cart"
                          className="text-white bg-[rgb(239,79,95)] py-2 px-4 rounded-full text-sm md:text-base"
                        >
                          <FiShoppingCart className="inline-block text-lg size-8" />
                          {/* Cart Icon */}
                          {totalItems > 0 && (
                            <span className="absolute top-0 right-1 bg-gray-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {totalItems}
                            </span>
                          )}
                        </Link>
                      </div>
                      <Link
                        to="/user-orders"
                        className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-white hover:bg-[rgb(219,59,75)] bg-[rgb(239,79,95)] py-2 px-4 rounded-full transition duration-300 text-sm md:text-base"
                      >
                        Logout
                      </button>
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
                </>
              ) : (
                <>
                  {/* If not logged in */}
                  <Link
                    to="/login"
                    className="text-white hover:text-pink-200 transition duration-300 text-sm md:text-base"
                  >
                    Login
                  </Link>
                  <Link
                    to="/add-restaurant"
                    className="bg-white hover:bg-pink-200 text-[rgb(239,79,95)] font-bold py-2 px-4 md:px-6 rounded-full transition-all duration-300 text-sm md:text-base"
                  >
                    Add Restaurant
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

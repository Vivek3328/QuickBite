import React from "react";

const Footer = () => {
  return (
    <div className="bg-black text-white py-8">
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Logo and Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-3xl font-extrabold text-red-500 mb-2">
              QuickBite
            </h2>
            <p className="text-gray-400 text-sm text-center sm:text-left">
              Discover deliciousness with just a few clicks. Your favorite food,
              delivered right to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="text-gray-400 text-sm">
              <li>
                <a href="#home" className="hover:text-red-500">
                  Home
                </a>
              </li>
              <li>
                <a href="#restaurants" className="hover:text-red-500">
                  Restaurants
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-red-500">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-red-500">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Stay updated with the latest food trends, restaurant deals, and
              more.
            </p>
            <form className="flex flex-col sm:flex-row items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 sm:mb-0 sm:mr-2"
              />
              <button
                type="submit"
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>
            &copy; {new Date().getFullYear()} QuickBite. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

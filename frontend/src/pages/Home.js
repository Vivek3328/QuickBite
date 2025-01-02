import React, { useEffect, useState } from "react";
import axios from "axios";
import backgroundImage from "../assets/home.jpg";
import RestaurantCard from "../components/RestaurantCard";
import Skelleton from "../components/Skelleton";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = localStorage.getItem("userToken") !== null;

  useEffect(() => {
    if (isLoggedIn) {
      const fetchRestaurants = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/ownerauth/fetchallowner`
          );
          setRestaurants(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchRestaurants();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error fetching restaurants: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r">
      <div className="flex-1">
        {isLoggedIn ? (
          <div className="p-4 mt-12">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
              Explore Our Restaurants
            </h1>
            <p className="text-sm text-gray-700 text-center mb-4">
              Discover a variety of dining options available in your area.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-8 mt-10">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="transform transition-transform hover:scale-105 mb-4"
                    >
                      <Skelleton />
                    </div>
                  ))
                : restaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="transform transition-transform hover:scale-105 mb-4"
                    >
                      <RestaurantCard
                        id={restaurant._id}
                        image={restaurant.image}
                        name={restaurant.name}
                        foodtype={restaurant.foodtype}
                      />
                    </div>
                  ))}
            </div>
          </div>
        ) : (
          <div
            className="flex-1 flex items-center justify-center w-full min-h-screen bg-fixed bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          >
            <div className="bg-black bg-opacity-60 p-8 rounded-xl shadow-lg text-center">
              <h1 className="text-white text-3xl font-extrabold mb-4 text-shadow-lg">
                Welcome to QuickBite - Discover Deliciousness!
              </h1>
              <p className="text-white text-lg font-medium mt-2 text-shadow-md">
                Join us today and explore an amazing selection of restaurants
                just for you!
              </p>
              <div className="mt-6">
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-red-600 transition-all duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

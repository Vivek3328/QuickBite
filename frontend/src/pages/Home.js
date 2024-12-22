import React, { useEffect, useState } from "react";
import axios from "axios";
import backgroundImage from "../assets/home.jpg";
import RestaurantCard from "../components/RestaurantCard";

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

  if (loading) {
    return <div className="text-center text-base">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error fetching restaurants: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-200 to-white pt-12 mt-5">
      <div className="flex-1">
        {isLoggedIn ? (
          <div className="p-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
              Explore Our Restaurants
            </h1>
            <p className="text-sm text-gray-700 text-center mb-4">
              Discover a variety of dining options available in your area.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-8 mt-10">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="transform transition-transform hover:scale-105 mb-4" // Added margin-bottom for spacing
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
            className="flex-1 flex items-center justify-center w-full min-h-screen"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="bg-black bg-opacity-60 p-4 rounded-lg text-center">
              <h1 className="text-white text-xl font-bold">
                Welcome to QuickBite - Discover Deliciousness!
              </h1>
              <p className="text-white mt-2 text-sm">
                Join us today and explore an amazing selection of restaurants
                just for you!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

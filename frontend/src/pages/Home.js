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
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error fetching restaurants: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-200 to-white">
      <div className="flex-1 pt-16">
        {isLoggedIn ? (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
              Explore Our Restaurants
            </h1>
            <p className="text-lg text-gray-700 text-center mb-8">
              Discover a variety of dining options available in your area.
              Whether you're looking for a cozy cafe, a family-friendly diner,
              or a fine dining experience, we've got you covered!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id} // Use a unique key
                  id={restaurant._id}
                  image={restaurant.image}
                  name={restaurant.name}
                  foodtype={restaurant.foodtype}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex-1 flex items-center justify-center w-full min-h-screen overflow-hidden"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center">
              <h1 className="text-white text-4xl md:text-5xl font-bold">
                Welcome to QuickBite - Discover Deliciousness!
              </h1>
              <p className="text-white mt-4 text-lg">
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

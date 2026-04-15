import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="surface-card border-red-100 bg-red-50 p-8 text-red-800">
          <p className="font-semibold">Could not load restaurants</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4.25rem)] flex-col">
      {isLoggedIn ? (
        <section id="restaurants" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-fade-up text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Hungry? Let&apos;s go
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Restaurants near you
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-ink-600">
              Pick a place, browse the menu, and checkout when you are ready.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Skelleton key={index} />
                ))
              : restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    id={restaurant._id}
                    image={restaurant.image}
                    name={restaurant.name}
                    foodtype={restaurant.foodtype}
                  />
                ))}
          </div>
        </section>
      ) : (
        <div className="relative flex flex-1 flex-col overflow-hidden">
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
              <Link to="/login" className="btn-primary min-w-[200px] px-8 py-3 text-base shadow-lg shadow-brand-900/30">
                Sign in to order
              </Link>
              <Link to="/add-restaurant" className="btn-secondary min-w-[200px] border-white/30 bg-white/10 px-8 py-3 text-base text-white backdrop-blur hover:bg-white/20">
                Restaurant login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

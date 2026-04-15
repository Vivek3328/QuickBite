import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import Skelleton from "../components/Skelleton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Menu = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const menuResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/menuitemauth/fetchrestomenu/${id}`
        );
        setMenuItems(menuResponse.data);

        const ownerResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/ownerauth/fetchallowner`
        );

        const restaurantOwner = ownerResponse.data.find(
          (o) => o._id === id
        );

        setOwner(restaurantOwner);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="surface-card border-red-100 bg-red-50 p-8 text-red-800">
          <p className="font-semibold">Could not load this menu</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/40 to-ink-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="surface-card border-0 p-8">
            <div className="text-center">
              <Skeleton height={36} width={220} className="mb-4 !rounded-lg" />
              <Skeleton height={24} width={160} className="mb-2 !rounded-lg" />
              <Skeleton height={18} width={280} className="mb-2 !rounded-lg" />
              <Skeleton height={18} width={240} className="mb-4 !rounded-lg" />
              <Skeleton height={28} width={120} className="!rounded-full" />
            </div>
          </div>
        ) : (
          owner && (
            <div className="surface-card overflow-hidden border-0 bg-gradient-to-br from-white to-brand-50/30 p-8 sm:p-10">
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                  {owner.name}
                </h1>
                <p className="mt-2 text-lg text-brand-700">{owner.foodtype}</p>
                <p className="mt-4 text-ink-600">{owner.address}</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-ink-600">
                  <span>{owner.mobile}</span>
                  <span className="hidden sm:inline">·</span>
                  <span>{owner.email}</span>
                </div>
                <span
                  className={`mt-6 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white ${
                    owner.restaurantType === "veg" ? "bg-emerald-600" : "bg-rose-600"
                  }`}
                >
                  {owner.restaurantType === "veg" ? "Vegetarian" : "Non-veg"}
                </span>
              </div>
            </div>
          )
        )}

        <h2 className="mt-12 text-center font-display text-2xl font-bold text-ink-900 sm:text-3xl">
          Menu
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-ink-500">
          Tap add to put items in your cart. You can adjust quantities at checkout.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skelleton key={index} />
              ))
            : menuItems.map((item) => (
                <ItemCard
                  key={item._id}
                  image={item.image}
                  name={item.itemname}
                  price={item.price}
                  description={item.description}
                  item={item}
                  ownerId={id}
                />
              ))}
        </div>
      </div>
      <ToastContainer hideProgressBar={true} position="top-center" theme="light" />
    </div>
  );
};

export default Menu;

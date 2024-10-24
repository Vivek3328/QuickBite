import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ItemCard from "../components/ItemCard";

const Menu = () => {
  const { id } = useParams(); // Get the restaurant ID from the URL
  const [owner, setOwner] = useState(null); // State for owner information
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        // Fetch menu items for the restaurant
        const menuResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/menuitemauth/fetchrestomenu/${id}`
        );
        setMenuItems(menuResponse.data);

        // Fetch the owner of the restaurant
        const ownerResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/ownerauth/fetchallowner`
        );

        const restaurantOwner = ownerResponse.data.find(
          (owner) => owner._id === id
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

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error fetching restaurant menu: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-5">
      <div className="max-w-6xl mx-auto pt-16 px-6">
        {owner && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">{owner.name}</h1>
              <p className="text-lg text-gray-600">{owner.foodtype}</p>
              <p className="text-gray-600">{owner.address}</p>
              <p className="text-gray-600">Contact: {owner.mobile}</p>
              <p className="text-gray-600">Email: {owner.email}</p>
              <span
                className={`mt-2 inline-block py-1 px-3 rounded-full text-white ${
                  owner.restaurantType === "veg" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {owner.restaurantType === "veg" ? "Veg" : "Non-Veg"}
              </span>
            </div>
          </div>
        )}
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
          Menu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <ItemCard
              key={item._id} // Use a unique key for each item
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
    </div>
  );
};

export default Menu;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTotalItems } from "../redux/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ItemCard = ({ image, name, price, description, item, ownerId }) => {
  const dispatch = useDispatch();
  const totalItems = useSelector((state) => state.cart.totalItems);

  const checkIdInArray = (array, idToCheck) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i]._id === idToCheck) {
        return true;
      }
    }
    return false;
  };

  const addToCart = (newItem, ownerId) => {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cart.length === 0) {
      cart.push({ ...newItem, owner: ownerId });
      dispatch(setTotalItems(totalItems + 1));
      toast.success("Item Added to Cart");
    } else {
      const existingOwnerId = cart[0].owner;

      if (existingOwnerId !== ownerId) {
        cart = [{ ...newItem, owner: ownerId }];
        dispatch(setTotalItems(1));
        toast.success("Item Added to Cart");
      } else {
        const isItemInCart = checkIdInArray(cart, newItem._id);

        if (isItemInCart) {
          // alert("Item Already in cart");
          toast.error("Item Already in cart");
        } else {
          cart.push({ ...newItem, owner: ownerId });
          dispatch(setTotalItems(totalItems + 1));
        }
      }
    }
    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  return (
    <div className="max-w-xs mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <div className="h-64 relative overflow-hidden">
        {" "}
        {/* Increased height to h-64 */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover" // Ensuring full coverage without hiding
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
        <p className="text-lg font-semibold text-gray-800 mt-2">${price}</p>
        <button
          onClick={() => addToCart(item, ownerId)}
          className="mt-4 w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemCard;

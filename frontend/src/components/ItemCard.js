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
      toast.success("Added to cart");
    } else {
      const existingOwnerId = cart[0].owner;

      if (existingOwnerId !== ownerId) {
        cart = [{ ...newItem, owner: ownerId }];
        dispatch(setTotalItems(1));
        toast.success("Cart updated for this restaurant");
      } else {
        const isItemInCart = checkIdInArray(cart, newItem._id);

        if (isItemInCart) {
          toast.error("Already in cart");
        } else {
          cart.push({ ...newItem, owner: ownerId });
          dispatch(setTotalItems(totalItems + 1));
          toast.success("Added to cart");
        }
      }
    }
    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  return (
    <article className="surface-card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-100">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink-900">{name}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-600">
          {description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
          <p className="text-lg font-bold text-brand-700">₹{price}</p>
          <button
            type="button"
            onClick={() => addToCart(item, ownerId)}
            className="btn-primary !px-4 !py-2 !text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;

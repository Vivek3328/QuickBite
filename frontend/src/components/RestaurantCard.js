import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = (props) => {
  return (
    <div className="max-w-xs w-full h-80 bg-white rounded-lg shadow-lg overflow-hidden sm:h-96 md:h-auto">
      <div className="relative w-full h-40 sm:h-48 md:h-60">
        <img
          src={props.image}
          alt={props.name}
          className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded">
          {props.rating || "4.5 ★"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 hover:text-red-500 transition-colors duration-200">
          {props.name}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm mt-1">{props.foodtype}</p>
        <div className="flex items-center justify-between mt-4">
          <Link
            to={`/restaurant/${props.id}`}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Order Now
          </Link>
          <p className="text-gray-700 font-medium text-sm">
            ${props.avgPrice || "15"} / meal
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = (props) => {
  return (
    <div className="max-w-xs w-full bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={props.image}
        alt={props.name}
        className="w-full h-48 object-cover transition-opacity duration-300 hover:opacity-90"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 hover:text-red-500 transition-colors duration-200">
          {props.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{props.foodtype}</p>
        <Link
          to={`/restaurant/${props.id}`}
          className="mt-4 inline-block bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Order Now
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;

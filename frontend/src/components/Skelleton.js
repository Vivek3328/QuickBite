import React from "react";

const Skelleton = () => {
  return (
    <div class="max-w-xs w-full h-80 bg-gray-200 rounded-lg shadow-lg overflow-hidden sm:h-96 md:h-auto animate-pulse">
      <div class="relative w-full h-40 sm:h-48 md:h-60">
        <div class="w-full h-full"></div>
        <div class="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded"></div>
      </div>
      <div class="p-4">
        <div class="h-5 bg-gray-300 rounded w-1/2"></div>
        <div class="h-3 bg-gray-300 rounded w-1/3 my-2"></div>
        <div class="flex items-center justify-between mt-4">
          <div class="bg-gray-400 h-8 w-24 rounded-lg shadow-md"></div>
          <div class="h-5 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default Skelleton;

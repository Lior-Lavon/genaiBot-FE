import React from "react";

const LauncherCard = () => {
  return (
    <div className="w-full mx-auto p-4 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="space-y-4">
        {/* Genie Product */}
        <div>
          <label className="block text-[.8rem] font-semibold text-gray-800 mb-1">
            Genie Product
          </label>
          <select className="w-full p-2 text-[.7rem] rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Brand Equity Pulse</option>
          </select>
        </div>

        {/* Product Category */}
        <div>
          <label className="block text-[.8rem] font-semibold text-gray-800 mb-1">
            Product Category
          </label>
          <select className="w-full p-2 text-[.7rem] rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Hair Care UK</option>
            <option>Deodorant UK</option>
          </select>
        </div>

        {/* Launch Button */}
        <button className="w-full bg-gray-800 hover:bg-gray-900 text-sm text-white font-bold py-2 rounded-md shadow cursor-pointer">
          LAUNCH
        </button>
      </div>
    </div>
  );
};

export default LauncherCard;

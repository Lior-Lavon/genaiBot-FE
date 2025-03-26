import React from "react";

const Kickstarters = () => {
  const cards = [
    "Positional attribute summary for my brands",
    "YoY trends for my brands",
    "Top 10 brands with best pulse score trend",
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="w-full h-[0.1rem] bg-gray-200 mb-2"></div>
      <h2 className="text-xl font-bold text-gray-800 mb-3">Kickstarters</h2>
      <div className="space-y-4">
        {cards.map((text, index) => (
          <div
            key={index}
            className=" text-[0.7rem] bg-indigo-50 hover:bg-indigo-100 text-gray-800 font-medium text-center px-1 py-2 rounded-xl border-l-4 border-gray-800 shadow-sm cursor-pointer transition-all duration-400"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kickstarters;

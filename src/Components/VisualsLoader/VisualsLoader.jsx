import React from "react";

const PlaceholderSparkIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25a.75.75 0 0 1 .698 1.017l-2.25 6.75h4.5a.75.75 0 0 1 .59 1.223l-6 8.25a.75.75 0 0 1-1.287-.54l2.25-6.75H7.5a.75.75 0 0 1-.59-1.223l6-8.25A.75.75 0 0 1 12 2.25Z"
      clipRule="evenodd"
    />
  </svg>
);

const VisualsLoader = ({
  icon: IconComponent = PlaceholderSparkIcon,
  iconColor = "text-blue-400",
  borderColor = "border-[#96d1d7]",
}) => {
  return (
    <div className="relative w-6 h-6 shrink-0 self-start">
      <div
        className={`absolute inset-0 border-2 rounded-full animate-spin z-0 ${borderColor}`}
        style={{
          animationDuration: "1.2s",
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
        }}
      ></div>
      <IconComponent className={`w-4 h-4 ${iconColor} z-10 absolute inset-1`} />
    </div>
  );
};

export default VisualsLoader;

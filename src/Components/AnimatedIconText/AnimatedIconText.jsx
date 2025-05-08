// // --- Placeholder Icons ---
// // Replace these with your actual SVG components or icon library imports (e.g., lucide-react)
// // Make sure to pass the className prop down to the SVG if using a library

// const PlaceholderSparkIcon = ({ className = "w-4 h-4" }) => (
//   <svg
//     className={className} // Apply Tailwind classes passed as props
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     aria-hidden="true"
//   >
//     <path
//       fillRule="evenodd"
//       d="M12 2.25a.75.75 0 0 1 .698 1.017l-2.25 6.75h4.5a.75.75 0 0 1 .59 1.223l-6 8.25a.75.75 0 0 1-1.287-.54l2.25-6.75H7.5a.75.75 0 0 1-.59-1.223l6-8.25A.75.75 0 0 1 12 2.25Z"
//       clipRule="evenodd"
//     />
//   </svg>
// );

// const PlaceholderArrowIcon = ({ className = "w-3 h-3" }) => (
//   <svg
//     className={className} // Apply Tailwind classes passed as props
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 16 16"
//     fill="currentColor"
//     aria-hidden="true"
//   >
//     <path
//       fillRule="evenodd"
//       d="M4.47 6.47a.75.75 0 0 1 1.06 0L8 8.94l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z"
//       clipRule="evenodd"
//     />
//   </svg>
// );
// // --- End Placeholder Icons ---

// const AnimatedIconText = ({
//   text = "Default Text",
//   icon: IconComponent = PlaceholderSparkIcon,
//   showArrow = true,
//   className = "",
//   iconColor = "text-blue-400", // Match screenshot blue
//   borderColor = "border-blue-400", // Match screenshot blue
//   textColor = "text-black", // Light text for dark backgrounds
//   arrowColor = "text-black", // Slightly dimmer arrow
// }) => {
//   return (
//     // Using a button assuming it's clickable, change to div if not interactive
//     <button
//       type="button"
//       // Base styles: inline flex layout, vertical centering, spacing
//       // Optional padding and rounded corners for the container
//       className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-gray-900 ${className}`}
//     >
//       {/* Icon Wrapper: Relative positioning for the absolute border */}
//       <div className="relative flex items-center justify-center w-6 h-6">
//         {" "}
//         {/* Increased size slightly for border */}
//         {/* Animated Border */}
//         <div
//           className={`absolute inset-0 border-2 rounded-full animate-spin half-spin-border z-0`}
//           style={{ animationDuration: "1.2s" }}
//         ></div>
//         {/* Icon Component: Render the passed icon */}
//         <IconComponent className={`w-4 h-4 ${iconColor} z-10`} />{" "}
//         {/* Icon size, color, and ensure it's above border */}
//       </div>

//       {/* Text: Apply text color and font size */}
//       <span
//         className={`text-base font-medium ${textColor} leading-none whitespace-nowrap`}
//       >
//         {text}
//       </span>
//       <span className="text-xs text-gray-500 whitespace-nowrap">
//         Supporting content goes here
//       </span>

//       {/* Arrow: Conditionally render the arrow */}
//       {showArrow && (
//         <PlaceholderArrowIcon className={`w-3 h-3 ${arrowColor} ml-0.5`} />
//       )}
//     </button>
//   );
// };

// export default AnimatedIconText;

// --- Placeholder Icons ---
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

const PlaceholderArrowIcon = ({ className = "w-3 h-3" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.47 6.47a.75.75 0 0 1 1.06 0L8 8.94l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Main Component ---
const AnimatedIconText = ({
  text = "Default Text",
  subtext = "", // 👈 New configurable subtext
  icon: IconComponent = PlaceholderSparkIcon,
  showArrow = true,
  // className = "",
  iconColor = "text-blue-400",
  borderColor = "border-blue-400",
  textColor = "text-black",
  arrowColor = "text-black",
}) => {
  return (
    <button
      type="button"
      className={`bbb inline-flex items-start gap-2 px-3 py-1.5 rounded-full transition-colors duration-150`}
    >
      {/* Icon with Animated Border */}
      <div className="relative w-6 h-6 shrink-0 self-start">
        <div
          className={`absolute inset-0 border-2 rounded-full animate-spin z-0 ${borderColor}`}
          style={{
            animationDuration: "1.2s",
            borderRightColor: "transparent",
            borderBottomColor: "transparent",
          }}
        ></div>
        <IconComponent
          className={`w-4 h-4 ${iconColor} z-10 absolute inset-1`}
        />
      </div>

      {/* Text and Subtext */}
      <div className="flex flex-col items-start leading-tight">
        <div className="flex flex-row gap-2 items-center">
          <span
            className={`text-base font-medium ${textColor} whitespace-nowrap`}
          >
            {text}
          </span>
          {subtext && (
            <PlaceholderArrowIcon className={`w-3 h-3 ${arrowColor} ml-0.5`} />
          )}
        </div>
        {subtext && (
          <span className="text-xs text-gray-500 whitespace-wrap text-left">
            {subtext}
          </span>
        )}
      </div>
    </button>
  );
};

export default AnimatedIconText;

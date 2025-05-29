const selectStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#dff1f4" : "white", // custom hover color
    color: "black",
    cursor: "pointer",
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#dff1f4" : "#d1d5db", // e.g., Tailwind indigo-500 and gray-300
    boxShadow: state.isFocused ? "0 0 0 1px #dff1f4" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#bcdde5" : "#9ca3af", // gray-400 on hover
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#dff1f4", // Tailwind's indigo-100
    ":hover": {
      backgroundColor: "#bcdde5", // indigo-200
      color: "#000000", // indigo-900
    },
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#000000",
    ":hover": {
      backgroundColor: "#bcdde5", // indigo-200
      color: "#ffffff", // indigo-900
    },
  }),
};

export default selectStyles;

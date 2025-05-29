import React, { useEffect, useState } from "react";
import Select from "react-select";
import selectStyles from "../../utills/selectStyles";

// const options = [
//   { value: "apple", label: "Apple" },
//   { value: "banana", label: "Banana" },
//   { value: "orange", label: "Orange" },
//   { value: "grape", label: "Grape" },
//   { value: "mango", label: "Mango" },
// ];

const ClarificationDropdown = ({
  questionKey,
  options,
  handleUserSelection,
}) => {
  const [selectOptions, setSelectOptions] = useState([]);

  const handleChange = (selectedItems) => {
    const answers = selectedItems.map((answer) => answer.value);
    handleUserSelection(questionKey, answers);
  };

  useEffect(() => {
    options.map((option) => {
      setSelectOptions((prev) => [...prev, { value: option, label: option }]);
    });
  }, [options]);

  return (
    <div className="w-full max-w-[80%]">
      <Select
        options={selectOptions}
        isMulti
        // value={selectedOptions}
        onChange={handleChange}
        placeholder="Select Options ..."
        className="text-sm"
        styles={selectStyles}
      />
    </div>
  );
};

export default ClarificationDropdown;

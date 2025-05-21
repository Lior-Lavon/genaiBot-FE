import React, { useEffect, useState } from "react";
import Select from "react-select";

// const options = [
//   { value: "apple", label: "Apple" },
//   { value: "banana", label: "Banana" },
//   { value: "orange", label: "Orange" },
//   { value: "grape", label: "Grape" },
//   { value: "mango", label: "Mango" },
// ];

const MultiSelectDropdown = ({ op, setSelectedCompetitorBrands }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  useEffect(() => {
    let arr = [];
    op.map((brand) => {
      arr.push({
        value: brand.name,
        label: brand.name,
      });
    });
    setOptions(arr);
  }, [op]);

  useEffect(() => {
    op = op.map((obj) => ({
      ...obj,
      selected: selectedOptions.some((opt) => opt.value === obj.name),
    }));
    setSelectedCompetitorBrands(op);
  }, [selectedOptions]);

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <Select
        options={options}
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select Brand(s) ..."
        className="text-sm"
      />
    </div>
  );
};

export default MultiSelectDropdown;

import { useEffect, useState } from "react";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";

const SelectBrand = ({
  title,
  options,
  setSelectedBrands,
  submitBrandSelection,
}) => {
  // handle clicks on brands
  const handleMyBrandSelect = (item) => {
    item.selected = !item.selected;
    const tmpArr = options.map((elm) => (elm.name === item.name ? item : elm));
    setSelectedBrands(tmpArr);
  };

  const handleDropDownSelect = (items) => {
    setSelectedBrands(items);
  };

  return (
    <div className={`mt-2 w-full flex items-center gap-3`}>
      <p className="w-fit py-1 ">{title}</p>
      {/* options */}
      <div className="flex items-center gap-2 ">
        {options.length <= 5 ? (
          options?.map((item, index) => {
            return (
              <div
                key={index}
                className={`text-sm w-fit px-2 py-1 rounded-2xl cursor-pointer transition-colors duration-300 ${
                  item.selected
                    ? "bg-[#5fbbc5] text-black"
                    : "bg-black text-white"
                }`}
                onClick={() => handleMyBrandSelect(item)}
              >
                {item.name}
              </div>
            );
          })
        ) : (
          <div className="w-[400px]">
            <MultiSelectDropdown
              op={options}
              setSelectedBrands={handleDropDownSelect}
            />
          </div>
        )}
      </div>

      {/* {showBrandFlow === "competitor-brand-question" &&
        (selectedCompetitorBrands.length <= 5 ? (
          <div className="flex items-center gap-2">
            {selectedCompetitorBrands?.map((item, index) => (
              <div
                key={index}
                className={`text-sm w-fit px-2 py-1 rounded-2xl cursor-pointer transition-colors duration-300 ${
                  item.selected
                    ? "bg-[#5fbbc5] text-black"
                    : "bg-black text-white"
                }`}
                onClick={() => handleCompetitorsBrandSelect(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-[500px]">
            <MultiSelectDropdown
              op={selectedCompetitorBrands}
              setSelectedCompetitorBrands={setSelectedCompetitorBrands}
            />
          </div>
        ))} */}
      {/* proceed */}
      <button
        className="bg-[#dceef1] mt-1 py-1 px-4 text-blue-900 rounded-2xl shadow-sm cursor-pointer hover:bg-[#bcdde5] transition-all duration-300 mb-2"
        onClick={submitBrandSelection}
      >
        Proceed
      </button>
    </div>
  );
};

export default SelectBrand;

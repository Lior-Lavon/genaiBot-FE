import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import getFiltersAdditionalInfo from "../../utills/getFiltersAdditionalInfo";
import { loadData } from "../../features/dashboard/dashboardSlice";

const LauncherCard = () => {
  const pProductRef = useRef(null);
  const pCategoryRef = useRef(null);

  const dispatch = useDispatch();
  // const { filters } = useSelector((store) => store.dashboard);
  const { folders, selectedFolders, user_id } = useSelector(
    (store) => store.dashboard
  );

  const [defaultCustomer, setDefaultCustomer] = useState("");
  const [defaultProduct, setDefaultProduct] = useState("");
  const [defaultCategory, setDefaultCategory] = useState("");

  useEffect(() => {
    if (folders != null) {
      setDefaultCustomer(folders?.data?.client[0]?.value);
    }
  }, [folders]);

  useEffect(() => {
    if (selectedFolders != null) {
      setDefaultCustomer(selectedFolders.client);
      setDefaultProduct(selectedFolders.product);
      setDefaultCategory(selectedFolders.category);
    }
  }, [selectedFolders]);

  const handleProductChange = (e) => {
    setDefaultProduct(e.target.value);
    // setTimeout(() => {
    //   handleLunchEvent();
    // }, 300);
  };

  const handleCategoriesChange = (e) => {
    setDefaultCategory(e.target.value);
    // setTimeout(() => {
    //   handleLunchEvent();
    // }, 10000);
  };

  useEffect(() => {
    if (defaultProduct == "") {
      const selectedValue = pProductRef.current?.value;
      setDefaultProduct(selectedValue);
    }
    if (defaultCategory == "") {
      const selectedValue = pCategoryRef.current?.value;
      setDefaultCategory(selectedValue);
    }

    if (defaultProduct != "" && defaultCategory != "") {
      // send an API call to cache the csv based on the folder info
      dispatch(
        loadData({
          user_id: user_id,
          client: defaultCustomer,
          product: defaultProduct,
          category: defaultCategory,
        })
      );
    }
  }, [defaultProduct, defaultCategory]);

  return (
    <div className="flex items-center gap-4 ">
      {/* Genie Product */}
      <div className="w-[260px] flex items-center border border-gray-200 rounded-xl p-2">
        {/* <label className="w-[150px] block text-[.8rem] font-semibold text-gray-800"> */}
        <label className="w-[196px] block text-[.8rem] font-semibold text-gray-800 m-1">
          Genie Product:
        </label>
        <select
          ref={pProductRef}
          className="w-[200px] text-black bg-white p-2 text-[.7rem] border border-gray-300 focus:outline-none"
          value={defaultProduct}
          onChange={handleProductChange}
        >
          {folders?.data.product.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Product Category */}
      <div className="w-[270px] flex items-center border border-gray-200 rounded-xl p-2">
        <label className="w-[196px] block text-[.8rem] font-semibold text-gray-800 m-1">
          Product Category:
        </label>
        <select
          ref={pCategoryRef}
          className="w-[200px] text-black bg-white p-2 text-[.7rem] border border-gray-300 focus:outline-none"
          value={defaultCategory}
          onChange={handleCategoriesChange}
        >
          {folders?.data.category.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LauncherCard;

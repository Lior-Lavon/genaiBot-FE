import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { testFunc } from "../../features/dashboard/dashboardSlice";
import getFiltersAdditionalInfo from "../../utills/getFiltersAdditionalInfo";

const LauncherCard = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((store) => store.dashboard);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [defaultCustomer, setDefaultCustomer] = useState(0);
  const [defaultProduct, setDefaultProduct] = useState(0);
  const [defaultCategory, setDefaultCategory] = useState(0);

  // get the products
  useEffect(() => {
    // get customer id
    setDefaultCustomer(filters?.filters.Customers_Id);

    // get the default product
    setProducts(filters?.filters.Products);

    // get the defaultProduct
    const dp = filters?.filters.Products?.find((p) => {
      return p.Product_default == true;
    });
    setDefaultProduct(dp?.Products_Id);
  }, [filters]);

  // get categories from defaultProduct
  useEffect(() => {
    const dp = products?.find((p) => {
      return p.Products_Id === defaultProduct;
    });
    if (dp != null) {
      setCategories(dp?.Categories);

      // get defaultCategory
      const dc = dp?.Categories.find((p) => {
        if (p.Categories_default == true) {
          setDefaultCategory(p?.Categories_Id);
          return p;
        }
      });
      if (dc == null) {
        setDefaultCategory(dp?.Categories[0].Categories_Id);
      }
    }
  }, [defaultProduct]);

  const getDefaultProduct = () => {
    return String(defaultProduct);
  };
  const getDefaultCategory = () => {
    return String(defaultCategory);
  };

  const handleProductChange = (e) => {
    setDefaultProduct(parseInt(e.target.value));
    setTimeout(() => {
      handleLunchEvent();
    }, 300);
  };

  const handleCategoriesChange = (e) => {
    setDefaultCategory(parseInt(e.target.value));
    setTimeout(() => {
      handleLunchEvent();
    }, 1000);
  };

  const handleLunchEvent = () => {
    // console.log("Customers Id : ", defaultCustomer);
    // console.log("Product Id: ", defaultProduct);
    // console.log("Category Id: ", defaultCategory);
    // console.log("filters: ", filters);

    console.log("handleLunchEvent");

    // const foldersInfo = getFiltersAdditionalInfo(
    //   filters,
    //   defaultProduct,
    //   defaultCategory
    // );

    // send an API call to cache the csv based on the folder info
    // dispatch(testFunc(foldersInfo));
  };

  return (
    <div className="flex items-center gap-4 ">
      {/* Genie Product */}
      <div className="w-[260px] flex items-center border border-gray-200 rounded-xl p-2">
        <label className="w-[150px] text-[.8rem] font-semibold text-gray-800 mb-1">
          Genie Product:
        </label>
        <select
          className="w-[140px] text-black bg-white p-2 text-[.7rem] border border-gray-300 focus:outline-none"
          value={getDefaultProduct()}
          onChange={handleProductChange}
        >
          {products?.map((opt) => (
            <option key={opt.Products_Id} value={opt.Products_Id}>
              {opt.Products_Name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Category */}
      <div className="w-[260px] flex items-center border border-gray-200 rounded-xl p-2">
        <label className="w-[196px] block text-[.8rem] font-semibold text-gray-800 mb-1 ">
          Product Category:
        </label>
        <select
          className="w-[140px] text-black bg-white p-2 text-[.7rem] border border-gray-300 focus:outline-none"
          value={getDefaultCategory()}
          onChange={handleCategoriesChange}
        >
          {categories?.map((opt) => (
            <option key={opt.Categories_Id} value={opt.Categories_Id}>
              {opt.Categories_Name}
            </option>
          ))}
        </select>
      </div>

      {/* Launch Button */}
      {/* <button
          className="w-full bg-gray-800 hover:bg-gray-900 text-sm text-white font-bold py-2 rounded-md shadow cursor-pointer"
          onClick={handleLunchBtn}
        >
          LAUNCH
        </button> */}
    </div>
  );
};

export default LauncherCard;

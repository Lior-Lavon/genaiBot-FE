import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import getFiltersAdditionalInfo from "../../utills/getFiltersAdditionalInfo";
import { loadData } from "../../features/dashboard/dashboardSlice";

const LauncherCard = () => {
  const dispatch = useDispatch();
  // const { filters } = useSelector((store) => store.dashboard);
  const { folders, selectedFolders, user_id } = useSelector(
    (store) => store.dashboard
  );

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

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

  // // get the products
  // useEffect(() => {
  //   // get customer id
  //   setDefaultCustomer(filters?.filters.Customers_Id);

  //   // get the default product
  //   setProducts(filters?.filters.Products);

  //   // get the defaultProduct
  //   const dp = filters?.filters.Products?.find((p) => {
  //     return p.Product_default == true;
  //   });
  //   setDefaultProduct(dp?.Products_Id);
  // }, [filters]);

  // // get categories from defaultProduct
  // useEffect(() => {
  //   const dp = products?.find((p) => {
  //     return p.Products_Id === defaultProduct;
  //   });
  //   if (dp != null) {
  //     setCategories(dp?.Categories);

  //     // get defaultCategory
  //     const dc = dp?.Categories.find((p) => {
  //       if (p.Categories_default == true) {
  //         setDefaultCategory(p?.Categories_Id);
  //         return p;
  //       }
  //     });
  //     if (dc == null) {
  //       setDefaultCategory(dp?.Categories[0].Categories_Id);
  //     }
  //   }
  // }, [defaultProduct]);

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
    if (defaultProduct != "" && defaultCategory != "") {
      // console.log("Customers Id : ", defaultCustomer);
      // console.log("Product Id: ", defaultProduct);
      // console.log("Category Id: ", defaultCategory);
      // console.log("filters: ", filters);

      // const foldersInfo = getFiltersAdditionalInfo(
      //   filters,
      //   defaultProduct,
      //   defaultCategory
      // );

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

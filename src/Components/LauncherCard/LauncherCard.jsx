import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cacheData,
  fetchMapping,
  setFolders,
} from "../../features/dashboard/dashboardSlice";

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
  };

  const handleCategoriesChange = (e) => {
    setDefaultCategory(parseInt(e.target.value));
  };

  const getAdditionalInfo = (defaultProduct, defaultCategory) => {
    // get Customer_Folder,Product_Folder,Category_Folder
    for (let i = 0; i < filters.filters.Products.length; i++) {
      if (filters.filters.Products[i].Products_Id == defaultProduct) {
        for (
          let j = 0;
          j < filters.filters.Products[i].Categories.length;
          j++
        ) {
          if (
            filters.filters.Products[i].Categories[j].Categories_Id ==
            defaultCategory
          ) {
            return {
              Customer_Folder:
                filters.filters.Products[i].Categories[j].Customer_Folder,
              Product_Folder:
                filters.filters.Products[i].Categories[j].Product_Folder,
              Category_Folder:
                filters.filters.Products[i].Categories[j].Category_Folder,
            };
          }
        }
      }
    }
    return null;
  };

  const handleLunchBtn = () => {
    // console.log("Customers Id : ", defaultCustomer);
    // console.log("Product Id: ", defaultProduct);
    // console.log("Category Id: ", defaultCategory);
    const foldersInfo = getAdditionalInfo(defaultProduct, defaultCategory);
    // store the foldersInfo to the store
    dispatch(setFolders(foldersInfo));
    // send an API call to cache the csv based on the folder info
    dispatch(cacheData(foldersInfo));
  };

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="space-y-4">
        {/* Genie Product */}
        <div>
          <label className="block text-[.8rem] font-semibold text-gray-800 mb-1">
            Genie Product
          </label>
          <select
            className="w-full p-2 text-[.7rem] rounded-md bg-gray-100 border border-gray-300 focus:outline-none"
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
        <div>
          <label className="block text-[.8rem] font-semibold text-gray-800 mb-1">
            Product Category
          </label>
          <select
            className="w-full p-2 text-[.7rem] rounded-md bg-gray-100 border border-gray-300 focus:outline-none"
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
        <button
          className="w-full bg-gray-800 hover:bg-gray-900 text-sm text-white font-bold py-2 rounded-md shadow cursor-pointer"
          onClick={handleLunchBtn}
        >
          LAUNCH
        </button>
      </div>
    </div>
  );
};

export default LauncherCard;

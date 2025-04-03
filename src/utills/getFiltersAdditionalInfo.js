export default function getFiltersAdditionalInfo(
  filters,
  defaultProduct,
  defaultCategory
) {
  // console.log("filters: ", filters);
  // console.log("defaultProduct: ", defaultProduct);
  // console.log("defaultCategory: ", defaultCategory);

  // get Customer_Folder,Product_Folder,Category_Folder
  for (let i = 0; i < filters.filters.Products.length; i++) {
    if (filters.filters.Products[i].Products_Id == defaultProduct) {
      for (let j = 0; j < filters.filters.Products[i].Categories.length; j++) {
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
}

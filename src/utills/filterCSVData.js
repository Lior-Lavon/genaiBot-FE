export default function parseCSVToStructureWithDefaults(
  csvString,
  filterInput
) {
  const rows = csvString.trim().split("\n");
  const headers = rows.shift().split(",");

  const data = rows.map((row) => {
    const values = row.split(",");
    return headers.reduce((acc, header, i) => {
      acc[header] = values[i];
      return acc;
    }, {});
  });

  const customersMap = new Map();

  data.forEach((row) => {
    const customerId = Number(row.Customers_Id);
    if (customerId !== filterInput.Customers_Id) return; // Filter by customer

    if (!customersMap.has(customerId)) {
      customersMap.set(customerId, {
        Customers_Id: customerId,
        Customers_Name: row.Customers_Name,
        Products: new Map(),
      });
    }

    const customer = customersMap.get(customerId);

    const productId = Number(row.Products_Id);
    if (!customer.Products.has(productId)) {
      customer.Products.set(productId, {
        Products_Id: productId,
        Products_Name: row.Products_Name,
        Product_default: productId === filterInput.Products_Id,
        Categories: new Map(),
      });
    }

    const product = customer.Products.get(productId);

    const categoryId = Number(row.Categories_Id);
    if (!product.Categories.has(categoryId)) {
      product.Categories.set(categoryId, {
        Categories_Id: categoryId,
        Categories_Name: row.Categories_Name,
        Customer_Folder: row.Customer_Folder || null,
        Product_Folder: row.Product_Folder || null,
        Category_Folder: row.Category_Folder || null,
        Categories_default: categoryId === filterInput.Categories_Id,
      });
    }
  });

  // Convert maps to arrays and return only filtered customer
  const customer = customersMap.get(filterInput.Customers_Id);
  if (!customer) return null;

  return {
    Customers_Id: customer.Customers_Id,
    Customers_Name: customer.Customers_Name,
    Products: Array.from(customer.Products.values()).map((product) => ({
      Products_Id: product.Products_Id,
      Products_Name: product.Products_Name,
      Product_default: product.Product_default,
      Categories: Array.from(product.Categories.values()),
    })),
  };
}

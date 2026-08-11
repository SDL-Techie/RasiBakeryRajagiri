// import Product from "../model/productModel.js";

// /**
//  * Validates that every item in the order meets its product's minimumOrder requirement.
//  * items: [{ productId, quantity, ... }]
//  * Returns: { valid: boolean, errors: string[] }
//  */
// export const validateMinimumOrder = async (items) => {
//   const errors = [];

//   if (!items || !items.length) {
//     return { valid: false, errors: ["No items provided in order"] };
//   }

//   for (const item of items) {
//     const productId = item.productId || item.product; // adjust to match your item shape
//     const quantity = Number(item.quantity);

//     const product = await Product.findById(productId);

//     if (!product) {
//       errors.push(`Product ${productId} not found`);
//       continue;
//     }

//     const minOrder = product.minimumOrder || 1;

//     if (quantity < minOrder) {
//       errors.push(
//         `"${product.name}" requires a minimum order of ${minOrder}, but only ${quantity} was added`
//       );
//     }
//   }

//   return { valid: errors.length === 0, errors };
// };


import Product from "../model/productModel.js";

export const validateMinimumOrder = async (items) => {
  const errors = [];

  if (!items || !items.length) {
    return { valid: false, errors: ["No items provided in order"] };
  }

  for (const item of items) {
    const productId = item.productId || item.product;
    const quantity = Number(item.quantity);

    const product = await Product.findById(productId);

    if (!product) {
      errors.push(`Product ${productId} not found`);
      continue;
    }

    const minOrder = product.minimumOrder || 1;

    if (quantity < minOrder) {
      errors.push(
        `Minimum order for "${product.name}" is ${minOrder}. Please add at least ${minOrder} to place this order.`
      );
    }
  }

  return { valid: errors.length === 0, errors };
};
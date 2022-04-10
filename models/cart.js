// const Sequelize = require("sequelize");
// const sequalize = require("../util/database");

// const Cart = sequalize.define("cart", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
// });

// module.exports = Cart;

// const fs = require("fs");
// const path = require("path");

// const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

// module.exports = class Cart {
//   static addToCart(id, Price) {
//     //read the file

//     fs.readFile(p, (err, fileContent) => {
//       let cart = { products: [], totalPrice: 0 };
//       if (!err) {
//         cart = JSON.parse(fileContent);
//       }
//       //analyze the existing product

//       const existingProductIndex = cart.products.findIndex(
//         (prod) => prod.id === id
//       );
//       const existingProduct = cart.products[existingProductIndex];
//       let updatedProduct;
//       if (existingProduct) {
//         updatedProduct = { ...existingProduct };
//         updatedProduct.quantity = updatedProduct.quantity + 1;
//         cart.products[existingProductIndex] = updatedProduct;
//       } else {
//         updatedProduct = { id: id, quantity: 1 };
//         cart.products = [...cart.products, updatedProduct];
//       }
//       cart.totalPrice = cart.totalPrice + +Price;
//       //write it again

//       fs.writeFile(p, JSON.stringify(cart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static deleteProduct(id, price) {
//     fs.readFile(p, (err, fileContent) => {
//       if (err) {
//         return;
//       }
//       let updatedProducts = { ...JSON.parse(fileContent) };
//       const deletedProduct = updatedProducts.products.find(
//         (prod) => prod.id === id
//       );
//       const deletedProductQuantity = deletedProduct.quantity;
//       updatedProducts.products = updatedProducts.products.filter(
//         (prod) => prod.id !== id
//       );
//       updatedProducts.totalPrice =
//         updatedProducts.totalPrice - deletedProductQuantity * price;

//       fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static getCart(cb) {
//     fs.readFile(p, (err, fileContent) => {
//       const cart = JSON.parse(fileContent);
//       if (err) {
//         cb(null);
//       } else {
//         cb(cart);
//       }
//     });
//   }
// };

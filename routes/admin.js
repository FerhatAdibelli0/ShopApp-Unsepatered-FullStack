const express = require("express");
const routes = express.Router();
const productController = require("../controller/product");

//   /admin/add-product =>GET
routes.get("/add-product", productController.getAddProduct);
//   /admin/add-product =>POST

routes.post("/add-product", productController.postProduct);

//module.exports = routes;
exports.routes = routes;

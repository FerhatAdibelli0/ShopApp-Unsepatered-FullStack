const express = require("express");
const routes = express.Router();
const adminController = require("../controller/admin");

//   /admin/add-product =>GET
routes.get("/add-product", adminController.getAddProduct);
//   /admin/add-product =>POST

routes.post("/add-product", adminController.postProduct);

routes.get("/products", adminController.getProducts);

//module.exports = routes;
exports.routes = routes;



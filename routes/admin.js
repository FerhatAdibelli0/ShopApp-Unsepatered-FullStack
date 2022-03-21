const express = require("express");
const routes = express.Router();
const adminController = require("../controller/admin");

//   /admin/add-product =>GET
routes.get("/add-product", adminController.getAddProduct);
//   /admin/add-product =>POST

routes.get("/products", adminController.getProducts);

routes.post("/add-product", adminController.postProduct);


//module.exports = routes;
exports.routes = routes;



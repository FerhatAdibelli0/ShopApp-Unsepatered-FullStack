const express = require("express");
const routes = express.Router();
const productController = require("../controller/product");

routes.get("/", productController.allGetProduct);

module.exports = routes;

const express = require("express");
const routes = express.Router();
const shopController = require("../controller/shop");

routes.get("/", shopController.getIndex);
routes.get("/products", shopController.getProducts);
routes.get("/cart", shopController.getCart);
routes.get("/orders", shopController.getOrders);
routes.get("/checkout", shopController.getCheckout);

module.exports = routes;

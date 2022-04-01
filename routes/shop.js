const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-order", shopController.orderCart);

router.post("/cart-delete-product", shopController.deleteCartProduct);

router.get("/orders", shopController.getOrders);


module.exports = router;

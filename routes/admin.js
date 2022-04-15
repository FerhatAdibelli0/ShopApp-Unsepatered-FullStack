const path = require("path");
const express = require("express");
const isAuth = require("../middleware/is-auth");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;

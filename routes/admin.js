const path = require("path");
const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 200 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 200 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// router.post("/delete-product", isAuth, adminController.postDeleteProduct); // Without Async Request

router.delete("/product/:productId", isAuth, adminController.deleteProduct); // With Async Request

module.exports = router;

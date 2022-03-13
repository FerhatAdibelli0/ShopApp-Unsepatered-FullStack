const express = require("express");
const routes = express.Router();
const path = require("path");
const rootPath = require("../util/path");
const adminData = require("./admin");

routes.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("shop", {
    prods: products,
    changedTitle: "Shoplist",
    path: "/",
    hasProduct: products.length > 0,
    productCss: true,
    shopActive: true,
    //layout:false // İt wouldnt apply default layout
  });
});

module.exports = routes;

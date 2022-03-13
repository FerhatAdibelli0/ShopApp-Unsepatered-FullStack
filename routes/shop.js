const express = require("express");
const routes = express.Router();
const path = require("path");
const rootPath = require("../util/path");
const adminData = require("./admin");

routes.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("shop", { prods: products, changedTitle: "Shoplist" });
});

module.exports = routes;

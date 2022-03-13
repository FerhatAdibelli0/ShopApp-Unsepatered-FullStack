const express = require("express");
const routes = express.Router();
const path = require("path");
const rootPath = require("../util/path");
const adminData = require("./admin");

routes.get("/", (req, res, next) => {
  res.render("shop", { prods: adminData.products, changedTitle: "Shoplist" });
});

module.exports = routes;

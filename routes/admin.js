const express = require("express");
const routes = express.Router();
const path = require("path");
const rootPath = require("../util/path");


//   /admin/add-product =>GET
routes.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootPath, "views", "add-product.html"));
});
//   /admin/add-product =>POST
const products = [];
routes.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

//module.exports = routes;
exports.routes = routes;
exports.products = products;

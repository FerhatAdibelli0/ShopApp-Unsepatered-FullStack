const express = require("express");
const routes = express.Router();
const path = require("path");
const rootPath = require("../util/path");
const adminData = require("./admin");

routes.get("/", (req, res, next) => {
  console.log(adminData.products);
  res.sendFile(path.join(rootPath, "views", "shop.html"));
});

module.exports = routes;

const express = require("express");
const routes = express.Router();
const path = require("path");
const rootPath = require("../util/path");

routes.get("/", (req, res, next) => {
  res.sendFile(path.join(rootPath, "views", "shop.html"));
});

module.exports = routes;

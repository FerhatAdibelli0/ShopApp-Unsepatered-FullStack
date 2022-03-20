const Product = require("../models/product");

exports.postProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    changedTitle: "AddProduct",
    path: "admin/add-product",
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      changedTitle: "Admin Products",
      path: "admin/products",
    });
  });
};

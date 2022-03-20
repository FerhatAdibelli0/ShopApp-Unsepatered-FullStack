const Product = require("../models/product");

exports.postProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product(title, imageUrl, description, price);
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

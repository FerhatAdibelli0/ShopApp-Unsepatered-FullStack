const Product = require("../models/product");

exports.allGetProduct = (req, res, next) => {
  Product.fetchAll((products) => {
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
};

exports.postProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    changedTitle: "AddProduct",
    path: "admin/add-product",
    formCss: true,
    productCss: true,
    productActive: true,
  });
};

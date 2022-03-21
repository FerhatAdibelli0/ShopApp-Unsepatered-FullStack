const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      changedTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      changedTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    changedTitle: "Cart",
    path: "/cart",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    changedTitle: "Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    changedTitle: "Checkout",
    path: "/checkout",
  });
};

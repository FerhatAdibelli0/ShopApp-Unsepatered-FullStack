const { redirect } = require("express/lib/response");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const paramId = req.params.productId;
  Product.findbyId(paramId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      path: "/products",
      pageTitle: product.title,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (prod of products) {
        const cartProductsData = cart.products.find((p) => p.id === prod.id);
        if (cartProductsData) {
          cartProducts.push({
            productData: prod,
            quantity: cartProductsData.quantity,
          });
        }
      }
      res.render("shop/cart", {
        products: cartProducts,
        path: "/cart",
        pageTitle: "Your Cart",
      });
    });
  });
};

exports.deleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findbyId(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart")
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findbyId(prodId, (product) => {
    Cart.addToCart(prodId, product.price);
  });
  res.redirect("/");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

const { redirect } = require("express/lib/response");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const paramId = req.params.productId;
  // Product.findAll({ where: { id: paramId } })
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       product: product[0],
  //       path: "/products",
  //       pageTitle: product[0].title,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  Product.findByPk(paramId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        path: "/products",
        pageTitle: product.title,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((product) => {
          res.render("shop/cart", {
            products: product,
            path: "/cart",
            pageTitle: "Your Cart",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (prod of products) {
  //       const cartProductsData = cart.products.find((p) => p.id === prod.id);
  //       if (cartProductsData) {
  //         cartProducts.push({
  //           productData: prod,
  //           quantity: cartProductsData.quantity,
  //         });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       products: cartProducts,
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //     });
  //   });
  //  });
};

exports.deleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts({ where: { id: prodId } })
        .then((products) => {
          let product = products[0];
          product.cartItem.destroy();
        })
        .then((result) => {
          res.redirect("/cart");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQunatity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart
        .getProducts({ where: { id: prodId } })
        .then((products) => {
          let product;
          if (products.length > 0) {
            product = products[0];
          }
          if (product) {
            let oldQuantity = product.cartItem.quantity;
            newQunatity = oldQuantity + 1;
            return product;
          }
          return Product.findByPk(prodId);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQunatity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });

  // Product.findbyId(prodId, (product) => {
  //   Cart.addToCart(prodId, product.price);
  // });
  // res.redirect("/");
};

exports.orderCart = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart
        .getProducts()
        .then((products) => {
          return req.user
            .createOrder()
            .then((order) => {
              return order.addProducts(
                products.map((product) => {
                  product.orderItem = {
                    quantity: product.cartItem.quantity,
                  };
                  return product;
                })
              );
            })
            .then((result) => {
              return fetchedCart.setProducts(null);
            })
            .then((result) => {
              res.redirect("/orders");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

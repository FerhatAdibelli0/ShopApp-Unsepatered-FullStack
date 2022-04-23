const { redirect } = require("express/lib/response");
const Product = require("../models/product");
const User = require("../models/users");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        // isAuthenticated: req.session.isLoggedIn,
        // csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const paramId = req.params.productId;
  Product.findById(paramId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        path: "/products",
        pageTitle: product.title,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
    });

  // WİTH SEQUELİZE
  // Product.findByPk(paramId)
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       product: product,
  //       path: "/products",
  //       pageTitle: product.title,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

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
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        products: products,
        path: "/cart",
        pageTitle: "Your Cart",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
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

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
    });

  // WİTH SEQUELİZE

  // let fetchedCart;
  // let newQunatity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart
  //       .getProducts({ where: { id: prodId } })
  //       .then((products) => {
  //         let product;
  //         if (products.length > 0) {
  //           product = products[0];
  //         }
  //         if (product) {
  //           let oldQuantity = product.cartItem.quantity;
  //           newQunatity = oldQuantity + 1;
  //           return product;
  //         }
  //         return Product.findByPk(prodId);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQunatity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // Product.findbyId(prodId, (product) => {
  //   Cart.addToCart(prodId, product.price);
  // });
  // res.redirect("/");
};

exports.deleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
    });
};

exports.orderCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: i.productId._doc };
      });

      const order = new Order({
        products: products,
        user: { email: req.user.email, userId: req.user },
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
      //   fetchedCart = cart;
      //   return cart
      //     .getProducts()
      //     .then((products) => {
      //       return req.user
      //         .createOrder()
      //         .then((order) => {
      //           return order.addProducts(
      //             products.map((product) => {
      //               product.orderItem = {
      //                 quantity: product.cartItem.quantity,
      //               };
      //               return product;
      //             })
      //           );
      //         })
      //         .then((result) => {
      //           return fetchedCart.setProducts(null);
      //         })
      //         .then((result) => {
      //           res.redirect("/orders");
      //         })
      //         .catch((err) => {
      //           console.log(err);
      //         });
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceId = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceId);
      // Creating Pdf on the fly
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline;filename='" + invoiceId + "'"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment;filename='" + invoiceId + "'"
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc.text(
          prod.product.title +
            "--" +
            prod.quantity +
            "X -- Price" +
            prod.product.price
        );
      });
      pdfDoc.fontSDize(15).text("Total Price" + totalPrice);

      pdfDoc.end();

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   // res.setHeader("Content-Disposition", "inline;filename='" + invoiceId + "'");
      //   res.setHeader(
      //     "Content-Disposition",
      //     "attachment;filename='" + invoiceId + "'"
      //   );
      //   res.send(data);
      // });

      // Reading concreate file in memory
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   "inline;filename='" + invoiceId + "'"
      // );
      // res.setHeader(
      //   "Content-Disposition",
      //   "attachment;filename='" + invoiceId + "'"
      // );
      // file.pipe(res);
    })
    .catch((err) => next(err));
};

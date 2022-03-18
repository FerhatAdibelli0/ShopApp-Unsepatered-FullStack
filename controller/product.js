const products = [];

exports.allGetProduct = (req, res, next) => {
  res.render("shop", {
    prods: products,
    changedTitle: "Shoplist",
    path: "/",
    hasProduct: products.length > 0,
    productCss: true,
    shopActive: true,
    //layout:false // İt wouldnt apply default layout
  });
};

exports.postProduct = (req, res, next) => {
  products.push({ title: req.body.title });
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

exports.error = (req, res, next) => {
  res.status(404).render("404", { changedTitle: "Error", path: "" });
};

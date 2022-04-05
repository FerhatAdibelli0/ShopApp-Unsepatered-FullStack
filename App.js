const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
// const sequelize = require("./util/database");
// const Product = require("./models/product");
// const User = require("./models/users");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cartItem");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// const Order = require("./models/order");
// const OrderItem = require("./models/orderItem");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/users");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// MİDLEWARE FOR EMBED REQ.USER TO SQUELİZE OBJECT

app.use((req, res, next) => {
  User.findByPk("624c98e2ec754251fe3f0756")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

//Routes

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

//Associations for MySQL

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Product.belongsToMany(Order, { through: OrderItem });
// Order.belongsToMany(Product, { through: OrderItem });

// SEQUELİZE FOR CREATE USER,CART AND SERVER

// sequelize
// .sync({ force: true })
// .sync()
// .then(() => {
//   return User.findByPk(1);
// })
// .then((user) => {
//   if (!user) {
//     return User.create({ name: "Ferhat", email: "ferhatadibelli@gmail.com" });
//   }
//   return user;
// })
// .then((user) => {
//   user.createCart();
// })
// .then(() => {
//   app.listen(3000);
// })
// .catch((err) => {
//   console.log(err);
// });

mongoConnect(() => {
  app.listen(3000);
});

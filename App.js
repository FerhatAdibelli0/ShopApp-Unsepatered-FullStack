const express = require("express");

const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/users");
const mongoose = require("mongoose");

// const sequelize = require("./util/database");
// const Product = require("./models/product");
// const User = require("./models/users");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cartItem");
// const Order = require("./models/order");
// const OrderItem = require("./models/orderItem");

const MONGO_URI =
  "mongodb+srv://maxpayne35:qGBr7naSXYmEYnw@cluster0.sp51h.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// MİDLEWARE FOR EMBED REQ.USER TO SQUELİZE OBJECT

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//Routes

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
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

// MongoDb Driver

// mongoConnect(() => {
//   app.listen(3000);
// });

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    app.listen(3000);
    console.log("Connected with mongoose");
  })
  .catch((err) => {
    console.log(err);
  });

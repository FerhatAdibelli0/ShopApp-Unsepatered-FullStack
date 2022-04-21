const express = require("express");

const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/users");
const mongoose = require("mongoose");
const { diskStorage } = require("multer");
// Creating csrf middleware
const csrfProtection = csrf();

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

const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + "-" + file.originalname);
  },
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single("image"));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// İmportant to use it just after session
app.use(csrfProtection);
app.use(flash());

// MİDLEWARE FOR EMBED REQ.USER TO SQUELİZE OBJECT

// Middleware for including every page rendering
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error("changed"); // if throw error in synch code Error middleware catch it but in async code it doesnt you should next(new Error(err))
  if (!req.session.user) {
    return next();
  } else {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        // console.log(err);
        next(new Error(err));
      });
  }
});

//Routes

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);
// ERROR MIDDLEWARE
app.use((error, req, res, next) => {
  console.log(error);
  return res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
  });
  // res.redirect("/500");
});

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

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
//const handleBrs = require("express-handlebars");


// Parsing body
app.use(bodyParser.urlencoded({ extended: false }));

// Static file for css sheet
app.use(express.static(path.join(__dirname, "public")));
// Templating Engine

// app.engine(
//   "handlebars",
//   handleBrs({
//     layoutsDir: "views/layout",
//     defaultLayout: "main-layout",
//     extname: "handlebars",
//   })
// );
app.set("view engine","ejs");
//app.set("view engine", "pug"); // with PUG Engine
//app.set("view engine", "handlebars"); // with handlebars
app.set("view engine", "ejs");
app.set("views", "views");

// if you use get,post and so on in routes no matter order is here

app.use("/admin/", adminData.routes);
app.use(shopRoutes);

app.use("/", (req, res, next) => {
  res.status(404).render("404", { changedTitle: "Error" });
});

app.listen(3000);

// const server = http.createServer(app);
// server.listen(3000);

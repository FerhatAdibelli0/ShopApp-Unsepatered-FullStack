const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
// if you use get,post and so on in routes no matter order is here

app.use("/admin/", adminRoutes);
app.use(shopRoutes);

app.use("/", (req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "not-found.html"));
});

app.listen(3000);

// const server = http.createServer(app);
// server.listen(3000);

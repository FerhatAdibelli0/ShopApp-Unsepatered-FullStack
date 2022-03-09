
const express = require("express");
const app = express();

app.use("/", (req, res, next) => {
  console.log("starting");
  next();
});

app.use("/add-product", (req, res, next) => {
  console.log("This is product");
  res.send("<h1>Adding product item</h1>");
});

app.use("/", (req, res, next) => {
  console.log("This is main");
  res.send("<h1>Welcome Express Js!!</h1>");
});

app.listen(3000);

// const server = http.createServer(app);
// server.listen(3000);

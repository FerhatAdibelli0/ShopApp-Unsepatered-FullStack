const User = require("../models/users");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").trim().split("=")[1] === "true";
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("625457d437b7dd80595dcc81")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
  //   res.setHeader("Set-Cookie", "loggedIn=true");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
    console.log(err);
  });
};

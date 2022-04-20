const User = require("../models/users");
const Bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1d9eaf02d961ed",
    pass: "371d4577bdfb78",
  },
});

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      errorValidation: errors.array(),
    });
  }

  Bcryptjs.hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transport.sendMail({
        from: "ferhatadibelli@software.com",
        to: email,
        subject: "Design Your Model S | Ferhat",
        html: "<h1>Great! You are successful</h1><p>Get your <b>Car</b> today!</p>",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    errorValidation: [],
  });
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  //   const isLoggedIn = req.get("Cookie").trim().split("=")[1] === "true";
  res.status(422).render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message,
    errorValidation: [],
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  // return res.status(422).render("auth/login", {
  //   path: "/login",
  //   pageTitle: "Login",
  //   isAuthenticated: false,
  //   errorMessage: errors.array()[0].msg,
  //   errorValidation: errors.array(),
  //   oldInput: {
  //     email: email,
  //     password: password,
  //   },
  // });
  // }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // req.flash("error", "invalid email or password"); // it is in session now
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          isAuthenticated: false,
          errorMessage: "invalid email or password",
          errorValidation: [{ param: "email" }],
          oldInput: {
            email: email,
            password: password,
          },
        });
      }
      Bcryptjs.compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => {
              res.redirect("/");
            });
          }
          // req.flash("error", "invalid email or password");
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            isAuthenticated: false,
            errorMessage: "invalid email or password",
            errorValidation: [{ param: "password" }],
            oldInput: {
              email: email,
              password: password,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/login");
    });

  // User.findById("625457d437b7dd80595dcc81")
  //   .then((user) => {
  //     req.session.isLoggedIn = true;
  //     req.session.user = user;
  //     req.session.save(() => {
  //       res.redirect("/");
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //   res.setHeader("Set-Cookie", "loggedIn=true");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
    console.log(err);
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "There is not such that Email.Please check it...");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExparation = Date.now() + 360000;
        return user
          .save()
          .then((result) => {
            res.redirect("/");
            return transport.sendMail({
              from: "ferhatadibelli@software.com",
              to: req.body.email,
              subject: "Design Your Model S | Ferhat",
              html: `
              <p>You want to reset your password</p>
              <p>You should <a href="http://localhost:3000/reset/${token}">Click this link</a> to reset it</p>
              `,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExparation: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        isAuthenticated: false,
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let resetUser;
  let userEmail;
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExparation: { $gt: Date.now() },
  })
    .then((user) => {
      userEmail = user.email;
      resetUser = user;
      return Bcryptjs.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExparation = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transport.sendMail({
        from: "ferhatadibelli@software.com",
        to: userEmail,
        subject: "Update Password",
        html: `<p>Your password is updated!!!</p> `,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

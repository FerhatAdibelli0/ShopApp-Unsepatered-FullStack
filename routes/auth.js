const express = require("express");
const { check, body } = require("express-validator");
const User = require("../models/users");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/logout", authController.postLogout);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("E-mail is not convenient for login")
      .normalizeEmail(),
    check("password", "Password is not convenient for login")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email..!")
      .custom((value, { req }) => {
        // if (value === "benal@gmail.com") {
        //   throw new Error("This mail is forbidden");
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exist already,please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please enter alfhanumeric and at least 5 characters")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Dont macth password");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;

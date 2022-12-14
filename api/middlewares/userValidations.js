const { body } = require("express-validator");
const User = require("../models/User")

const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("Name required.")
      .isLength({ min: 3 })
      .withMessage("The name requires at least 3 characters."),

    body("email")
      .isString()
      .withMessage("E-mail required.")
      .isEmail()
      .withMessage("The e-mail is not valid.")
      .custom(async value => {
        return User.findOne({ email: value }).then((res) => {
          if (res) {
            return Promise.reject("An account with this email already exists.");
          }
        })
      }),

    body("password")
      .isString()
      .withMessage("Password required.")
      .isLength({ min: 5 })
      .withMessage("The password requires at least 5 characters."),

    body("confirmPassword")
      .isString()
      .withMessage("Password confirmation required.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("Password fields don't match.")
        }
        return true;
      })
  ]
}

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("E-mail required.")
      .isEmail()
      .withMessage("The e-mail is not valid."),

    body("password")
      .isString()
      .withMessage("Password required.")
  ]
}

//TODO: optional + isLength not working
const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("The name requires at least 3 characters."),

    body("password")
      .optional()
      .isLength({ min: 5 })
      .withMessage("The password requires at least 5 characters.")
  ]
}

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation
}
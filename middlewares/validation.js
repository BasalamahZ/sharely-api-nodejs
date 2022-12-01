import { body } from "express-validator";
import User from "../models/User.js";

export const validateRegisterEmail = body(
  "email",
  "Please enter a valid e-mail address."
)
  .isEmail()
  .custom(value => {
    return User.findOne({
      where: {
        email: value,
      },
    }).then(user => {
      if (user) {
        return Promise.reject(
          "E-Mail already exists, please enter other e-mail!"
        );
      }
    });
  })
  .normalizeEmail();

export const validateLoginEmail = body(
  "email",
  "Please enter a valid e-mail address."
)
  .isEmail()
  .normalizeEmail();

export const validatePassword = body(
  "password",
  "Please enter a alphanumeric password and at least 6 characters long."
)
  .isLength({ min: 6 })
  .isAlphanumeric()
  .trim();

export const validatePhoneNumber = body(
  "phoneNumber",
  "Please enter a number for phone number and should containt 11 - 13 digit"
)
  .isNumeric()
  .isLength({ min: 11, max: 13 });

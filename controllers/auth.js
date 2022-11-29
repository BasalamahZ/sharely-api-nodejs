import User from "../models/User.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      message: "success",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;
    const hash = await bcrypt.hash(password, 10);
    if (hash) {
      const user = await User.create({
        fullName: fullName,
        email: email,
        password: hash,
        phoneNumber: phoneNumber,
      });
      return res.status(200).send({
        status: true,
        message: "User registered successfully!",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Something Wrong",
      });
    }

    const validate = await bcrypt.compare(req.body.password, user.password);
    if (!validate) {
      return res.status(400).send({
        success: false,
        message: "Something Wrong",
      });
    }

    const token = Jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT,
      {
        expiresIn: "3d",
      }
    );
    return res.status(200).send({
      success: true,
      message: "success",
      data: {
        id: user._id,
        accessToken: token,
      },
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};

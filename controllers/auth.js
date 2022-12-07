import User from "../models/User.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import AWS from "aws-sdk";
import path from "path";
import { AWSConfig } from "../configs/awsconfig.js";

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.findOne({
      where: {
        id: userId,
      },
    });
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        message: errors.array()[0].msg,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    if (hash) {
      const user = await User.create({
        fullName: fullName,
        email: email,
        password: hash,
        phoneNumber: phoneNumber,
        point: 0,
        count: 0,
      });
      return res.status(200).send({
        status: true,
        message: "User registered successfully!",
        data: user,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        message: errors.array()[0].msg,
      });
    }
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid e-Mail or password!",
      });
    }

    const validate = await bcrypt.compare(req.body.password, user.password);
    if (!validate) {
      return res.status(400).send({
        success: false,
        message: "Invalid e-Mail or password!",
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
      data: user,
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const image = async (req, res) => {
  const data = await AWSConfig(req.files);
  const extensionName = path.extname(data.Key); // fetch the file extension
  const allowedExtension = [".png", ".jpg", ".jpeg"];

  if (!allowedExtension.includes(extensionName)) {
    return res.status(422).send({
      success: false,
      message: "Please enter a valid image.",
    });
  }
  const userId = req.params.id;
  const newData = User.update(
    {
      ktp: data.Location,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  res.status(200).send({
    success: true,
    message: "File successfully uploaded",
    data: data,
  });
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fullName, password, phoneNumber } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const users = await User.update(
      {
        fullName: fullName,
        password: hash,
        phoneNumber: phoneNumber,
      },
      {
        where: {
          id: userId,
        },
        returning: true,
        plain: true,
      }
    );
    return res.status(200).send({
      success: true,
      message: "success",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

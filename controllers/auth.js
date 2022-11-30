import User from "../models/User.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import AWS from "aws-sdk";

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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(409).send(errors.array()[0].msg);
    }
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
      return res.status(404).send(errors.array()[0].msg);
    }
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid e-Mail or password!"
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
      data: {
        id: user._id,
        accessToken: token,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const image = async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });
  const s3 = new AWS.S3();
  const fileContent = Buffer.from(req.files.data.data, "binary");
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.files.data.name,
    Body: fileContent,
  };
  const userId = req.params.id;
  s3.upload(params, (err, data) => {
    if (err) {
      throw err;
    }
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
  });
};

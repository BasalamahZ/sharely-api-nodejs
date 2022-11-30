import { DataTypes } from "sequelize";
import db from "../configs/dbconfig.js";

const User = db.define(
  "users",
  {
    fullName: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ktp: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  },
  {
    freezeTableName: true,
  }
);

export default User;

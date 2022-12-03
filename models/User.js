import { DataTypes } from "sequelize";
import db from "../configs/dbconfig.js";

const User = db.define(
  "users",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ktp: {
      type: DataTypes.TEXT,
    },
    point: {
      type: DataTypes.INTEGER,
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

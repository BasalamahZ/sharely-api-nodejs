import { DataTypes } from "sequelize";
import db from "../configs/dbconfig.js";
import Event from "./Event.js";

const Helper = db.define(
  "helpers",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    place: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  },
  {
    freezeTableName: true,
  }
);

export default Helper;

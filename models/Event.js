import { DataTypes } from "sequelize";
import db from "../configs/dbconfig.js";

const Event = db.define(
  "events",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    status: {
      type: DataTypes.STRING,
    },
    helpedBy: {
      type: DataTypes.STRING,
    },
    review: {
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

export default Event;

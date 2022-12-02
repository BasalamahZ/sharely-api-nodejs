import { DataTypes } from "sequelize";
import db from "../configs/dbconfig.js";
import Helper from "./Helper.js";
import User from "./User.js";

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
Event.hasMany(Helper);
Helper.belongsTo(User);
// User.hasMany(Event);
// Event.hasMany(Helper);
Event.belongsTo(User);
// Helper.belongsTo(Event)
// Helper.hasOne(User);
// User.belongsTo(Helper)

export default Event;

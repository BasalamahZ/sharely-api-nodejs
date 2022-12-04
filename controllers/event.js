import Event from "../models/Event.js";
import Helper from "../models/Helper.js";
import db from "../configs/dbconfig.js";
import User from "../models/User.js";
import { Sequelize, Op } from "sequelize";

export const createEvent = async (req, res) => {
  try {
    const { title, detail, phoneNumber, latitude, longitude, place, userId } =
      req.body;
    const avalaible = await Event.findOne({
      where: {
        [Op.and]: [
          { userId: userId },
          { status: ["ongoing", "waiting for help"] },
        ],
      },
      include: [
        {
          model: User,
        },
      ],
    });
    console.log(avalaible);
    if (avalaible) {
      return res.status(400).send({
        success: false,
        message: "Invalid, Event has been created",
      });
    }
    const events = await Event.create({
      title: title,
      detail: detail,
      phoneNumber: phoneNumber,
      latitude: latitude,
      longitude: longitude,
      place: place,
      userId: userId,
      status: "ongoing",
    });
    return res.status(200).send({
      status: true,
      message: "Successfully Created!",
      data: events,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const getEvent = async (req, res) => {
  try {
    const loginUser = req.user;
    console.log(loginUser);
    const events = await Event.findAll({
      where: {
        [Op.and]: [
          { status: ["waiting for help", "ongoing"] },
          { [Op.not]: { userId: req.user.id } },
        ],
      },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "fullName",
            "email",
            "phoneNumber",
            "point",
            "count",
          ],
        },
        {
          model: Helper,
          attributes: [
            "id",
            "userId",
            "title",
            "message",
            "phoneNumber",
            "place",
          ],
          include: "user",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      success: true,
      message: "success",
      data: events,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEventById = async (req, res) => {
  try {
    let events;
    const userId = req.params.userId;
    const status = req.query.status;
    if (status) {
      events = await Event.findAll({
        where: {
          [Op.and]: [{ userId: userId }, { status: status }],
        },
        include: [
          {
            model: User,
            attributes: [
              "id",
              "fullName",
              "email",
              "phoneNumber",
              "point",
              "count",
            ],
          },
          {
            model: Helper,
            attributes: ["userId", "title", "message", "phoneNumber", "place"],
            include: "user",
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } else {
      events = await Event.findAll({
        where: {
          userId: userId,
        },
        include: [
          {
            model: User,
            attributes: [
              "id",
              "fullName",
              "email",
              "phoneNumber",
              "point",
              "count",
            ],
          },
          {
            model: Helper,
            attributes: ["userId", "title", "message", "phoneNumber", "place"],
            include: "user",
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    }
    if (!events) {
      return res.status(400).send({
        success: false,
        message: "Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "success",
      data: events,
    });
  } catch (error) {
    console.log(error);
  }
};

export const finishedEvent = async (req, res) => {
  const eventsId = req.params.eventId;
  const helper = req.body.helper;
  const events = await Event.update(
    {
      helper: helper,
      review: req.body.review,
      status: "finished",
    },
    {
      where: {
        id: eventsId,
      },
    }
  );

  const users = await User.update(
    {
      point: Sequelize.fn("100 + ", Sequelize.col("point")),
      count: Sequelize.fn("1 + ", Sequelize.col("count")),
    },

    {
      where: {
        id: helper,
      },
    }
  );
  res.status(200).send({
    success: true,
    message: "success",
    data: events,
    data1: users,
  });
};

export const cancelEvent = async (req, res) => {
  const eventsId = req.params.eventId;
  const events = await Event.update(
    {
      status: "canceled",
    },
    {
      where: {
        id: eventsId,
      },
    }
  );
  res.status(200).send({
    success: true,
    message: "success",
    data: events,
  });
};

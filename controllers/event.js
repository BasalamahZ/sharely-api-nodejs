import Event from "../models/Event.js";
import Helper from "../models/Helper.js";
import User from "../models/User.js";

export const createEvent = async (req, res) => {
  try {
    const { title, detail, phoneNumber, latitude, longitude, place, userId } =
      req.body;
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
    const events = await Event.findAll({
      where: {
        status: ["waiting for help", "ongoing"],
      },
      include: [
        {
          model: Helper,
          attributes: ["title", "message", "phoneNumber", "place"],
          include: "user",
        },
      ],
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
    const userId = req.params.id;
    const events = await Event.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: Helper,
          attributes: ["title", "message", "phoneNumber", "place"],
          include: "user",
        },
      ],
    });
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
  const eventsId = req.params.id;
  const events = await Event.update(
    {
      review: req.body.review,
      status: "finished",
    },
    {
      where: {
        id: eventsId,
      },
    }
  );
  // const users = await User.update({
  //   where:{
  //     id: ev
  //   }
  // })
  res.status(200).send({
    success: true,
    message: "success",
    data: events,
  });
};

export const cancelEvent = async (req, res) => {
  const eventsId = req.params.id;
  const events = await Event.destroy({
    where: {
      id: eventsId,
    },
  });
  res.status(200).send({
    success: true,
    message: "success",
    data: events,
  });
};

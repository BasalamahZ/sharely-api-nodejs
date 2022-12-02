import Helper from "../models/Helper.js";
import Event from "../models/Event.js";

export const createHelper = async (req, res) => {
  try {
    const { title, message, phoneNumber, eventId, userId, place } = req.body;
    const helpers = await Helper.create({
      userId: userId,
      title: title,
      message: message,
      phoneNumber: phoneNumber,
      eventId: eventId,
      place: place,
    });
    const events = await Event.update(
      {
        status: "waiting for help",
      },
      {
        where: {
          id: eventId,
        },
      }
    );
    return res.status(200).send({
      success: true,
      message: "Create Helper Successfully",
      data: helpers,
      data1: events
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const getHelper = async (req, res) => {
  try {
    const helpers = await Helper.findAll({ include: "users" });
    res.status(200).json({
      success: true,
      message: "success",
      data: helpers,
    });
  } catch (error) {
    console.log(error);
  }
};
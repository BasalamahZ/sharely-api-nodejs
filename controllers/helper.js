import Helper from "../models/Helper.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import FCM from "fcm-node";

export const createHelper = async (req, res) => {
  try {
    const {
      title,
      message,
      phoneNumber,
      eventId,
      longitude,
      latitude,
      userId,
      place,
    } = req.body;

    const helpers = await Helper.create({
      userId: userId,
      title: title,
      message: message,
      phoneNumber: phoneNumber,
      eventId: eventId,
      longitude: longitude,
      latitude: latitude,
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
    const findUser = await Event.findOne({
      where: {
        id: eventId,
      },
      include: [
        {
          model: User,
          attributes: ["fcmToken"],
        },
      ],
    });
    let fcm = new FCM(process.env.FIREBASE_SERVER_KEY);
    const token = findUser.user.fcmToken;
    let messages = {
      to: token,
      notification: {
        title: "Someone is going to help you",
        body: message,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "https://res.cloudinary.com/damocpbv0/image/upload/v1670417144/128_htgmsz.png",
      },
    };
    fcm.send(messages, (err, response) => {
      if (err) {
        next(err);
      } else {
        return res.status(200).send({
          status: true,
          message: "Successfully Created!",
          data: helpers,
          response: response,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const getEventByIdHelper = async (req, res) => {
  try {
    // const helperId = req.user.id;
    const events = await Event.findAll({
      where: {
        status: "waiting for help",
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
          where: {
            userId: req.user.id,
          },
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

export const getHelper = async (req, res) => {
  try {
    const helpers = await Helper.findAll({ include: "user" });
    res.status(200).json({
      success: true,
      message: "success",
      data: helpers,
    });
  } catch (error) {
    console.log(error);
  }
};

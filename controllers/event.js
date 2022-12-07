import Event from "../models/Event.js";
import Helper from "../models/Helper.js";
import User from "../models/User.js";
import { Sequelize, Op } from "sequelize";
import FCM from "fcm-node";
import fetch from "node-fetch";

export const createEvent = async (req, res) => {
  try {
    const { title, detail, phoneNumber, latitude, longitude, place, userId } =
      req.body;
    let fcm = new FCM(process.env.FIREBASE_SERVER_KEY);
    let message = {
      to: "/topics/sharely",
      notification: {
        title: title,
        body: detail,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon",
      },
    };
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
    fcm.send(message, (err, response) => {
      if (err) {
        next(err);
      } else {
        return res.status(200).send({
          status: true,
          message: "Successfully Created!",
          data: events,
          response: response,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const subsFirebase = async (req, res) => {
  const fcmToken = req.body.fcmToken;
  const userId = req.params.userId;
  const users = User.update(
    {
      fcmToken: fcmToken,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  fetch("https://iid.googleapis.com/iid/v1/" + fcmToken + "/rel/topics/sharely", {
    method: "PUT",
    headers: {
      Authorization: "key=" + process.env.FIREBASE_SERVER_KEY,
    },
  })
    .then(() => {
      console.log(req.body);
      res.status(200).send({
        success: true,
        message: "subscribed",
      });
    })
    .catch(error => {
      res.status(500).send({
        success: false,
        message: "something went wrong",
      });
      console.log(error);
    });
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
    if (status == "canceled") {
      events = await Event.findAll({
        where: {
          [Op.and]: [{ userId: userId }, { status: "canceled" }],
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
    } else if (status == "finished") {
      events = await Event.findAll({
        where: {
          [Op.and]: [{ userId: userId }, { status: "finished" }],
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
    } else if (status == "ongoing") {
      events = await Event.findAll({
        where: {
          [Op.and]: [
            { userId: userId },
            { status: ["waiting for help", "ongoing"] },
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
  });
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
  });
};

// dboqTRkA7m7waQtYtb7DAV:APA91bFdMM5NyN-bTUEL0H4V_B8b4baz1YoK_B1x3s9ag0iJkRXVXWOEWSIeMvs3NNSP6gQuJyKOnqqKKlx6avITcumLfs8Tr7q7KftcaPqrZhy4xp8zDSHWzWG6klWPKd1Y1OF4iEgc

// export const subsFirebase = async (req, res) => {
//   const notification = {
//     title: "title of notif",
//     text: "subtitle",
//   };

//   const fcm_tokens = [
//     "dboqTRkA7m7waQtYtb7DAV:APA91bFdMM5NyN-bTUEL0H4V_B8b4baz1YoK_B1x3s9ag0iJkRXVXWOEWSIeMvs3NNSP6gQuJyKOnqqKKlx6avITcumLfs8Tr7q7KftcaPqrZhy4xp8zDSHWzWG6klWPKd1Y1OF4iEgc",
//   ];

//   let notif_body = {
//     notification: notification,
//     registration_ids: fcm_tokens,
//   };
//   fetch("https://fcm.googleapis.com/fcm/send", {
//     method: "POST",
//     headers: {
//       Authorization: "key=" + process.env.FIREBASE_SERVER_KEY,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(notif_body),
//   })
//     .then(() => {
//       res.status(200).send("notification send successfully");
//     })
//     .catch((error) => {
//       res.status(400).send("something went wrong")
//       console.log(error);
//     });
// };

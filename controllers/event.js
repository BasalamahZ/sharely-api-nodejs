import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const { title, detail, phoneNumber, latitude, longitude } = req.body;
    const events = await Event.create({
      title: title,
      detail: detail,
      phoneNumber: phoneNumber,
      latitude: latitude,
      longitude: longitude,
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
    const events = await Event.findAll();
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
    const eventsId = req.params.id;
    const events = await Event.findOne({
      where: {
        id: eventsId,
      },
    });
    res.status(200).json({
      success: true,
      message: "success",
      data: {
        title: events.title,
        detail: events.detail,
        createdAt: events.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const finishedEvent = async (req, res) => {
  const eventsId = req.params.id;
  const events = Event.update(
    {
      helpedBy: req.body.helpedBy,
      review: req.body.review,
      status: "finished",
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

export const cancelEvent = async (req, res) => {
  const eventsId = req.params.id;
  const events = Event.destroy(
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

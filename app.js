import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
dotenv.config();
import db from "./configs/dbconfig.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import helperRoutes from "./routes/helperRoutes.js";
import User from "./models/User.js";
import Event from "./models/Event.js";
import Helper from "./models/Helper.js";

const app = express();
const port = process.env.PORT || 3000;

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
  // await Helper.drop();
  // await Event.drop();
  // await User.drop();
  // await User.sync();
  // await Event.sync();
  // await Helper.sync();
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use(authRoutes);
app.use(eventRoutes);
app.use(helperRoutes);

app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`);
});

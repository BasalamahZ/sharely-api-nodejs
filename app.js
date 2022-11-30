import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
dotenv.config();
import db from "./configs/dbconfig.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import User from "./models/User.js";
import Event from "./models/Event.js";

const app = express();
const port = process.env.PORT || 3000;

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
  // await User.drop();
  // await User.sync()
  // await Event.drop();
  // await Event.sync()
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

app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`);
});

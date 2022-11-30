import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import db from "./configs/dbconfig.js";
import authRoutes from "./routes/index.js";
import User from "./models/User.js";

const app = express();
const port = process.env.PORT || 3000;

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
  // await User.drop();
  // await Post.drop();
  // await User.sync()
  // await Post.sync()
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use(authRoutes);

app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`);
});

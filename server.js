import { APP_PORT, DB_URL, RAZORPAY_API_KEY, RAZORPAY_API_SECRET } from "./config";
import express, { urlencoded } from "express";
const app = express();
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";
import mongoose from "mongoose";
import cors from "cors";
import Razorpay from "razorpay";
import path from "path";
const bodyParser = require("body-parser");

// Database Connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected...");
});

// Razorpay Instance
export const instance = new Razorpay({
  key_id: RAZORPAY_API_KEY,
  key_secret: RAZORPAY_API_SECRET,
});

global.appRoot = path.resolve(__dirname);
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routes);
app.use("/uploads", express.static("uploads"));
// app.use("/", routes);
app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`));

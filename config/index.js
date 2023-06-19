import dotenv from "dotenv";
dotenv.config();

export const { APP_PORT, DEV_MODE, DB_URL, JWT_SECRET, REFRESH_SECRET, RAZORPAY_API_KEY, RAZORPAY_API_SECRET, APP_URL } = process.env;

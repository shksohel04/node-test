import express from "express";
import { RAZORPAY_API_KEY } from "../config";
const router = express.Router();
import { registerController, loginController, userController, refreshController, logoutController, paymentController, courseController } from "../controllers";
import auth from "../middlewares/auth";
import admin from "../middlewares/admin";
import multer from "multer";

// router.get("/", (req, res) => {
//   res.send("HI MY Name Rehan");
// });
router.post("/api/register", registerController.register);
router.post("/api/login", loginController.login);
router.get("/api/me", auth, userController.me);
router.post("/api/refresh", refreshController.refreshToken);
router.post("/api/logout", auth, logoutController.logout);
router.post("/api/checkout", paymentController.checkout);
router.post("/paymentverification", paymentController.paymentVerification);
router.get("/api/getkey", (req, res) => {
  res.status(200).json({ key: RAZORPAY_API_KEY });
});
router.post("/api/addcourses", [auth, admin], courseController.store);
router.put("/api/courses/:id", [auth, admin], courseController.update);
router.delete("/api/courses/:id", [auth, admin], courseController.delete);
router.get("/api/courses", courseController.index);

export default router;

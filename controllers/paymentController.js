import { instance } from "../server.js";
import { RAZORPAY_API_SECRET } from "../config";
import crypto from "crypto";
import Payment from "../models/Payment.js";
const paymentController = {
  async checkout(req, res, next) {
    try {
      const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
      };

      const order = await instance.orders.create(options);
      res.json({
        success: true,
        order,
      });
    } catch (error) {
      return next(error);
    }
  },

  async paymentVerification(req, res, next) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", RAZORPAY_API_SECRET).update(body.toString()).digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    console.log(req.body);
    if (isAuthentic) {
      // Database comes here

      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}}`);
      // res.json({ success: true });
    } else {
      res.status(400).json({
        success: false,
      });
    }
  },
};

export default paymentController;

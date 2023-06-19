import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
  },
  { timestamps: false }
);

export default mongoose.model("Payment", PaymentSchema);

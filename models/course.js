import { boolean } from "joi";
import mongoose from "mongoose";
import { APP_URL } from "../config";
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    course_name: { type: String, required: true },
    category: { type: String, required: true },
    image: {
      type: String,
      required: true,
      get: (image) => {
        // http://localhost:5000/uploads/1616443169266-52350494.png

        return `${APP_URL}/${image}`;
      },
    },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    description_2: { type: String },
    who_should_learn: { type: String, required: true },
    syllabus: { type: String, required: true },
    duration: { type: Number, required: true },
    we_provides: { type: [String], required: true },
    popular_roles: { type: [String], required: true },
    meeting: { type: String, required: true },
    recording: { type: String, required: true },
    isNewCourse: { type: Boolean, default: false },
    isPopularCourse: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model("Course", courseSchema, "courses");

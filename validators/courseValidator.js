import Joi from "joi";

const courseSchema = Joi.object().keys({
  course_name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  duration: Joi.number().required(),
  description: Joi.string().required(),
  description_2: Joi.string(),
  who_should_learn: Joi.string().required(),
  syllabus: Joi.string().required(),
  we_provides: Joi.string().required(),
  popular_roles: Joi.string().required(),
  meeting: Joi.string().required(),
  recording: Joi.string().required(),
});

export default courseSchema;

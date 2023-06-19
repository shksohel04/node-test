import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const registerController = {
  async register(req, res, next) {
    // validate the user
    let success = false;
    try {
      const registerSchema = Joi.object().keys({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string()
          .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "in"] },
          })
          .required(),

        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
          "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
          "string.empty": `Password cannot be empty`,
          "any.required": `Password is required`,
        }),

        confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({ "any.only": "password does not match" }),
      });

      const { error } = registerSchema.validate(req.body);

      if (error) {
        return next(error);
      }
    } catch (err) {
      return next(err);
    }

    // check if user already exists
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(CustomErrorHandler.alreadyExist("Account with this email already exists"));
      }
    } catch (err) {
      return next(err);
    }

    const { name, email, password, confirm_password } = req.body;
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // prepare the model
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // [ ] generate jwt token
    let access_token;
    let refresh_token;
    try {
      // [ ] store in database
      const result = await user.save();
      // [ ] generate jwt token
      access_token = JwtService.sign({ _id: result._id, role: result.role });
      // [ ] generate refresh jwt token
      refresh_token = JwtService.sign({ _id: result._id, role: result.role }, "1y", REFRESH_SECRET);
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
    } catch (err) {
      return next(err);
    }
    success = true;
    // [ ] send response
    res.json({ success, access_token, refresh_token });
  },
};

export default registerController;

// CHECKLIST
// [ ] validate the request
// [ ] authorise the request
// [ ] check if user is in the database already
// [ ] prepare model
// [ ] store in database
// [ ] generate jwt token
// [ ] send response
